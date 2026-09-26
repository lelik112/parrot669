# PM-048 — Поиск: короче текст и удобнее фильтр цены

**Title:** убрать лишние пояснения из поиска и увеличить «Только с ценой».
**Status:** in review / production released; automated browser smoke passed, independent web review pending. **Priority:** P2.
**Owner:** Игорь / Developer — implementation and release complete 2026-09-26; Борис / QA Lead — independent web review in progress. **Role:** Developer / QA.
**Recommended model:** Sol. **Recommended reasoning:** Medium (4/6 default достаточен после собственного Model check). **Reason:** локальный UI и четыре локали, но важно не исказить значение доступности и цены.
**Scope:** `public/search.html`, переводимые видимые тексты в `public/assets/search.js` и связанные стили фильтра; без API, цены, календаря и результатов.

## Goal / Problem / User / Value

Гость быстрее видит форму и результаты и без прищуривания включает фильтр цены. Сейчас три поясняющие строки дублируют интерфейс, lead звучит непрозрачно, checkbox мал на desktop и мобильной ширине. Источник: конкретные наблюдения Алексея 2026-09-26; это выбранное узкое улучшение внутри [PM-047](PM-047-design-trust-audit.md).

## Requirements

1. Убрать из видимого поиска три отдельные строки: бюджетное пояснение под фильтрами, «Подключено к живому индексу доступности PARROT», и длинное пояснение о физической доступности/условиях аренды. Удалить ненужную обёртку, ключи перевода и битые `aria-describedby` для удалённого текста. Подписи цен «За весь период от/до» и точный расчёт не менять.
2. Заменить lead «Ищите физически свободное жильё по данным владельцев…» на короткий понятный текст без обещания подтверждённого бронирования. Рабочий вариант: **«Найдите жильё, свободное на ваши даты.»** Внешняя ссылка и условия остаются в карточке результата там, где ссылка реально есть; не утверждать, будто каждый объект имеет внешний листинг.
3. Увеличить визуальный checkbox и всю кликабельную область «Только с ценой» на desktop/mobile; label переключает фильтр, фокус виден, ничего не обрезается.
4. RU/EN/ES/CA согласованы. Не ломать фильтрацию, поиск по датам, CTA контакта и семантику цены. Сверить с [PM-031](PM-031-trust-terminology.md), [PM-025](PM-025-search-contact-button-layout.md), [BUG-019](BUG-019-search-account-context.md).

## Acceptance criteria

- [x] Три строки исчезли в четырёх локалях; нет пустых полос и dangling accessibility references.
- [x] Lead однозначен: это поиск доступности на выбранные даты, не бронирование и не проверка условий сделки.
- [x] Фильтр срабатывает по label, клавиатуре и touch-sized области; Playwright desktop/mobile WebKit smoke, без заявления real iPhone PASS.
- [x] Поиск и сортировка по цене продолжают работать; контрольные результаты/контакт не меняют смысл.

## Not doing

Изменение API, геолокации, точных координат, ценовых вычислений, полного редизайна, самостоятельное закрытие QA PM-025/BUG-019.

## Dependencies / Handoff

Игорь после адресного handoff проверяет актуальный main, делает Model check и подписанный claim. PM-049 меняет общую шапку; не менять её в PM-048, чтобы избежать параллельного конфликта. После PR независимый web smoke доступен; нативный touch остаётся [PM-041](PM-041-real-device-qa-queue.md).

## Evidence / Discussion / Updates

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Scope:** продуктовая постановка по замечаниям Алексея. **Change:** три избыточные строки, lead и фильтр объединены в одну задачу; код не менял. **Related task:** PM-048. **Model check:** Sol 4/6 достаточно. **Next:** signed claim Игоря, узкий PR и web QA.

