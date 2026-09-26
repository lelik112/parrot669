# BUG-022 — Возврат в кабинет сбрасывает позицию страницы

**Title:** после перехода в «Сообщения» кабинет владельца возвращается не к прежнему месту.
**Status:** in review / production released — PR #66 и main CI зелёные, новый asset доступен на двух origins; независимый production-ретест Бориса ожидается. **Priority:** P2.
**Owner:** Игорь / Developer — implementation/release complete 2026-09-26; QA: Борис. **Developer claim:** complete, handoff sent.
**Agent:** Борис. **Role:** QA. **Scope:** live-проверка Host → Messages → Host; код и данные объекта не менялись.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** нужно исследовать сохранение и восстановление UI-контекста при переходе между двумя страницами после выпуска исправления BUG-016. **Model check:** будущий Developer до реализации.

## Steps to reproduce

1. Авторизоваться в desktop Chrome под владельцем, открыть /host.html и развернуть существующую карточку объекта.
2. Прокрутить страницу до низа (window.scrollY = 2678, высота документа 3614 px, viewport 936 px).
3. Через верхнюю навигацию открыть «Сообщения».
4. Из «Сообщений» нажать «Владельцам».

## Actual behavior

На повторном проходе страница кабинета открылась с window.scrollY = 0 вместо 2678. Карточка осталась раскрытой, но позиция страницы потерялась. На первом проходе после возврата получено scrollY = 2249; после ожидания значение не изменилось. Следовательно, контекст позиции не восстанавливается стабильно.

## Diagnosis and restoration rule

Кабинет сохранял корректные `scrollY` и раскрытые property IDs, но восстанавливал позицию один раз сразу после синхронного `renderProperties()`. В этот момент асинхронные address/calendar widgets ещё могли менять высоту документа; браузер ограничивал `scrollTo(2678)` временным максимумом 2249 (либо последующая загрузка оставляла начало страницы), повторной попытки не было.

Исправление в течение не более трёх секунд повторяет восстановление при стабилизации layout: до достижения целевой позиции используется текущий доступный максимум. Любой wheel/touch/pointer/keyboard input немедленно отменяет retry. Если итоговая страница объективно короче, остаётся ближайшая достижимая позиция. Контекст по-прежнему одноразовый, привязан к текущему account и создаётся только при Host → Messages.

## Expected behavior

Возврат в той же вкладке и с той же сессией сохраняет выбранный объект, его раскрытое состояние и прежнюю позицию страницы.

## User impact

Владелец теряет место в длинной форме объекта и календаре, вынужден искать нужную секцию заново и может принять переход за потерю состояния.

## Evidence / limits

- 2026-09-25, production desktop Chrome, аккаунт qa; проверено отдельно на parrot669.cheltsov112.workers.dev и parrot669.com.
- Worker origin: при возврате после глубокой прокрутки получено scrollY=0; повторяемость неполная: один ранний проход вернулся на 2249 из 2678.
- Основной домен: после подтверждённого исходного scrollY=2678 повторный возврат дал scrollY=0.
- Раскрытая карточка сохранялась; поля не редактировались и не сохранялись, данные объекта не менялись.
- Это live-наблюдение UI; причина в коде не установлена. Относится к ранее исправленному возврату BUG-016 и требует проверки после его выпуска.

## Acceptance / boundaries

- После Host → Messages → Host в той же вкладке раскрытый объект и прежняя глубокая позиция доступны после завершения загрузки кабинета; допустима близкая позиция при изменённой высоте страницы, без скачка к началу.
- Повторить сценарий на desktop для двух указанных origins; проверить возврат без глубокой прокрутки и обычное обновление страницы.
- Если дефект зависит от изменения высоты/содержимого, описать воспроизведение и выбранное правило восстановления до реализации. Борис делает независимый ретест.
- Scope: UI навигации/восстановления scroll кабинета; не затрагивать PM-038 (несохранённые черновики), auth, API, календарные данные и реальные мобильные проверки PM-015.

## Next

Борис повторяет сценарий на обоих production origins, включая неглубокий возврат и обычный reload; touch отдельно остаётся в PM-015. Игорь возвращается только при воспроизводимом FAIL.

**Related task:** PM-020 / BUG-016 / PM-015.


## Discussion / Updates

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Change:** по поручению Алексея назначил Игорю следующий свободный dev слот BUG-022, P2; assignment не равен claim. **Scope:** только возврат scroll в Host после Messages, без работы Дениса над PM-040 и без PM-038. **Recommended model/reasoning:** Sol / Medium. **Related task:** BUG-022 / PM-020. **Next:** Игорь подтверждает claim и проводит диагностику; Борис принимает после выпуска.

