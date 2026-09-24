# PM-010 — Выделение AuthRoutes

**Title:** вынести auth endpoints в отдельный `AuthRoutes` без изменения поведения.

**Status:** in review — backend released, independent QA assigned to Борис. **Priority:** P2. **Owner:** Игорь / Developer (назначение Марка по поручению Алексея).

**Agent:** Игорь / Developer. Scope до собственного claim не считается занятым. Игорь предложил этап в team-chat 2026-09-24 10:04 UTC; назначение подтверждено Марком после поручения владельца.

## Goal

Отделить маршруты аутентификации от общего `http/Routes.scala`, сохранив существующий контракт.

## Problem

`register`, `verify-email`, `login`, `logout` и `me` остаются в общем route-файле; дальнейшее сопровождение маршрутов смешано с прочими HTTP-доменами.

## Context

По handoff Игоря `AuthService` и `AuthRepository` уже выделены. Это ограниченное упорядочивание backend-структуры, не новая фича и не доказательство MVP. PM-001 уже опубликована backend/frontend и передана на независимую QA; после прямого поручения владельца активирован первый из предложенных Игорем этапов. См. [D006](../decisions/D006-backend-refactor-backlog.md) и [D007](../decisions/D007-activate-auth-routes-extraction.md).

## Requirements

- До реализации сверить свежий backend main, текущие claims и точный список затронутых файлов; записать в задаче Agent/Role/Scope, ветку и Model check (Sol/Medium достаточны или обоснован запрос повышения).
- Перенести только перечисленные auth routes в отдельный `AuthRoutes`.
- Сохранить текущие контракты, порядок проверок и фактические результаты endpoints.
- Подключение нового route module не должно создавать дублирующиеся маршруты.
- Провести отдельные CI/релизные проверки согласно действующему процессу; указать, что проверено в production, а что только в тестах.

## Acceptance criteria

- Все пять маршрутов доступны по прежним путям и с прежними запросами/ответами, cookies и кодами ошибок; порядок авторизации/валидации не меняется.
- Существующие auth tests и релевантные route/integration tests проходят; при нехватке characterization coverage она добавляется в рамках задачи.
- Изменение ограничено выделением маршрутов; продуктовые/auth-поведение и схема данных не меняются.
- PR/release handoff приводит изменённые области, CI и production evidence; до независимой проверки результат остаётся `in review`.

## Not doing

Переписывание `AuthService` / `AuthRepository`, смена auth-контрактов, email flow, session policy, миграции или новые пользовательские возможности. Не менять PM-001 calendar verification, PM-011 calendar sync, PM-012 legacy challenges и чужую QA-приёмку.

## Dependencies

Разработка PM-001 опубликована, но её независимая QA ещё идёт. PM-010 можно начинать параллельно с QA, поскольку область — auth routes, а не календарная проверка; до claim проверить свежий backend main и claims. PM-011 и PM-012 остаются LATER и не входят в этот этап.

**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** перенос ограничен маршрутами, но auth flow чувствителен к изменению порядка проверок и совместимости; нужна целевая проверка поведения.

**Model check:** исполнитель подтверждает до основной работы; при заявленной нехватке мощности действует порядок [D005](../decisions/D005-ai-team-model-guidance.md).

## Discussion / Updates

### 2026-09-24 — Игорь / Developer: release handoff

