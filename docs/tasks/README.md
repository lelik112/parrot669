# PARROT 669 — короткий индекс задач

**Agent:** Марк. **Role:** Product Manager. **Change:** ежедневный индекс отделён от [правил claim и отчётов](workflow.md) по принятой [PM-035](PM-035-documentation-structure-refactoring.md). **Related task:** PM-035. Обновлено: 2026-09-25.

Перед стартом: [текущий статус](../status.md) → этот индекс → **своя карточка задачи** → [сегодняшние адресованные сообщения](../team-chat.md). Продуктовые решения сверять с [product-context](../product-context.md) и [decisions](../decisions/README.md); история реализации — [changelog](../changelog.md), правила команды — [ai-team](../ai-team.md) и [team](../team.md). Описание и критерии берём из карточки, текущие приоритеты — из [roadmap](../roadmap.md).

Карточка — источник статуса, evidence, назначения и рекомендации модели. Здесь короткий указатель: `in review` означает следующий QA, прежний автор реализации указан в карточке. «—» означает отсутствие активного claim; ссылка в индексе не уведомляет исполнителя. Полный неизменённый [README до разделения](README-history-2026-09-25.md) сохранён.

## Кто есть кто

[Состав и границы ролей](../team.md). Координатор задач — Марк / PM; Денис и Игорь — Developer, Борис — QA Lead / Acceptance QA, новая неназванная роль — Regression QA Engineer (пока без исполнителя и claims), Алекс — Strategy, Алексей — Product Owner.

## Индекс задач

| Задача | Приоритет | Статус | Текущий/следующий шаг |
| --- | --- | --- | --- |
| **NOW — P1** | | | |
| [PM-029](PM-029-two-origin-qa-sessions.md) | P1 | in review — dual sessions and A→B→A passed; block test signed out primary; currently both origins show qa | Борис / QA |
| [PM-016](PM-016-qa-second-session-access.md) | P1 | in review — dual sessions verified, but lelik session needs restoring after block test | Борис / QA |
| [PM-024](PM-024-contact-from-every-search-result.md) | P1 | in review | Борис / QA |
| [PM-003](PM-003-contact-acceptance.md) | P1 | blocked — contact/unread PASS; test pair blocked, `lelik` login needed | Борис / QA после восстановления доступа |
| [PM-023](PM-023-guest-message-onboarding.md) | P1 | in review | Борис / QA |
| [PM-002](PM-002-link-publication.md) | P1 | in review | Борис / QA |
| [PM-025](PM-025-search-contact-button-layout.md) | P1 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-001](PM-001-calendar-control-dates.md) | P1 | in review | Борис / QA |
| [PM-018](PM-018-qa-controlled-calendar.md) | P1 | in review | Борис; Airbnb — Алексей |
| [PM-015](PM-015-qa-mobile-device-environment.md) | P1 | in review | Борис; доступ к mobile |
| [PM-030](PM-030-qa-drain-next-stage.md) | P1 | in progress | Марк / PM |
| **NOW — P2** | | | |
| [BUG-020](BUG-020-unread-message-discoverability.md) | P2 | in review | Борис / QA |
| [BUG-021](BUG-021-blocking-signs-out-host.md) | P2 | reported — one observation, reproduction needed | Марк / PM triage; Борис / QA |
| [BUG-022](BUG-022-host-return-loses-scroll-position.md) | P2 | reported — reproduced on two production origins after BUG-016 fix; developer diagnosis needed | Марк / PM triage; Борис / QA |
| [PM-026](PM-026-remove-duplicate-messages-link.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-027](PM-027-open-property-from-messages.md) | P2 | in review | Борис / QA |
| [PM-028](PM-028-open-host-profile-from-messages.md) | P2 | in review | Борис / QA |
| [PM-010](PM-010-auth-routes-extraction.md) | P2 | in review | Борис / QA |
| [PM-021](PM-021-private-host-profile.md) | P2 | in review | Борис / QA |
| [PM-020](PM-020-host-cabinet-navigation.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [BUG-019](BUG-019-search-account-context.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-005](PM-005-closed-dates-copy.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-011](PM-011-calendar-sync-extraction.md) | P2 | in review | Борис / QA |
| [PM-013](PM-013-calendar-waiting-instruction.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-004](PM-004-street-autofill.md) | P2 | in review | Борис / QA |
| [BUG-018](BUG-018-calendar-end-date-mobile-safari.md) | P2 | in review | Борис / QA |
| [PM-014](PM-014-qa-native-autofill-environment.md) | P2 | blocked | Алексей → Борис: Safari |

| **NEXT — P1** | | | |
| [PM-017](PM-017-qa-test-mailbox-access.md) | P1 | blocked | Алексей → Борис: почта |
| [PM-006](PM-006-email-acceptance.md) | P1 | planned | —: после PM-017 |
| [PM-007](PM-007-mobile-acceptance.md) | P1 | planned | —: после PM-015 |
| [PM-008](PM-008-pilot.md) | P1 | planned | —: пилот не запущен |
| **NEXT — P2** | | | |
| [PM-022](PM-022-public-host-profile.md) | P2 | planned | —: privacy approval + QA |
| [PM-031](PM-031-trust-terminology.md) | P2 | planned | —: без claim редактора |
| [PM-034](PM-034-backend-frontend-refactoring-audit.md) | P2 | in progress — PM overview готов | Марк / PM сводит два независимых аудита |
| [PM-034-BE](PM-034-BE-backend-audit.md) | P2 | planned | Игорь / backend audit, handoff без claim; Sol / High |
| [PM-034-FE](PM-034-FE-frontend-audit.md) | P2 | planned | Денис / frontend audit, handoff без claim; Sol / Medium |
| **LATER** | | | |
| [PM-012](PM-012-legacy-challenges-extraction.md) | later | planned | —: LATER |
| [PM-032](PM-032-how-it-works.md) | later | planned | —: LATER |
| [PM-033](PM-033-faq.md) | later | planned | —: LATER |
| **DONE** | | | |
| [PM-035](PM-035-documentation-structure-refactoring.md) | P2 | done | Марк / PM |
| [PM-009](PM-009-team-identity.md) | P2 | done | Марк / PM |
| [PM-019](PM-019-host-cabinet-ia.md) | P2 | done | Марк / PM |

## PM-отчёт владельцу продукта

Формат отчёта и полный порядок работы — [workflow.md](workflow.md#pm-отчёт-владельцу-продукта).

## Авторство

Действующие правила подписи — [workflow.md](workflow.md#авторство), [team.md](../team.md#идентификация-изменений).

## Структура постановки

Шаблон новой задачи и model check — [workflow.md](workflow.md#структура-постановки); прежние записи сохранены в [истории README](README-history-2026-09-25.md).
