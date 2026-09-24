# PM-011 — Выделение внешнего calendar sync

**Title:** перенести lifecycle внешнего календаря в отдельный модуль без смены поведения.

**Status:** in review — backend released, independent QA pending. **Priority:** P2. **Owner:** Игорь / Developer.

**Agent:** Игорь / Developer. Назначение по поручению Алексея от 24.09 12:02 UTC; эта запись не означает, что Игорь начал работу.

## Goal

Сгруппировать маршруты и операции connect/sync/enable/disable/delete внешнего календаря в календарном модуле.

## Problem

Жизненный цикл внешнего календаря распределён между общими `Routes`, `ParrotService` и `ParrotRepository`; его сопровождение может пересекаться с новым challenge flow PM-001.

## Context

Handoff Игоря прямо связывает этот этап с завершением согласования Дениса по [PM-001](PM-001-calendar-control-dates.md). Это техническое выделение, не изменение того, как хозяин подключает и синхронизирует iCal.

## Requirements

- Перенести только connect/sync/enable/disable/delete внешнего календаря в календарный модуль.
- Сохранить обычную синхронизацию, классификацию событий и текущие пользовательские/серверные контракты.
- Сохранить существующие ограничения безопасности fetcher и не расширять доступ к calendar URL.
- До изменения общих файлов исполнитель согласует точные границы с владельцем PM-001.

## Acceptance criteria

- Каждый прежний lifecycle endpoint сохраняет путь, авторизацию, ответ и наблюдаемое поведение.
- Подключение/отключение и обычный iCal sync покрыты существующими или добавленными тестами; релевантные backend checks проходят.
- SSRF ограничения fetcher и нормализация/классификация календарных событий не ослаблены.
- Перенос не меняет PM-001 challenge verification и не включает несогласованные продуктовые изменения.

## Not doing

Новый iCal протокол, иной fetcher, смена семантики Reserved/Not available, scraping/Airbnb API или изменение алгоритма проверки контрольного задания.

## Dependencies

Контракт PM-001 выпущен, независимая приёмка ещё открыта. До claim и изменения общих файлов Игорь сверяет свежий backend main, свободные области и авторство PM-001; Денис сейчас назначен только на frontend-тексты PM-013. Если потребуется затронуть `calendarverification`, V25, проверку задания или текущий QA сценарий, сначала зафиксировать новое пересечение и согласовать границу в задачах. PM-012 не входит в scope.

**Recommended model:** Sol. **Recommended reasoning:** High. **Reason:** затрагиваются общие route/service/repository границы, синхронизация и ограничения сетевой безопасности; проверка должна удержать текущее поведение.

**Model check:** исполнитель подтверждает до основной работы; при заявленной нехватке мощности действует порядок [D005](../decisions/D005-ai-team-model-guidance.md).

## Discussion / Updates

### 2026-09-24 — Игорь / Developer: release handoff

- **Agent:** Игорь. **Role:** Developer. **Change:** вынес connect/sync/enable/disable/delete, error/success snapshots и hourly sync в `externalcalendar/{CalendarRoutes,CalendarService,CalendarRepository}.scala`; общий `Main` подключает календарные маршруты один раз, `Routes`/`ParrotService`/`ParrotRepository` сохраняют legacy challenges. Проверил посимвольное совпадение перенесённых обработчиков, веток сервиса и SQL. `calendarverification`, PM-001, V25, fetcher/parser и UI не менял. **Related task:** PM-011.
- **Source:** [backend PR #23](https://github.com/lelik112/parrot669-backend/pull/23), merged `59c046ff61989f6f9ac2903cdf448a93dbcb45dd`. Added route authorization-order test and PostgreSQL HTTP smoke for `DELETE /api/calendars/:id`, empty dashboard calendar list and restored guest search.
- **CI:** [PR 36004130654](https://github.com/lelik112/parrot669-backend/actions/runs/36004130654) and [main 36004571053](https://github.com/lelik112/parrot669-backend/actions/runs/36004571053) SUCCESS, with compile/tests, full PostgreSQL HTTP smoke and Docker build. The smoke also exercises connect/listing-ID mismatch, localized Airbnb URL, disable/enable, malformed/empty iCal, successful and failed sync, and reservation-based search blocking.
- **Production:** Railway `parrot669` / `production` / `parrot669-backend` deployment `b302e2f4-2021-469b-a773-87bcddc1b50b` SUCCESS on the same SHA. Startup logs: schema V25 validated, no migration, server bound to port 8080. Direct live `/health` 200 and `/api/auth/me` without cookie 401. No real host calendar was mutated in production for this release check.
- **Next:** независимая QA проверяет подключение, выключение/включение, синхронизацию, удаление и отражение в dashboard/search; исполнитель QA ещё не назначен. До приёмки оставить `in review`. PM-012 остаётся LATER, PM-001 QA и PM-013 идут отдельно.


### 2026-09-24 13:08 UTC — Игорь / Developer: claim и Model check

- **Agent:** Игорь. **Role:** Developer.
- **Scope:** backend `src/main/scala/com/parrot669/{Main.scala,http/Routes.scala,service/ParrotService.scala,repo/ParrotRepository.scala}`, новый модуль `externalcalendar/{CalendarRoutes,CalendarService,CalendarRepository}.scala` и целевые tests; docs только этот task/index до handoff. Ветка `refactor/pm011-calendar-lifecycle` от backend main `e41d3224c65340725f3ba5b49bdb1a530b98c50d`.
- **Change:** начинаю узкий перенос connect/sync/enable/disable/delete, event snapshot/retry и часовой sync loop с сохранением существующих запросов, SQL, транзакций, порядка авторизации, fetcher, URL secrecy и iCal классификации. Свежие PM-001, claims и team-chat проверены: Денис назначен только на frontend PM-013 и письменно освободил общие backend файлы; `calendarverification`, V25 и QA Бориса не входят в мой scope. PM-012 остаётся LATER.
- **Related task:** docs/tasks/PM-011-calendar-sync-extraction.md.
- **Model check:** рекомендованных Sol / High достаточно для переноса с фокусом на права, SSRF и транзакции; усиление не требуется.
- **Next:** сверить старые обработчики с перенесёнными, прогнать PostgreSQL characterization/full smoke + CI, опубликовать PR, подтвердить точный Railway production SHA и оставить независимую QA открытой.


### 2026-09-24 12:02 UTC — Денис / Developer → Игорь, Борис: назначение по поручению Алексея

- **Agent:** Денис
- **Role:** Developer
- **Scope:** координация границ PM-011; моя текущая реализация — только frontend PM-013, общие backend файлы не заняты мной.
- **Change:** Алексеем поручено раздать следующую работу; назначаю Игорю отдельно выделение lifecycle внешнего календаря (connect/sync/enable/disable/delete) без изменения поведения и без переноса PM-001 challenge. Выпущенная PM-010 остаётся в независимом QA Бориса. PM-012 остаётся LATER.
- **Related task:** docs/tasks/PM-011-calendar-sync-extraction.md
- **Recommended model:** Sol. **Recommended reasoning:** High; при переносе важно сохранить iCal импорт, SSRF-ограничения, транзакции удаления и маршруты. Игорь делает собственный Model check и claim до правок.
- **Next:** Игорь сверяет backend main и claims, записывает точные файлы и границы; добавляет characterization tests для calendar lifecycle, проходит CI/PostgreSQL smoke, публикует PR и отдельно подтверждает production SHA. QA Бориса по PM-001 остаётся независимой; при выявленном пересечении — остановиться и согласовать.
