"""
SafeClaim Comprehensive Evaluation Suite.
Measures retrieval performance (Hit@k, threshold gating, false positive rate)
and rumour verdict classification (Accuracy, Confusion Matrix, Precision/Recall).
"""

import json
from pathlib import Path
from typing import Any, Dict, List

from sklearn.metrics.pairwise import cosine_similarity

from safeclaims.claims import DomainType
from safeclaims.config import config
from safeclaims.retrieve import retriever
from safeclaims.verdict import determine_verdict


def load_jsonl(path: Path) -> List[Dict[str, Any]]:
    with path.open(encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def evaluate_retrieval(path: Path) -> Dict[str, Any]:
    cases = load_jsonl(path)
    relevant_cases = [case for case in cases if case["should_retrieve"]]
    unsupported_cases = [case for case in cases if not case["should_retrieve"]]

    ranked_relevant_hits = 0
    surfaced_relevant_hits = 0
    relevant_false_negatives = 0
    unsupported_retrievals = 0
    details = []

    for case in cases:
        result = retriever.retrieve(case["question"])
        query_vector = retriever.index.vectorizer.transform([result.query])
        scores = cosine_similarity(query_vector, retriever.index.tfidf_matrix)[0]
        top_indices = sorted(
            range(len(scores)), key=lambda index: scores[index], reverse=True
        )[: config.RETRIEVAL_TOP_K]
        ranked_doc_ids = {
            retriever.index.passages[index].doc_id for index in top_indices
        }
        surfaced_doc_ids = {
            passage.passage_id.split("#", 1)[0] for passage in result.passages
        }
        expected_doc_id = case["expected_doc_id"]
        ranked_hit = expected_doc_id in ranked_doc_ids if expected_doc_id else False
        surfaced_hit = expected_doc_id in surfaced_doc_ids if expected_doc_id else False

        if case["should_retrieve"] and ranked_hit:
            ranked_relevant_hits += 1
        if case["should_retrieve"] and surfaced_hit:
            surfaced_relevant_hits += 1
        if case["should_retrieve"] and not result.relevant:
            relevant_false_negatives += 1
        if not case["should_retrieve"] and result.relevant:
            unsupported_retrievals += 1

        details.append(
            {
                "question": case["question"],
                "relevant": result.relevant,
                "top_score": result.top_score,
                "expected_doc_id": expected_doc_id,
                "expected_doc_in_top_k": ranked_hit,
                "expected_doc_surfaced": surfaced_hit,
            }
        )

    return {
        "cases": len(cases),
        "relevant_cases": len(relevant_cases),
        "top_k_document_hit_rate": (
            round(ranked_relevant_hits / len(relevant_cases), 4) if relevant_cases else 0.0
        ),
        "surfaced_relevant_hit_rate": (
            round(surfaced_relevant_hits / len(relevant_cases), 4) if relevant_cases else 0.0
        ),
        "relevant_false_negatives": relevant_false_negatives,
        "unsupported_cases": len(unsupported_cases),
        "unsupported_retrieval_rate": (
            round(unsupported_retrievals / len(unsupported_cases), 4) if unsupported_cases else 0.0
        ),
        "details": details,
    }


def evaluate_rumours(path: Path) -> Dict[str, Any]:
    cases = load_jsonl(path)
    labels = [
        "CONTRADICTED_BY_OFFICIAL_SOURCE",
        "SUPPORTED_BY_OFFICIAL_SOURCE",
        "NO_OFFICIAL_SOURCE_FOUND",
    ]
    confusion_matrix = {
        true_label: {pred_label: 0 for pred_label in labels}
        for true_label in labels
    }

    correct = 0
    details = []

    for case in cases:
        claim = case["claim"]
        domain: DomainType = case.get("domain", "other")
        expected = case["expected_verdict"]

        verdict, is_gap = determine_verdict(claim, domain)
        pred = verdict.label

        if pred in confusion_matrix.get(expected, {}):
            confusion_matrix[expected][pred] += 1

        is_correct = pred == expected
        if is_correct:
            correct += 1

        details.append(
            {
                "claim": claim,
                "domain": domain,
                "expected": expected,
                "predicted": pred,
                "correct": is_correct,
                "is_guidance_gap": is_gap,
            }
        )

    accuracy = round(correct / len(cases), 4) if cases else 0.0

    # Per-class metrics
    per_class = {}
    for lbl in labels:
        tp = confusion_matrix[lbl][lbl]
        fp = sum(confusion_matrix[other][lbl] for other in labels if other != lbl)
        fn = sum(confusion_matrix[lbl][other] for other in labels if other != lbl)
        prec = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
        rec = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
        f1 = round(2 * prec * rec / (prec + rec), 4) if (prec + rec) > 0 else 0.0
        per_class[lbl] = {"precision": prec, "recall": rec, "f1": f1, "support": tp + fn}

    macro_f1 = round(sum(m["f1"] for m in per_class.values()) / len(labels), 4)

    return {
        "cases": len(cases),
        "accuracy": accuracy,
        "macro_f1": macro_f1,
        "confusion_matrix": confusion_matrix,
        "per_class": per_class,
        "details": details,
    }


def run_full_evaluation(eval_dir: Path) -> Dict[str, Any]:
    retrieval_res = evaluate_retrieval(eval_dir / "questions.jsonl")
    rumour_res = evaluate_rumours(eval_dir / "rumours.jsonl")
    return {
        "retrieval": retrieval_res,
        "rumours": rumour_res,
    }


if __name__ == "__main__":
    base_dir = Path(__file__).parent
    res = run_full_evaluation(base_dir)
    print(json.dumps(res, indent=2))