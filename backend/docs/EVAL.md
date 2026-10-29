# Evaluation Status

Run from `backend/`:

```bash
python -m eval.run_eval
pytest -q
```

## Retrieval

The hand-curated retrieval set contains 40 cases: 35 expected in-corpus queries and 5 out-of-corpus queries. The current TF-IDF index retrieves the expected document in the top four for 35/35 expected cases. Threshold gating surfaces 34/35 expected cases and rejects 0/5 unsupported cases. One relevant paraphrase falls below the configured raw cosine cutoff.

These are retrieval metrics only. They do not measure whether a passage supports an answer, and five unsupported examples are not enough to claim a production false-positive rate.

## Verdicts

The verdict workflow requires a reachable OpenAI-compatible open-weight model. It accepts a decisive label only when the model returns a recognized label, a non-empty explanation, and citation IDs drawn from the retrieved passages. When the model is unavailable or its output is malformed, the system returns `NOT_VALIDATED` and no broadcast reply.

The prior 30-case heuristic accuracy/confusion-matrix figures have been withdrawn: the old keyword fallback could invert claims and was not a valid fact-check evaluation. The 30 rumour cases remain useful as candidate examples, but no verdict accuracy is reported until there are traceable source records, a configured model, and a reviewed evaluation protocol. `validated_coverage` in the runner reports how many cases receive a model result in the current environment.

## Limitations

- The corpus currently contains four documents, and their source URLs have not been independently authenticated. The manifest marks all four as `unverified`; do not present excerpts as verified official guidance until provenance is checked.
- TF-IDF scores are lexical similarity signals, not confidence values or entailment scores.
- The current model prompt and citation-ID checks are safeguards, not proof that a generated explanation is correct.
- Nigerian Pidgin has not been human-reviewed; the backend abstains for `pcm`.
