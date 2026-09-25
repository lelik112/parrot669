# PARROT 669 — короткий индекс задач

**Agent:** Марк. **Role:** Product Manager. **Change:** ежедневный индекс отделён от [правил claim и отчётов](workflow.md) по принятой [PM-035](PM-035-documentation-structure-refactoring.md). **Related task:** PM-035. Обновлено: 2026-09-25.

Перед стартом: [текущий статус](../status.md) → этот индекс → **своя карточка задачи** → [сегодняшние адресованные сообщения](../team-chat.md). Продуктовые решения сверять с [product-context](../product-context.md) и [decisions](../decisions/README.md); история реализации — [changelog](../changelog.md), правила команды — [ai-team](../ai-team.md) и [team](../team.md). Описание и критерии берём из карточки, текущие приоритеты — из [roadmap](../roadmap.md).

Карточка — источник статуса, evidence, назначения и рекомендации модели. Здесь короткий указатель: `in review` означает следующий QA, прежний автор реализации указан в карточке. «—» означает отсутствие активного claim; ссылка в индексе не уведомляет исполнителя. Полный неизменённый [README до разделения](README-history-2026-09-25.md) сохранён.

## Кто есть кто

[Состав и границы ролей](../team.md). Координатор задач — Марк / PM; Денис и Игорь — Developer, Борис — QA Lead / Acceptance QA, Никита — Regression QA Engineer (двухаккаунтный QA claim ожидается), Алекс — Strategy, Алексей — Product Owner.

## Индекс задач

| Задача | Приоритет | Статус | Текущий/следующий шаг |
| --- | --- | --- | --- |
| **NOW — P1** | | | |
| [BUG-023](BUG-023-host-profile-save-not-found.md) | P1 | in review — authenticated save/reopen PASS after PR #46 on both origins; 401/privacy open | Денис / Developer; Борис / QA |
| [PM-029](PM-029-two-origin-qa-sessions.md) | P1 | in review — dual exchange passed; main later anonymous, Worker=lelik | Борис / QA |
| [PM-016](PM-016-qa-second-session-access.md) | P1 | in review — qa/lelik restored; shared Chrome collision with Regression QA confirmed | Борис / QA |
| [PM-024](PM-024-contact-from-every-search-result.md) | P1 | in review | Борис / QA |
| [PM-003](PM-003-contact-acceptance.md) | P1 | in review — contact/reply, repeat CTA, unread and block/unblock passed; legacy state open | Борис / QA |
| [PM-023](PM-023-guest-message-onboarding.md) | P1 | in review — public anonymous draft/auth gate PASS; post-login/mobile open | Борис / QA |
| [PM-002](PM-002-link-publication.md) | P1 | in review | Борис / QA |
| [PM-025](PM-025-search-contact-button-layout.md) | P1 | blocked — web PASS, реальный touch ждёт PM-015/039 | Борис / QA после доступного iPhone; Sol / Medium из карточки |
| [PM-001](PM-001-calendar-control-dates.md) | P1 | in review | Борис / QA |
| [PM-018](PM-018-qa-controlled-calendar.md) | P1 | in review | Борис; Airbnb — Алексей |
| [PM-015](PM-015-qa-mobile-device-environment.md) | P1 | blocked — нет управляемого iPhone Safari для Бориса | PM-039 → тест среды; Борис / QA после разблокировки; Luna / Medium |
| [PM-030](PM-030-qa-drain-next-stage.md) | P1 | in progress | Марк / PM; Sol / Medium |
| [PM-039](PM-039-browser-test-environments.md) | P1 | in progress — Марк claim, варианты/цены собраны; real-device feasibility открыта | Марк / PM; Sol / Medium; следующее: проверить AWS Device Farm доступ без покупки |
| **NOW — P2** | | | |
| [PM-038](PM-038-host-unsaved-drafts-rerender.md) | P2 | reported from code — focused QA needed | Марк triage; Никита / QA candidate, Денис / dev candidate, claims нет; Luna / Medium QA, Sol / Medium dev |
| [BUG-020](BUG-020-unread-message-discoverability.md) | P2 | in review | Борис / QA |
| [BUG-021](BUG-021-blocking-signs-out-host.md) | P2 | reported — controlled block/unblock repeat did not reproduce earlier signout | Марк / PM triage; Борис / QA |
| [BUG-022](BUG-022-host-return-loses-scroll-position.md) | P2 | reported — reproduced on two production origins after BUG-016 fix; developer diagnosis needed | Марк / PM triage; Борис / QA |
| [PM-026](PM-026-remove-duplicate-messages-link.md) | P2 | in review — desktop badge evidence проверить; mobile blocked by PM-015 | Борис / acceptance; Никита кандидат на короткий desktop ретест; Luna / Low из карточки |
| [PM-027](PM-027-open-property-from-messages.md) | P2 | in review | Борис / QA |
| [PM-028](PM-028-open-host-profile-from-messages.md) | P2 | in review | Борис / QA |
| [PM-010](PM-010-auth-routes-extraction.md) | P2 | in review | Борис / QA |
| [PM-021](PM-021-private-host-profile.md) | P2 | in review — name save/reopen PASS; API negatives and privacy open | Денис / Developer; Борис / QA |
| [PM-020](PM-020-host-cabinet-navigation.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [BUG-019](BUG-019-search-account-context.md) | P2 | in review — signed-out public/iPhone QA open | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-005](PM-005-closed-dates-copy.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-011](PM-011-calendar-sync-extraction.md) | P2 | in review | Борис / QA |
| [PM-013](PM-013-calendar-waiting-instruction.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-004](PM-004-street-autofill.md) | P2 | blocked — нативный autofill ждёт PM-014 | Борис / QA после Safari с сохранённым адресом; Luna / Low |
| [BUG-018](BUG-018-calendar-end-date-mobile-safari.md) | P2 | blocked — iPhone Safari picker ждёт PM-015 | Борис / QA после реального устройства; Sol / Medium из карточки |
| [PM-014](PM-014-qa-native-autofill-environment.md) | P2 | blocked | Алексей → Борис: Safari |

