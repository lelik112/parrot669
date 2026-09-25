# PM-034-BE — технический аудит backend

**Title:** детально проверить backend находки обзорного [PM-034](PM-034-backend-frontend-refactoring-audit.md).

**Status:** done — read-only отчёт Игоря передан Марку 2026-09-25; PM-034 остаётся in progress до сводки Марка. **Priority:** P2. **Owner:** Игорь / Developer.

**Agent:** Игорь. **Role:** Developer. **Scope:** только read-only backend аудит в `lelik112/parrot669-backend`, отчёт; без реализации. **Branch:** `igor/pm034-be-audit` в frontend docs; backend `main` только читается.

**Recommended model:** Sol. **Recommended reasoning:** High. **Reason:** поиск связывает запросы, доступность, обогащение ценой/ссылкой и ошибки, а legacy endpoints требуют осторожной сверки контрактов. **Model check, Игорь 2026-09-25 13:53 UTC:** текущий GPT-6 с высоким уровнем анализа достаточен для read-only проверки и отчёта; повышение не требуется.

**Claim — 2026-09-25 13:53 UTC. Agent:** Игорь. **Role:** Developer. **Change:** сверил frontend `main` `59a3a99`, backend `main` `3e35c46`, P1 QA/PM-029 и BUG-021; беру только PM-034-BE, область Дениса PM-034-FE и пользовательские сценарии QA не трогаю. **Related task:** PM-034-BE. **Next:** проверить запросы/ошибки поиска, границы модулей и legacy callers; оформить доказательства и handoff Марку.

## Goal

Доказать или опровергнуть backend гипотезы Марка и назвать самый маленький полезный следующий шаг для MVP.

## Problem / Context

Обзор [PM-034](PM-034-backend-frontend-refactoring-audit.md) заметил отдельные listings/cleaning fee/link source запросы на каждый результат в `SearchService.search`; эффект на реальной выдаче ещё не измерен. PM-010/011 уже извлекли auth и calendar routes и ждут QA. Legacy challenge migration — отдельная [PM-012](PM-012-legacy-challenges-extraction.md), LATER. Текущий P1 QA и восстановление PM-003 имеют больший приоритет.

## Requirements

- Сверить свежий main и активные claims; записать `Agent / Role / Scope / Model check / дата / next`. Не пересекаться с действующей PM-029 или исправлением подтверждённого BUG-021.
- Проверить поведение поиска для доступных репрезентативных размеров выдачи (например 1/10/50 результатов, если достижимо без изменения production): число запросов, задержку, ошибки при удалённом объекте/неудаче обогащения, влияние на цену, ссылку и полный ответ. Если замер недоступен — указать, что именно нужно для него, не выдумывать цифры и не создавать нагрузку на production.
- Проверить границы `SearchService`/`SearchRepository`, `Routes`/`Main`, auth, calendar и messaging на реальные препятствия к будущим изменениям. Отметить дублирование только с примером влияния.
- Для legacy перечислить действующие endpoints, callers и отличие от нового PM-001 flow; не предлагать удаление без совместимости и отдельного решения.
- Сообщить, какие находки обзорного PM не подтвердились. Результат в этой карточке или подписанном `docs/tasks/logs/PM-034-backend.md`, ссылка сюда.

## Acceptance criteria

- Есть ссылки на точные файлы/функции и воспроизводимое или измеримое доказательство для каждой находки.
- Для каждой рекомендации: влияние на поиск/контакт/выпуск, размер S/M/L, риск Low/Medium/High, минимальное решение, проверка регресса, приоритет NOW/NEXT/LATER/DO NOT TOUCH.
- Не заявлены исправление или факт бага на основании одного размера файла либо неподтверждённой задержки; отсутствие evidence записано явно.
- Передан отчёт Марку для сводки PM-034; статус `done` только у этой дочерней карточки после отчёта.

## Not doing

Код, PR, миграции, нагрузочные тесты на production, перестройка Worker/Railway/Cloudflare, переписывание backend, реализация PM-012 и изменение accepted product behavior.

## Dependencies

QA первой волны и безопасность текущих claims; frontend аудит [PM-034-FE](PM-034-FE-frontend-audit.md) идёт независимо по своей карточке. Репозиторий не будит Игоря автоматически.

## Report / handoff — 2026-09-25

**Agent:** Игорь. **Role:** Developer. **Change:** закончил read-only аудит backend `main` `3e35c46`; полный отчёт с permalink на код, выведенным числом SQL для 1/10/50, failure path, новым риском длинного интервала, границами модулей и legacy callers — в [PM-034-backend.md](logs/PM-034-backend.md). **Related task:** PM-034-BE. **Checks:** сверены код, миграции, существующие тесты/smoke и frontend Worker; runtime benchmark не выполнен (в среде нет sbt/PostgreSQL); production/CI/деплой не менялись. **Next:** Марк сверяет с PM-034-FE/QA, решает допустимую длительность поиска и открывает только узкие доказанные задачи. Кодовый рефакторинг не начинался.
