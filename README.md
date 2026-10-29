# SafeClaim

SafeClaim is an OSCA OPEN//BUILD 2026 prototype for searching a small corpus of Nigerian public-service documents and exploring synthetic rumour-clustering workflows. It is not a production fact-checker or a source of medical or legal advice.

## Current Capabilities

- React frontend with a clearly labeled interface-only Demo Mode and a Live Mode that calls the backend.
- FastAPI backend with TF-IDF passage retrieval, corpus/source metadata, and evidence-only `/ask` responses.
- Rumour Desk fixture endpoints and token-protected message submission/demo reload.
- Optional Qwen-compatible NLI call for rumour verdicts. A decisive label is accepted only with valid citations to retrieved passages. If the model is unavailable or output is invalid, the result is `NOT_VALIDATED` and no broadcast reply is returned.
- Nigerian Pidgin is not enabled for backend answers pending human review.

Retrieved passages are lexical matches, not proof that a document supports a claim. All four bundled corpus entries currently have `verification_status=unverified`. The URLs/excerpts must be authenticated and corrected before describing them as verified official guidance. Demo Ask Mode does not answer factual questions; it previews the interface only. Rumour Desk numbers and examples are synthetic fixtures, not observed public activity.

## Repository Layout

- `backend/`: Python package, corpus, API, tests, and evaluation runner.
- `frontend/`: React/Vite application.

## Run the Backend

Requires Python 3.11 or newer.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m safeclaims.ingest
pytest -q
uvicorn safeclaims.server:app --host 127.0.0.1 --port 8000
```

Set unique `SAFECLAIM_ADMIN_TOKEN` and `SAFECLAIM_WEBHOOK_TOKEN` values in `.env` before using protected endpoints. Do not commit `.env`, subscriber records, WhatsApp session keys, or credentials. Admin tokens are required for `POST /api/v1/rumours/submit` and `POST /api/v1/rumours/load-synthetic`; webhook calls require the webhook token header. Missing tokens leave these routes unavailable.

The API docs are served at `http://localhost:8000/docs`.

## Run the Frontend

Requires Node.js 20.19+ or 22.12+ for Vite 8.

```bash
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000`. To use Live Mode, configure the backend URL in the settings dialog. It will show retrieved passages as unvalidated evidence; it does not produce a verified answer.

## Evaluation

From `backend/`:

```bash
python -m eval.run_eval
pytest -q
```

Retrieval metrics are reported in `backend/docs/EVAL.md`. Prior heuristic rumour-verdict accuracy figures were withdrawn because the old implementation could invert claims. Verdict accuracy is not reported until source provenance and model-backed evaluation are independently reviewed.

## Model

The optional inference client targets Qwen2.5 7B Instruct through an OpenAI-compatible endpoint. In the current prototype, it is called for rumour claim/evidence comparison only. TF-IDF retrieval, keyword domain routing, and deterministic brief formatting are not LLM functions. Model licence and deployment details are documented in `backend/docs/MODEL.md`; verify the model repository's current terms before redistribution or deployment.

## Privacy and Security

The API is a local prototype. Admin writes and WhatsApp webhook calls require tokens. Subscriber data and Baileys authentication/session files are runtime-private and ignored by Git. WhatsApp users must explicitly send `SUBSCRIBE` before their number is stored for broadcasts; `STOP` opts them out. Do not expose the API or bridge publicly without TLS, rate limits, operational secret management, and a reviewed privacy/consent process.

## Acknowledgements

See `ACKNOWLEDGEMENTS.md` and `frontend/ATTRIBUTION.md` for dependencies, open-weight model licenses, design assets, and AI-assisted disclosures. AI coding assistance was used during implementation; the team remains responsible for reviewing and understanding submitted code.
