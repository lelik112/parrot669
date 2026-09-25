# PM-027 — Открыть карточку жилья из Messages

**Title:** дать хозяину переход к своему объекту из диалога.
**Status:** in review — frontend опубликован; независимая QA Бориса открыта. **Priority:** P2.
**Owner:** Игорь / Developer; QA Борис.
**Agent:** Игорь. **Role:** Developer. **Scope:** owner-only переход Messages → конкретная карточка Host → тот же диалог; frontend и UI-тесты, без backend, публичной карточки и PM-028.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** надо сохранить conversation context и открыть правильный объект без путаницы между несколькими объявлениями и приватным/публичным представлением.

## Goal

Хозяин может из связанного диалога открыть карточку именно того жилья, о котором идёт переписка.

## Problem

В заголовке диалога видны название жилья и собеседник, но название не даёт хозяину очевидного перехода к карточке объекта.

## User

Владелец PARROT, отвечающий гостю по одному из своих объектов.

## Value

Хозяин быстро сверяет запрос гостя с нужным жильём и не ищет объект вручную в кабинете.

## Solution

Сделать название жилья/контекст объекта в треде доступным переходом к карточке этого же объекта в Host; вернуться в тот же диалог можно штатной навигацией Messages. Публичный просмотр гостя не расширять этой задачей.

## Requirements

- Для диалога, связанного с объектом, дать авторизованному владельцу понятное действие «Открыть объект».
- Маршрут выбирает ровно тот property ID, который закреплён за диалогом; не открывать последний редактировавшийся объект вместо нужного.
- Открыть соответствующую карточку владельца без автоматического изменения данных.
- Если объект удалён или недоступен, показать понятное read-only состояние; не подменять его другим объектом.
- Не раскрывать адрес или настройки владельца собеседнику-гостю.
- Сохранить историю, URL и возврат в исходный диалог; mobile и desktop.

## Acceptance criteria

- [ ] Владелец открывает правильную карточку жилья прямо из диалога на desktop/mobile.
- [ ] Гость не получает Host edit link или приватные поля.
- [ ] Переход/возврат не теряет сообщения, непрочитанное и состояние другого открытого диалога.
- [ ] Удалённый объект не вызывает ссылку на чужую/новую карточку.
- [ ] Переводы EN/ES/CA/RU доступны.

## Alternatives

Оставить объектный контекст только текстом; вернуть хозяина в список объектов без выделения нужной карточки.

## Rejected

Открытие последнего выбранного объекта наугад; передача приватного Host URL гостю; изменение карточки из сообщения без явного действия владельца.

## Success criteria

Хозяин находит связанный объект из треда без повторного поиска в своём кабинете.

## Not doing

Публичная карточка гостя, редактирование объекта из Messages, изменение модели сообщений или данных брони.

## Dependencies

[D009](../decisions/D009-host-cabinet-ia.md), PM-020 Host navigation и стабильный return context. Перед claim сверить PM-020/021 и текущий URL state.

## Evidence

До PM-027 в public/messages.html и public/assets/messages.js контекст треда выводил название объекта текстом (msg-property); отдельного owner action к карточке не было.

