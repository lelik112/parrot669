# PARROT 669 — Roadmap и Feature Registry

**Agent:** Марк. **Role:** Product Manager. **Change:** срез 2026-09-25 после PM-029 и triage PM-030. **Related task:** [PM-030](tasks/PM-030-qa-drain-next-stage.md).

Цель MVP: хозяева добавляют свободное жильё, гости находят полезные результаты, между ними происходит контакт. Выпущенный код и зелёный CI не являются независимой приёмкой и доказательством ценности. Фактические claims — [индекс задач](tasks/README.md), полная [очередь Бориса](tasks/PM-030-qa-drain-next-stage.md#одна-очередь-бориса-после-pm-029pm-016), [статус](status.md).

## Team operations — P2 / NOW

[PM-042](tasks/PM-042-agent-check-in-process-audit.md) и [PM-043](tasks/PM-043-agent-wake-up-feasibility.md) завершены как исследования; [PM-045](tasks/PM-045-five-minute-agent-wake-up-pilot.md) закрыта как недоступный пятиминутный scheduler. [PM-046](tasks/PM-046-github-event-existing-chat-wakeup.md) / P2 в работе как внедрение [D017](decisions/D017-pr-inbox-handoffs.md): адресные комментарии в PR #60 Марка и #61 Игоря подтвердили двустороннее пробуждение прежних чатов; второй отдельный комментарий повторно запустил Игоря. PR #62 Дениса, #63 Бориса, #64 Никиты и #65 Алекса подготовлены, но их личные triggers и доставка ещё не подтверждены. Следующий шаг — однократная настройка в каждом существующем чате и один тест Марка; обычный push в `main` не будит агента. Это процессная работа Марка, она не снимает P1 приоритет с QA основного пути.

## NEXT — почтовая приёмка P1

[PM-044](tasks/PM-044-qa-mailboxes.md) — четыре управляемых QA inbox и контролируемая привязка старых аккаунтов; Никита четыре ящика (Luna / Medium), Борис — приёмка после привязки, Денис dev после PM-040 (Sol / Medium), claims нет. После этого [PM-017](tasks/PM-017-qa-test-mailbox-access.md) и [PM-006](tasks/PM-006-email-acceptance.md); личную почту владельца не используем. Провайдер и любые изменения DNS требуют выбора/прав Алексея.

## NOW

QA capacity: [D013](decisions/D013-qa-acceptance-regression-split.md) разделяет критическую приёмку Бориса и регресс Никиты. PM-036 закрыта по решению Алексея после A→B→A Никиты и проверки пары Бориса; live outsider login negative на QA origin отмечен как принятое исключение без PASS. Новые QA claims распределяются по карточкам; Борис оставляет за собой критические контакт, календарь и auth/security/privacy. [Матрица передачи](tasks/PM-030-qa-drain-next-stage.md#qa-split--новая-роль-2026-09-25-после-появления-исполнителя).

| Приоритет | Задачи | Ответственный и выход |
| --- | --- | --- |
| P1 | [PM-029](tasks/PM-029-two-origin-qa-sessions.md) → [PM-016](tasks/PM-016-qa-second-session-access.md) | Базовый qa/lelik обмен PASS, но после block-теста PM-016 снова in review до восстановления `lelik`; PM-029 security/reverse logout остаётся in review |
| P1 | [PM-024](tasks/PM-024-contact-from-every-search-result.md) + [PM-003](tasks/PM-003-contact-acceptance.md) + [PM-023](tasks/PM-023-guest-message-onboarding.md) | Базовый контакт и ответ PASS; PM-003 blocked после block-теста/BUG-021 до восстановления `lelik`; PM-023 independent QA следующей |
| P1 | [PM-002](tasks/PM-002-link-publication.md), [PM-001](tasks/PM-001-calendar-control-dates.md) | Борис закрывает доступный copy/contact/calendar QA; контролируемый Airbnb/iCal PM-018 отдельно |
| P1 | [PM-030](tasks/PM-030-qa-drain-next-stage.md) | Марк / PM сводит приёмку и договорится о следующем продукте после первой волны QA |
| P2 | [PM-037](tasks/PM-037-search-date-range-bound.md) | Выпущена Игорем, независимая QA Бориса открыта; PM-043 закрыта |
| P2 | [PM-038](tasks/PM-038-host-unsaved-drafts-rerender.md) | Кодовый путь потери черновика подтверждён аудитом; Никита — кандидат на короткий QA без двух аккаунтов, Денис — dev кандидат после QA; claims не заявлены |
| P2 | [BUG-021](tasks/BUG-021-blocking-signs-out-host.md) | Один QA случай потери видимого входа после block: reported, повтор после восстановления `lelik`; Марк решает узкий dev claim после evidence |
| P2 | [BUG-020](tasks/BUG-020-unread-message-discoverability.md), [PM-026](tasks/PM-026-remove-duplicate-messages-link.md), [PM-027](tasks/PM-027-open-property-from-messages.md), [PM-028](tasks/PM-028-open-host-profile-from-messages.md) | BUG-020 в работе Дениса (Sol / Medium): повторный QA нашёл пропадающий глобальный badge при непрочитанной строке; PM-026 ждёт общий ретест. PM-028 desktop owner/guest, языки и keyboard PASS; same-origin logout/switch/expiry и touch открыты. PM-027 — отдельная приёмка Бориса |
| P2 | [PM-005](tasks/PM-005-closed-dates-copy.md), [PM-010](tasks/PM-010-auth-routes-extraction.md), [PM-011](tasks/PM-011-calendar-sync-extraction.md), [PM-013](tasks/PM-013-calendar-waiting-instruction.md), [PM-020](tasks/PM-020-host-cabinet-navigation.md), [PM-021](tasks/PM-021-private-host-profile.md), [BUG-019](tasks/BUG-019-search-account-context.md) | BUG-019 authenticated desktop self/other и четыре языка PASS; нужен отдельный anonymous public QA и iPhone. PM-020 глубокий scroll FAIL после BUG-016: BUG-022 без dev claim, затем ретест Бориса; прочие задачи — по карточкам |

| P1 | [PM-040](tasks/PM-040-playwright-web-e2e.md) | Денис / Sol / Medium выпустил PR #54/#57, 4 fixture-сценария × 3 проекта, CI 12/12; независимый QA и живой backend открыты. Никита / Luna / Medium и Борис / Sol / Medium берут свои QA claims; ручной A↔B PM-036 PASS, автоматический A↔B требует изолированных данных и разрешённого окружения |
| P1 | [PM-041](tasks/PM-041-real-device-qa-queue.md) | blocked: Марк ведёт отдельную очередь real iPhone Safari, Борис / Никита после доступной среды; Luna / Medium; mobile PASS по Playwright не заявлять |
| P1 | [PM-015](tasks/PM-015-qa-mobile-device-environment.md), [PM-025](tasks/PM-025-search-contact-button-layout.md) | blocked: без автономного iPhone Safari для Бориса; телефонные критерии в PM-041, browser smoke в PM-040; desktop PM-025 partial PASS сохраняется |
| P2 | [PM-004](tasks/PM-004-street-autofill.md), [BUG-018](tasks/BUG-018-calendar-end-date-mobile-safari.md), [PM-014](tasks/PM-014-qa-native-autofill-environment.md) | blocked: PM-004/014 ждут Safari со сохранённым адресом; BUG-018 — реальный iPhone picker. PM-026/BUG-020 остаются in review для доступного desktop с отдельным mobile блокером |

Денис выпустил первый browser smoke PM-040 после handoff BUG-020; основная QA и последующее расширение web покрытия открыты. Реальный backend и телефон этот fixture не проверяет. PM-017 (почта) и PM-018 (контролируемый Airbnb) — отдельные ресурсы QA; [D015](decisions/D015-qa-environment-blocked-status.md) разделяет blocked и in review, [D016](decisions/D016-playwright-first-real-device-queue.md) задаёт Playwright-first и отдельную очередь настоящего телефона.

## NEXT

- [PM-036](tasks/PM-036-regression-qa-independent-two-accounts.md) P1 — done: независимые сеансы Никиты и сохранность пары Бориса подтверждены; CI/live guard частично проверен. По решению Алексея live login постороннего подтверждённого аккаунта остался явно непроверенным исключением. PM-029 и автоматический auth PM-040 отдельно.

- [PM-006](tasks/PM-006-email-acceptance.md) P1 — независимый цикл email после PM-017. [PM-007](tasks/PM-007-mobile-acceptance.md) P1 — blocked, пока Борис не получает управляемый iPhone Safari по PM-015/041; полного QA claim нет.
- [PM-008](tasks/PM-008-pilot.md) P1 — Марк / PM готовит план пилота и определения измерений; запуск и исходные показатели не подтверждены.
- [PM-022](tasks/PM-022-public-host-profile.md) P2 — предложен минимальный публичный контракт. Требуется отдельное решение владельца о privacy/visibility и первая волна QA; только после этого рассматривать **одну** следующую dev-задачу. Сейчас dev не назначен.
- [PM-034](tasks/PM-034-backend-frontend-refactoring-audit.md) P2 — done: Игорь/Денис завершили read-only аудиты, Марк свёл их. [PM-037](tasks/PM-037-search-date-range-bound.md) выпущена после завершения PM-043; независимая QA ожидается. PM-038 P2/NOW — отдельный QA черновиков и узкое исправление только после подтверждения. Скорость поискового enrichment и FE-3 5xx empty state остаются гипотезами для проверки.
- [PM-031](tasks/PM-031-trust-terminology.md) P2 — Марк / PM, редакционный контракт проверяемых формулировок без dev claim; новая публичная коммуникация после согласования.

## LATER

- [PM-012](tasks/PM-012-legacy-challenges-extraction.md) later — нет обоснованного срочного рефакторинга.
- [PM-032](tasks/PM-032-how-it-works.md) и [PM-033](tasks/PM-033-faq.md) later — отдельные редакционные задачи после словаря PM-031 и QA; dev не назначен.
- Перестройка homepage — после принятых контрактов PM-022/031/032 и проверки вреда текущего экрана для поиска/контакта. Legal/privacy — до запуска нового публичного раскрытия.
- Карта, контакты по явному согласию, вложения, realtime, рейтинг и расширение географии — после сигналов пилота; новой разработки сейчас нет.

## REJECTED в текущем MVP

- Бронирование и оплата внутри PARROT.
- Расплывчатый статус `Trusted host` без проверяемого факта.
- Обязательное Airbnb-объявление для участия объекта в поиске.
- Признание проверки сохранённых дат успешной по одной лишь смене текста.

Эти границы пересматриваются отдельным решением с причиной. [PM-019](tasks/PM-019-host-cabinet-ia.md) уже done (D009); PM-020 и PM-021 выпущены и проходят независимую приёмку.

## Feature Registry

Статусы: `idea`, `planned`, `in progress`, `done`, `rejected`. `done` означает реализацию в описанном объёме; независимый QA и доказанная полезность отмечаются отдельно. Приоритет завершённой фичи означает важность сохранения её поведения. Детальное описание новой работы — в связанной задаче. `done` в этом реестре относится к реализации в указанном объёме, а task file остаётся `in review` до независимого QA.

| ID | Название | Описание | Статус | Приоритет | Связанные задачи / источник |
| --- | --- | --- | --- | --- | --- |
| F01 | Аккаунты | Email, подтверждение, сессии и принадлежность данных | done | P1 | [PM-006](tasks/PM-006-email-acceptance.md); product-context |
| F02 | Восстановление доступа | Возврат в тот же аккаунт через email | done | P1 | [PM-006](tasks/PM-006-email-acceptance.md); полный live-цикл не принят |
| F03 | Объект и адрес | Название, тип, вместимость и приватный адрес | done | P1 | [PM-004](tasks/PM-004-street-autofill.md), [PM-007](tasks/PM-007-mobile-acceptance.md) |
| F04 | Доступность и закрытия | Свободные периоды, цены и отдельные ручные блокировки | done | P1 | [PM-005](tasks/PM-005-closed-dates-copy.md); текущий контекст |
| F05 | Поиск | Страна/город, даты, вместимость, тип и фильтры | done | P1 | [PM-003](tasks/PM-003-contact-acceptance.md), [PM-007](tasks/PM-007-mobile-acceptance.md) |
| F06 | Сравнение стоимости | Полная цена срока с известной уборкой; без неполной оценки | done | P1 | QA 23.09; [PM-007](tasks/PM-007-mobile-acceptance.md) |
| F07 | Airbnb iCal | Импорт, синхронизация и жизненный цикл календаря | done | P1 | Защищаемые сценарии [PM-001](tasks/PM-001-calendar-control-dates.md) |
| F08 | Поиск без Airbnb | Внешнее объявление необязательно | done | P1 | [PM-002](tasks/PM-002-link-publication.md), [PM-008](tasks/PM-008-pilot.md) |
| F09 | Сообщения и блокировка | Контакт доступен для каждого объекта в поиске; auth перед отправкой, per-participant block/rate limit | done | P1 | [D011](decisions/D011-contact-always-available.md), [PM-024](tasks/PM-024-contact-from-every-search-result.md), QA [PM-003](tasks/PM-003-contact-acceptance.md)
| F10 | Email-уведомления | Уведомление о непрочитанных сообщениях | done | P1 | [PM-006](tasks/PM-006-email-acceptance.md); доставка ещё не принята |
| F11 | Изменение календаря v1 | Историческая проверка любого изменения без сохранённого задания | done | P1 | Ранее выданный v1-статус не доказывает выбранные даты; [D002](decisions/D002-calendar-control-dates.md) |
| F12 | Проверка выбранных дат | Выбор в PARROT, сохранение, внешнее действие, сравнение | done | P1 | [PM-001](tasks/PM-001-calendar-control-dates.md); частичная desktop QA подтверждена, полная приёмка и [PM-013](tasks/PM-013-calendar-waiting-instruction.md) открыты |
| F13 | Внешняя ссылка + verification status | Не блокировать валидный URL из-за verification; показывать status и nudge | done | P1 | [PM-002](tasks/PM-002-link-publication.md); [D010](decisions/D010-external-link-independent-verification.md) accepted
| F14 | Понятные закрытые даты | Ясный заголовок и обычное оформление формы | done | P2 | [PM-005](tasks/PM-005-closed-dates-copy.md), Денис; выпущено, независимая приёмка ожидается |
| F15 | Подсказки улиц | Устранить перекрытие браузерным autofill | done | P2 | [PM-004](tasks/PM-004-street-autofill.md), Денис; выпущена правка, нативный ретест ожидается |
| F16 | Пилот и воронка | Проверить активацию владельца, поиск и контакт | idea | P1 | [PM-008](tasks/PM-008-pilot.md) |
| F17 | Доступный путь связи | Проверить качество реализованного D011-контакта | planned | P1 | [PM-024](tasks/PM-024-contact-from-every-search-result.md), [PM-003](tasks/PM-003-contact-acceptance.md), [PM-008](tasks/PM-008-pilot.md) |
| F18 | Жалобы | Сообщение сервису о нарушении | idea | later | TODO product-context; задача после оценки инцидентов |
| F19 | Доставка email | Видимость доставок и возвратов | idea | later | Проверить потребность по [PM-006](tasks/PM-006-email-acceptance.md) |
| F20 | Карта | Визуальный выбор места | idea | later | Отдельное решение; текущий поиск работает без карты |
| F21 | Публичные контакты | Внешний контакт по согласию | idea | later | Не менять текущую приватность |
| F22 | Вложения | Передача файлов в переписке | idea | later | Потребность не подтверждена |
| F23 | Realtime | Уменьшить задержку обновления переписки | idea | later | Текущий polling уже реализован |
| F24 | Собственный рейтинг | Репутация на основе взаимодействий PARROT | idea | later | Рекомендация PM отложить, не принятое отклонение |
| F25 | Общий Trusted host | Обещание доверия без определённой проверки | rejected | later | Принцип проверяемых фактов |
| F26 | Бронирование и оплата | Сделка внутри сервиса | rejected | later | Вне текущего продукта |
| F27 | Навигация кабинета | Найти действующие действия и вернуться без потери контекста | done | P2 | [PM-019](tasks/PM-019-host-cabinet-ia.md) → [PM-020](tasks/PM-020-host-cabinet-navigation.md), QA in review |
| F28 | Личный профиль | Управлять данными хозяина отдельно от учётной записи | done | P2 | [PM-021](tasks/PM-021-private-host-profile.md), реализация выпущена, QA in review |
| F29 | Публичный профиль | Показывать только разрешённые сведения и проверяемые сигналы | planned | P2 | [PM-022](tasks/PM-022-public-host-profile.md), после PM-021 |
| F30 | Путь гостя к первому сообщению | Довести намерение написать до отправленного обращения: auth по месту, без потери черновика | done | P1 | [PM-023](tasks/PM-023-guest-message-onboarding.md) |
| F31 | Контекст диалога | Открыть связанный объект и собственный профиль из Messages | done | P2 | [PM-027](tasks/PM-027-open-property-from-messages.md), [PM-028](tasks/PM-028-open-host-profile-from-messages.md) |

| F32 | Проверяемые формулировки доверия | Называть конкретный сигнал и его ограничения | planned | P2 | [PM-031](tasks/PM-031-trust-terminology.md) |
| F33 | How it works | Объяснить проверенный путь поиска и контакта | idea | later | [PM-032](tasks/PM-032-how-it-works.md) |
| F34 | FAQ | Ответы на повторяющиеся реальные вопросы | idea | later | [PM-033](tasks/PM-033-faq.md) |

## Приоритизация и измерения

- **P0:** подтверждённая критическая поломка основного пути, утрата данных или раскрытие приватных данных. По изученным материалам текущим задачам P0 не назначен.
- **P1:** основной путь MVP, достоверность сигнала или необходимая приёмка.
- **P2:** локальная помеха интерфейса; повысить приоритет, если выяснится, что она блокирует основной путь.
- **later:** отложенная или пока недоказанная ценность.

Для пилота наблюдаем: добавление объекта с будущей доступностью, полезную выдачу с путём связи, первое сообщение, ответ владельца и расхождения доступности. Внешний клик не равен контакту. Реальные исходные числа и целевые значения ещё не предоставлены; они не считаются нулевыми. Определения — в PM-008.
