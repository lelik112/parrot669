# BUG-020 — Новое сообщение не выделяется во входящих

**Title:** ясно показывать непрочитанное сообщение в списке диалогов и пункте «Сообщения».
**Status:** in review — первичный запрос unread в скрытой вкладке исправлен в PR #53; повторная живая проверка глобального badge и iPhone Safari остаются открытыми. **Priority:** P2.
**Owner:** Денис / Developer; QA: Борис.
**Agent:** Денис. **Role:** Developer. **Scope:** индикация непрочитанного и исходное отображение строки диалога; не менять правила доступа, отправки или блокировок сообщений.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** root cause пока неизвестен; нужно пройти цепочку unread API → polling → состояние строки/вкладки, сохранив текущую семантику прочтения.

## Goal

Хозяин сразу замечает новое сообщение и понимает состояние диалога, не открывая каждый диалог наугад.

## Problem

Во время двухаккаунтной проверки PARROT гость отправил сообщение хозяину. У хозяина появился диалог, но Алексей не увидел признака нового сообщения ни у пункта «Сообщения», ни в строке диалога. Строка выглядела неаккуратно до открытия; после нажатия на неё вид становился понятнее. Без явного непрочитанного состояния хозяин может пропустить обращение, а гость — не понимать, дошло ли оно.

## User

Хозяин, получающий первое обращение от гостя; гость, ожидающий ответа.

## Context

Это наблюдение относится к видимости новых сообщений, отдельно от доступности CTA и создания первого диалога в [PM-024](PM-024-contact-from-every-search-result.md). Результат проверен владельцем продукта на iPhone Safari; точная версия iOS/Safari не записана.

В текущем frontend исходный код содержит скрытый элемент счётчика `data-msg-unread`, строка диалога может показывать `unreadCount`, а список опрашивается периодически. Наличие этих элементов в коде не доказывает, что production-состояние отображается при получении нового сообщения; разработчику нужно проверить фактические ответы API, тайминг обновления и DOM/CSS.

## Requirements

- После получения непрочитанного сообщения пункт «Сообщения» показывает заметный, доступный по контрасту индикатор или счётчик.
- Строка диалога до открытия явно отмечена как непрочитанная и показывает достаточный контекст: объект, собеседника и последнее сообщение.
- Исходная строка не выглядит сломанной или незаполненной; открытие диалога меняет состояние прочтения, а не внезапно достраивает основное содержимое.
- Уточнить и сохранить согласованную семантику: когда сообщение считается прочитанным и когда снимается индикатор.
- Индикатор обновляется без ручного перезапуска страницы в пределах согласованного интервала опроса.
- Не помечать собственные отправленные сообщения как новые входящие для того же пользователя.
- Проверить desktop и iPhone Safari, а также RU/EN/ES/CA.
- Сохранить приватность текста сообщения и существующие ограничения доступа.

## Acceptance criteria

- [ ] Новое входящее сообщение даёт видимый индикатор у пункта «Сообщения».
- [ ] Непрочитанная строка заметна до её открытия и содержит корректные данные.
- [ ] После открытия/прочтения состояние обновляется предсказуемо и не возвращается без нового входящего сообщения.
- [ ] Список обновляется без ручного refresh; измеренный интервал и среда QA записаны.
- [ ] Собственные сообщения не вызывают ложное непрочитанное состояние.
- [ ] RU/EN/ES/CA и desktop/iPhone Safari проверены.

## Alternatives

Оставить только появление диалога в списке; полагаться только на email; обновлять unread-состояние лишь после ручного обновления.

## Rejected

Автоматически открывать входящий диалог без действия пользователя; показывать текст сообщения вне авторизованного inbox; менять правила контакта, доступности объекта или блокировок.

## Dependencies

[PM-024](PM-024-contact-from-every-search-result.md), messaging API и существующие правила read/unread. Игорь ведёт [PM-027](PM-027-open-property-from-messages.md) с изменениями Messages UI. Денис начинает с диагностики; до handoff/merge PM-027 не менять общие файлы `messages.js`, `messages.html` и `messaging-common.js`, если Игорь не подтвердит непересекающийся участок.

## Evidence

- 2026-09-25 — Борис / production desktop Cloud Chrome, `qa` → `lelik` test thread: after first incoming message, the Messages navigation badge showed 1 unread and the inbox row showed “Не прочитано” plus count 1. The badge appeared without manual reload in about 17 seconds (the task’s polling interval is 30 seconds). Opening the conversation removed the unread marker; the owner reply did not create a false unread for the owner. Row retained object title, interlocutor and latest preview before opening. Desktop flow PASS; iPhone Safari and RU/EN/ES/CA not retested.

