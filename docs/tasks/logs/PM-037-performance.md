# PM-037 — изолированный замер поиска, 2026-09-25

**Agent:** Игорь. **Role:** Developer. **Related task:** [PM-037](../PM-037-search-date-range-bound.md), [D014](../../decisions/D014-public-search-date-range.md).

## Вывод для PM / release gate

Рекомендую оставить **366 ночей** для небольшого пилота, если ожидаемый объём близок к сценарию 100 объектов в городе и невысокой одновременности. На этом сценарии p95 полного поиска 226 мс последовательно / 572 мс при четырёх одновременных запросах. Признаков необходимости уменьшать продуктовую границу в таком сценарии нет.

**500 объектов в городе — уже заметная задержка:** p95 1,044 с последовательно / 2,216 с при четырёх запросах. Это не отказ, но и не доказательство готовности к росту. Для такой целевой нагрузки сначала согласовать с PM допустимую задержку и необходимость узкой оптимизации. Предложение разработчика не является PM acceptance; ожидаемый пилотный объём и SLO отдельно не заданы. На момент handoff разработчика merge/deploy ждал PM; **Марк принял этот pilot performance gate 2026-09-25** в [PM-037](../PM-037-search-date-range-bound.md) и [D014](../../decisions/D014-public-search-date-range.md). Технический выпуск и независимая QA остаются следующими шагами. Предел не снижался, SQL не переписывался, production не нагружался.

## Код и воспроизведение

