# PM-049 — Единая шапка и спокойный кабинет хозяина

**Title:** согласовать account/navigation и общий контейнер Search, Host, Messages; убрать лишнюю навигацию кабинета.
**Status:** in review / released; PM-049 code shipped, independent QA remains open. **Priority:** P2.
**Owner / expected Agent:** Денис / Developer; PM-044 ждёт отдельное evidence, PM-048 выпущена; PM-049 выпущена отдельно; QA остаётся открытым. **Role:** Developer.
**Recommended model:** Sol. **Recommended reasoning:** Medium (4/6 default; собственный Model check до claim). **Reason:** три страницы, auth/logout и responsive-навигация требуют аккуратной регрессии.
**Scope:** общий header/container трёх страниц и визуальная иерархия Host; не менять auth API или сохранённые данные.

## Goal / Problem / User / Value

На трёх страницах разное место, оформление и набор действий у имени аккаунта, языков, выхода и возврата. У Host нет такого же светлого контейнера на тёмном фоне; две яркие shortcut-кнопки ведут к секциям одного кабинета, а «ХАРАКТЕРИСТИКИ ОБЪЕКТА» добавляет шум. Участник должен сразу понимать, чей сеанс открыт, как выйти и куда вернуться.

## Requirements

1. Для Search, Host, Messages установить одну видимую систему: место языков, имя/идентификатор (без разного овала/@ только на Search), действие «Выйти» для авторизованного сеанса, понятный signed-out state. На Search проверить доступность безопасного logout без изменения backend; не выводить чувствительную почту там, где продукт показывает username. После logout/session expiry состояние всех страниц верно при переходе между ними. Не регрессировать [BUG-019](BUG-019-search-account-context.md), [PM-020](PM-020-host-cabinet-navigation.md), [PM-026](PM-026-remove-duplicate-messages-link.md).
2. Добавить Messages явный путь «Назад на сайт» в общей шапке. Сохранять понятные ссылки Search/Host и прямой вход в Messages; решить, что делает back-link при входе из карточки, без сломанного browser history.
3. Применить на Host светлый контейнер поверх тёмного фона, согласованный с Search/Messages; desktop/mobile ширина, внешние отступы и responsive не должны скакать между страницами. Не превращать это в новый дизайн.
4. Убрать/ослабить shortcut «Мои объекты» и «Профиль хозяина» как избыточные кнопки, сохранив доступность самих секций и deep link из Messages к `#host-profile`. Убрать чисто декоративную надпись «ХАРАКТЕРИСТИКИ ОБЪЕКТА» в карточке, оставив поля, edit/save и понятные подписи.
5. Подпись **«Search by LocationIQ.com» оставить видимой ссылкой рядом с адресным поиском**: она требуется для использования бесплатного LocationIQ. Можно улучшить размещение, но нельзя убрать/спрятать. [Правила провайдера](https://locationiq.com/pricing).

## Acceptance criteria

- [ ] В четырёх языках одинаковый порядок и поведение account/language/logout/back в трёх разделах; клавиатура и узкая ширина работают.
- [ ] Авторизованный/анонимный/истёкший сеанс, переходы Search↔Host↔Messages и logout не дают ложной идентичности.
- [ ] Внешний контейнер Host визуально согласован по размеру/отступам; функции профиля и объекта доступны, deep link и сохранение не сломаны.
- [ ] Attribution LocationIQ виден и работает; ни одна QA граница PM-020/021/026/028/BUG-019 не объявлена закрытой этим PR.

## Not doing

Полный redesign, новая модель аккаунта, изменение email/сессий, публичный профиль PM-022, перенос корпоративной главной, переделка Messages polling PM-050.

## Dependencies / Handoff

Диагностика P1 PM-044 остановлена на owner-доступе к Resend; её зависимая часть остаётся blocked. PM-048 выпущена и не правит общие HTML/CSS. Денис может взять PM-049 отдельно, не смешивая scopes; PM-050 Игоря в общих Messages файлах не вести параллельно до согласования порядка. После signed claim, PR и web smoke передать регресс QA; реальный Safari остаётся отдельной очередью PM-041.

## Evidence / Discussion / Updates

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Scope:** постановка общего UI по пунктам Алексея. **Change:** объединил шапку, контейнер и навигационный шум Host; атрибуцию LocationIQ сохранил по условиям провайдера. **Related task:** PM-049. **Model check:** Sol 4/6 достаточно. **Next:** после P1 почты и PM-048 адресно передать Денису; его claim ещё нет.

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Change:** PM-049 поставлена в NOW как независимая работа Дениса на время owner-blocker PM-044; PM-048 уже released, конфликт общих файлов проверять при claim. **Related task:** PM-049 / PM-044. **Next:** адресный handoff Денису, его Model check и отдельный signed claim; к PM-044 вернуться после Resend evidence.

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Change:** [адресный handoff Денису #62](https://github.com/lelik112/parrot669/pull/62#issuecomment-5846614870), Wake ID `PM-049-DENIS-INDEPENDENT-20260926-1323`; это доставка, не signed claim. **Related task:** PM-049. **Next:** дождаться Model check и claim Дениса, затем реализация независимо от PM-044.

- 2026-09-26T13:25:14.683Z — **Agent:** Денис. **Role:** Developer. **Wake ID:** `PM-049-DENIS-INDEPENDENT-20260926-1323`. **Source:** [PR #62 comment #5846614870](https://github.com/lelik112/parrot669/pull/62#issuecomment-5846614870). **Related task:** PM-049. **Model check:** подтверждённый Алексеем в `docs/team.md` Sol 4/6 соответствует Sol / Medium карточки; фактически достаточно для трёх страниц, auth state и responsive regression. **Claim / scope:** беру только общий header/account/language/logout/back и Host container/navigation copy в Search, Host, Messages; не меняю auth API, данные, polling и PM-050 email-help/Refresh. PM-048 выпущена; PM-050 ещё без claim и прямо исключает общий header, пересечение общих файлов ограничиваю разными участками. **Status:** in progress. **Next:** проверить main и существующие реализации, внести узкие UI изменения в отдельной ветке/PR, выполнить тесты и web smoke, затем QA handoff.

- 2026-09-26T13:26:20.853Z — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `PM-049-DENIS-START-20260926-1325`. **Source:** [PR #60 comment #5846635523](https://github.com/lelik112/parrot669/pull/60#issuecomment-5846635523). **Related task:** PM-049. **PM review:** Денис отдельно подписал claim и Model check Sol 4/6, согласованный scope общего header/account/logout/back и Host container. PM-048 released, PM-050 без claim и исключает общий header; параллельный конфликт не подтверждён. PM-049 in progress. **Next:** узкий UI PR, auth/logout и responsive smoke, затем независимая QA; PM-044 остаётся blocked отдельно.

- 2026-09-26T13:50:12.874Z — **Agent:** Денис. **Role:** Developer. **Wake ID:** `PM-049-DENIS-INDEPENDENT-20260926-1323` (result of signed claim). **Source:** [PR #62 comment #5846614870](https://github.com/lelik112/parrot669/pull/62#issuecomment-5846614870). **Related task:** PM-049. **Change:** [frontend PR #68](https://github.com/lelik112/parrot669/pull/68) merged as `1a0f57263974817de0c6a42c00c84147c104ae56`. Search/Host/Messages share language → account/login/logout → back order and same bounded surface; Search logout uses existing endpoint and clears owned-card identity; Messages has deterministic back to Search, including direct/card entry; Host shortcuts are quiet links, decorative property-settings heading removed while edit/save and `#host-profile` remain. Header displays username without email tooltip; no auth API/data/polling/PM-050 change, LocationIQ attribution unchanged.

**Verification:** `npm test` 140/140 PASS locally and PR CI test job PASS. [Frontend CI run #36246088042](https://github.com/lelik112/parrot669/actions/runs/36246088042) completed SUCCESS after browser-smoke retry: 21/21 Chromium desktop, WebKit desktop, mobile emulation. The first mobile attempt had one no-navigation tap at the viewport bottom while scrolling (20/21); second attempt passed unchanged. This flaky signal remains for independent mobile web QA; not proof of real iPhone Safari. Cloudflare commit preview deployed; read-only production smoke on `parrot669.com` after merge showed new Search container and guest login, Host guest state, Messages guest login and back → Search, with saved search state restored. Signed-in production logout, expired session, property save and actual mobile tap are not claimed as manually verified.

**Status / next:** in review; Никита / Regression QA to check four languages, keyboard/compact width and signed-in/anonymous/expired navigation, Search logout, Host profile/property edit/save and Messages deep link on two QA origins. Борис retains critical auth/privacy acceptance. PM-041 owns real Safari. PM-050 may be scheduled in its separate scope after this merge; no shared-header work from it.