- **Среда:** owner-assisted тест Алексея, iPhone Safari, 2026-09-25; пользователь был залогинен под `lelik112`, собеседник — тестовый аккаунт Минкс.
- **Наблюдение:** после отправки сообщения с поиска диалог появился у хозяина. Алексей подтвердил отсутствие признака нового сообщения на пункте «Сообщения» и в самой строке диалога. Он сообщил, что строка выглядит плохо до открытия и становится лучше после клика. Скриншотов нет по предпочтению пользователя.
- **Проверка исходного кода:** `public/messages.html` содержит скрытый слот `data-msg-unread`; `public/assets/messages.js` показывает badge при `unreadCount` у строки; `public/assets/messaging-common.js` опрашивает суммарное число непрочитанных. Причина расхождения между ожидаемым и наблюдаемым production UI пока не установлена.
- **Ограничение QA:** Борис не имеет браузерной сессии под аккаунтом хозяина `lelik112`; входящее наличие и вид на устройстве подтверждены владельцем продукта.

- 2026-09-25 ~10:37 UTC — **Борис / QA:** после релиза PR #35 проверил production desktop Cloud Chrome на `parrot669.com/messages` под `lelik`: список из двух уже существующих диалогов отображает объект, собеседника и preview, при отсутствии новых входящих нет ложного unread-индикатора. Исходный iPhone Safari кейс `lelik112` с новым входящим не воспроизводился: у Бориса нет управляемого второго авторизованного аккаунта; второй origin PM-029 пока выдаёт `Could not connect` на `/messages`. Поэтому нельзя подтвердить новый бейдж, состояние строки до открытия, снятие индикатора после прочтения и 15/30-секундное обновление. Задача остаётся `in review` (Денис / Developer; QA Борис); живой двухаккаунтный прогон после разблокировки PM-016, iPhone Safari — отдельно.

## Discussion / Updates

- 2026-09-25 — **Борис / QA:** зафиксировано owner-assisted наблюдение во время проверки PM-024. Контакт, создание диалога и отправка гостем прошли; видимость непрочитанного и исходный вид строки остаются открытыми. Не назначено, потому что разработчик ещё не подтвердил claim. **Next:** разработчик воспроизводит при новом входящем, проверяет API unread count, получение inbox, polling и стили строки; затем Борис повторяет критерии на desktop/iPhone Safari.


### PM review and assignment — 2026-09-25

- **Agent:** Марк / Product Manager. **Change:** симптом подтверждён владельцем на iPhone Safari: новое входящее приводит к появлению диалога, но хозяин не видит unread-сигнал ни на вкладке, ни в строке списка. Это проблема discoverability/read-state presentation; создание и отправка диалога в тесте прошли. Оставляю P2: диалог доступен, а факт влияния на долю ответов пока не измерен; повысить приоритет при подтверждении пропущенных обращений или неработающих email notifications.
- **Assignment:** Денису поручена диагностика, так как он освободился после PM-028. Claim и Model check Sol / Medium пока ожидаются от него. В начале проверить действительные ответы unread API и polling interval, затем состояние DOM/CSS до и после открытия треда. Не менять read semantics, приватность, messaging backend или rate limits в рамках минимального UI fix без отдельного решения.
- **Coordination:** PM-027 Игоря ещё в работе и пересекается по Messages frontend. Диагностику можно вести сейчас; изменения общих файлов — после handoff PM-027 или явного согласования с Игорем.
- **Next:** Denis records claim/model check, confirms exact files with Igor, reproduces the owner-assisted case, then implements smallest fix and hands off to Boris for desktop/iPhone Safari QA.

