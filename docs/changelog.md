## 2026-09-24 — Host cabinet IA approved; private profile moved next

- **Agent:** Алекс. **Role:** Strategy / Product Advisor. **Change:** Алексей подтвердил [D009](decisions/D009-host-cabinet-ia.md). Принята последовательность кабинета **PM-020 → PM-021 → PM-022**. PM-021 private host profile больше не LATER и не ждёт пилота; пилот может влиять на дополнительные поля, но не блокирует сам профиль. PM-022 остаётся следующим после PM-021 с отдельным privacy/publication contract. **Related task:** [PM-019](tasks/PM-019-host-cabinet-ia.md), [PM-021](tasks/PM-021-private-host-profile.md), [PM-022](tasks/PM-022-public-host-profile.md).

# PARROT 669 changelog
## 2026-09-25 — BUG-017: neutral copy for unavailable public links

- **Agent:** Игорь. **Role:** Developer. **Change:** Updated the search-card fallback in EN/ES/CA/RU to say the public external link is unavailable, without asserting that the host never added one. The API correctly returns the same empty public `links` array for a missing link and publish OFF; the fallback no longer guesses which private state caused it. No backend, calendar or messaging changes. CI and release evidence pending. **Related task:** [PM-002 / BUG-017](tasks/PM-002-link-publication.md).

## 2026-09-25 — Постоянный PM-отчёт по задачам и backlog

- **Agent:** Марк. **Role:** Product Manager. **Change:** По просьбе Алексея зафиксирован формат каждого PARROT-ответа о задачах/status/backlog: краткий статус новых и затронутых задач, фактическое назначение или причина отсутствия claim, затем полный открытый backlog по NOW/NEXT/LATER и P0/P1/P2 с моделью и reasoning. Для blocked задач указываются блокер и следующий шаг; ожидаемый исполнитель не выдаётся за подтверждённый claim.
- **Related docs:** [AI-team workflow](ai-team.md), [task index and reporting](tasks/README.md).

## 2026-09-24 — D011: контакт доступен из каждого результата поиска

- **Agent:** Марк. **Role:** Product Manager. **Change:** Алексей решил, что гость должен всегда иметь PARROT-путь связаться с хозяином объекта из поиска. Принято D011: прежний host-wide opt-in не может блокировать первое обращение; auth, подтверждение email, rate limits и блокировка участника сохраняются. Implementation pending в PM-024.
- Созданы PM-024 (контакт из каждого результата), PM-025 (съехавшая мобильная CTA), PM-026 (убрать повтор Messages shortcut), PM-027 (открыть карточку жилья из диалога) и PM-028 (открыть свой профиль хозяина из Messages). PM-023 остаётся отдельной задачей о моменте auth и сохранении черновика.
- **Related docs:** [D011](decisions/D011-contact-always-available.md), [PM-024–PM-028](tasks/README.md), [roadmap](roadmap.md).

## 2026-09-24 — PM-023 guest message onboarding task

- **Agent:** Марк. **Role:** Product Manager. **Change:** Зафиксирована задача P1 на гостевой путь из поиска к первому сообщению: подготовить обращение до входа, потребовать auth перед отправкой, вернуть пользователя к тому же объекту/датам/черновику и сохранить приватность inbox. Кнопка «Написать владельцу» уже есть в поиске, но текущий production ещё зависит от старого host-wide opt-in; D011/PM-024 требует показывать её для каждого объекта в выдаче. Исполнитель не назначен; задача в NEXT после текущих PM-020/021 claims. **Related task:** [PM-023](tasks/PM-023-guest-message-onboarding.md).


## 2026-09-24 — PM-002 link and calendar-control status implementation

