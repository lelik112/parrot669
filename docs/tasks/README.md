# PARROT 669 — короткий индекс задач

**Agent:** Марк. **Role:** Product Manager. **Change:** ежедневный индекс отделён от [правил claim и отчётов](workflow.md) по принятой [PM-035](PM-035-documentation-structure-refactoring.md). **Related task:** PM-035. Обновлено: 2026-09-25.

Перед стартом: [текущий статус](../status.md) → этот индекс → **своя карточка задачи** → [сегодняшние адресованные сообщения](../team-chat.md). Продуктовые решения сверять с [product-context](../product-context.md) и [decisions](../decisions/README.md); история реализации — [changelog](../changelog.md), правила команды — [ai-team](../ai-team.md) и [team](../team.md). Описание и критерии берём из карточки, текущие приоритеты — из [roadmap](../roadmap.md).

Карточка — источник статуса, evidence, назначения и рекомендации модели. Здесь короткий указатель: `in review` означает следующий QA, прежний автор реализации указан в карточке. «—» означает отсутствие активного claim; ссылка в индексе не уведомляет исполнителя. Полный неизменённый [README до разделения](README-history-2026-09-25.md) сохранён.

## Кто есть кто

[Состав и границы ролей](../team.md). Координатор задач — Марк / PM; Денис и Игорь — Developer, Борис — QA Lead / Acceptance QA, Никита — Regression QA Engineer (двухаккаунтный ручной smoke PM-036 PASS; QA claims по другим задачам отдельно), Алекс — Strategy, Алексей — Product Owner.

## Индекс задач