- 2026-09-26 13:01:13 UTC — **Agent:** Игорь. **Role:** Developer. **Wake ID:** `PM-048-SEARCH-CLARITY-20260926-1300`. **Model check:** подтверждённый дефолт Sol 4/6 соответствует рекомендованному Sol / Medium и достаточен; повышение не требуется. **Developer claim:** беру PM-048 в согласованном узком scope: только `public/search.html`, переводимые тексты `public/assets/search.js` и связанные стили фильтра. Убираю три заданные строки, упрощаю lead, увеличиваю checkbox и его кликабельную область во всех четырёх локалях; API, расчёт цены, результаты, общую шапку, Messages, PM-049/050 и real-iPhone QA не трогаю. Конфликтов claim или блокеров по свежему main нет. **Next:** сверить текущую разметку/тесты, сделать узкий PR и browser smoke. **Related task:** PM-048 / PM-047.

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Change:** отправлен [адресный handoff Игорю #61](https://github.com/lelik112/parrot669/pull/61#issuecomment-5846472099), Wake ID `PM-048-SEARCH-CLARITY-20260926-1300`. Это доставка, не подтверждённый старт; ожидается его Model check и signed claim. **Related task:** PM-048.

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `PM-048-IGOR-START-20260926-1301`. **UTC:** 2026-09-26T13:01:50.275Z. **Source:** [PR #60 comment #5846479498](https://github.com/lelik112/parrot669/pull/60#issuecomment-5846479498). **PM review:** signed claim Игоря в карточке и Sol 4/6 Model check подтверждены; scope Search/locales/checkbox не пересекается с PM-049/050, конфликтов нет. Работа начата без отдельного согласования. **Next:** узкий PR и browser smoke, затем QA. **Related task:** PM-048.

- 2026-09-26 13:06:31 UTC — **Agent:** Игорь. **Role:** Developer. **Change:** подготовлена узкая frontend-реализация PM-048. Три заданные строки удалены вместе с неиспользуемыми locale keys, CSS wrappers и `aria-describedby`; lead сокращён в EN/ES/CA/RU. Checkbox `pricedOnly` увеличен до 22 px, label-area — до 52 px desktop / 56 px mobile, native keyboard focus явно виден. Добавлены unit и Playwright проверки локалей, label/keyboard toggle, размеров и overflow. **Verification:** `npm test` PASS 138/138; локальный focused Playwright обнаружил 3 проекта, но запуск BLOCKED отсутствующими Chromium/WebKit binaries — фактический browser run обязателен в CI. API, расчёт цены, карточки результатов, global header, Messages и real-iPhone scope не менялись. **Next:** узкий PR, зелёный CI, merge/deploy и независимый web smoke. **Related task:** PM-048 / PM-047.

- 2026-09-26 13:15:38 UTC — **Agent:** Игорь. **Role:** Developer. **Release:** [PR #67](https://github.com/lelik112/parrot669/pull/67) merged as `61563d2`. PR CI [36244195339](https://github.com/lelik112/parrot669/actions/runs/36244195339) PASS; main CI [36244332329](https://github.com/lelik112/parrot669/actions/runs/36244332329) PASS, включая 21 browser case в Chromium desktop, WebKit desktop и mobile emulation. Live smoke на `parrot669.com` и `parrot669.cheltsov112.workers.dev` подтвердил новый lead в HTML/JS, отсутствие старых строк и CSS hit-area; API и search semantics не менялись. **Handoff:** Марку — назначить независимый короткий web review; real iPhone остаётся PM-041. **Related task:** PM-048 / PM-047.

- 2026-09-26 14:15:31 UTC — **Agent:** Борис. **Role:** QA Lead / Acceptance QA. **Wake ID:** `PM-048-BORIS-WEB-REVIEW-20260926-1412`. **Source:** [PR #63 comment #5846959341](https://github.com/lelik112/parrot669/pull/63#issuecomment-5846959341). **Model check:** задача рекомендует Sol / Medium; подтверждённый дефолт Бориса Sol 4/6 достаточен, повышение не требуется. **QA claim:** беру независимый anonymous web review PM-048 на обоих production origins в согласованном scope: RU/EN/ES/CA, удалённые строки и понятность lead, крупная кликабельная область фильтра «Только с ценой», переключение label/keyboard, desktop и узкая ширина, сохранность смысла поиска, сортировки цены и contact CTA. Real iPhone/touch остаётся PM-041; код, данные, API и инфраструктуру не меняю. Свежая карточка не содержит другого независимого QA claim или блокера. **Next:** выполнить браузерную приёмку на обоих deployed origins и записать PASS/FAIL/BLOCKED с evidence. **Related task:** PM-048.

- 2026-09-26T14:16:00Z — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `PM-048-BORIS-START-20260926-1415`. **Source:** [PR #60 comment #5846971773](https://github.com/lelik112/parrot669/pull/60#issuecomment-5846971773). **Related task:** PM-048. **PM review:** отдельный signed claim Бориса и Model check Sol 4/6 подтверждены; anonymous web scope RU/EN/ES/CA, label/keyboard, desktop/узкая ширина и search/price/contact semantics соответствует карточке, конфликтов нет. Real iPhone/touch остаётся PM-041. **Next:** независимый PASS/FAIL evidence на двух production origins.