- 2026-09-25 08:30 UTC — **Денис / Developer:** беру BUG-020 по прямому поручению Алексея. **Agent:** Денис. **Role:** Developer. **Scope:** frontend presentation пункта Messages и строки inbox, чтение существующего unread API/polling, без backend/read semantics или PM-027 deep link. **Model check:** Sol / Medium достаточно для сквозной диагностики и узкой UI-правки. **Change:** claim, статус in progress. **Related task:** BUG-020. **Branch:** `denis/bug020-unread`. PM-027 Игоря уже merged/in review ([PR #33](https://github.com/lelik112/parrot669/pull/33)); общие файлы доступны после её handoff. **Найдено:** мобильная активная вкладка и бейдж имеют одинаковый лаймовый фон; строка с unreadCount не имеет общего unread-оформления. Backend SQL считает лишь входящие выше read sequence, frontend опрашивает inbox раз в 15 секунд и общий unread раз в 30 секунд; прочтение подтверждается только при видимой истории в фокусе и прокрутке вниз. **Следующий шаг:** проверить live DOM/API, добавить явное состояние строки и контрастный badge без изменения read semantics; затем тесты и QA Бориса.
- 2026-09-25 08:36 UTC — **Денис / Developer:** исправил presentation: у мобильной активной вкладки теперь тёмный контрастный бейдж на лаймовом фоне; у строки inbox отдельные фон/рамка/метка «Не прочитано», счётчик и доступная подпись, длинный preview обрезается в границах строки. Polling остаётся 15 секунд для inbox и 30 секунд для общего счётчика; read acknowledgement не менял. **Agent:** Денис. **Role:** Developer. **Change:** frontend CSS/JS и UI regression на новый входящий → опрос → read state, self-sent без ложной отметки, RU/EN/ES/CA. **Related task:** BUG-020. **Checks:** `npm test` 125/125 PASS, `git diff --check` PASS. **Ограничение:** живого unread-ответа аккаунта хозяина `lelik112` в моей сессии нет; исходный iPhone Safari симптом и реальный API/DOM на нём должен перепроверить Борис вместе с владельцем. **Следующий шаг:** PR/CI/Cloudflare и доступный live smoke, затем независимая QA.
- 2026-09-25 08:38 UTC — **Денис / Developer:** frontend [PR #35](https://github.com/lelik112/parrot669/pull/35) слит в `main` (`9058414`); PR/main frontend CI и Cloudflare Workers production build `174a843f-111f-4309-b498-92115cadbef2` — SUCCESS. **Agent:** Денис. **Role:** Developer. **Change:** релиз, статус in review. **Related task:** BUG-020. **Checks:** 125/125 локальных тестов, CI и build зелёные; живой ответ unread API хозяина и UI на iPhone в этой сессии не проверены, критерии acceptance остаются открытыми. **Handoff Борису / QA:** в двух независимых сессиях отправить первое сообщение гостем и зафиксировать `/api/messaging/unread` и `unreadCount` в inbox у хозяина до открытия; проверить контраст бейджа на активной вкладке и строку на desktop/iPhone Safari, 15/30-секундные циклы, состояние после read, собственный ответ без новой отметки, длинные название/preview и RU/EN/ES/CA. Для точного повторения исходного кейса `lelik112` понадобится owner-assisted проверка; тестовыми двумя аккаунтами можно пройти сценарий самостоятельно.

- 2026-09-25 ~14:43 UTC — **Борис / QA:** prepared Worker `lelik` inbox on another conversation to measure polling for new `qa` message. The main-origin `qa` session had become anonymous before sending; composer was absent and no test message was sent. Therefore no new 15/30-second unread observation from this attempt. Prior desktop unread PASS remains valid; original iPhone Safari symptom and cross-language repeat remain open. **Related task:** BUG-020 / PM-016. **Owner:** Денис / Developer; QA Борис.

- 2026-09-25 15:22–15:24 UTC — **Agent:** Борис. **Role:** QA. **Scope:** two authenticated accounts in desktop Cloud Chrome; main `qa` guest, QA Worker `lelik` owner. **Change:** with owner inbox open on *another* conversation, guest sent a new message at 15:22:43 UTC. Without owner reload, by 15:23:06 UTC global Messages link showed `1 непрочитанное сообщение`; QA listing row showed correct object, sender Qa, preview, “Не прочитано” and count 1. Clicking that row opened exact conversation with new message and removed unread markers. Owner sent a reply; own outgoing did not add unread for owner. Production polling observed within ~23 seconds end-to-end (includes tool execution); precise server timing not asserted. **PASS:** repeat desktop auto-refresh/read/self-send. **Open:** original iPhone Safari/contrast and full language repeat. **Related task:** BUG-020 / PM-003. **Owner:** Денис / Developer; QA Борис.

- 2026-09-25 ~18:55–18:57 UTC — **Борис / QA — FAIL повторного прогона badge.** Main `qa` отправил одно тестовое сообщение `lelik` в существующий диалог QA-объекта; в логе гостя оно появилось, у `lelik` на QA Worker после открытия Messages строка этого диалога получила `1 непрочитанное сообщение`, `Не прочитано` и корректный preview. При этом глобальный пункт «Сообщения» оставался без цифры и без aria-label о непрочитанном как до перехода с Host, так и на загруженной Messages странице с непрочитанной строкой; DOM видимого nav содержит скрытый `messaging-badge`. Это **противоречит успешному прогону в 15:23 UTC**, значит поведение непостоянно или зависит от состояния навигации/refresh; причины не установлены. Попытки переключить язык/открыть другой тред через browser UI завершились selector deadline, сообщения дополнительно не отправлял. **Статус in review, требуется расследование Дениса и ретест**, native iPhone отдельно PM-039. Тестовое входящее оставлено непрочитанным для диагностики.

- 2026-09-25 ~19:00 UTC — **Agent:** Денис. **Role:** Developer. **Scope:** диагностика global Messages unread badge при непрочитанной строке inbox, минимальная frontend правка и regression; без изменения backend/read semantics, доступа и PM-027. **Model check:** Sol / Medium достаточно для цепочки API → session state → polling → DOM; при выходе в backend уточню scope отдельно. **Change:** возобновил BUG-020 по прямому поручению Алексея после QA FAIL 18:55–18:57 UTC. **Related task:** BUG-020. **Next:** воспроизвести состояние глобального badge при активном unread, найти причину рассинхронизации и передать исправление Борису.

- 2026-09-25 ~19:05 UTC — **Денис / Developer:** воспроизвёл отдельный источник рассинхронизации: если Messages стартует при `document.visibilityState === 'hidden'`, inbox загружает строку `unreadCount:1`, но первичный `/api/messaging/unread` пропускается и глобальный badge остаётся скрытым. Та же `setUser`/badge логика работает на Host. Регрессия сначала падала (`true !== false` у hidden badge), затем прошла после изменения. Начальный запрос теперь разрешён для скрытой вкладки; периодический 30-секундный polling по-прежнему паузится в фоне. **Agent:** Денис. **Role:** Developer. **Change:** frontend [PR #53](https://github.com/lelik112/parrot669/pull/53) слит в `main` (`72c4274`), frontend CI PASS; `npm test` 131/131 PASS и `git diff --check` PASS. **Related task:** BUG-020. **Ограничение:** точная причина живого FAIL Бориса 18:55–18:57 ещё не доказана, поскольку ответ `/api/messaging/unread` и visibility state тогда не зафиксированы. **Handoff Борису / QA:** с оставленным непрочитанным входящим `qa` → `lelik` проверить Host и Messages на QA Worker, записать ответ `/api/messaging/unread`, `document.visibilityState`, состояние nav badge и inbox row; затем повторить после новой отправки и read. Native iPhone отдельно PM-039. До живого PASS не закрывать BUG-020.

- 2026-09-25 ~19:22 UTC — **Борис / QA — ретест после PR #53 (`72c4274`).** В QA Worker под `lelik` сохранилось тестовое непрочитанное от `qa`: строка диалога показывает `1 непрочитанное сообщение`, preview и «Не прочитано». На загруженной Messages странице глобальная ссылка показывает `Сообщения, 1 непрочитанное сообщение` и видимую цифру `1`; после перехода в Host и загрузки данных та же единственная глобальная ссылка показывает счётчик `1`. `document.visibilityState` в обоих наблюдениях был `hidden`; значит первичный badge появился и в скрытой вкладке, где до исправления был пропущен. **PASS узкого регрессионного сценария hidden initial load.** Прямой просмотр `/api/messaging/unread` через управляемый браузер заблокирован `net::ERR_BLOCKED_BY_CLIENT`, тело ответа не подтверждено; попытка открыть диалог для read завершилась browser `Input.dispatchMouseEvent timed out`, состояние оставлено непрочитанным. Новое входящее после релиза, read/clear, четыре языка и реальный iPhone Safari этим проходом **не подтверждены**. Статус in review, owner Денис, QA Борис; следующая проверка — foreground/new incoming/read и native iPhone отдельно PM-039.

- 2026-09-25 ~19:58 UTC — **Борис / QA — дополнительная попытка read/clear по просьбе Алексея.** Открыл точный URL существующего QA-диалога `94a03a34-2177-4386-ac01-7b7fd6324b30` в Worker под владельцем `lelik`: сообщение отображается в истории, строка inbox и глобальная вкладка по-прежнему показывают `1 непрочитанное`. В управляемом Chrome `document.visibilityState=hidden` даже у выбранной вкладки; по действующему правилу read acknowledgement выполняется лишь при видимой истории в фокусе, поэтому простое открытие URL не должно снимать unread. Вызов UI click для фокусировки вкладки завершился `Input.dispatchMouseEvent timed out`. **Итог:** hidden-load badge PASS; read/clear в foreground остаётся «Нужна проверка», не FAIL продукта. Исходное непрочитанное сохранено. Денису новая правка по этим данным не поручается; QA повторит при доступном foreground browser/touch, real iPhone — PM-039.
