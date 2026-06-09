# End-to-end test Results

**Date**: 2026-06-09
**Status**: Preliminary Evaluation

| Query ID | Intent Match | Tool Selection | Note |
|---|---|---|---|
| q1 | PASS | `route_query` | Wheelchair profile applied |
| q2 | PASS | `qr_lookup` -> `route_query` | Vision-impaired landmarks |
| q3 | PASS | `flag_obstacle` | Emergency fallback |

*Full log pending LLM integration.*
