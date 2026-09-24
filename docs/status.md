# PARROT Status

Дата среза: **2026-09-24**. Автор: **Марк / PM**.

Идентификация текущего обновления документации:

- **Agent:** Марк
- **Role:** Product Manager
- **Scope:** Сверка релиза PM-011 и обновление очереди независимой QA после PM-013.
- **Change:** отражён выпущенный Игорем PM-011 (backend CI и Railway успешны); QA календаря взял Борис после PM-005/010. PM-013: Борис подтвердил waiting для `open`, reload и четыре языка; `close` заблокирован контролируемым Airbnb-состоянием PM-018.
- **Related task:** [PM-001](tasks/PM-001-calendar-control-dates.md), [PM-010](tasks/PM-010-auth-routes-extraction.md), [PM-011](tasks/PM-011-calendar-sync-extraction.md), [PM-013](tasks/PM-013-calendar-waiting-instruction.md)

Источники среза: product-context/changelog, задачи/QA, handoff Игоря и claim/релиз Дениса в PM-001, [frontend PR #14](https://github.com/lelik112/parrot669/pull/14), [backend PR #21](https://github.com/lelik112/parrot669-backend/pull/21) и [запись Дениса](changes/PM-001-calendar-control-dates.md). Игорь завершил свой рефакторинг. PM-001 уже находится в обоих main; backend Railway deployment имеет SUCCESS. Денис подтвердил frontend production совпадением хэшей опубликованных файлов с релизными. Борис провёл независимый desktop-прогон с подключённым Airbnb iCal: ключевые A/B-сценарии подтвердились, один UX-баг P2 найден; полная приёмка остаётся открытой.

## Done

- Реализованы аккаунты, объекты/адреса, доступность, ручные закрытия, цены, поиск, iCal, сообщения и уведомления. Полнота независимого QA отличается по сценариям.
- Девять исходных исправлений QA 23.09 подтверждены в указанных desktop-сценариях. Полный цикл восстановления пароля и mobile этим не закрыты.
- Выпущены описанные этапы выделения backend-модулей; product-context фиксирует финальный релиз `f9d8ae7`, V24 и проверки. Повторный live Worker-check в последнем этапе не подтверждён из-за 403/1010 среды.
- Создана общая структура продуктовой работы: roadmap/реестр фич, решения, задачи с владельцами и журналами, этот статус. Изменений приложения в PM-пакете нет.
- Уточнены имена и роли в [team.md](team.md); [D004](decisions/D004-team-identity.md) закрепляет идентификацию коммитов, PR, статусов задач и changelog.
- Добавлены [AI-team workflow](ai-team.md) и [D005](decisions/D005-ai-team-model-guidance.md): рекомендации модели/reasoning, причина выбора и проверка достаточности до основной работы.
- Создан [общий чат команды](team-chat.md); поручение Денису, handoff Игоря и claim/релиз Дениса опубликованы в документации.
- Денис записал claim PM-001. Backend с V25 слит через [PR #21](https://github.com/lelik112/parrot669-backend/pull/21) (`1da6c64`), его Railway deployment имеет статус SUCCESS; frontend слит через [PR #14](https://github.com/lelik112/parrot669/pull/14) (`d75bffb`).
- Игорь выпустил [PM-010](tasks/PM-010-auth-routes-extraction.md): пять auth routes выделены в [backend PR #22](https://github.com/lelik112/parrot669-backend/pull/22), commit `e41d322`; CI и Railway deployment SUCCESS. Независимый QA auth flow пока не записан.
- Борис подтвердил desktop A/B-проверку PM-001: сохранение A после reload, отсутствие успеха без изменения и при изменении B/части A, успех при полном закрытии A и сохранение результата после disable/enable. Полная приёмка остаётся открытой.
- Марк выпустил [PM-013](tasks/PM-013-calendar-waiting-instruction.md) в frontend `a749c72` по отдельному поручению владельца: в waiting больше нет просьбы нажать скрытую кнопку. 109 тестов, main CI и Cloudflare Workers Build успешны; Борису передан независимый ретест.
- Игорь выпустил [PM-011](tasks/PM-011-calendar-sync-extraction.md): lifecycle внешнего календаря перенесён в отдельный backend-модуль в [PR #23](https://github.com/lelik112/parrot669-backend/pull/23), merge `59c046f`; PR/main CI и Railway deployment `b302e2f4-2021-469b-a773-87bcddc1b50b` успешны. Пользовательское поведение ещё не проверено независимо.

## In Progress

- **[PM-001](tasks/PM-001-calendar-control-dates.md) — in review:** Борис проверил часть сценариев с подключённым Airbnb iCal на production; `close` подтвердился, постороннее/частичное изменение не засчиталось. `open` в первой попытке не засчитан как положительный тест из-за завершения окна повторов; mobile, ошибка iCal, смена источника и другие границы ещё нужны. UX-дефект — [PM-013](tasks/PM-013-calendar-waiting-instruction.md).
- **[PM-010](tasks/PM-010-auth-routes-extraction.md) — in review:** Игорь выпустил auth routes; независимая проверка регистрации/сессии через UI назначена Борису, результатов ещё нет.
- **[PM-013](tasks/PM-013-calendar-waiting-instruction.md) — in review:** Борис подтвердил waiting `open`, reload и EN/ES/CA/RU на опубликованной версии; `close` ждёт контролируемого источника PM-018.
- **[PM-011](tasks/PM-011-calendar-sync-extraction.md) — in review:** backend-релиз Игоря подтверждён CI и Railway; Борис взял независимую QA подключения, синхронизации, выключения/включения и удаления календаря в очередь после PM-005/010. Это не является QA-приёмкой PM-001.
- **CHECK-H11 / [PM-003](tasks/PM-003-contact-acceptance.md):** независимая проверка сообщений начата, затем приостановлена. Обмена двумя аккаунтами ещё нет в подтверждённых результатах.
- **PM-004/005 — in review:** Денис выпустил frontend `05a8189` через [PR #13](https://github.com/lelik112/parrot669/pull/13); в задачах зафиксированы 106 тестов и успешный Cloudflare build. Следующее действие — независимые QA-проверки; claim Бориса ожидается. Нативный autofill и авторизованный визуальный desktop/mobile-ретест ещё не подтверждены.

## Blocked

| Пункт | Что мешает | Кто/что снимает блокировку |
| --- | --- | --- |
| PM-003 | Последний QA не завершил вход вторым аккаунтом; состояние нужно сверить перед продолжением | Борис / QA фиксирует доступ и продолжает существующий сценарий |
| PM-001, приёмка | Desktop проверен частично; `open`, ошибки/смена источника и mobile ждут отдельного evidence; PM-013 `close` ждёт PM-018 | Борис продолжает с контролируемым Airbnb-источником и доступной мобильной средой |
| PM-004/005 | Для следующих независимых QA-проверок пока нет подтверждённого claim Бориса | Борис подтверждает доступ/среду и claim по задаче |
| PM-011 | Релиз есть; Борис забрал независимую календарную регрессию в очередь | Борис проверяет после PM-005/010 и записывает результаты |

Алекс оставил подписанное предложение о кабинете, профиле и объясняющих страницах в [курилке](team-chat.md). По просьбе Алексея кабинет теперь разделён на [PM-019](tasks/PM-019-host-cabinet-ia.md) (контракт D009 подготовлен, ждёт подтверждения владельца) → [PM-020](tasks/PM-020-host-cabinet-navigation.md) (NEXT/P2, не разблокирована) и [PM-021](tasks/PM-021-private-host-profile.md) / [PM-022](tasks/PM-022-public-host-profile.md) (LATER). Реализации, принятой схемы полей и назначенных разработчиков пока нет. Факт доступа к курилке не меняет роль Алекса.

## Decisions

- [D001](decisions/D001-repository-coordination.md): работа и обсуждения команды ведутся в репозитории; добавлен свободный team-chat, вопросы передаются напрямую. PM-001 назначена Денису с отдельным согласованием backend-этапа.
- [D002](decisions/D002-calendar-control-dates.md): контрольные даты выбираются и сохраняются в PARROT до изменения Airbnb; проверяется сохранённое задание. Принято владельцем 24.09; реализация слита в оба main, независимая QA-приёмка не завершена.
- [D003](decisions/D003-link-publication-proposal.md) superseded before acceptance. [D009](decisions/D010-external-link-independent-verification.md): валидная опубликованная Airbnb-ссылка доступна независимо от calendar verification; verification показывается отдельным trust signal, unverified host можно попросить пройти проверку через messaging.
- [D004](decisions/D004-team-identity.md): перед работой Agent/Role/Scope; в коммите, PR, статусе задачи и changelog Agent/Role/Change/Related task. После значимого изменения PM сохраняет авторство, причины и решения в документации.
- [D005](decisions/D005-ai-team-model-guidance.md): новые/возобновляемые задачи содержат рекомендацию модели и reasoning; исполнитель проверяет её до основной работы и при нехватке мощности ждёт решения владельца продукта.
- [D008](decisions/D008-cabinet-sequencing.md): принят только порядок подготовки. Предложение IA [D009](decisions/D009-host-cabinet-ia.md) в PM-019 ждёт подтверждения Алексея; PM-020 не разблокирована, PM-021/022 — LATER.
- [D006](decisions/D006-backend-refactor-backlog.md) и [D007](decisions/D007-activate-auth-routes-extraction.md): PM-010 опубликована, auth QA назначена Борису. PM-011 выпущена Игорем, независимая QA ещё открыта; PM-012 остаётся LATER. Календарная QA PM-001 и ретест frontend PM-013 ещё открыты.

## Risks

- Ранее выданные v1-статусы не доказывают выполнение задания с выбранными датами. Desktop A/B и `close` проверены; смена источника и другие непроверенные состояния ещё не дают оснований объявить PM-001 принятой.
- P2: прежний текст после раннего Check требовал нажать отсутствующий «Проверить». Исправление [PM-013](tasks/PM-013-calendar-waiting-instruction.md) опубликовано; реальный `open` waiting/reload/четыре языка прошли, `close` ждёт PM-018.
- Поиск может привести к объекту без доступного контакта: сообщения по умолчанию выключены, внешняя ссылка необязательна. Измерить в пилоте; не включать сообщения без согласия.
- Email и мобильные сценарии имеют незакрытые участки QA. [PM-006](tasks/PM-006-email-acceptance.md) и [PM-007](tasks/PM-007-mobile-acceptance.md) отделяют их от уже закрытых дефектов.
- Открыты старые draft PR [frontend #3](https://github.com/lelik112/parrot669/pull/3) и [backend #5](https://github.com/lelik112/parrot669-backend/pull/5) об email verification, уже описанной как реализованная другим путём. Это кандидаты на проверку актуальности, а не задачи к автоматическому merge. PM их не менял.
- Чужая работа вне репозитория невидима до claim/update. Обновление Markdown не запускает другого агента автоматически.

## Next Priorities

1. Сохранить частичный PASS PM-013 (`open` waiting и четыре языка); `close`/PM-001 positive open и смена источника ждут контролируемого Airbnb-состояния [PM-018](tasks/PM-018-qa-controlled-calendar.md), mobile — PM-015.
2. Борис продолжает PM-003 и подтверждает реальный путь поиска и контакта; отдельно берёт следующий QA этап PM-004/005, если доступ и claim подтверждены.
3. PM-002 разблокирована D010: назначить реализацию внешней ссылки + честного verification status + messaging nudge; Airbnb остаётся необязательным для поиска.
4. Борис независимо проверяет [PM-010](tasks/PM-010-auth-routes-extraction.md) по auth UI/сессиям; Игорь выпустил [PM-011](tasks/PM-011-calendar-sync-extraction.md); Борис взял независимый календарный QA в очередь. PM-012 остаётся LATER.
5. Подготовить discovery пилота и ограниченную приёмку email/mobile; оформить с владельцем минимальный контракт кабинета PM-019, затем рассмотреть PM-020. PM-021/022 не назначать без privacy/PM-002 и данных пилота.

## Evidence

- [QA 24.09: BUG-013/014/015 и PRODUCT-001](qa/2026-09-24/PARROT669-QA-HOST-2026-09-24.md).
- [QA 23.09: текущий CHECK-H11 и границы ретеста](qa/2026-09-23/PARROT669-QA-2026-09-23.md).
- [Текущая документация](product-context.md), [история](changelog.md), [задачи и порядок работы](tasks/README.md).
- [Запись релиза PM-001](changes/PM-001-calendar-control-dates.md), [PM-001 с результатами Бориса](tasks/PM-001-calendar-control-dates.md), [PM-013 с шагами бага](tasks/PM-013-calendar-waiting-instruction.md), [frontend PR #14](https://github.com/lelik112/parrot669/pull/14), [backend PR #21](https://github.com/lelik112/parrot669-backend/pull/21), [PM-010 release handoff](tasks/PM-010-auth-routes-extraction.md).
- [PM-013 commit `a749c72`](https://github.com/lelik112/parrot669/commit/a749c723fddf9d2322a1a617e82459d24818b78a), [main CI 36004743972](https://github.com/lelik112/parrot669/actions/runs/36004743972); Cloudflare Workers Build `47733a04-92d4-4515-83b8-825a93a966c5` success, production version `8efe156f-959b-4e00-82e4-e02cca09f36f`. Борис записал частичный live UI-ретест `open` waiting/reload/языков; `close` остаётся открытым.

Следующий статус обновляется по claims, изменениям, ответам и результатам QA. Фоновое наблюдение и расписание этой записью не создаются.