Реализация использует `hostProfileId` и nullable `propertyId` из существующего conversation DTO; Host раскрывает карточку только после загрузки owner dashboard. При удалении объекта Messages скрывает переход, а уже сохранённая ссылка Host показывает нейтральное состояние и безопасный путь обратно к диалогу. Возврат использует существующий URL `/messages.html?conversation=<id>` и не меняет отправку/read-состояние. [PR #33](https://github.com/lelik112/parrot669/pull/33) слит в main `55afe21`; локально 124/124 тестов, [PR CI](https://github.com/lelik112/parrot669/actions/runs/36111752836) и [main CI](https://github.com/lelik112/parrot669/actions/runs/36111839730) SUCCESS. Live `/messages.html`, `/host.html`, оба контроллера, общие тексты и CSS вернули 200 и совпали с merged source по SHA-256; независимый QA ещё открыт.

## Discussion / Updates

- 2026-09-24 — **Марк / Product Manager:** отделено от ссылки на профиль хозяина, чтобы QA проверял два конкретных назначения.
- 2026-09-25 — **Agent:** Игорь. **Role:** Developer. **Scope:** `public/assets/messages.js`, `messages.html`, `messaging-common.js`, `host.js`, `host.html`, относящиеся CSS/UI-тесты и handoff docs. **Change:** по поручению Алексея беру PM-027 на ветке `igor/pm027-message-property`. PM-023 уже merged/in review, PM-020/021 frontend выпущены, других активных claims на Messages/Host для этой задачи нет. Backend conversation DTO уже содержит `hostProfileId` и nullable `propertyId`; owner dashboard подтверждает принадлежность перед показом карточки. **Model check:** Sol / Medium достаточно для ограниченного frontend перехода и проверки owner/deleted/account boundary. **Related task:** PM-027. **Next:** добавить точный deep link, при недоступном объекте показать нейтральное состояние и возврат к диалогу; проверить mobile/desktop UI и CI.
- 2026-09-25 — **Agent:** Игорь. **Role:** Developer. **Change:** Денис выпустил PM-028 (собственный private profile), поэтому PM-027 rebase сделан на его frontend main. Профильный переход сохранён; при загрузке Host явный `propertyId` выигрывает у сохранённой позиции, а профильный deep link по `fromMessages=1#host-profile` остаётся рабочим. Для owner/deleted/guest и выбора между двумя объектами добавлены UI regression checks; после совмещения локально 124/124. **Related task:** PM-027. **Next:** обновить PR, дождаться CI/main и проверить production, затем независимый QA Бориса на desktop и mobile.
- 2026-09-25 — **Agent:** Игорь. **Role:** Developer. **Change:** выпущен [PR #33](https://github.com/lelik112/parrot669/pull/33), merged `55afe21`; [PR CI](https://github.com/lelik112/parrot669/actions/runs/36111752836) и [main CI](https://github.com/lelik112/parrot669/actions/runs/36111839730) зелёные. Все семь опубликованных HTML/JS/CSS файлов PM-027 совпали с этим исходным деревом по SHA-256. PM-028 сохранилась после rebase. **Related task:** PM-027. **Next:** Борису независимо проверить owner с двумя объектами, guest без ссылки, удалённый объект и возврат к диалогу на desktop/mobile; acceptance пока не закрыта.

- 2026-09-25 09:24 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Chrome, `lelik` как гость в существующем диалоге `Минкс` с хозяином `lelik112`; read-only. **Change:** PARTIAL PASS: у гостя в открытом треде не показывается действие открытия owner-карточки Host. Ссылка на редактирование чужого объекта в видимом интерфейсе отсутствует. **Открыто:** переход владельца к двум разным объектам, удалённый объект, возврат, mobile/touch и backend unauthorized отдельно не проверены — для них нужен второй доступный аккаунт/тестовое состояние. **Related task:** PM-027; PM-016. **Next:** после PM-029 пройти owner-side и return; статус in review.

- 2026-09-25 13:50 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production Worker origin, desktop Chrome, authenticated `qa`, existing guest conversation; read-only. **Change:** guest-side PASS: the thread shows no owner-only «Открыть объект» action or private Host edit link; only the global «Владельцам» navigation is present. No data changed. **Open:** host-side correct-property routing, deleted-object handling and return-to-thread remain unverified because this session is the guest side and `lelik` is unavailable; real mobile/touch also open. **Related task:** PM-027; PM-016. **Next:** owner-side checks require restoring `lelik`.

- 2026-09-25 ~14:25 UTC — **Agent:** Борис. **Role:** QA. **Scope:** desktop Cloud Chrome, QA Worker `lelik` as owner, main origin `qa` as guest. **Change:** owner conversation showed «Открыть объект ↗», opened `/host?property=1bba00dd-ade6-4860-af03-688ae7bd1eab&conversation=94a03a34-2177-4386-ac01-7b7fd6324b30`, with status «Это объект из вашего диалога» and expanded exact QA listing. «← Вернуться в диалог» returned to the same conversation with messages intact. Guest-side owner action absent as previously recorded. **Open:** second owned property, deleted object, real mobile/touch and language variants. **Related task:** PM-027. **Owner:** Игорь / Developer; QA Борис.

- 2026-09-25 ~14:40 UTC — **Борис / QA:** desktop keyboard on owner `lelik` Messages: Tab from conversation list reached «Открыть объект ↗» as a real focusable link (exact property/conversation URL), then profile link. Localized property action visible in all four languages: EN “Open property”, ES “Abrir vivienda”, CA “Obrir habitatge”, RU “Открыть объект”. Navigation and return on RU previously passed. **Open:** mobile, deleted object and second owner property.
