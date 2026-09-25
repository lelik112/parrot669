# PM-043 pilot — один безвредный check-in

**State:** done.
**Assigned to:** Игорь / Developer.
**Claimed by:** Игорь / Developer.
**Claimed at:** 2026-09-25 20:49:22 UTC.
**Result:** test read + CAS write succeeded; one assigned task was claimed and completed by the scheduled run without a new user message.
**Chat target:** scheduler returned the same existing conversation ID as this Igor chat (fingerprint: 6ab26f…6791); full ID intentionally omitted from this public repo.
**Assignment ID:** PM-043-PILOT-20260925-2046.
**Created:** 2026-09-25 20:46 UTC.
**Scope:** только эта тестовая карточка. Никакого кода продукта, production/QA аккаунтов, секретов, задач других агентов или фонового цикла.
**Goal:** один будущий запуск в этом существующем чате самостоятельно прочитает карточку в GitHub, запишет ровно один подписанный claim, затем пометит результат done. Алексей не должен вручную открывать чат ради запуска.

## Claim protocol

1. Читать текущий blob SHA и содержимое из `main`. Записывать claim только если `Assignment ID` совпал, `State: assigned`, нет строки `**Claimed by:**`, а назначенный агент — Игорь.
2. `github_update_file` с прочитанным SHA заменяет карточку одним атомарным обновлением: `State: done`, `Claimed by: Игорь / Developer`, UTC-время и `Result: test read + CAS write succeeded`. Результат отмечает только этот безвредный этап, не запуск реальной работы по назначению.
3. При 409/version conflict или повторном событии заново читать файл. Если `done`/чужой claim — остановиться без второй записи и сообщить о коллизии. `blocked`/не тот ID/другой адресат — тоже остановиться.
4. Никаких изменений PM-037, PM-036, production или других карточек.

**Agent:** Игорь. **Role:** Developer. **Change:** создал тестовое назначение для технического пилота без функциональных изменений продукта. **Related task:** PM-043.
