# PM-025 — Исправить расположение кнопки контакта в веб-выдаче

**Title:** исправить расположение «Написать владельцу» в веб-выдаче; отдельно проверить мобильную.
**Status:** in review — web fix deployed and live checked; mobile and independent QA pending. **Priority:** P1.
**Owner:** Денис / Developer; QA Борис.
**Agent:** Денис. **Role:** Developer. **Scope:** frontend contact CTA и соседние действия внутри карточки поиска; без backend и contact/auth semantics.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** локальный responsive UI-дефект, но кнопку нужно проверить с несколькими состояниями карточки и языками.

## Goal

Кнопка связи находится рядом с тем объектом, которому принадлежит, и остаётся понятной и нажимаемой в веб-выдаче и на мобильном экране.

## Problem

Алексей сообщил, что в веб-версии PARROT кнопка «Написать владельцу» съехала с ожидаемого места. На мобильном это поведение он не проверял. Скриншот приложен к исходному сообщению, но файла-доказательства в репозитории пока нет; точный viewport и браузер нужно зафиксировать при воспроизведении.

## User

Гость, который открывает веб-выдачу или мобильную версию результатов поиска.

## Value

Гость сразу понимает, с каким хозяином/объектом свяжется, и не промахивается по кнопке.

## Solution

Исправить положение contact CTA в веб-версии, сохранив визуальную связь с объектом, внешней ссылкой и статусом календаря. Мобильное поведение проверить отдельно; не считать его дефектным до воспроизведения.

## Requirements

- Воспроизвести описанное наблюдение в веб-версии на опубликованном поиске и зафиксировать браузер, viewport, zoom и шаги; сверить с приложенным пользователем скриншотом, если он доступен исполнителю.
- Отдельно проверить мобильную версию и зафиксировать фактическое поведение; исходно мобильный баг не подтверждён.
- Проверить комбинации: external link есть/нет, verification status есть/нет, длинные переводы, несколько карточек.
- Кнопка должна оставаться дочерним действием своей карточки и не перекрывать/сдвигать соседнюю карточку.
- Сохранить передачу property ID и выбранных дат из PM-023/PM-024.
- Проверить исправление в веб-версии и отдельно подтвердить поведение на мобильном; не менять правила доступности и отправки сообщений.

## Acceptance criteria

- [x] В веб-версии дефект воспроизведён до исправления; фактическое и ожидаемое положение зафиксированы viewport, шагами и скриншотом.
- [ ] Мобильная версия проверена отдельно; результат записан без предположения, что там был баг.
- [ ] Contact CTA визуально находится внутри нужной карточки при всех проверенных состояниях.
- [ ] Нажатие ведёт к обращению именно по этой карточке и сохраняет даты.
- [ ] Нет наложения на Airbnb link, verification status, соседние карточки, фокус-рамки или unread/navigation элементы.
- [ ] RU/EN/ES/CA и доступная клавиатурная навигация проверены.

## Alternatives

Оставить текущую позицию; перенести кнопку в глобальную навигацию; заменить её внешней ссылкой на Airbnb.

## Rejected

Скрыть contact CTA, маскировать дефект только на одном языке или менять продуктовый смысл D011 ради визуального обхода.

## Success criteria

В веб-версии контактное действие однозначно принадлежит выбранному жилью и срабатывает без промаха; мобильное поведение отдельно проверено.

## Not doing

Переработка всей карточки поиска, новый дизайн выдачи, изменение contact/auth backend.

## Dependencies

[D011](../decisions/D011-contact-always-available.md), [PM-024](PM-024-contact-from-every-search-result.md). Screenshot из исходного запроса нужен исполнителю при воспроизведении; не утверждать, что дефект уже локализован.

## Evidence

Наблюдение владельца в веб-версии, уточнено 2026-09-25; мобильная версия им не проверялась. Оригинал скриншота не сохранён в docs. Собственные production-снимки: [до](../evidence/PM-025-web-before.jpg), [после](../evidence/PM-025-web-after.jpg).

