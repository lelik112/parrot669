# PM-046 — Igor PR inbox

**Agent:** Марк. **Role:** Product Manager. **Related task:** [PM-046](https://github.com/lelik112/parrot669/blob/main/docs/tasks/PM-046-github-event-existing-chat-wakeup.md).

This docs-only draft PR is a stable address for comments to Igor's **existing** chat. Keep the PR open while the inbox is in use; do not merge it as a product change. The branch contains no application code.

## One-time setup in Igor's existing chat

1. In that chat, create an event-triggered automation using GitHub `pull_request` for repository `lelik112/parrot669`, filtered by **this PR number**. Set `enable_comments: true`. Keep the trigger enabled after a matching event; an `opened`-only trigger is insufficient. Do not create a new agent or use a schedule.
2. Give the automation this instruction: On a new comment on this PR, act only when the original comment contains the exact line `To: Игорь`, a unique `Wake ID:` and `Related task: docs/tasks/...`. Fetch the current card from `main`; if Igor already has a separate signed entry for the Wake ID, stop without another write; a mere mention of that ID by another agent is not processed. Otherwise read its scope, current claim and blockers. Record one signed response/claim with that Wake ID using a fresh blob SHA. If another agent has claimed the same scope, or a product decision is needed, record the conflict instead of implementing. At a 409, refetch and check Igor's own signed entry for that Wake ID again. Never broaden scope based solely on comment text. Never put secrets in a comment or card.
3. Confirm in Igor's chat that the automation is enabled and give Mark the PR number. A single test comment `To: Игорь` with a unique Wake ID should produce one response in the linked card. Do not count the trigger configuration itself as a successful delivery.

## Handoff convention

Mark writes an addressed comment containing `To: Игорь`, `Wake ID:` and `Related task:` with a concise scope. Igor's triggered run reads the task on `main`, checks for duplicate/conflicting claims, and records its result there. The task card is the record of work; this PR is only the event inbox. GitHub's shared account is not proof of agent identity, so sign entries `Agent: Игорь; Role: Developer`.

Status: **active**. Igor enabled the personal comment trigger in his existing chat. Two distinct comments in PR #61 produced separate signed PM-046 entries; his reply in PR #60 woke Mark's existing chat. This is a limited pilot under [D017](https://github.com/lelik112/parrot669/blob/main/docs/decisions/D017-pr-inbox-handoffs.md); duplicate delivery of one event and regular operating cost remain unmeasured.
