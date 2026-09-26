# BUG-023 — Имя хозяина не сохраняется

**Title:** сохранение публичного имени в кабинете показывает Not found.
**Status:** in review — PR #46 authenticated save/reopen PASS on both origins; anonymous 401 and public privacy acceptance remain open. **Priority:** P1.
**Owner:** Денис / Developer; QA Борис. **Developer claim:** 2026-09-25 14:19 UTC.
**Agent:** Борис. **Role:** QA. **Scope:** независимый live acceptance PM-021; код не менялся.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** сопоставить опубликованный frontend route, backend API и сессию, затем подтвердить сохранение и ошибку в UI. **Model check:** будущий Developer до реализации.

## Steps to reproduce

1. Войти в PARROT под тестовым аккаунтом qa и открыть кабинет владельца.
2. В поле «Публичное имя хозяина» заменить исходное Qa на Qa PM-021 test.
3. Нажать «Сохранить имя» и дождаться ответа интерфейса.
4. Перезагрузить страницу.

## Actual behavior

Возле формы появляется alert «Not found». После перезагрузки поле снова содержит Qa; новое имя не сохранено.

## Expected behavior

После сохранения интерфейс подтверждает новое имя, а перезагрузка показывает его. При отказе серверной операции ошибка объясняет причину и не выдаёт сохранение за успешное.

## User impact

Владелец не может исправить имя, которое видят гости. Основное редактирование PM-021 не работает в проверенном аккаунте.

## Evidence / limits

- 2026-09-25 14:02 UTC, production desktop Chrome, аккаунт qa: сценарий воспроизведён на parrot669.com и parrot669.cheltsov112.workers.dev.
- В обоих случаях виден alert «Not found»; после reload отображается исходное Qa. Повтор на основном домене дал тот же результат.
- Данные не изменились; тестовый ввод сброшен перезагрузкой и исходное значение восстановлено.
- Статус HTTP и первопричина не установлены; другие аккаунты и mobile ещё не проверены. Не приписывать ошибку конкретному слою до диагностики.

## Next

Борис повторяет под qa сохранение имени → reload на обоих origins, затем пустое имя/400, отсутствие сессии/401 и отсутствие приватных полей в публичном профиле. Статус done только после независимой QA.

**Related task:** PM-021.

## Discussion / Updates

- 2026-09-25 14:19 UTC — **Agent:** Денис. **Role:** Developer. **Scope:** BUG-023, только Worker route для PATCH /api/host/profile и тест proxy; backend/profile semantics не менять. **Model check:** Sol / Medium достаточно для локализованной диагностики и route fix. **Change:** claim по прямому поручению Алексея. Сверил frontend и backend main: Worker не пропускает PATCH /api/host/profile и для host путей убирает /host при proxy, тогда как backend ожидает /api/host/profile. **Related task:** BUG-023 / PM-021. **Next:** узкая правка proxy и тест на обоих origins, PR, релиз и QA Бориса.

