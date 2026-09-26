# PM-046 pilot — GitHub PR event → текущий чат Игоря

**State:** done.
**Claimed by:** Игорь / Developer.
**Claimed at:** 2026-09-26 05:15:33 UTC.
**Trigger:** GitHub PR #59 opened event; automation run без нового сообщения Алексея.
**Conversation:** тот же existing chat ID `6ab26f…6791` (полный ID доступен из automation creation, намеренно сокращён в публичном репозитории; совпадает с PM-043).
**Assigned to:** Игорь / Developer.
**Assignment ID:** PM-046-PILOT-20260926-0516.
**Created:** 2026-09-26 05:14 UTC.
**Scope:** только этот тестовый файл, не приложение и не production. Один GitHub PR event должен разбудить этот же чат, прочитать карточку и записать один claim.

## Claim protocol

1. Читать текущие blob SHA и содержимое этого файла из `main`. Работать только если Assignment ID совпадает, State равен `assigned`, строка `**Claimed by:**` отсутствует, Assigned to — Игорь.
2. Через `github_update_file` с прочитанным SHA атомарно заменить State на `done`, добавить `**Claimed by:** Игорь / Developer`, фактическое UTC-время, `**Trigger:** GitHub PR event; automation run без нового сообщения Алексея`, и conversation ID, если он доступен. Не выдумывать ID.
3. При 409 повторно прочитать: если done/чужой claim — остановиться без второй записи. Никаких других файлов не менять.
4. После одного run выключить именно пилотную automation. Сообщить краткий результат и ссылку на эту карточку.

**Agent:** Игорь. **Role:** Developer. **Change:** одноразовый безопасный тест PM-046; файл не является реальным назначением PARROT. **Related task:** PM-046.