## Discussion / Updates

- 2026-09-24 — **Марк / Product Manager:** создан отдельный bug task по сообщению о сдвиге кнопки; исходно поверхность была ошибочно указана как mobile.
- 2026-09-25 — **Марк / Product Manager:** Алексей уточнил, что сдвиг наблюдается в веб-версии; мобильную не проверял. Исправлена поверхность дефекта, mobile оставлен отдельной проверкой. **Next:** воспроизвести web-дефект, зафиксировать viewport/evidence и проверить mobile отдельно.

- 2026-09-25 07:12 UTC — **Денис / Developer:** беру PM-025 по прямому поручению Алексея. **Agent:** Денис. **Role:** Developer. **Scope:** frontend responsive layout кнопки контакта внутри search-result card, RU/EN/ES/CA, desktop/mobile и клавиатура; backend и правила сообщений вне scope. **Model check:** Sol / Medium достаточен: дефект локальный, нужны несколько состояний карточки и viewport. **Change:** claim, статус in progress. **Related task:** PM-025. **Branch:** `denis/pm025-contact-layout`. **Следующий шаг:** сверить свежий main, воспроизвести web-сдвиг, проверить mobile отдельно, затем исправить и передать Борису на QA.

- 2026-09-25 07:17 UTC — **Денис / Developer:** воспроизвёл на production `/search` в Chrome, viewport 1363×936, стандартный zoom, RU, Barcelona, 01–08.10.2026. Три карточки: у первой правая граница 463 px, у кнопки контакта — 512 px; она выступает на 49 px и заходит на соседнюю карточку. [Скриншот до исправления](../evidence/PM-025-web-before.jpg). Причина: в footer подпись владельца и `.availability-links` конкурируют за 345 px, а ссылки не сжимаются (`flex: 0 0 auto`, суммарная ширина footer 419 px). **Agent:** Денис. **Role:** Developer. **Change:** локально перестроил footer вертикально, ограничил ширину ссылок и сделал contact CTA на ширину карточки; property ID/даты и логику отправки не менял. **Related task:** PM-025. **Проверки:** `npm test` 117/117 PASS, `git diff --check` PASS. **Следующий шаг:** PR/CI и live web ретест; mobile отдельно остаётся для responsive и независимого touch QA.

