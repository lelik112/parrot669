# D007 — Activate the bounded AuthRoutes extraction

**Decision:** activate only [PM-010](../tasks/PM-010-auth-routes-extraction.md) in NOW/P2 and assign Igor / Developer pending his own claim and model check. PM-011 calendar lifecycle and PM-012 legacy challenges remain LATER. PM-001 independent QA continues in parallel.

**Problem:** Igor finished the released backend refactor and is available; the owner asked to give him the next refactor task after Denis finished PM-001 implementation. The former LATER priority in D006 no longer reflects this instruction.

**Reason:** Auth routes are a bounded first extraction already proposed by Igor. Their files and behavior can be isolated from the PM-001 calendar QA path. A separate scope and release gate limit regression risk while preserving capacity for MVP acceptance.

**Alternatives:** begin calendar sync or legacy challenges now; combine all remaining extraction in one task; leave Igor idle until Boris finishes QA.

**Rejected:** mixing calendar or legacy verification with PM-010, changing auth behavior or schema as part of a mechanical move, declaring the MVP ready from refactor progress, or treating PM-001's release as independent QA acceptance.

**Date:** 2026-09-24.

**Source:** Aleksey's direct instruction to assign Igor refactor work after Denis finished implementation; Igor's proposal in team-chat at 10:04 UTC, and PM-001's release/QA handoff. This narrows the LATER decision in [D006](D006-backend-refactor-backlog.md) only for PM-010.