- 2026-09-25 14:26 UTC — **Agent:** Денис. **Role:** Developer. **Change:** root cause подтверждён: Worker отвечал 404 на PATCH /api/host/profile до proxy; общий rewrite /api/host/* → /api/* также отправил бы запрос на несуществующий /api/profile. Добавлены точечный allowlist и upstream /api/host/profile, тест на production и QA origins. Frontend [PR #45](https://github.com/lelik112/parrot669/pull/45) merged в main (`ff75502`), Frontend CI success, локально npm test 130/130 и git diff --check PASS. Без сессии оба живых адреса теперь возвращают 401 `authentication required`, а не 404: parrot669.com и parrot669.cheltsov112.workers.dev. **Related task:** BUG-023 / PM-021. **Next:** Борис / QA проводит authenticated save → reload на qa, 400/401/privacy, затем закрывает BUG-023 и PM-021 по результатам. Авторизованное сохранение в моей сессии не проверено.

- 2026-09-25 14:33 UTC — **Борис / QA, independent retest after PR #45:** `qa` on `https://parrot669.com/host#host-profile`, changed `Qa` to `Qa PM-021 test` and clicked Save. UI alert `Not found`; after navigation search→Host field returned `Qa`. On `https://parrot669.cheltsov112.workers.dev/host#host-profile` signed in as `lelik`, changed `lelik` to `lelik QA PM-021 test`; same `Not found`, after Messages→Host field returned `lelik`. Both account sessions intact; test data not persisted. Authenticated path remains broken despite unauthenticated 401 smoke. HTTP status/root cause not asserted. **Assigned:** Денис / Developer (existing claim); Борис / QA retests after next fix. **Related task:** BUG-023 / PM-021.

- 2026-09-25 14:49 UTC — **Agent:** Денис. **Role:** Developer. **Scope:** узкое исправление frontend вызова профиля и тест полного URL; Worker/backend не менять. **Model check:** Sol / Medium достаточно. **Change:** повторная диагностика после QA FAIL: `host.js api()` уже добавляет `/api/host`, а save передаёт `/host/profile`, из-за чего реальный путь `/api/host/host/profile`. Старый UI mock срезал один префикс и скрывал баг. **Related task:** BUG-023 / PM-021. **Next:** исправить аргумент на `/profile`, усилить тест абсолютным путём, PR/CI/live и повторная QA.

- 2026-09-25 14:53 UTC — **Agent:** Денис. **Role:** Developer. **Change:** [PR #46](https://github.com/lelik112/parrot669/pull/46) merged (`bef2251`), `host.js` now calls `api("/profile")` so request path is exactly `/api/host/profile`; UI test asserts full URL (130/130 local PASS, PR CI success). **Related task:** BUG-023 / PM-021. **Deployment evidence:** immediately after merge both live origins still serve old `host.js` with `api("/host/profile")`; authenticated save remains expected to fail until Cloudflare publishes new asset. **Next:** verify deployed JS contains `api("/profile")`, then Boris retests authenticated save/reload and 400/401/privacy. Do not close based on merge alone.

- 2026-09-25 ~14:55 UTC — **Agent:** Денис. **Role:** Developer. **Change:** live asset on `parrot669.com` and `parrot669.cheltsov112.workers.dev` now contains `api("/profile")` (cache-busted GET, observed line 526); Worker already routes resulting `PATCH /api/host/profile` to backend. **Related task:** BUG-023 / PM-021. **Next:** Борис / QA repeats authenticated save → reload on both origins, empty name/400, unauthorized/401 and public privacy; only then mark done. No credentials were used in my live check.

- 2026-09-25 ~15:21 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Cloud Chrome; main origin authenticated `qa`, QA Worker authenticated `lelik`. **Change:** PASS for original defect after PR #46. On main, changed public name `Qa`→`Qa PM-021 retest`, UI showed “Имя хозяина сохранено”, navigated Search→Host and saw the changed name; restored `Qa` and verified after another navigation. On QA Worker, changed `lelik`→`lelik PM-021 retest`, saw success, navigated Messages→Host and saw changed value; restored `lelik` and verified. No `Not found`. A whitespace-only value triggered native required-field validation in the main browser before API submission; revisiting Host retained `Qa`. **Open:** direct backend invalid/400, anonymous/401 and public-profile privacy not independently proven in this pass. **Assigned:** Денис / Developer (fix); Борис / QA acceptance. **Related task:** BUG-023 / PM-021.


## Boris negative/privacy follow-up result — 2026-09-26 13:57:39 UTC

**Agent:** Борис. **Role:** QA Lead / Acceptance QA. **Wake ID:** `BUG-023-BORIS-PRIVACY-20260926-1357`. **Source:** workflow next-ready rule after PM-049 privacy FAIL; [PM-049 result](PM-049-shared-shell-host-cleanup.md). **Related task:** BUG-023 / PM-021.

**Model check:** карточка рекомендует Sol / Medium; подтверждённый дефолт Бориса Sol 4/6 достаточен, повышение не требуется.

**Scope / environment:** оставшийся независимый anonymous 401/privacy acceptance на production canonical и QA Worker; authenticated save/reopen уже PASS в предыдущем Boris evidence и не повторялся без безопасной сессии. Код и данные не менялись.

**PASS — unauthenticated write rejection.** Выполнен один anonymous `PATCH /api/host/profile` с безопасным тестовым body на каждом origin: `https://parrot669.com` и `https://parrot669.cheltsov112.workers.dev`. Expected: 401 до обработки профиля, без изменения данных. Actual: оба ответа HTTP 401 с `authentication required`; сессии/cookies не передавались.

**PASS — public privacy.** В anonymous canonical Search сохранённый live-запрос Barcelona 2027-06-11→14 показал карточку с публичным owner name `lelik`, но без email, account login или private host fields. Anonymous Host на обоих origin показывает только login/register shell и не возвращает профиль/объект. Полный email в evidence не публикуется.

**Result: PASS for remaining BUG-023 scope.** В совокупности с прежним authenticated save→navigate→reopen→restore PASS на обоих origin исходный Not found не воспроизводится, anonymous 401 и public privacy подтверждены. Рекомендация Марку: закрыть BUG-023; отдельный BFCache/history privacy FAIL после logout относится к PM-049 и не переоткрывает route fix BUG-023.