| Задача | Приоритет | Статус | Текущий/следующий шаг |
| --- | --- | --- | --- |
| **NOW — P1** | | | |
| [BUG-023](BUG-023-host-profile-save-not-found.md) | P1 | in review — authenticated save/reopen PASS after PR #46 on both origins; 401/privacy open | Денис / Developer; Борис / QA |
| [PM-029](PM-029-two-origin-qa-sessions.md) | P1 | in review — dual exchange passed; main later anonymous, Worker=lelik | Борис / QA |
| [PM-016](PM-016-qa-second-session-access.md) | P1 | in review — qa/lelik restored; shared Chrome collision with Regression QA confirmed | Борис / QA |
| [PM-024](PM-024-contact-from-every-search-result.md) | P1 | in review | Борис / QA |
| [PM-003](PM-003-contact-acceptance.md) | P1 | in review — contact/reply, repeat CTA, unread and block/unblock passed; legacy state open | Борис / QA |
| [PM-023](PM-023-guest-message-onboarding.md) | P1 | in review — anonymous draft/auth gate/4 языка PASS; login→send и account isolation открыты | Борис / QA: отдельный public сеанс; confirm после PM-017, mobile PM-041; dev Игорь только при FAIL |
| [PM-002](PM-002-link-publication.md) | P1 | in review | Борис / QA |
| [PM-025](PM-025-search-contact-button-layout.md) | P1 | blocked — web PASS, реальный touch ждёт PM-015/041 | Борис / QA после доступного iPhone; Sol / Medium из карточки |
| [PM-001](PM-001-calendar-control-dates.md) | P1 | in review — сохранённый статус и выбранные даты PASS; негативные/смена iCal и Safari открыты | Борис / QA: контролируемый PM-018 с Алексеем, mobile PM-041; Денис dev только при FAIL |
| [PM-018](PM-018-qa-controlled-calendar.md) | P1 | in review | Борис; Airbnb — Алексей |
| [PM-015](PM-015-qa-mobile-device-environment.md) | P1 | blocked — нет управляемого iPhone Safari для Бориса | очередь PM-041; Борис / QA после разблокировки; Luna / Medium |
| [PM-030](PM-030-qa-drain-next-stage.md) | P1 | in progress | Марк / PM; Sol / Medium |
| [PM-040](PM-040-playwright-web-e2e.md) | P1 | in progress — 4 fixture-сценария × 3 проекта, CI 12/12 (PR #54/#57); web покрытие/QA открыты, ручной A↔B PASS, автоматический auth ждёт изоляции данных | Денис claim, Sol / Medium; Никита / Regression QA claim 2026-09-26 на матрицу и smoke, Luna / Medium; Борис назначен на отдельный critical contact acceptance, Sol / Medium, ждём claim |
| [PM-041](PM-041-real-device-qa-queue.md) | P1 | blocked — очередь реальных iPhone/Safari критериев; браузерный QA продолжается | Марк ведёт очередь, Борис / Никита после доступа; Luna / Medium |
| **NOW — P2** | | | |
| [PM-038](PM-038-host-unsaved-drafts-rerender.md) | P2 | reported from code — focused QA needed | Марк triage; Никита / QA candidate, Денис / dev candidate, claims нет; Luna / Medium QA, Sol / Medium dev |
| [BUG-020](BUG-020-unread-message-discoverability.md) | P2 | in review — PR #53 выпущен; hidden badge PASS, foreground/read-clear и iPhone открыты | Борис / QA следующий при доступной foreground среде; Денис / Sol / Medium только при новом FAIL |
| [BUG-021](BUG-021-blocking-signs-out-host.md) | P2 | reported — controlled block/unblock repeat did not reproduce earlier signout | Марк / PM triage; Борис / QA |
| [BUG-022](BUG-022-host-return-loses-scroll-position.md) | P2 | reported — reproduced on two production origins after BUG-016 fix; developer diagnosis needed | Марк / PM triage; Борис / QA |
| [PM-026](PM-026-remove-duplicate-messages-link.md) | P2 | in review — одна ссылка/языки/keyboard PASS; badge FAIL через BUG-020, touch blocked | Денис исправляет BUG-020 (Sol / Medium); Борис ретестирует badge; mobile PM-041 |
| [PM-027](PM-027-open-property-from-messages.md) | P2 | in review | Борис / QA |
| [PM-028](PM-028-open-host-profile-from-messages.md) | P2 | in review — owner/guest, возврат, языки и keyboard PASS | Борис / QA: same-origin logout/switch/expiry, затем touch PM-041; Denis dev только при FAIL |
| [PM-010](PM-010-auth-routes-extraction.md) | P2 | in review | Борис / QA |
| [PM-021](PM-021-private-host-profile.md) | P2 | in review — name save/reopen PASS; API negatives and privacy open | Денис / Developer; Борис / QA |
| [PM-020](PM-020-host-cabinet-navigation.md) | P2 | in review — глубокий scroll FAIL после BUG-016, BUG-022 открыт | BUG-022 dev claim отсутствует; затем Борис / QA; touch PM-041 |
| [BUG-019](BUG-019-search-account-context.md) | P2 | in review — authenticated desktop self/other и языки PASS | Борис / QA: отдельный anonymous public сеанс; iPhone PM-041; Денис dev только при FAIL |
| [PM-005](PM-005-closed-dates-copy.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-011](PM-011-calendar-sync-extraction.md) | P2 | in review | Борис / QA |
| [PM-013](PM-013-calendar-waiting-instruction.md) | P2 | in review | Борис / acceptance; короткий ретест — кандидат Regression QA после появления и claim |
| [PM-004](PM-004-street-autofill.md) | P2 | blocked — нативный autofill ждёт PM-014 | Борис / QA после Safari с сохранённым адресом; Luna / Low |
| [BUG-018](BUG-018-calendar-end-date-mobile-safari.md) | P2 | blocked — iPhone Safari picker ждёт PM-015 | Борис / QA после реального устройства; Sol / Medium из карточки |
| [PM-014](PM-014-qa-native-autofill-environment.md) | P2 | blocked | Алексей → Борис: Safari |

| **NEXT — P1** | | | |
| [PM-044](PM-044-qa-mailboxes.md) | P1 | in progress / NEXT — Никита взял provisioning четырёх inbox; привязка аккаунтов остаётся за Денисом | Никита / Regression QA claim 2026-09-26 — четыре ящика; Борис — приёмка после привязки; Денис — проверка и смена адресов после PM-040 (claim нет), Luna / Medium QA, Sol / Medium dev; Алексей — выбор сервиса/права при необходимости |
| [PM-017](PM-017-qa-test-mailbox-access.md) | P1 | blocked до PM-044 | Борис / QA после четырёх доступных ящиков |
| [PM-006](PM-006-email-acceptance.md) | P1 | planned | —: после PM-017 |
| [PM-007](PM-007-mobile-acceptance.md) | P1 | blocked — управляемый iPhone Safari ждёт PM-015/041 | Борис / QA после среды, нет claim полного прогона; Luna / Medium |
| [PM-008](PM-008-pilot.md) | P1 | planned | —: пилот не запущен |
| **NEXT — P2** | | | |
| [PM-045](PM-045-five-minute-agent-wake-up-pilot.md) | P2 | blocked / NEXT — callable ограничен часом; Cloud Browser ChatGPT ждёт безопасного входа, пилот не запущен | Марк / PM готовит, Алексей помогает с авторизованным UI при необходимости; агент пилота позже, Luna / Low для check-in |
| [PM-037](PM-037-search-date-range-bound.md) | P2 | in review — backend/frontend release и live smoke выполнены; независимая QA открыта | Борис / QA проверяет 366/367, сохранение ввода, обычный поиск; Игорь / Developer передал evidence |
| [PM-022](PM-022-public-host-profile.md) | P2 | planned | —: privacy approval + QA |
| [PM-031](PM-031-trust-terminology.md) | P2 | planned | —: без claim редактора |

| **LATER** | | | |
| [PM-012](PM-012-legacy-challenges-extraction.md) | later | planned | —: LATER |
| [PM-032](PM-032-how-it-works.md) | later | planned | —: LATER |
| [PM-033](PM-033-faq.md) | later | planned | —: LATER |
| **DONE** | | | |
| [PM-043](PM-043-agent-wake-up-feasibility.md) | P2 | done — одноразовый запуск и CAS доказаны, 5 минут не подтверждены | Марк / PM закрыл исследование; без постоянного scheduler |
| [PM-036](PM-036-regression-qa-independent-two-accounts.md) | P1 | done — функциональный QA и пара Бориса PASS; live outsider login negative оставлен как явно принятое исключение | Марк / PM closure; Игорь / Developer, Никита / Regression QA, Борис / QA Lead |
| [PM-042](PM-042-agent-check-in-process-audit.md) | P2 | done — аудит процесса Алекса; ошибочный второй PM-036 удалён | Марк / PM; Sol / Medium; реализация отдельно PM-043 |
| [PM-039](PM-039-browser-test-environments.md) | P1 | done — выбор D016: Playwright first, телефон PM-041 | Марк / PM; внедрение отдельно PM-040 |
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
