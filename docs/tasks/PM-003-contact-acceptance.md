# PM-003 — Независимая приёмка поиска и контакта

**Title:** продолжить CHECK-H11: поиск → первое сообщение → ответ владельца.

**Status:** in progress — PM-016 unblocked; basic qa→lelik search/contact/reply and unread/read PASS. Pair blocking and repeat-contact behavior remain to test. D011 supersedes old host-wide opt-in/out criteria. **Priority:** P1.

**Owner:** Борис / QA; возобновил CHECK-H11 после PM-016, зафиксировал базовый цикл. **Area:** поиск / сообщения.

**Agent:** Борис / QA. **Recommended model:** Luna. **Recommended reasoning:** Medium. **Reason:** существующий сценарий двух тестовых аккаунтов ограничен ясной последовательностью, но требует аккуратно восстановить доступ/opt-in и приложить доказательства без смешения с предположениями.

**Model check:** Борис подтверждает при возобновлении; отсутствие тестового доступа записывается как blocker, а не обходится предположениями.

**Updated:** 2026-09-24, Марк / PM.

## Goal

Подтвердить полный работающий путь контакта между двумя разными участниками.

## Problem

Сообщения реализованы, но независимый прогон не дошёл до обмена двумя аккаунтами. Центральная гипотеза MVP пока не подтверждена этим QA.

## Context

Продолжение существующего [CHECK-H11 в отчёте 23.09](../qa/2026-09-23/PARROT669-QA-2026-09-23.md), не новая конкурирующая проверка. По отчёту владелец подготовил второй аккаунт, но вход прерван; итог неизвестен. Первый профиль, его opt-in и прошлый QA-период требуют восстановления по инструкции отчёта. Проверка интерфейса не означает совпадения production с конкретным commit.

## Requirements

- Взять актуальное состояние из QA-отчёта, восстановить доступ двум разрешённым тестовым аккаунтам и записать среду. Сначала проверить, не продолжил ли другой QA.
- Гость находит тестовый объект, начинает обращение с контекстом дат; владелец видит его, отвечает; гость получает ответ.
- Проверить историю после возврата, непрочитанное и явное чтение, opt-out новых обращений при сохранении старого диалога, блокировку пары.
- Не путать отключённый opt-in с дефектом отсутствующей кнопки; не открывать заново снятый BUG-004.
- Восстановить оговорённое тестовое состояние. Не публиковать учётные данные, приватные сообщения или адреса в evidence.

## Acceptance criteria

- [ ] Первое сообщение и ответ получены нужными участниками; гость и владелец — разные аккаунты.
- [ ] После reload/возврата сохранены контекст и история; повтор действия не создаёт дублирование в проверенном сценарии.
- [ ] Непрочитанное/чтение, opt-in/opt-out и блокировка проверены и результаты перечислены отдельно.
- [ ] Восстановление состояния первого QA-профиля и периода подтверждено либо явно записан остаток и причина.
- [ ] Результат содержит дату, среду/наблюдаемую версию, шаги, evidence и ограничения. Непроверенный пункт не объявлен прошедшим.

## Not doing

Разработка сообщений, новые публичные контакты, бронь из диалога, нагрузочное тестирование, изменения инфраструктуры. Реальные email-уведомления — PM-006; mobile — PM-007.

## Dependencies

Два доступных разрешённых тестовых аккаунта, актуальный QA-отчёт, рабочий тестовый объект. Блокировка основана на последней записи QA; перед продолжением проверить, сохраняется ли она, а не требовать повторной регистрации автоматически.

## Evidence

- 2026-09-25 — Борис / production Cloud Chrome, `qa` guest on Worker origin and `lelik` host on `parrot669.com`: search found `lelik` QA property for 2027-06-11 → 2027-06-14. First message reached owner, owner replied, and reply appeared to guest. Both tabs retained their respective accounts after reload. Full PM-003 continuation is in progress; pair block/unblock and repeat CTA behavior remain untested. No property, calendar or price data changed.

Существующий прогон: CHECK-H11; prior messages had not been sent. Найденные дефекты передать PM отдельными наблюдениями; QA не исправляет их в рамках этой задачи.

## Discussion / Updates

- 2026-09-25 — **Борис / QA:** PM-016 is unblocked after PM-029 live session setup. Started CHECK-H11 with the allowed test accounts; basic search → contact → reply passes. Continue with pair block/unblock, repeat contact and final cleanup/state report. The former host-wide opt-in requirement is superseded by accepted D011/PM-024, which removed that control.

## Discussion / Updates

- **Date:** 2026-09-24 07:41 UTC
- **Agent:** Марк
- **Role:** Product Manager
- **Change:** Владелец подтвердил имя QA — Борис. Уточнена идентичность участника; статус blocked сохранён до его обновления о доступе и продолжении CHECK-H11.
- **Related task:** [PM-003](PM-003-contact-acceptance.md); соглашение — [PM-009](PM-009-team-identity.md)

- 2026-09-24 07:23 UTC — **Марк / PM:** объединено с существующим CHECK-H11. Жду подписанного статуса QA и продолжения; имя исполнителя не выдумываю.

- 2026-09-25 12:46 UTC — **Agent:** Марк. **Role:** Product Manager. **Change:** уточнил blocker после handoff PM-029, не объявляя QA пройденной. **Related task:** PM-003 / PM-016 / PM-029. **Next:** Борис подтверждает два сеанса и выполняет CHECK-H11, фиксирует evidence.