- 2026-09-25 07:32 UTC — **Денис / Developer:** PR [#29](https://github.com/lelik112/parrot669/pull/29) слит в `main` (`c7cd14d`); frontend CI и Cloudflare Workers build для PR и `main` завершились SUCCESS (production build `6ddbcfeb-3b32-4e59-95ae-733aaa1bbb71`). После выкладки проверил Chrome 1363×936, RU, Barcelona, 01–08.10.2026: три карточки; contact CTA у каждой заканчивается за 25 px до правого края своей карточки, footer `scrollWidth=width=345 px`. [Скриншот после](../evidence/PM-025-web-after.jpg). Переключил RU/EN/ES/CA: 3 CTA на каждом языке, без выхода за край. Ссылки сохранили разные property ID и даты `from=2026-10-01&to=2026-10-08`. **Agent:** Денис. **Role:** Developer. **Change:** web fix опубликован, статус in review. **Checks:** `npm test` 117/117 PASS, PR/main CI и Cloudflare SUCCESS, live web smoke PASS. **Handoff Борису / QA:** независимо проверить web с external link/verification status/длинным текстом, клавиатуру и переход по CTA; отдельно мобильный экран 390 px и фактический touch, зафиксировать, был ли там дефект. Мобильный результат не подтверждён этим web-smoke; acceptance оставлены открытыми до QA. **Related task:** PM-025.

- 2026-09-25 09:24 UTC — **Agent:** Борис. **Role:** QA. **Scope:** независимый production desktop Chrome, RU/EN/ES/CA, Barcelona 01–08.10.2026; без изменения данных. **Change:** PARTIAL PASS: в выдаче три карточки (`The therd`, `One more`, `The second`) с отдельными CTA внутри своих границ (по DOM 25 px от боковых краёв, без наложения); на всех четырёх языках есть три кнопки с тремя различными property ID и сохранёнными датами. Нажал CTA `The second`: открылся composer именно этого объекта с заездом 01.10 и выездом 08.10, сообщение не отправлял. **Открыто:** external link/verification status на этих трёх карточках отсутствовали, длинный текст, клавиатурный фокус и mobile/touch не проверены. Скриншот web сохранён в этой QA-беседе. **Related task:** PM-025; PM-024. **Next:** отдельно пройти внешнюю ссылку/status и клавиатуру, mobile/touch при доступной среде; статус остаётся in review.

- 2026-09-25 13:49 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production search on Worker origin, desktop Chrome, authenticated `qa`, existing selected dates 11–14 Jun 2027; read-only. **Change:** PARTIAL PASS for a card with external link and confirmed calendar: one result displays one `Открыть на Airbnb` link, one `Написать владельцу` action and the confirmed-calendar label within the same article. No message was sent and no data changed. **Open:** this is one card/state only; precise overlap measurement on this browser run timed out, and long translations, keyboard and mobile/touch remain open. **Related task:** PM-025. **Next:** test remaining card combinations and responsive/keyboard states when the matching data/device is available.

- 2026-09-25 14:08 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production parrot669.com desktop Chrome, qa logged in; Barcelona 11–14.06.2027, one card with Airbnb link and confirmed calendar. **Change:** PASS for keyboard and this card layout: after Search, Tab reaches Airbnb link then contact link; contact has keyboard focus and Enter opens the existing conversation for the same QA property. Card horizontal bounds 68–463 px, contact 93–438 px; card scrollWidth=clientWidth=393 px. Airbnb link ends at y=757, contact starts y=786, so they do not overlap. Existing thread shows trip dates 11–14.06.2027. **Open:** the pair is blocked, so sending a new message was not tested; mobile/touch and other card states remain open. No message was sent or data changed. **Related task:** PM-025 / PM-024 / PM-003. **Next:** mobile/touch when available; unblocked contact flow separately.

- 2026-09-25 ~15:55 UTC — **Борис / QA:** main `qa` desktop Cloud Chrome, Barcelona 2026-10-01→08. Search showed three no-external-link cards (`The therd`, `One more`, `The second`), latter without price. In each card CTA remained inside its own `article.availability-card`: card widths ~394.6 px, contact widths ~344.6 px, 25 px inset, card `scrollWidth=clientWidth=393`; all three card tops y≈779 and CTAs y≈1050, no horizontal overflow or cross-card overlap in checked viewport. Clicking third CTA opened composer for exactly `The second` (property ID ending `f537`) with both dates 2026-10-01/08 prefilled; no message sent. **PASS for additional desktop no-link/no-price variants.** Real mobile/touch remains open and this is not a mobile claim. **Related task:** PM-025 / PM-024. **Owner:** Денис / Developer; QA Борис.

- 2026-09-25 ~15:59 UTC — **Борис / QA:** desktop Chrome, `qa` on main search, Barcelona 2026-10-01→08, `The second` card without external link/price. Switched EN/ES/CA/RU using keyboard Enter on language controls. Contact labels: “Message host” / “Escribir al propietario” / “Escriure al propietari” / “Написать владельцу”. In each language the CTA remained within its card, ~25 px horizontal inset; card `scrollWidth=clientWidth=393`, CTA width ~344.6 px, no horizontal overflow; href retained exact property ID and dates. Keyboard Enter on CTA opened `The second` composer with 2026-10-01/08. No message sent. **PASS for available desktop localization/keyboard acceptance.** Real mobile/touch still unverified. **Owner:** Денис / Developer; QA Борис.