- **Agent:** Игорь. **Role:** Developer. **Scope:** `Routes.scala`, new `AuthRoutes.scala`, `Main.scala` and focused `AuthRoutesSuite.scala`; no service/repository/schema/frontend changes.
- **Change:** moved the existing five auth handlers byte for byte into `AuthRoutes`, moved their unchanged cookie-header builders and composed the new routes once. Preserved shared `OwnerRequests` and `HttpResponses` behavior. [Backend PR #22](https://github.com/lelik112/parrot669-backend/pull/22) merged into main as `e41d3224c65340725f3ba5b49bdb1a530b98c50d`.
- **Verification:** [PR CI run 35990938243](https://github.com/lelik112/parrot669-backend/actions/runs/35990938243) and [main CI run 35991305724](https://github.com/lelik112/parrot669-backend/actions/runs/35991305724) passed Scala compile/tests, full PostgreSQL HTTP smoke and Docker build. The smoke covers register, verify-email, login, logout and me with real sessions; focused route tests assert malformed JSON responses, missing-session 401 and the exact Secure/dev logout cookie flags.
- **Production:** Railway project `parrot669`, environment `production`, service `parrot669-backend`: deployment `e9e2333c-721e-4bd0-8184-ec07130ebd35` SUCCESS on the same commit. Runtime logs confirm schema V25, no new migration, bound HTTP server and active HTTP requests including authenticated `/api/auth/me` 200; a direct unauthenticated `/api/auth/me` returned 401. Direct `/health` from the execution environment timed out twice, so its result is not claimed as a passed smoke; Railway health/deployment is green. No real registration emails or account mutations were exercised against production.
- **Next:** независимая QA проверяет auth flow и cookie через UI; результат остаётся `in review`. PM-011/012 не активированы этим выпуском.


### 2026-09-24 10:55 UTC — Игорь / Developer: claim и Model check

- **Agent:** Игорь
- **Role:** Developer
- **Scope:** только пять auth endpoints в `src/main/scala/com/parrot669/http/Routes.scala`, новый `AuthRoutes.scala`, подключение в `Main.scala` и целевые route-тесты; `AuthService` и `AuthRepository` не менять. Ветка backend `refactor/pm010-auth-routes`; запись claim и handoff — эта задача и `docs/tasks/README.md` во frontend.
- **Change:** принимаю PM-010 после проверки backend main `1da6c649ffdbecc4d1f7978407f9f545512527b4`, текущих claims и границ PM-001. PM-001 уже опубликована и ждёт независимой QA; общий календарный код, миграции и product behavior не входят в мой scope.
- **Related task:** docs/tasks/PM-010-auth-routes-extraction.md
- **Model check:** Sol / Medium достаточны для механического переноса пяти обработчиков с точной проверкой cookie, порядка декодирования/авторизации и smoke-тестом. Запрос повышения не нужен.
- **Next:** сравнить до/после обработчики, выполнить CI и PostgreSQL HTTP smoke, затем проверить точный production commit и записать release evidence. До QA задача остаётся in review после выпуска.

### 2026-09-24 10:45 UTC — Марк / Product Manager → Игорь: назначение

- **Agent:** Марк
- **Role:** Product Manager
- **Scope:** приоритет и границы PM-010 после релиза PM-001.
- **Change:** по поручению Алексея активирую и назначаю тебе только выделение `AuthRoutes`. Твоё предложение этапов от 10:04 принято в части первого, компактного шага. PM-011/012 оставляем в LATER. Это поручение, а не твой claim и не подтверждение старта.
- **Related task:** docs/tasks/PM-010-auth-routes-extraction.md
- **Next:** сверь backend main/claims, оставь собственный claim со scope и Model check для Sol/Medium; при нехватке мощности объясни запрос и дождись решения владельца. Затем работай в отдельной ветке с проверкой контрактов, CI и отдельным release handoff. Если выяснится, что необходимы изменения вне перечисленных auth routes или сроки мешают приёмке MVP, остановись и обсудим scope до реализации.

### 2026-09-24 12:02 UTC — Денис / Developer → Борис: независимая приёмка PM-010 по поручению Алексея

- **Agent:** Денис
- **Role:** Developer
- **Scope:** назначение QA на уже выпущенный auth refactor; разработка PM-010 завершена Игорем.
- **Change:** поручаю Борису независимо проверить сохранение контрактов `register` / `verify-email` / `login` / `logout` / `me` через UI и сессии (включая ошибки, повторный вход и cookie/logout). Проверку с тестовым аккаунтом отделить от личного аккаунта и не объявлять ранее выполненный CI независимой приёмкой. Серверный commit `e41d3224c65340725f3ba5b49bdb1a530b98c50d` уже выпущен; текущих QA evidence для PM-010 в задаче нет.
- **Related task:** docs/tasks/PM-010-auth-routes-extraction.md
- **Recommended model for QA:** Sol / Medium: нужен разбор auth состояний и кодов ответов. Борис фиксирует собственный claim/Model check, наблюдения и среду.
- **Next:** Борис проводит доступные авторизованные сценарии, указывает непроверенные из-за отсутствия тестового email или доступа, записывает результаты и дефекты в этой задаче. После выпуска PM-013 отдельно ретестирует waiting для PM-001; не выдаёт этот ретест за завершение всей PM-001.

### 2026-09-24 14:12 UTC — Борис / QA: доступная часть и границы

- **Agent:** Борис. **Role:** QA. **Scope:** production desktop UI с разрешённым аккаунтом `lelik`, текущий сеанс без logout; отдельные сценарии регистрации/второго входа ожидают PM-016/017. **Status:** in review.
- **Model check:** Sol / Medium достаточно; повышать не требуется.
- **Change:** после нескольких независимых reload страницы владельца сервер продолжает показывать авторизованный профиль и тестовый объект; активный сеанс сохранён. Это наблюдение `me`/загрузки кабинета, **не** подтверждение всего PM-010. Пять маршрутов, cookies, ошибки, logout, повторный login и почта пока не прошли независимый цикл. Текущий аккаунт не выведен из системы по прежней договорённости с Алексеем.
- **Related task:** PM-010, PM-016, PM-017.
- **Next:** с отдельным тестовым сеансом пройти register/verify/login/logout/me и ошибки; не закрывать PM-010 на основании CI/одного reload.
