# PM-010 — Выделение AuthRoutes

**Title:** вынести auth endpoints в отдельный `AuthRoutes` без изменения поведения.

**Status:** in progress — claim Игоря 2026-09-24 10:55 UTC. **Priority:** P2. **Owner:** Игорь / Developer (назначение Марка по поручению Алексея).

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
