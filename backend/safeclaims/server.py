"""FastAPI application exposing SafeClaim's complete REST API and WhatsApp webhook."""

from contextlib import asynccontextmanager
import csv
from datetime import datetime, timezone
import time
from typing import Any, Dict, List, Literal, Optional
import uuid

from fastapi import FastAPI, Query, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, Field

from safeclaims import __version__
from safeclaims.answer import answer_question
from safeclaims.brief import generate_daily_brief
from safeclaims.claims import DomainType, RawMessage, SourceType
from safeclaims.cluster import cluster_engine
from safeclaims.config import config
from safeclaims.ingest import CorpusIndex
from safeclaims.retrieve import retriever


# Initialize precomputed cluster fixture on module import
if config.PRECOMPUTED_CLUSTERS_PATH.exists():
    cluster_engine.load_precomputed(config.PRECOMPUTED_CLUSTERS_PATH)

app = FastAPI(title="SafeClaim API", version=__version__)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=500)
    language: Literal["en", "pcm"] = "en"


class RumourSubmitRequest(BaseModel):
    raw_text: str = Field(min_length=3, max_length=500)
    source_type: SourceType = "whatsapp_forward"
    language: Literal["en", "pcm"] = "en"


class WhatsAppWebhookRequest(BaseModel):
    Body: Optional[str] = None
    message: Optional[str] = None
    From: Optional[str] = None
    sender: Optional[str] = None


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        media_type="application/problem+json",
        content={
            "type": "about:blank",
            "title": "Validation Error",
            "status": 422,
            "detail": "The request does not match the SafeClaim API schema.",
            "instance": request.url.path,
        },
    )


@app.get("/api/v1/health")
def health() -> Dict[str, Any]:
    try:
        index = retriever.index
    except (FileNotFoundError, OSError) as exc:
        return JSONResponse(
            status_code=503,
            media_type="application/problem+json",
            content={
                "type": "about:blank",
                "title": "Corpus Index Not Available",
                "status": 503,
                "detail": str(exc),
                "instance": "/api/v1/health",
            },
        )

    return {
        "status": "healthy",
        "version": __version__,
        "model": {
            "name": "TF-IDF retrieval (answer generation disabled)",
            "provider": "local",
            "embedding_model": "not used",
            "retrieval_similarity_threshold": config.RETRIEVAL_SIMILARITY_THRESHOLD,
        },
        "corpus": {
            "documents_indexed": len({passage.doc_id for passage in index.passages}),
            "passages_count": len(index.passages),
            "clusters_tracked": len(cluster_engine.clusters),
        },
    }


@app.get("/api/v1/meta/languages")
def languages() -> Dict[str, Any]:
    return {
        "languages": [
            {"code": "en", "name": "English", "status": "pending_human_check", "eval_score": None},
            {"code": "pcm", "name": "Nigerian Pidgin", "status": "pending_human_check", "eval_score": None},
        ]
    }


@app.get("/api/v1/corpus/sources")
def corpus_sources() -> Dict[str, Any]:
    sources = []
    with open(config.MANIFEST_PATH, mode="r", encoding="utf-8", newline="") as manifest:
        for row in csv.DictReader(manifest):
            if not row.get("id") or not (config.CORPUS_DIR / f"{row['id']}.md").is_file():
                continue
            sources.append(
                {
                    "doc_id": row["id"],
                    "title": row["title"],
                    "publisher": row["publisher"],
                    "url": row["url"],
                    "date_retrieved": row["date_retrieved"],
                    "domain": row["domain"],
                    "reuse_terms": row.get("reuse_terms", ""),
                }
            )
    return {"sources": sources}


@app.post("/api/v1/ask")
def ask(request: AskRequest) -> Dict[str, Any]:
    return answer_question(request.question, request.language)


# ---------------------------------------------------------
# Rumour Desk Endpoints
# ---------------------------------------------------------


@app.get("/api/v1/rumours/stats")
def rumour_stats() -> Dict[str, Any]:
    return cluster_engine.get_stats()


