# PM-037 — безопасная длина публичного поиска по датам

**Title:** определить и ограничить число ночей в одном публичном запросе поиска.

**Status:** in progress — Марк принял [изолированный performance gate](logs/PM-037-performance.md) для малого пилота; Игорь сверяет mergeability/current-head CI, затем выпускает backend → frontend и передаёт Борису. Код пока не merged/deployed, независимая QA открыта. **Priority:** P2; повысить при подтверждённой деградации или воспроизводимом отказе. **Owner:** Марк / Product Manager — контракт завершён; **Developer:** Игорь / Developer — claim принят. **Origin:** [PM-034-BE](PM-034-BE-backend-audit.md), [backend report](logs/PM-034-backend.md).

**Agent:** Марк. **Role:** Product Manager. **Scope:** контракт и критерии; реализацию и замеры проводит назначенный разработчик.

**Recommended model:** Sol. **Recommended reasoning:** High. **Reason:** публичный endpoint, ночные диапазоны, SQL `generate_series`, совместимость поиска, даты checkout-exclusive и риск нагрузки. **Model check — Игорь, 2026-09-25:** текущий GPT-6 Codex, высокий уровень анализа; соответствует сложности задачи.

## Goal

Публичный запрос с чрезмерно длинным диапазоном не заставляет базу выполнять несоразмерную работу и не скрывает от гостя, почему поиск невозможен.

## Problem / Context

В текущем backend `SearchService.search` проверяет `to > from`, но верхней границы числа ночей нет. `SearchRepository` обрабатывает запрошенные ночи через `generate_series` и кандидатов. Игорь подтвердил путь по коду; до реализации нагрузка **не была измерена** (результаты ниже); [D014](../decisions/D014-public-search-date-range.md) утвердило максимум одного запроса **366 ночей**, а не допустимую длину проживания. PARROT не определяет юридический срок аренды и не должен заявлять пользователю, что более длинное проживание запрещено.

## Requirements

- Один запрос ищет **1–366 ночей включительно**. 367+ отклонять сервером с 400 в действующей структуре ошибки **до** основного SQL. Проверить разность дат до преобразования в Int и обработки тяжёлого запроса; нулевой/отрицательный интервал и некорректные/крайние даты получают понятную 400, не 500. Checkout исключающая дата, owner inclusive формы и календарные периоды не меняются.
- UI даёт понятное сообщение о лимите **поискового запроса**, а не ограничении аренды, на EN/ES/CA/RU; сохраняет введённые даты и фильтры для исправления. Рекомендуемый смысл: «За один раз можно искать жильё максимум на 366 ночей. Выберите более короткий период и уточните более долгий срок у хозяина». Не подставлять молча меньшую дату и не показывать доступность только части срока как доступность на весь период.
- Серверное ограничение обязательно и для прямого API; UI может предупредить до запроса, но не заменяет backend validation. Не менять остальные фильтры, сортировку, цену и переход к сообщению.
- Игорь или назначенный dev на изолированной базе с репрезентативным количеством объектов/периодов сравнивает 7/30/90/366 ночей (и контрольное отклонение 367): EXPLAIN (ANALYZE, BUFFERS) основного SQL, число кандидатов, p50/p95 полного поиска, характеристики данных и вывод о верхней границе. Не делать нагрузочный эксперимент на production.
- Если запрос на 366 ночей при ожидаемой нагрузке пилота неприемлем, dev возвращает замеры Марку **до выпуска** для пересмотра D014 или обоснованной узкой оптимизации. Не уменьшать предел без нового решения; не маскировать превышение пустой выдачей.

## Acceptance criteria

- [x] Марк принял число **366 ночей** для одного запроса и документировал основание, альтернативы и технический gate в [D014](../decisions/D014-public-search-date-range.md); acceptance реализации пока открыт.
- [ ] На границе 366 ночей выдача и цены корректны; на 367 сервер возвращает 400 до основного SQL и UI показывает ясное сообщение на четырёх языках, не теряя введённые даты.
- [ ] Обычные 1/7/30/90 ночей, смена даты, сохранённые фильтры, выбранные даты в пути до сообщения и PM-001 semantics не меняются.
- [x] Изолированный замер верхней границы зафиксирован и признан Марком допустимым **для малого пилота** 2026-09-25; наблюдения при 500 объектах и production не объявлены пройденным SLO.
- [ ] Границы дат/переполнения и 400 вместо 500 покрыты проверками; независимая QA отдельно проверила нормальный поиск и ошибку длинного интервала.

## Not doing

Глобальное ограничение длительности аренды, переписывание SQL поиска, введение бронирований или нагрузочное тестирование production.

## Dependencies

Продуктовая граница D014 и pilot performance gate теперь приняты Марком; до выпуска Игорь проверяет current-head CI, решает frontend PR #52 `mergeable=false` и обеспечивает порядок backend → frontend. При большем пилоте отдельно проверяем реальные задержки и возможную узкую оптимизацию. PM-030 QA-очередь имеет приоритет; Игорь принял разработку по поручению Алексея; claim ниже. После реализации — независимая проверка Бориса или отдельно согласованного QA.

