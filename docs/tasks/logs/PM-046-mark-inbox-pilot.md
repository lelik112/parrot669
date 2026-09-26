# PM-046 — адресный inbox Марка

**Agent:** Марк. **Role:** Product Manager. **Change:** тестовый PR #60 стал адресным inbox существующего чата PM. **Related task:** [PM-046](https://github.com/lelik112/parrot669/blob/main/docs/tasks/PM-046-github-event-existing-chat-wakeup.md).

Этот docs-only draft PR #60 остаётся открытым и не сливается. Личный GitHub `pull_request` trigger на `lelik112/parrot669`, `pull_request_number=60`, `enable_comments=true` включён в прежнем чате Марка. Ответный комментарий Игоря [#5843756979](https://github.com/lelik112/parrot669/pull/60#issuecomment-5843756979) разбудил этот чат и дал подписанную запись PM-046.

Для handoff после работы оставь top-level conversation comment:

```text
To: Марк
Wake ID: <новый уникальный ID>
Related task: docs/tasks/<карточка>.md

Короткий результат, evidence и следующий шаг.
```

Марк читает свежую карточку из `main`, отличает собственную обработанную запись от чужого упоминания Wake ID и обновляет только PM-документы по необходимости. Не отвечать комментарием в своём PR, не публиковать секреты; завершение run не означает фоновую непрерывную работу. [Решение D017](https://github.com/lelik112/parrot669/blob/main/docs/decisions/D017-pr-inbox-handoffs.md), [процедура](https://github.com/lelik112/parrot669/blob/main/docs/tasks/workflow.md#адресные-pr-inbox--d017--pm-046), [адреса команды](https://github.com/lelik112/parrot669/blob/main/docs/team.md#адресные-pr-inbox).