@app.get("/api/v1/rumours/clusters")
def rumour_clusters(
    domain: Optional[str] = Query(None),
    label: Optional[str] = Query(None),
    guidance_gap_only: bool = Query(False),
    search_query: Optional[str] = Query(None),
) -> List[Dict[str, Any]]:
    clusters = cluster_engine.get_clusters(
        domain=domain,
        label=label,
        guidance_gap_only=guidance_gap_only,
        search_query=search_query,
    )
    return [c.to_dict() for c in clusters]


@app.post("/api/v1/rumours/load-synthetic")
def load_synthetic_demo() -> Dict[str, Any]:
    start = time.perf_counter()
    loaded = cluster_engine.load_precomputed(config.PRECOMPUTED_CLUSTERS_PATH)
    elapsed = round(time.perf_counter() - start, 3)
    total_messages = sum(c.message_count for c in cluster_engine.clusters)
    return {
        "status": "loaded_from_precomputed_cache",
        "source_file": str(config.PRECOMPUTED_CLUSTERS_PATH),
        "messages_loaded": total_messages,
        "clusters_loaded": loaded,
        "load_time_seconds": elapsed,
    }


@app.post("/api/v1/rumours/submit")
def submit_rumour(req: RumourSubmitRequest) -> Dict[str, Any]:
    msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    raw_msg = RawMessage(
        message_id=msg_id,
        raw_text=req.raw_text,
        source_type=req.source_type,
        language=req.language,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    cluster = cluster_engine.add_message(raw_msg)
    return {
        "status": "ingested",
        "message_id": msg_id,
        "extracted_claim": cluster.representative_claim,
        "domain": cluster.domain,
        "cluster_id": cluster.cluster_id,
        "is_guidance_gap": cluster.is_guidance_gap,
    }


@app.get("/api/v1/rumours/brief")
def rumour_brief(date: Optional[str] = Query(None)) -> Dict[str, Any]:
    return generate_daily_brief(date)


@app.get("/api/v1/rumours/brief/download")
def download_rumour_brief(date: Optional[str] = Query(None)) -> Response:
    brief = generate_daily_brief(date)
    filename = f"SafeClaim_Intelligence_Brief_{brief['date']}.md"
    return Response(
        content=brief["markdown"],
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------------------------------------------------------
# WhatsApp Bot Webhook
# ---------------------------------------------------------


@app.post("/api/v1/whatsapp/webhook")
def whatsapp_webhook(req: WhatsAppWebhookRequest) -> Dict[str, Any]:
    """
    Webhook endpoint compatible with WhatsApp Business Cloud API / Twilio webhooks.
    Receives incoming text from a citizen on WhatsApp, runs grounded verification,
    and returns a formatted WhatsApp verification receipt.
    """
    incoming_text = req.Body or req.message or ""
    sender = req.From or req.sender or "citizen"

    if not incoming_text.strip():
        return {
            "reply": "⚠️ SafeClaim AI: Please send a rumour, voice note transcript, or question to verify.",
            "recipient": sender,
        }

    res = answer_question(incoming_text.strip(), language="en")
    is_grounded = res.get("grounded", False)
    answer = res.get("answer", "")
    citations = res.get("citations", [])
    hotline = res.get("hotline_info")

    citations_text = ""
    if citations:
        citations_text = "\n\n*Official Receipts:*\n" + "\n".join(
            f"• {c['publisher']}: {c['doc_title']} ({c['url']})" for c in citations[:2]
        )

    hotline_text = ""
    if hotline:
        hotline_text = f"\n\n☎️ *Official Helpline:* {hotline['name']} ({hotline['number']})"

    reply = (
        f"🏛️ *SafeClaim AI Verification Receipt*\n\n"
        f"🔍 *Query:* \"{incoming_text[:120]}\"\n\n"
        f"📋 *Official Finding:*\n{answer}"
        f"{citations_text}"
        f"{hotline_text}\n\n"
        f"_Verified via SafeClaim AI — The trusted neighbour with the receipts._"
    )

    return {
        "reply": reply,
        "recipient": sender,
        "grounded": is_grounded,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=config.API_HOST, port=config.API_PORT)