## PM update — 2026-09-25

**Agent:** Марк. **Role:** Product Manager. **Change:** зафиксировал 1–366 ночей как лимит одного запроса, ошибку на 367+, сохранение пользовательского ввода и performance gate D014; техническая работа не начата. **Related task:** PM-037. **Next:** Игорь или назначенный разработчик после проверки своих P1 claims записывает model check/claim, проводит изолированный замер и сообщает, годится ли 366 для пилота; затем узкая реализация и независимая QA.


## Developer claim — 2026-09-25

**Agent:** Игорь. **Role:** Developer. **Change:** по прямому поручению Алексея беру PM-037: изолированный замер 7/30/90/366 ночей, backend validation до SQL и UI-ошибка EN/ES/CA/RU без потери дат. **Scope:** search package, SearchSuite/smoke/benchmark, public/assets/search.js и search UI tests; host/PM-038 не затрагиваю. **Related task:** PM-037 / D014. **Branches:** `igor/pm037-search-range` в обоих репозиториях. Production нагрузочно не тестирую. Измерения и вывод о 366 передаются PM; неприемлемый результат блокирует выпуск.

## Implementation — 2026-09-25

**Agent:** Игорь. **Role:** Developer. **Change:** backend [PR #29](https://github.com/lelik112/parrot669-backend/pull/29): 1–366, Long before Int, 400 before repository, safe four-digit dates. Frontend: localized request-limit warning, no input truncation, restoration and contact-path checks. Isolated benchmark runs on GitHub Actions PostgreSQL 16, using 5,000 synthetic properties / 100 and 500 per queried city; these are declared scenarios, not measured production inventory. CI/benchmark and release decision pending. Host/PM-038 files are not touched. **Related task:** PM-037.

## Developer handoff — 2026-09-25 18:55 UTC

**Agent:** Игорь. **Role:** Developer. **Change:** реализация и измерения готовы; [отчёт с raw JSON и EXPLAIN](logs/PM-037-performance.md). Backend [PR #29](https://github.com/lelik112/parrot669-backend/pull/29), frontend [PR #52](https://github.com/lelik112/parrot669/pull/52). Backend [CI 36175617171](https://github.com/lelik112/parrot669-backend/actions/runs/36175617171) PASS (113 tests, E2E, Docker); frontend [CI 36176047946](https://github.com/lelik112/parrot669/actions/runs/36176047946) PASS (134 tests); [benchmark 36175617454](https://github.com/lelik112/parrot669-backend/actions/runs/36175617454) PASS.

366 ночей, 100 объектов в городе: p95 226 мс, при concurrency=4 — 572 мс. 500 объектов: 1 044 / 2 216 мс. 367 отклоняется за p95 4–5 мс, route tests подтверждают отсутствие repository calls. Границы/цены/стыки/null-priced/filters/contact dates PASS. Рекомендую сохранить 366 для малого пилота; для 500 объектов необходимо явно принять задержку или отдельно согласовать узкую оптимизацию. **PM acceptance не объявляю за Марка:** ожидаемый объём пилота/SLO не задан. Согласно acceptance выше выпуск ждёт его решения по замеру. Никакой нагрузки или изменения production.

**Занятые файлы:** backend `search/SearchService.scala`, `search/SearchSuite.scala`, `.github/workflows/search-benchmark.yml`, `scripts/search-benchmark.py`; frontend `public/assets/search.js`, `tests/search-ui.test.cjs`. Документы PM-037 обновлены, host/PM-038 и аккаунты QA не менялись. Следующий исполнитель: Марк — решение по performance gate; затем Игорь — merge/release и отдельный QA claim. **Related task:** PM-037.

## PM performance gate — 2026-09-25 ~19:25 UTC

**Agent:** Марк. **Role:** Product Manager. **Change:** принимаю замер [PM-037-performance](logs/PM-037-performance.md) для малого пилота и оставляю предел 366 ночей из [D014](../decisions/D014-public-search-date-range.md). Изолированный HTTP p95 на 366 ночах: 226 мс при 100 объектах в городе; 572 мс при concurrency=4. При 500 объектах — 1 044 / 2 216 мс соответственно, поэтому готовность к большему масштабу и production SLO этим не утверждаются. 367+ отклоняется до repository. Оптимизацию SQL и снижение предела в текущий scope не добавляю. **Related task:** PM-037 / D014.

**Адресат: Игорь / Developer. Next:** PM gate снят. GitHub на момент решения показывает backend [PR #29](https://github.com/lelik112/parrot669-backend/pull/29) open/mergeable, frontend [PR #52](https://github.com/lelik112/parrot669/pull/52) open/`mergeable=false`. Проверь причину и current-head CI обоих PR; после устранения препятствия выпусти сначала backend validation, затем frontend UI, запиши фактические commit/deploy/smoke, отдай Борису на независимую QA 366/367 и сохранение дат. Если PR или live regression мешает выпуску — запиши блокер здесь, не считай PM gate техническим разрешением пропустить CI/QA. **Status:** in progress до выпуска; затем in review.
