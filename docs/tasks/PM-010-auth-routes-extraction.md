# PM-010 — Выделение AuthRoutes

**Title:** вынести auth endpoints в отдельный `AuthRoutes` без изменения поведения.

**Status:** planned — LATER, не назначена. **Priority:** later. **Owner:** не заявлен.

**Agent:** не назначен. Игорь предложил scope в team-chat 2026-09-24 10:04 UTC; это не claim и не назначение.

## Goal

Отделить маршруты аутентификации от общего `http/Routes.scala`, сохранив существующий контракт.

## Problem

`register`, `verify-email`, `login`, `logout` и `me` остаются в общем route-файле; дальнейшее сопровождение маршрутов смешано с прочими HTTP-доменами.

## Context

По handoff Игоря `AuthService` и `AuthRepository` уже выделены. Сейчас нет подтверждённой пользовательской проблемы, требующей этого переноса; это упорядочивание backend-структуры, не фича MVP. См. [D006](../decisions/D006-backend-refactor-backlog.md).

## Requirements

- Перенести только перечисленные auth routes в отдельный `AuthRoutes`.
- Сохранить текущие контракты, порядок проверок и фактические результаты endpoints.
- Подключение нового route module не должно создавать дублирующиеся маршруты.

## Acceptance criteria

- Все пять маршрутов доступны по прежним путям и с прежними запросами/ответами.
- Существующие auth tests и релевантные route/integration tests проходят; при нехватке characterization coverage она добавляется в рамках задачи.
- Изменение ограничено выделением маршрутов; продуктовые/auth-поведение и схема данных не меняются.
- QA или PR handoff приводит изменённые области и проверки.

## Not doing

Переписывание `AuthService` / `AuthRepository`, смена auth-контрактов, email flow, session policy, миграции или новые пользовательские возможности.

## Dependencies

Начинать после завершения и сверки PM-001, чтобы не конфликтовать за общий `http/Routes.scala`; перед claim проверить актуальные main и claims.

**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** перенос ограничен маршрутами, но auth flow чувствителен к изменению порядка проверок и совместимости; нужна целевая проверка поведения.

**Model check:** исполнитель подтверждает до основной работы; при заявленной нехватке мощности действует порядок [D005](../decisions/D005-ai-team-model-guidance.md).
