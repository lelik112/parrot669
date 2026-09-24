# PARROT 669 — Decision Log

Ведёт **Марк / PM**. Обновлено: **2026-09-24**.

Принятое решение, предложение и реализованное поведение — разные состояния. Принятие решения не закрывает задачу реализации. Если основание меняется, добавить новую запись с явным указанием, что она заменяет; историю не стирать.

| ID | Решение | Статус | Дата / основание |
| --- | --- | --- | --- |
| [D000](D000-existing-product-decisions.md) | Ранее принятые границы, доступность, контакт и даты | accepted — historical | Даты и источники указаны по каждому пункту |
| [D001](D001-repository-coordination.md) | Координация команды через репозиторий | accepted | Поручение владельца 2026-09-24 |
| [D002](D002-calendar-control-dates.md) | Проверка конкретных дат, выбранных в PARROT | accepted; implementation released, independent QA pending | Уточнение владельца 2026-09-24, QA BUG-015 |
| [D003](D003-link-publication-proposal.md) | Внешняя ссылка только после проверки источника | superseded before acceptance | Заменено D009 2026-09-24 |
| [D004](D004-team-identity.md) | Имена, роли и обязательная идентификация изменений | accepted | Поручение владельца 2026-09-24; дополняет D001 |
| [D005](D005-ai-team-model-guidance.md) | Рекомендация модели/reasoning и предварительная проверка достаточности | accepted | Поручение владельца 2026-09-24 |
| [D006](D006-backend-refactor-backlog.md) | Исходный порядок оставшихся backend extraction этапов после PM-001 | accepted; PM-010 updated by D007 | PM priority от 2026-09-24 по handoff Игоря |
| [D007](D007-activate-auth-routes-extraction.md) | Только PM-010 активирована для Игоря; календарные этапы остаются LATER | accepted | Прямое поручение владельца 2026-09-24 |
| [D008](D008-cabinet-sequencing.md) | Этапность кабинета: сначала действующий путь, профили отдельно | accepted — только порядок backlog | Просьба владельца нарезать задачи 2026-09-24 |
| [D010](D010-external-link-independent-verification.md) | Внешняя ссылка независима от calendar verification | accepted | Решение владельца 2026-09-24; supersedes D003 |
| [D009](D009-host-cabinet-ia.md) | Минимальная IA: Search / Host / Messages; PM-020 → PM-021 → PM-022 | accepted | Подтверждено владельцем 2026-09-24 |

У каждой записи: Decision, Problem, Reason, Alternatives, Rejected, Date, источник и связь с задачей. Незаписанные исторические альтернативы обозначаются как неизвестные, а не восстанавливаются из предположений.