| **NEXT — P1** | | | |
| [PM-017](PM-017-qa-test-mailbox-access.md) | P1 | blocked | Алексей → Борис: почта |
| [PM-006](PM-006-email-acceptance.md) | P1 | planned | —: после PM-017 |
| [PM-007](PM-007-mobile-acceptance.md) | P1 | blocked — управляемый iPhone Safari ждёт PM-015/039 | Борис / QA после среды, нет claim полного прогона; Luna / Medium |
| [PM-008](PM-008-pilot.md) | P1 | planned | —: пилот не запущен |
| [PM-036](PM-036-regression-qa-independent-two-accounts.md) | P1 | in progress — qa2/qa3 допущены; оба входа/reload PASS, message A↔B/logout и независимый QA открыты | Игорь / Developer; Никита / QA evidence; Sol / High (dev), Luna / Medium (QA) |
| **NEXT — P2** | | | |
| [PM-022](PM-022-public-host-profile.md) | P2 | planned | —: privacy approval + QA |
| [PM-031](PM-031-trust-terminology.md) | P2 | planned | —: без claim редактора |
| [PM-037](PM-037-search-date-range-bound.md) | P2 | in progress — D014: 366 ночей; замер/реализация/QA открыты | Марк / PM контракт done; Игорь dev candidate без claim, P1 раньше; Sol / High |

| **LATER** | | | |
| [PM-012](PM-012-legacy-challenges-extraction.md) | later | planned | —: LATER |
| [PM-032](PM-032-how-it-works.md) | later | planned | —: LATER |
| [PM-033](PM-033-faq.md) | later | planned | —: LATER |
| **DONE** | | | |
| [PM-034](PM-034-backend-frontend-refactoring-audit.md) | P2 | done — PM synthesis, two follow-ups | Марк / PM |
| [PM-034-BE](PM-034-BE-backend-audit.md) | P2 | done — read-only backend report | Игорь / Developer; Марк завершил PM-034 |
| [PM-034-FE](PM-034-FE-frontend-audit.md) | P2 | done — read-only frontend report submitted | Денис / Developer; Марк завершил PM-034 |
| [PM-035](PM-035-documentation-structure-refactoring.md) | P2 | done | Марк / PM |
| [PM-009](PM-009-team-identity.md) | P2 | done | Марк / PM |
| [PM-019](PM-019-host-cabinet-ia.md) | P2 | done | Марк / PM |

## PM-отчёт владельцу продукта

Формат отчёта и полный порядок работы — [workflow.md](workflow.md#pm-отчёт-владельцу-продукта).

## Авторство

Действующие правила подписи — [workflow.md](workflow.md#авторство), [team.md](../team.md#идентификация-изменений).

## Структура постановки

Шаблон новой задачи и model check — [workflow.md](workflow.md#структура-постановки); прежние записи сохранены в [истории README](README-history-2026-09-25.md).