- **Agent:** Игорь. **Role:** Developer. **Change:** Implemented D010 in backend shared public-link projection for search and existing public-profile JSON: publish only canonical Airbnb links with matching listing/calendar ID, and derive `unverified`, `pending`, `verified` or `recheck_required` from the current D002 calendar source. Search shows a localized status beside the clickable link; when messaging opt-in allows, the guest can open an unsent calendar-verification request. Removed unpublished links from public-profile JSON. The search result itself remains independent of external links. [Backend PR #24](https://github.com/lelik112/parrot669-backend/pull/24) merged as `5db88ce`; [PR CI](https://github.com/lelik112/parrot669-backend/actions/runs/36015061454) and [main CI](https://github.com/lelik112/parrot669-backend/actions/runs/36015679982) passed (unit, PostgreSQL smoke, Docker). Railway deployment `e496a322-6390-4127-be99-aa53121b2a6f` is SUCCESS on the exact SHA, live `/health` returned 200. [Frontend PR #19](https://github.com/lelik112/parrot669/pull/19) has green CI; local tests 111/111 passed. Frontend production rollout and independent QA pending. **Related task:** [PM-002](tasks/PM-002-link-publication.md).

## 2026-09-24 — PM-019 cabinet IA proposal prepared

- **Agent:** Марк. **Role:** Product Manager. **Change:** Prepared [D009](decisions/D009-host-cabinet-ia.md): keep current Search / Host / Messages navigation; keep availability/calendar controls with each property, owner messaging opt-in in Host, and Inbox in Messages. No empty Dashboard/Profile tabs; Account remains technical. PM-019 is in review pending Aleksey's confirmation; PM-020 stays planned and unassigned until then. PM-002/link visibility is explicitly outside this scope. **Related task:** [PM-019](tasks/PM-019-host-cabinet-ia.md).


## 2026-09-24 — Host cabinet backlog staged, no implementation claim

- **Agent:** Марк. **Role:** Product Manager. **Change:** By Aleksey's request, split Alex's cabinet proposal into [PM-019](tasks/PM-019-host-cabinet-ia.md) IA contract and [PM-020](tasks/PM-020-host-cabinet-navigation.md) navigation of current flows (NEXT/P2), plus [PM-021](tasks/PM-021-private-host-profile.md) personal data and [PM-022](tasks/PM-022-public-host-profile.md) public view (LATER). [D008](decisions/D008-cabinet-sequencing.md) records sequencing; no developer is assigned and no field/publication scope is approved. **Related task:** PM-019–PM-022.
- Existing /host.html, /messages.html and restricted backend public-profile JSON remain current behavior; external-link rule D003/PM-002 and consent for new personal fields remain undecided. PM-001/003 QA and PM-008 pilot retain priority.


## 2026-09-24 — QA handoff update (partial)

- **Agent:** Борис. **Role:** QA. **Change:** Confirmed PM-013 waiting for `open` after early Check, reload and EN/ES/CA/RU in production; the `close` state still needs a controlled Airbnb starting condition ([PM-018](tasks/PM-018-qa-controlled-calendar.md)). Claimed independent PM-011 calendar QA after PM-005/010. **Related task:** [PM-013](tasks/PM-013-calendar-waiting-instruction.md), [PM-011](tasks/PM-011-calendar-sync-extraction.md). **Recorded by:** Марк / PM; see Boris's signed task entries for details.

## 2026-09-24 — PM-011 external calendar lifecycle extracted and released

- **Agent:** Игорь. **Role:** Developer. **Change:** moved external calendar routes, sync service, SQL operations and hourly loop into `externalcalendar`, preserving the existing API, SQL transactions, iCal URL security and reservation semantics. [Backend PR #23](https://github.com/lelik112/parrot669-backend/pull/23) merged as `59c046f`; [PR CI](https://github.com/lelik112/parrot669-backend/actions/runs/36004130654) and [main CI](https://github.com/lelik112/parrot669-backend/actions/runs/36004571053) passed with PostgreSQL smoke (including calendar delete/search recovery) and Docker. Railway deployment `b302e2f4-2021-469b-a773-87bcddc1b50b` is SUCCESS at V25; direct health 200. Independent calendar QA remains open. **Related task:** [PM-011](tasks/PM-011-calendar-sync-extraction.md).

## 2026-09-24 — PM-013 waiting instructions released for QA

- **Agent:** Марк. **Role:** Product Manager, temporary frontend implementer by Aleksey's direct instruction while Denis was unavailable. **Change:** fixed the PM-013 waiting state after an early Check: four languages now name the selected Airbnb action and automatic follow-up without asking to press a hidden button; ready still tells the owner to use the visible Check. Backend verification, sync and retry schedule unchanged. [Commit `a749c72`](https://github.com/lelik112/parrot669/commit/a749c723fddf9d2322a1a617e82459d24818b78a). **Related task:** [PM-013](tasks/PM-013-calendar-waiting-instruction.md).
- Local `npm test` passed 109/109, [main CI 36004743972](https://github.com/lelik112/parrot669/actions/runs/36004743972) succeeded, and Cloudflare Workers Build `47733a04-92d4-4515-83b8-825a93a966c5` succeeded for production version `8efe156f-959b-4e00-82e4-e02cca09f36f`. Independent Boris QA is pending; PM-001 remains in review.

## 2026-09-24 — Boris's PM-001 desktop QA and waiting-instruction defect

- **Agent:** Борис. **Role:** QA. **Change:** In a production Chrome run with a connected Airbnb iCal, confirmed that selected nights survive reload, unrelated date B and partial change of A do not verify, full closing of A verifies, and the status survives calendar disable/enable. The first full `open` attempt was inconclusive after the retry window ended; mobile/touch and other boundary cases remain open. The test calendar's unrelated date was restored. **Related task:** [PM-001](tasks/PM-001-calendar-control-dates.md). Source: Борис's report `PARROT669-QA-PM001-2026-09-24.md`; the actionable summary is copied into PM-001.
- **Bug QA-PM001-01 / P2:** after an early Check the waiting state hides «Проверить», but its instruction still tells the owner to press it. Ordinary «Обновить сейчас» is a different sync action. **Agent:** Марк. **Role:** Product Manager. **Change:** Triaged Boris's finding and assigned a bounded frontend correction to Denis, pending his claim and Luna/Medium model check. **Related task:** [PM-013](tasks/PM-013-calendar-waiting-instruction.md). **Recorded by:** Марк / Product Manager.
- **PM-010 status:** Igor already released auth-route extraction ([PR #22](https://github.com/lelik112/parrot669-backend/pull/22), CI/Railway SUCCESS); independent auth UI QA remains open. No additional backend implementation is attributed to this PM update.

## 2026-09-24 — PM-010 auth routes extracted and released
- **Agent:** Игорь. **Role:** Developer. **Change:** extracted five existing auth routes and cookie builders into `http.AuthRoutes`; `Main` composes the module once. `AuthService`, repository, auth behavior, schema and frontend stay unchanged. [Backend PR #22](https://github.com/lelik112/parrot669-backend/pull/22) merged as `e41d322`; [PR CI](https://github.com/lelik112/parrot669-backend/actions/runs/35990938243) and [main CI](https://github.com/lelik112/parrot669-backend/actions/runs/35991305724) passed, including PostgreSQL smoke and Docker build. Railway deployment `e9e2333c-721e-4bd0-8184-ec07130ebd35` is SUCCESS on that commit. See [PM-010](tasks/PM-010-auth-routes-extraction.md) for QA handoff.

## 2026-09-24 — Owner activates Igor's limited auth-route extraction

- **Agent:** Марк. **Role:** Product Manager. **Change:** By Aleksey's instruction, move only [PM-010](tasks/PM-010-auth-routes-extraction.md) to NOW/P2 and assign Igor pending his own claim and Sol/Medium Model check. Keep existing auth behavior and PM-001 independent QA separate; PM-011/012 remain LATER. Record the changed priority in [D007](decisions/D007-activate-auth-routes-extraction.md). **Related task:** docs/tasks/PM-010-auth-routes-extraction.md.
- Алекс / Strategy posted a signed cabinet/profile/trust/pages proposal to [team-chat](team-chat.md), showing repository access. Марк acknowledged receipt; the proposal is not an accepted product decision or a developer assignment.
- Documentation and coordination only; no application code, infrastructure or QA result changed by this entry.

## 2026-09-24 — Saved-date calendar challenge released, independent QA pending

- **Agent:** Денис. **Role:** Developer. **Change:** Implemented PM-001 in [backend PR #21](https://github.com/lelik112/parrot669-backend/pull/21) (`1da6c64`, V25) and [frontend PR #14](https://github.com/lelik112/parrot669/pull/14) (`d75bffb`). The owner selects first/last inclusive nights in PARROT; the persisted range and action survive reload, and verification compares the selected range against a complete snapshot of the same calendar source. Unrelated/partial changes, mixed or reserved baselines and invalid feeds do not count; legacy v1 verified rows are not selected-date proof. **Related task:** [PM-001](tasks/PM-001-calendar-control-dates.md). See [Denis's release note](changes/PM-001-calendar-control-dates.md) and backend contract linked from the task.
- **Release evidence:** Backend PostgreSQL CI and frontend CI (108 tests) passed according to Denis's task update. Railway deployment `56125884-7043-46f0-bc08-de7aaef272d9` for `1da6c64` succeeded with V25 and `/health` `ok`; Denis checked published frontend assets against release hashes. These are implementation/deployment checks; Boris's independent QA on a controlled calendar, mobile input and Airbnb export timing remain open. PM-001 is `in review`.
- **Agent:** Марк. **Role:** Product Manager. **Change:** Recorded Denis's implementation, release evidence and QA boundary in changelog, product context, roadmap and status without claiming independent product acceptance. **Related task:** [PM-001](tasks/PM-001-calendar-control-dates.md). **Recorded by:** Марк / Product Manager.

## 2026-09-24 — AI-team workflow and PM-001 handoff

- Accepted [D005](decisions/D005-ai-team-model-guidance.md): new or reactivated tasks carry a minimum-sufficient model/reasoning recommendation and reason; executors check it before main work and wait for the product owner when they identify a need to increase capacity. No retroactive recommendation is required for completed work.
- Added [AI-team workflow](ai-team.md), including team roles, source reading, claims, task fields and handoffs.
- Added specific recommendations for active/planned QA and implementation tasks; for in-review items they apply to the next QA step, not the prior implementation.
- Igor confirmed his name in team-chat. His handoff states the current refactor is complete and PM-001's relevant backend area is released; Denis's claim/start was still pending at the time of this handoff entry.
- Recorded Igor's remaining extraction suggestions as PM-010/011/012 in LATER, with dependencies and behavior-preserving acceptance criteria; no developer claim or assignment is implied. D006 records the sequencing decision.
- **Agent:** Марк. **Role:** Product Manager. **Change:** recorded D005, updated team/product/task workflow and current PM-001 handoff. **Related task:** docs/tasks/PM-001-calendar-control-dates.md; docs/decisions/D005-ai-team-model-guidance.md.

## 2026-09-24 — Assign saved-date verification and open team chat

- **Agent:** Марк
- **Role:** Product Manager
- **Change:** Assign PM-001 to Denis following the owner's instruction; record a concrete contract/frontend starting scope and require direct backend overlap coordination with the developer still refactoring. Assignment is recorded; Denis's claim and the other developer's acknowledgement are pending.
- **Related task:** [PM-001](tasks/PM-001-calendar-control-dates.md).
- Add [team-chat.md](team-chat.md) for informal agent-to-agent discussion, including criticism of processes and leadership. Read addressed messages on start/resume and handoff; record actionable agreements in tasks/decisions. The file does not automatically wake agents.
- Extend [D001](decisions/D001-repository-coordination.md), update team/context and reconcile roadmap/status with Denis's already-published PM-004/005 evidence. Those fixes remain in review; no new QA result is asserted.
- Documentation only: no implementation, infrastructure or product-contract change in this update.

## 2026-09-24 — Host address lookup and closed-date UI

- **Agent:** Денис
- **Role:** Developer
- **Change:** Present city/street comboboxes as place searches (`type=search`, search names/IDs and translated search labels) to reduce competition with contact-address autofill. Keep `autocomplete=off`, native keyboard/touch behavior and the normalized provider selection. Detect change-only autofill and reject visible values that no longer match the selected country/city/street before saving. Do not repeat lookups on a normal change following input.
- **Related task:** [PM-004 / BUG-013](tasks/PM-004-street-autofill.md), [PM-005 / BUG-014](tasks/PM-005-closed-dates-copy.md).
- Rename manual closures to neutral “Closed dates” / «Закрытые даты» in EN/ES/CA/RU; remove error-like styling, explain the action before saving, label first/last included nights, distinguish saved closures, and show save/delete confirmation next to the form. Keep existing API dates, prices and availability behavior.
- 106 frontend tests pass, including six added cases covering silent autofill in create/edit, keyboard selection and all four closed-date state transitions. Existing overlap, inclusive-date, price, touch and proxy tests pass.
- Browser-native autofill with a saved address and real mobile Safari remain unverified; the available cloud host page requires sign-in. Search semantics are a targeted mitigation, not proof that every browser suppresses its native popup. Both tasks remain in review for independent QA. Chromium's [search field parser](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/components/autofill/core/browser/form_parsing/search_field_parser.cc) informs this choice; it is not a cross-browser guarantee.
- Frontend-only change. Backend, migrations, synchronization, selected-date verification (PM-001) and external-link publication (PM-002) are untouched during parallel backend refactoring. Released via [PR #13](https://github.com/lelik112/parrot669/pull/13), main `05a81890c7d5a7dbf73f07f0bb3104c63a995781`. PR/main CI and Cloudflare production build `107543913610` passed. A fresh live host DOM exposes the new search input types/names and RU labels; authenticated interactions remain unverified. Direct asset HTTP checks received 403 from this environment and are not counted as successful smoke.

## 2026-09-24 — Named team and mandatory change identification

- **Agent:** Марк
- **Role:** Product Manager
- **Change:** Add the canonical team roster and boundaries in `docs/team.md`: Алекс / Strategy, Марк / PM, Денис / Developer, Борис / QA and a second developer whose name is pending. Require Agent/Role/Scope before work and Agent/Role/Change/Related task in commit messages, PR descriptions, task-status updates and changelog entries. Record PM's responsibility to preserve authorship, reasons and decisions after significant changes.
- **Related task:** [PM-009](tasks/PM-009-team-identity.md)
- **Decision:** [D004](decisions/D004-team-identity.md), accepted from the owner's instruction. Алекс prepared the proposal; Марк records and publishes the documentation.
- Clarify Boris's identity in the existing paused QA task without claiming a restart or successful checks. Unknown developer names, claims and historical authors are not invented. Application behavior is unchanged.
- Preserve Denis's concurrent claim of PM-004/005 (`d8dc6db`) and reflect their frontend-only `in progress` state in the roadmap/status. This records a start of work, not completed fixes or a release.

## 2026-09-24 — Product coordination and saved-date verification requirement

- Establish a shared repository workflow for both frontend and backend work: roadmap/feature registry, task ownership and discussion, decision log and a status report. PM: Mark / Марк. Strategist: Alex / Алекс, currently without repository access. Other agent names and claims remain open until confirmed.
- Record the owner's accepted clarification: select control dates in PARROT, save the dates/action and initial state, change them in Airbnb, then verify that exact challenge. This is a product requirement and backlog entry (`PM-001` / `BUG-015`), **not a release of the corrected implementation**. The historical v1 entry below remains intact.
- Track link publication after verification as a proposal with unresolved details (`PM-002` / `PRODUCT-001`), rather than describing a new gate as current behavior.
- Prioritize the unfinished two-account contact scenario, current host UI findings and bounded email/mobile acceptance. Separate implementation, deployment and independent QA evidence.
- Correct the product-context summary of search coverage to include existing manual PARROT blocks. No runtime behavior, application code, configuration or infrastructure changes are part of this documentation update.

## 2026-09-24 — Extract housing operations and profile views

- Move availability/manual-block routes, service and repository into `com.parrot669.housing` (`AvailabilityRoutes`, `AvailabilityService`, `AvailabilityRepository` / `DoobieAvailabilityRepository`). Preserve half-open API dates, nightly-price handling, validation/ownership order and overlap-conflict behavior.
- Move property and external-listing operations into the same package's `PropertyRoutes`, `PropertyService` and `PropertyRepository`. Preserve omitted title/address updates, canonical Airbnb URLs and link visibility; keep listing/calendar deletion atomic and retain messaging history when a property is deleted.
- Move owner-dashboard and public-profile assembly into `com.parrot669.profiles` (`ProfileRoutes`, `ProfileService`, `ProfileRepository` / `DoobieProfileRepository`). Preserve owner-only address/calendar data, anonymous public JSON, listing scoping and legacy verification expiry semantics.
- Share the existing cookie/authentication, UUID and JSON request handling through `http.OwnerRequests`; keep response/error mapping in `HttpResponses` and shared models in `domain`. `Main` composes the extracted modules. API paths, Worker forwarding, SQL and transaction boundaries are unchanged; no frontend or database migration is required. Messaging, calendar-control verification and calendar synchronization retain their existing implementation.
- Add 21 focused tests: nine availability route/service tests, six property/listing tests (four route and two PostgreSQL tests), and six profile tests. Cover auth/validation order, exact errors/JSON, overlap constraints, patch semantics, atomic deletion rollback, messaging-history retention and public privacy.
- Released in three PR/main-CI-verified steps: availability `50ef837` (84 tests), properties/listings `b5ac2a2` (90 tests), profiles `f9d8ae7` (96 tests). Every stage passed full PostgreSQL HTTP smoke and Docker build. Final [main CI 35964554278](https://github.com/lelik112/parrot669-backend/actions/runs/35964554278) is green; Railway deployment `73c5cb1a-2657-49c5-bfd3-b2e9b172bdcd` is SUCCESS on `f9d8ae7ab0b2d16a260a2ac64eeea3b9582f6696`, with Flyway unchanged at V24.
- Eight read-only live backend checks passed. Private/mutation coverage ran in isolated CI. The frontend proxy check was blocked by Cloudflare 403/1010 from this environment; Worker runtime was not changed. See product-context for the complete release evidence.

## 2026-09-23 — Extract the backend search module

- Move availability search and database-backed country/city discovery from the large legacy routes/service/repository into the independent `com.parrot669.search` package.
- Move search-only models; keep the country DTO shared with geocoding. Reuse the unchanged HTTP response/error mapping through `HttpResponses`.
- Preserve API paths and JSON, SQL/query count, half-open coverage, validation order, property cleaning fees, total-price filtering/sorting and searchable properties without external links. No migration or product behavior change.
- Add seven focused route/service contract tests alongside the existing full-application PostgreSQL smoke and Docker build. Keep messaging and the new calendar-control verification implementation structurally unchanged.
- Released as backend `1e00ef5`: PR/main CI green with 75 tests, PostgreSQL smoke and Docker; Railway deployment `6d68b808-d625-461c-ba74-c26afa862873` SUCCESS, schema V24, ten direct/proxied read-only production checks passed.

## 2026-09-23 — Extract shared backend errors

- Move the unchanged `ServiceError` ADT out of `ParrotService.scala` into its own file, preserving its package and all API/error behavior.
- Keep this mechanical refactor separate from the preceding calendar integrity fix; validate it through the complete backend CI and production deployment checks.
- Released as backend `d370575`: PR/main CI green with 68 tests, PostgreSQL smoke and Docker; matching Railway deployment SUCCESS and six live API checks passed.

## 2026-09-23 — Preserve reservations when iCal content is incomplete

- Reject incomplete calendar envelopes and unbalanced/nested event boundaries before replacing imported events, including malformed responses delivered with HTTP 200.
- Preserve the previous reservation snapshot and last-success timestamp on parse failure. A complete empty calendar still clears old events normally.
- Add parser regression tests and end-to-end PostgreSQL/API smoke checks for malformed feeds, snapshot preservation, search blocking, valid empty feeds and recovery.
- Keep Airbnb URL validation, event classification and the separate calendar-control verification workflow unchanged. No database migration.
- Released as backend `bcebaa4`: PR/main CI green with 68 tests, PostgreSQL smoke and Docker; matching Railway deployment SUCCESS and six live API checks passed.

## 2026-09-23 — Airbnb calendar control verification

- Add owner-only Start/Check verification and clear required/pending/verified/blocked states, retry deadlines and attempt counts in EN/ES/CA/RU. Status updates preserve unsaved property/date/price edits.
- Backend V24 stores a fresh baseline, attempts and persistent jobs. Check immediately and at +5/+10/+20 minutes; three failed attempts block verification for 24 hours. Initial changes have a 30-minute deadline. Removing/reconnecting a calendar does not clear its property's cooldown.
- Reuse the existing iCal fetcher/parser without changing calendar connection, listing-ID matching, synchronization, imports, enable/disable or deletion. Verification does not gate existing search or availability.
- Only availability ranges count; UID/metadata noise and malformed feeds do not. A changed source invalidates verification. Any availability change can pass, including an unrelated reservation; iCal cannot prove who edited it. The badge concerns calendar control, not identity or legal property ownership.
- Add PostgreSQL concurrency/cooldown/HTTP tests, snapshot tests and frontend/polling/proxy regressions. Full backend contract and limits: `parrot669-backend/docs/calendar-ownership-verification.md`.

## 2026-09-23 — General QA fixes and password recovery

- Address BUG-001/002/006/007/008/010/011/012: reject invalid search budgets, rerender results on language changes, clarify whole-stay pricing and optional Airbnb use, make form values readable, fix Russian capacity plurals and explain email verification.
- Let owners rename existing properties through their characteristics; keep ownership checks and preserve addresses, availability and integrations. Older PUT payloads continue to preserve the name.
- BUG-005: add a localized recovery page linked from both login screens and real Resend reset emails using the existing token table. Single-use 30-minute links, database issuance limits and atomic session/token revocation protect recovery. No automatic login or account enumeration response.
- Serialize login/verification session creation with reset, so a concurrent old credential cannot survive revocation. Tokens stay out of URL queries, browser storage and logs. No migration or new credentials required.
- Add PostgreSQL/HTTP, rename smoke and browser-controller regression checks. Preserve the parallel geolocation fixes and their search tests.
- Recovery delivery uses a bounded in-memory queue; users can retry if delivery fails or a restart interrupts it. Message notification delivery remains durable.
- Released backend `39f3f92` and frontend `be9db76`: main CI passes (51 backend tests plus PostgreSQL smoke/Docker; 90 frontend tests), Railway and Cloudflare deployments succeed. Live desktop checks confirm budget validation, translated results, readable fields, editable-title controls and the recovery page. Evidence and remaining mailbox/mobile limitations are recorded in the QA report.

## 2026-09-23 — Geolocation QA: guest search state and accessible labels

- GEO-001: changing country, city, dates or capacity clears the previous results and asks the guest to search again. Late responses and filter changes cannot bring back results for the old parameters.
- Keep unsubmitted search drafts across navigation without automatically running them; confirmed searches still restore normally. Pending requests cannot unlock controls belonging to a newer request.
- GEO-002: country and city controls inherit their translated native labels, removing the fixed English accessible names in RU/ES/CA.
- Add seven guest-search regression tests covering changed parameters, delayed responses, filters, state restoration and all four interface languages. Backend, LocationIQ and owner data are unchanged.

## 2026-09-23 — Unread-message email notifications

- Notify verified hosts and guests about new unread messages through the existing backend Resend configuration. Wait two minutes, combine pending messages and cap frequency at one email per recipient/conversation per 15 minutes.
- Add a Messages-page notification toggle and EN/ES/CA/RU email-language selector, backed by authenticated settings endpoints. Host contact opt-in stays independent.
- Keep message content and participant contact details out of emails; link directly to the authenticated conversation. Suppress pending mail for read messages, opt-outs, blocks, unverified accounts and deleted properties.
- Flyway V23 adds preferences and a transactional PostgreSQL outbox. Leases, frozen payloads, stable provider idempotency keys and bounded retries survive restarts without tying chat writes to email availability.
- Add PostgreSQL/HTTP and UI regression tests for coalescing, cooldown, suppression, retry/restart races, settings isolation and failure recovery. No geocoding configuration or implementation changes.
- Bounce/delivery webhooks and abuse reporting remain follow-up work.

## 2026-09-23 — LocationIQ owner address lookup

- Replace Geoapify with LocationIQ for country → city → street entry. Keep the selected city's geographic bounds and search only road records, with the city included in each query.
- Remove the Catalan-prefix fallback. Deduplicate road segments and reject neighboring-city/POI results; each uncached street lookup uses one provider request.
- Preserve caches, mobile selection, manual house numbers, existing saved addresses and PostgreSQL-only guest search.
- Add backend request pacing, clear quota errors and visible LocationIQ attribution. No database migration.

## 2026-09-23 — Guest/host inbox and participant blocking

- Connect search's **Write to host**, a Messages tab with unread counts and the owner's account-level opt-in control. No external listing is required to communicate.
- Add `/messages.html`: login/registration, paginated conversations/history, optional stay dates, plain-text messages and block/unblock, in EN/ES/CA/RU. Mobile uses separate list and thread panels.
- Preserve enquiry context through login and same-browser email verification. Keep drafts and uncertain-send keys scoped to the account; retries do not duplicate messages and polling does not skip concurrent replies.
- Acknowledge read only for visible, focused history at its latest messages. API errors remain visible next to the relevant controls.
- Add a strict Worker messaging proxy with session-cookie forwarding, Origin protection and no-store responses.
- Backend V22 adds profile-pair blocks across all properties, public contact labels and an authenticated existing-enquiry lookup; PostgreSQL tests cover blocking races and bypass attempts.
- Add frontend CI and regression coverage for auth/context, failed sends, account isolation, read acknowledgements, opt-in and proxy protections. Geolocation implementation is unchanged.
- Message email notifications and abuse reporting remain follow-up work.

## 2026-09-23 — Private guest/host messaging backend

- Added isolated backend `messaging` routes, service and repository plus Flyway V21.
- Reuse verified account sessions for property conversations, text messages with optional stay dates, paginated inbox/history, unread counts and explicit read acknowledgements.
- Host opts into new conversations (off by default); existing conversations continue after opt-out. No external listing is required. Messaging never changes physical availability or creates bookings.
- Participant-only access keeps emails, raw contacts and exact addresses private. Deleting a property retains read-only history.
- Database locks and idempotency keys protect retries, message ordering and unread state; per-profile database-backed limits constrain spam.
- PostgreSQL integration tests cover authorization, privacy, dates, concurrency, pagination, retries, limits and deletion. Backend API contract is in `parrot669-backend/docs/messaging.md`.
- Backend only: frontend screens, Worker proxy, block/report UI and message email notifications remain to be connected. Existing frontend/geolocation flows are unchanged.

## 2026-09-23 — Host address autocomplete and persistence

- Replace the Barcelona city selector with a labeled address field in create/edit forms.
- Fetch suggestions through the authenticated Worker proxy; debounce, cancel stale queries,
  support keyboard/touch selection and show retry/error states without losing the text.
- Fill country/city from selection and save the complete address with the property.
- Clear stale coordinates when text changes; keep exact addresses private to the owner.
- Backend V19 preserves existing records and lets normalized properties use other locations;
  guest discovery continues to read our own database.

## 2026-09-23 — Compact responsive period layout

- Desktop period controls share one row: dates, labeled nightly price and actions.
- Mobile keeps both dates side by side, with labeled price and actions below.
- Keep card grouping and date hints; reduce nested mobile padding to leave room for date values.

## 2026-09-23 — Clear owner period cards on mobile

- Saved availability and manual blocks are separate cards with labeled fields and a dedicated action row.
- Price per night keeps its visible label and EUR unit even when filled.
- Empty owner date controls show a localized hint and calendar icon without relying on native date placeholders.
- Native date pickers and inclusive-night semantics are preserved.

## 2026-09-23 — Inclusive owner date ranges

- Owner availability and manual blocks now include the selected last night, with explicit labels and guidance in all four languages.
- A single-night period can use the same date in both fields.
- Convert dates only at the host UI boundary; API/database ranges and guest checkout remain exclusive.
- Existing periods retain their covered nights and prices. Display, edit, save and deletion confirmation use consistent inclusive dates.
- Regression tests cover single nights, repeated saves, month/year/leap-day boundaries and date changes around daylight saving time.

## 2026-09-23 — Country and city search

- Guest search now requires both country and city.
- Country options come from distinct property countries in PostgreSQL; city options come from distinct property cities for the selected country.
- Guest search no longer depends on an external geocoder and cannot select locations that PARROT does not currently have in its database.
- Removed the remaining Barcelona-only filter from backend availability search; backend now filters by normalized country code plus city.
- Cloudflare Worker proxies the public location endpoints used by the search UI.
- Existing saved Barcelona searches are migrated client-side when Spain is the only available country.
- Search stays disabled until both required location fields are loaded and selected.

## 2026-09-22 — Remove duplicated dates from result cards

- Removed the availability date window from every result card because the requested stay period is already visible in the search controls above the results.
- Cards now focus on the information that actually differs between properties: identity, accommodation/capacity facts, price, host and outbound action.

## 2026-09-22 — Product-style housing result cards

- Reworked guest search results into a clearer product-card hierarchy instead of a flat stack of equally weighted metadata.
- Cards now lead with property name and city, group accommodation type/bedrooms/sleeping places into compact facts, and give the available date window its own visual block.
- Result dates are rendered in the current UI locale rather than raw ISO form.
- Price is a stronger secondary focus, while host identity is intentionally quieter in the footer.
- Published Airbnb links render as the card CTA; properties without a published external link show a subdued informational state instead of a button-like affordance.

## 2026-09-22 — Database-enforced availability integrity

- Added Flyway V13 with a PostgreSQL GiST exclusion constraint preventing overlapping `[date_from, date_to)` availability periods for the same property.
- Migration aborts with a clear error if legacy overlapping rows already exist instead of silently deleting user data.
- Existing application overlap checks remain for friendly validation, while PostgreSQL now closes the concurrent check-then-insert/update race.
- PostgreSQL exclusion violations are mapped back to HTTP 409 Conflict instead of surfacing as 500 errors.

## 2026-09-22 — Live housing filters and dirty period saves

- Accommodation type now behaves as a true result filter: repeat searches always use its current selected value instead of the value captured in the previous base-search snapshot.
- Existing host availability periods no longer show a redundant Save action while unchanged. Save appears only after dates or nightly price are edited.

## 2026-09-22 — Remove legacy auth and simplify host account UI

- Removed the pre-account edit-token migration path, legacy claim endpoint and compatibility owner routes.
- V12 deletes any remaining unowned legacy profiles, makes `profiles.account_id` mandatory and drops `access_token_hash`.
- Host authentication moved out of the large numbered content panel into compact top-bar Log in / Create account actions.
- After authentication, only the account email and Log out action remain in the top bar; PARROT ID is no longer shown in the host console.
- Cloudflare Worker now proxies only the `parrot_session` cookie for owner API calls.

## 2026-09-22 — Editable property characteristics and stay settings

- Bedrooms and sleeping places can now be edited after property creation alongside accommodation type.
- Property characteristics are grouped separately from stay conditions: minimum stay and cleaning fee now sit with availability and nightly pricing controls.
- Renamed the property creation label from an internal/private label to a property name, matching the fact that it is shown in guest search.
- Guest search no longer displays minimum stay as a separate result line; backend minimum-stay enforcement is unchanged.

## 2026-09-22 — Owner accounts and server-side sessions

- Replaced frontend `profileId + editToken` authentication with email/password accounts and opaque server-side sessions.
- Passwords are hashed with Argon2id; raw passwords and raw session tokens are never stored in PostgreSQL.
- Host sessions use HttpOnly, SameSite=Lax cookies; production cookies are Secure and expire after 30 days. Logout invalidates the server-side session.
- Owner mutations authorize the authenticated profile and no longer accept `X-Parrot-Token` as a security credential.
- Added register, login, logout, `/me` and authenticated dashboard flows plus login failure rate limiting.
- Added a one-time legacy profile claim path for existing edit-token hosts. Successful claim clears the legacy token hash.
- Host UI now shows login/sign-up states, persists authentication across reloads via the cookie, clears host state on logout, and offers legacy migration when old credentials are found in localStorage.
- V11 adds accounts, sessions, profile/account ownership and a reserved hashed password-reset-token table. Password reset email is intentionally not exposed until backend email delivery is connected.
- Guest availability search remains public.

## 2026-09-22 — Search copy and city selector cleanup

- Removed the claim that host properties do not contain prices; PARROT can now store optional pricing.
- Results without a price now say to ask the host and no longer show the indicative-price disclaimer.
- Removed unconditional wording that assumed an external listing exists; general rental terms are attributed to the host, while external links are shown only when actually attached and published.
- Removed minimum-stay text from the compact host property summary because the value is already visible in property settings.
- Aligned the `Only with a price` checkbox with the other result-filter controls.
- Added a real city selector to guest search and property creation. Barcelona is currently the only available city.

## 2026-09-22 — External listing lifecycle and filter cleanup

- Calendar sync is now shown only when an external Airbnb listing exists.
- Deleting the external listing also deletes its Airbnb calendar atomically; migration V10 removes any already orphaned calendars.
- Added a host checkbox to keep an Airbnb listing connected for sync while hiding its outbound link from guest search results.
- Replaced the property Expand/Collapse text button with a compact up/down chevron control.
- Moved accommodation type from the primary search form into the result-filter group. After an initial search, changing it immediately re-runs the search like the other filters.

## 2026-09-22 — Persistent search, price ordering and compact host cards

- Availability search now persists criteria and result filters in localStorage. Returning from the host screen restores the previous search state and automatically re-runs the last performed search.
- Search results are sorted by final estimated stay price ascending; properties without a complete price are placed last.
- Added estimated total price filters from/to in EUR. Changing a result filter after a search immediately re-runs it.
- Calendar connected status is localized; Russian now shows `Подключён` instead of `Connected`.
- Calendar destructive action is labelled Delete/Удалить rather than Disconnect/Отключить.
- Enable/disable controls are visually grouped separately from calendar deletion.
- Host property cards are collapsed by default to their main summary and expose Expand/Collapse controls; expanded state survives internal rerenders.

## 2026-09-22 — Editable accommodation type and result filters

- Accommodation type can now be changed from each property's settings together with minimum stay and cleaning fee.
- Moved `Only with a price` out of the primary search form into a separate result-filter area, leaving room for future filters.
- After an initial search, changing `Only with a price` immediately re-runs the same search with the new filter state.
- Documented the host API proxy contract: browser `/api/host/*` requests are intentionally forwarded to backend `/api/*`; the different visible paths are not separate APIs.

## 2026-09-22 — Editable property settings and calendar toggles

- Minimum stay is no longer requested while creating a property; new properties default to one day and the value is editable from each property card.
- Cleaning fee moved from the external Airbnb listing to the PARROT property, so it can be set, changed or cleared even when no external listing exists. Existing listing fees are migrated to their property.
- External calendars can now be disabled and re-enabled without deleting the connection. Disabled calendars keep their snapshot but do not block search or run automatic sync; re-enabling refreshes immediately.
- Calendar controls remain visible after the external Airbnb listing is removed, so an existing calendar can still be disabled, re-enabled or disconnected.
- Host property cards are more strongly separated visually and highlight each property title.
- Added backend smoke coverage for property settings plus calendar disable/re-enable search semantics.

## 2026-09-22 — Search without external links and accommodation type

- Properties remain in availability search after their external Airbnb listing is removed; search results return `links: []` and the guest UI explains that no external link has been added yet.
- Added `accommodationType` with the values `entire_place` and `private_room` across property creation, owner dashboard, public profile and search results.
- Existing properties migrate to `entire_place`.
- Host creation uses a compact two-option select; guest search uses `Any type / Entire place / Private room`, and result cards show the selected type.
- Added backend smoke coverage for type filtering, invalid type rejection and search after deleting an external listing.

## 2026-09-22 — Localized Airbnb calendar links and visible errors

- Airbnb iCal export links on localized hosts such as `airbnb.ru`, `airbnb.es` and `airbnb.co.uk` are accepted and normalized to `www.airbnb.com` before fetch; redirects stay disabled and lookalike hosts remain rejected.
- Calendar connection failures, including an iCal listing-id mismatch, are now rendered directly below the calendar form instead of only in the page-level status above the property list.

## 2026-09-22 — Harden Airbnb iCal connection

- Added regression coverage confirming that a calendar listing ID must exactly match the attached Airbnb listing ID; mismatches are rejected before fetch.
- Calendar fetches accept only `airbnb.com` and its subdomains with the exact `/calendar/ical/<listingId>.ics` path, closing lookalike-host SSRF bypasses.
- A failed calendar reconnect keeps the last successful event snapshot and last-success timestamp, so known reservations remain blocked.
- End-to-end smoke coverage now protects URL validation, exact listing matching and failed-reconnect behavior.

## 2026-09-21 — Airbnb iCal synchronization

- Hosts can connect an Airbnb iCal export URL after attaching the matching Airbnb listing.
- The backend validates that the listing id inside the iCal URL matches the property's Airbnb listing id.
- Sync happens immediately on connect, manually on demand, and automatically about once per hour.
- Imported iCal data is normalized to event kind + date range + UID; reservation descriptions/phone fragments are not stored.
- `Reserved` events block PARROT search for overlapping nights.
- `Airbnb (Not available)` events are retained for host visibility but do not block PARROT physical availability.
- Unknown summaries are retained as unknown and do not silently block availability.
- Calendar URLs remain server-side and are never returned by dashboard/public APIs.

## 2026-09-21 — optional pricing and interval stitching

- Availability periods can carry an optional nightly price in EUR cents.
- External listings can carry an optional cleaning fee.
- Guest search can show all results or only results with complete pricing.
- If any requested night has no price, the result has no price estimate; priced-only mode excludes it.
- Price is explicitly indicative; final terms and other charges remain with the host/external listing.
- New and edited availability periods cannot overlap.
- Adjacent half-open periods are allowed and search now stitches them across boundaries by night.
- Kept interval rows rather than one database row per day; requested nights are expanded only inside the search query.
- Main-site Housing entry is visually separated from ordinary service/navigation links.

## 2026-09-21 — owner state and date semantics

- Host page now reloads properties, external listing and PARROT availability from an authenticated backend dashboard endpoint on every page load.
- localStorage is credentials-only; it is no longer authoritative for property/listing/calendar state.
- Search results use the owner-entered property title instead of the city name.
- Date ranges now use hotel semantics: `[check-in, checkout)`.
- Same-day check-in/check-out is rejected as a zero-night stay.
- Host availability periods also require `to > from`.
- Existing production availability rows are migrated by adding one day to the old inclusive end date, preserving their previous meaning.
- Worker proxy allows the new owner dashboard route.

## 2026-09-21 — Barcelona scope and deletion

- Added property deletion and external-listing deletion with owner-token authorization.
- MVP restricted to Barcelona with internal `city_code = barcelona`.
- Search includes owner nickname but does not expose raw contact details.
- Main navigation groups guest search and host tools under the Housing product area.

## 2026-09-21 — capacity, minimum stay and Airbnb IDs

- Added sleeping-place capacity and minimum stay.
- Search enforces both.
- Hosts enter an Airbnb listing ID; PARROT generates the external URL.
- Search moved from the homepage to `/search.html`.
