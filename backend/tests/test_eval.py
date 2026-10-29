"""
Automated unit tests for SafeClaim retrieval and rumour evaluation benchmarks.
"""

from pathlib import Path

from eval.run_eval import evaluate_retrieval, evaluate_rumours


def test_retrieval_benchmark_40_cases():
    eval_path = Path(__file__).parents[1] / "eval" / "questions.jsonl"
    result = evaluate_retrieval(eval_path)

    assert result["cases"] == 40
    assert result["relevant_cases"] == 35
    assert result["top_k_document_hit_rate"] == 1.0
    assert result["surfaced_relevant_hit_rate"] >= 0.95
    assert result["unsupported_retrieval_rate"] == 0.0


def test_rumour_verdict_evaluation_reports_validated_coverage():
    eval_path = Path(__file__).parents[1] / "eval" / "rumours.jsonl"
    result = evaluate_rumours(eval_path)

    assert result["cases"] == 30
    assert result["validated_cases"] == 0
    assert result["validated_coverage"] == 0.0
    assert result["accuracy_on_validated_cases"] is None