- 2026-09-26 08:16:24 UTC — **Agent:** Игорь. **Role:** Developer. **Wake ID:** `BUG-022-IGOR-ASSIGN-20260926-0814`. **Developer claim:** беру BUG-022 в согласованном P2 scope: только восстановление глубокой позиции Host после перехода Messages → Host, без PM-038, auth/API/calendar/mobile и без тестовой работы Дениса в PM-040. Свежие status/task/D017/PM-040 сверены; Денис работает в Playwright fixture/coverage и отдельно отметил BUG-022 вне своего scope, конфликта claim нет. **Model check:** Sol / Medium достаточно для узкой frontend-диагностики и исправления. **Next:** воспроизвести логику на обоих origins по коду/доступному UI, добавить регрессионные проверки, выпустить через CI и передать Борису независимый ретест. **Related task:** BUG-022 / PM-020.

- 2026-09-26 — **Agent:** Игорь. **Role:** Developer. **Change:** диагностика подтвердила timing/layout race: сохранённая позиция была корректной, но одноразовый `scrollTo` выполнялся до позднего роста Host layout и зажимался временным max scroll. Подготовлено bounded retry до трёх секунд с немедленной отменой при пользовательском вводе; обычная навигация и другие состояния не меняются. Добавлен unit regression 1200 px → 3614 px → `scrollY=2678`; локально `npm test` PASS 137/137, `npm run test:e2e -- --list` обнаруживает 18 сценариев. Фактический browser run локально BLOCKED отсутствующим Playwright Chromium executable; это известное ограничение среды, CI должен выполнить browser-smoke. **Next:** PR CI, merge/release, затем handoff Борису на два origins. **Related task:** BUG-022 / PM-020.

- 2026-09-26 08:28 UTC — **Agent:** Игорь. **Role:** Developer. **Release:** [PR #66](https://github.com/lelik112/parrot669/pull/66) merged as `844bb63`. PR CI [36229648159](https://github.com/lelik112/parrot669/actions/runs/36229648159) PASS; main CI [36229732675](https://github.com/lelik112/parrot669/actions/runs/36229732675) PASS (137 unit checks and 18 browser scenarios). Live asset smoke found `restoreHostScroll` on both `https://parrot669.com/assets/host.js` and `https://parrot669.cheltsov112.workers.dev/assets/host.js`. **Handoff:** Борису — same-tab desktop Host → Messages → Host on both origins, deep and shallow positions plus ordinary reload; record exact before/after `scrollY`. **Related task:** BUG-022 / PM-020.

- 2026-09-26 08:35:37 UTC — **Agent:** Борис. **Role:** QA Lead / Acceptance QA. **Wake ID:** `BUG-022-BORIS-RETEST-20260926-0831`. **Source:** [PR #63 comment #5844625041](https://github.com/lelik112/parrot669/pull/63#issuecomment-5844625041). **Claim / scope:** independent desktop production retest только BUG-022; same-tab Host → Messages → Host, deep/shallow position, раскрытая карточка и одноразовый return-контекст. Данные не редактировал; PM-038, mobile/touch, auth/API/calendar вне scope.

  **Environment:** Cloud Browser / Chrome, desktop viewport `936 px`, две production origins, существующие авторизованные owner-сессии; одна вкладка на origin.

  **Result: PASS.** Подтверждённый BUG-022 после release `844bb63` не воспроизводится.

  - `parrot669.com`, deep: Host с раскрытой карточкой, document `3614 px`, target/max `scrollY=2678`; после Messages → Host и полной стабилизации layout — `2678 → 2678`, карточка раскрыта.
  - `parrot669.com`, shallow: `619 → 619`, карточка раскрыта. Обычный reload после возврата, выполненный из `scrollY=0`, оставил `0 → 0` и не применил использованный deep/shallow return-контекст повторно.
  - `parrot669.cheltsov112.workers.dev`, deep: document `4349 px`, max `scrollY=3413`; после Messages → Host — `3413 → 3413`, карточка раскрыта.
  - Worker origin, shallow: `891 → 891`, карточка раскрыта. Обычный reload из `scrollY=0` оставил `0 → 0`; старый return-контекст не восстановился повторно.

  **Expected / actual:** на обоих origins глубокая и неглубокая позиции восстановились точно после завершения асинхронного layout; раскрытое состояние сохранилось при Host → Messages → Host; reload не переиспользовал одноразовый контекст. **Blockers / defects:** нет. **Next:** Марк может принять BUG-022; Игорю возвращаться не требуется. **Related task:** BUG-022 / PM-020.



- 2026-09-26 08:32 UTC — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `BUG-022-IGOR-RELEASE-20260926-0831`. **Source:** [PR #60 comment #5844625117](https://github.com/lelik112/parrot669/pull/60#issuecomment-5844625117). **PM review:** release Игоря соответствует согласованному BUG-022 scope: PR #66 merged как `844bb63`, PR/main CI PASS, новый asset виден на обоих production origins. [Адресный handoff Борису #5844625041](https://github.com/lelik112/parrot669/pull/63#issuecomment-5844625041) содержит оба origins, deep/shallow scroll, раскрытую карточку, reload, точные before/after `scrollY` и исключает PM-038/mobile. Конфликта scope и продуктовой развилки нет. **Status:** in review; dev complete, QA claim/result pending. **Next:** Борис подтверждает claim и делает независимый production-ретест; Игорь возвращается только при воспроизводимом FAIL. **Related task:** BUG-022 / PM-020.
