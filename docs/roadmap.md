# PARROT 669 — Roadmap и Feature Registry

**Agent:** Марк. **Role:** Product Manager. **Change:** срез 2026-09-25 после PM-029 и triage PM-030. **Related task:** [PM-030](tasks/PM-030-qa-drain-next-stage.md).

Цель MVP: хозяева добавляют свободное жильё, гости находят полезные результаты, между ними происходит контакт. Выпущенный код и зелёный CI не являются независимой приёмкой и доказательством ценности. Фактические claims — [индекс задач](tasks/README.md), полная [очередь Бориса](tasks/PM-030-qa-drain-next-stage.md#одна-очередь-бориса-после-pm-029pm-016), [статус](status.md).

## NOW

| Приоритет | Задачи | Ответственный и выход |
| --- | --- | --- |
| P1 | [PM-029](tasks/PM-029-two-origin-qa-sessions.md) → [PM-016](tasks/PM-016-qa-second-session-access.md) | Базовый qa/lelik обмен PASS, но после block-теста PM-016 снова in review до восстановления `lelik`; PM-029 security/reverse logout остаётся in review |
| P1 | [PM-024](tasks/PM-024-contact-from-every-search-result.md) + [PM-003](tasks/PM-003-contact-acceptance.md) + [PM-023](tasks/PM-023-guest-message-onboarding.md) | Базовый контакт и ответ PASS; PM-003 blocked после block-теста/BUG-021 до восстановления `lelik`; PM-023 independent QA следующей |
| P1 | [PM-002](tasks/PM-002-link-publication.md), [PM-025](tasks/PM-025-search-contact-button-layout.md), [PM-001](tasks/PM-001-calendar-control-dates.md) | Игорь/Денис выпустили соответствующие изменения; Борис закрывает copy/CTA и контролируемые календарные состояния, external PM-018/mobile PM-015 отдельно |
| P1 | [PM-030](tasks/PM-030-qa-drain-next-stage.md) | Марк / PM сводит приёмку и договорится о следующем продукте после первой волны QA |
| P2 | [BUG-021](tasks/BUG-021-blocking-signs-out-host.md) | Один QA случай потери видимого входа после block: reported, повтор после восстановления `lelik`; Марк решает узкий dev claim после evidence |
| P2 | [BUG-020](tasks/BUG-020-unread-message-discoverability.md), [PM-026](tasks/PM-026-remove-duplicate-messages-link.md), [PM-027](tasks/PM-027-open-property-from-messages.md), [PM-028](tasks/PM-028-open-host-profile-from-messages.md) | Реализация in review; Борис проверяет unread и переходы в двух аккаунтах |
| P2 | [PM-004](tasks/PM-004-street-autofill.md), [PM-005](tasks/PM-005-closed-dates-copy.md), [PM-010](tasks/PM-010-auth-routes-extraction.md), [PM-011](tasks/PM-011-calendar-sync-extraction.md), [PM-013](tasks/PM-013-calendar-waiting-instruction.md), [PM-020](tasks/PM-020-host-cabinet-navigation.md), [PM-021](tasks/PM-021-private-host-profile.md), [BUG-018](tasks/BUG-018-calendar-end-date-mobile-safari.md), [BUG-019](tasks/BUG-019-search-account-context.md) | In review, частичные PASS есть; короткие ретесты/внешняя среда расписаны в PM-030. BUG-016 исправлен в PR #23, production ретест открыт |

До первой QA-волны свободной мощности Дениса не назначаем крупную новую фичу; если Борис подтверждает дефект, предложить узкий fix с отдельным claim. Отдельные PM-014/015/017/018 — внешние условия QA, не «пройдено» после реализации второго origin.

## NEXT

- [PM-006](tasks/PM-006-email-acceptance.md) P1 — независимый цикл email после PM-017; [PM-007](tasks/PM-007-mobile-acceptance.md) P1 — основной путь на touch после PM-015. Борис / QA, ожидают доступа; нет claim о начале полного цикла.
- [PM-008](tasks/PM-008-pilot.md) P1 — Марк / PM готовит план пилота и определения измерений; запуск и исходные показатели не подтверждены.
- [PM-022](tasks/PM-022-public-host-profile.md) P2 — предложен минимальный публичный контракт. Требуется отдельное решение владельца о privacy/visibility и первая волна QA; только после этого рассматривать **одну** следующую dev-задачу. Сейчас dev не назначен.
- [PM-034](tasks/PM-034-backend-frontend-refactoring-audit.md) P2 — in progress: Марк сделал обзорный аудит двух репозиториев и подготовил две отдельные карточки: [PM-034-BE](tasks/PM-034-BE-backend-audit.md) Игорю (backend, Sol/High) и [PM-034-FE](tasks/PM-034-FE-frontend-audit.md) Денису (frontend, Sol/Medium); обе planned без claims и не вытесняют P1 QA. Выводы о задержке поиска, рисках состояния и масштабе работ предварительны; кодовый рефакторинг не запущен.
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