- Backend [PR #29](https://github.com/lelik112/parrot669-backend/pull/29), head `7ee59378b3265ef51dc354f75c5a03f79f0084b4`.
- Frontend [PR #52](https://github.com/lelik112/parrot669/pull/52).
- [Benchmark run 36175617454](https://github.com/lelik112/parrot669-backend/actions/runs/36175617454), PASS. GitHub проверял merge ref `129268436b11c07e4541792a35a15b0373d7fb0a`.
- [Backend CI 36175617171](https://github.com/lelik112/parrot669-backend/actions/runs/36175617171), PASS: compile, 113 тестов, E2E smoke, Docker image build.
- [Frontend CI 36176047946](https://github.com/lelik112/parrot669/actions/runs/36176047946), PASS: 134 теста.
- [Исходный артефакт](https://github.com/lelik112/parrot669-backend/actions/runs/36175617454/artifacts/10882257614) содержит также подставленный SQL и server.log. [report.json](PM-037/report.json) с отдельными latency samples и все восемь EXPLAIN сохранены здесь без срока истечения Actions artifact.
- Workflow `.github/workflows/search-benchmark.yml` создаёт отдельный PostgreSQL 16 и запускает собранный backend. Скрипт `scripts/search-benchmark.py` допускает только `APP_ENV=test`, localhost и пустую БД с точным именем `parrot_search_benchmark`; внешние endpoints не принимает.

## Среда и данные

GitHub Actions ubuntu-latest, 4 CPU, ~15.6 GiB RAM, PostgreSQL **16.15**, Java **21.0.12.1**. `shared_buffers=128MB`, `work_mem=4MB`, `jit=on`, max_connections=100. HTTP клиент, JVM и БД на одном runner, без Cloudflare и сетевой задержки Railway; это не production capacity certification.

Синтетический набор: **5 000 объектов, 1 000 владельцев, 59 500 availability periods, 5 000 listings/calendars, 60 000 импортированных событий, 500 ручных блокировок**. `Pilot`: 100 объектов в городе; `Scale`: 500; остальные в третьем городе. После ручных блокировок кандидатов 90/450. Все объекты имеют внешний listing и включённый календарь.

12 смежных периодов по 31 ночи. У 10% объектов пропущен один период, у других 10% отсутствует цена в последнем периоде; 10% имеют reservation, ещё 10% ручную блокировку. Остальные события — platform_unavailable/unknown, они не блокируют. Даты запросов от `2030-01-01`; все периоды остаются `[from,to)`. Размеры сценариев — явные предположения для проверки, не прочитанная статистика production.

Для каждого города и интервала: три warmup, затем 25 измерений в воспроизводимо перемешанном порядке. p50 — медиана, p95 — nearest rank. Дополнительно 24 запроса 366 ночей с concurrency=4. Это короткий warm-cache эксперимент, не длительный soak-тест и не холодный cache. Все значения ниже — миллисекунды.

## Полный HTTP-путь и основной SQL

| Сценарий | Ночей | Кандидатов | Результатов | HTTP p50 | HTTP p95 | SQL EXPLAIN execution |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Pilot | 7 | 90 | 80 | 98.35 | 117.64 | 5.163 |
| Pilot | 30 | 90 | 80 | 104.20 | 116.21 | 13.74 |
| Pilot | 90 | 90 | 70 | 112.97 | 127.58 | 37.924 |
| Pilot | 366 | 90 | 70 | 214.50 | 226.09 | 153.993 |
| Pilot | 367 | — | 400 | 3.81 | 5.13 | — |
| Scale | 7 | 450 | 400 | 438.36 | 481.78 | 20.923 |
| Scale | 30 | 450 | 400 | 471.55 | 498.36 | 59.334 |
| Scale | 90 | 450 | 350 | 516.71 | 555.41 | 170.275 |
| Scale | 366 | 450 | 350 | 965.19 | 1043.65 | 655.903 |
| Scale | 367 | — | 400 | 3.13 | 3.79 | — |

| Сценарий, 366 ночей | Одновременно | HTTP p50, мс | HTTP p95, мс | Запросов/с |
| --- | ---: | ---: | ---: | ---: |
| Pilot | 4 | 413.71 | 572.31 | 9.19 |
| Scale | 4 | 1655.43 | 2215.96 | 2.21 |

SQL извлекается непосредственно из `SearchRepository.scala`, без отдельной копии алгоритма. EXPLAIN выполнялся с литералами параметров; полный HTTP использует реальный Doobie/JDBC-путь. Это snapshot custom plan, не доказательство того, что JDBC всегда выберет тот же generic plan. EXPLAIN один на комбинацию; его время — не p50/p95 SQL.

## Что видно в планах

- [Pilot / 366](PM-037/Pilot-366-explain.json): 90×366 = **32 940** строк покрытия; execution **153.993 мс**; shared hit **199 562**, shared read **0**; external merge sort 3 416 KiB на диске, temp read/write **427/428 blocks** при work_mem=4MB.
- [Scale / 366](PM-037/Scale-366-explain.json): 450×366 = **164 700** строк покрытия; execution **655.903 мс**; shared hit **997 724**, shared read **0**, temp read/write 0. План выбрал incremental sort, поэтому больший набор не обязан повторять disk spill меньшего.
- Коррелированная проверка reservation повторяется **32 630 / 163 150** раз. Это измеримый рост работы пропорционально ночам и кандидатам.
- После основного SQL текущий SearchService делает три repository-вызова на каждый результат: listings/cleaning fee/link source, то есть **1+3N** транзакций. Для 70/350 результатов — 211/1 051. Это вывод из кода, не отдельный замер числа SQL через pg_stat_statements. HTTP benchmark включает этот путь. Ничего из этого не оптимизировалось в PM-037.

## Проверка корректности

- 1/7/30/90/366 проходят HTTP с точными `availableFrom/availableTo`; реальные смежные периоды stitch без потери ночей.
- 366: 70/350 результатов, у 10/50 цена null; `pricedOnly=true` исключает ровно их. Известная цена: **3 685 000 cents nightly subtotal + 5 000 cleaning = 3 690 000 cents**, nights=366. Assertions проверяют каждую известную цену, весь набор ID и исключение reservation/manual block/gap.
- 367: 400 с `{error: "A search request can cover at most 366 nights"}`, не пустая выдача. Route tests подтверждают **ноль repository calls** для 367, нуля, обратного интервала, невозможных/крайних дат и огромного положительного диапазона.
- Backend принимает строгий YYYY-MM-DD, годы 0001–9999; year zero/signed/extended отвергаются до SQL, ChronoUnit разность проверяется как Long до Int.
- UI tests: EN/ES/CA/RU, сохранение дат и фильтров/restore, исправление 367→366, серверная ошибка, 1/7/30/90/366 и исходные даты в contact URL. Независимая QA не подменяется этими dev checks.

## Следующий шаг

Марк принял замер для **малого пилота**; при 500 объектах/город и четырёх запросах p95 2,216 с остаётся риском масштабирования. Релиз backend `90a4d90` → frontend `17a6d9c` выполнен 2026-09-26 с зелёным main CI и Railway SUCCESS; live UI 367/366/3-night smoke записан в [PM-037](../PM-037-search-date-range-bound.md). Независимая QA Бориса открыта. Изолированный benchmark не является production SLO и не заменяет замеры при росте пилота.
