# PM-028 — Открыть профиль хозяина из Messages

**Title:** дать вошедшему хозяину переход к собственному профилю из Messages.
**Status:** in review — frontend выпущен; независимый host/guest и mobile QA открыт. **Priority:** P2.
**Owner:** Денис / Developer; QA Борис.
**Agent:** Денис. **Role:** Developer. **Scope:** frontend переход из Messages в собственный private Host Profile и возврат к тому же диалогу; без новых полей, API и публичного профиля.
**Recommended model:** Luna. **Recommended reasoning:** Low. **Reason:** переход в существующую профильную секцию, без новых данных и API.

## Goal

Хозяин может проверить и открыть свои данные профиля, не выходя из переписки и не теряя выбранный диалог.

## Problem

Из Messages есть общий переход For Hosts, но нет прямой точки входа к профилю хозяина. Владелец должен идти через кабинет и искать секцию профиля.

## User

Авторизованный хозяин PARROT, отвечающий гостю.

## Value

Быстрый доступ к собственному имени и другим разрешённым для редактирования полям профиля из контекста рабочего inbox.

## Solution

Добавить в Messages понятный переход к собственному приватному Host Profile и открыть его в Host console. Внутренний profile link виден только владельцу своей сессии.

## Requirements

- Показывать переход только аутентифицированному владельцу; гостю/участнику диалога не раскрывать private profile route/data.
- Открывать существующий Host Profile раздел, реализованный в PM-021; не дублировать поля в Messages.
- Сохранять выбранный диалог/URL и возвращать владельца в него после просмотра профиля.
- Не включать About, фото, Instagram, email, точный адрес или публичные контакты без отдельного решения и согласия.
- Поддержать mobile/desktop и RU/EN/ES/CA.

## Acceptance criteria

- [ ] Хозяин из активного Messages inbox открывает свой профиль и возвращается к тому же диалогу.
- [ ] Гостевая сессия не получает ссылку/данные private profile.
- [ ] Поля и права совпадают с PM-021; новых публичных полей нет.
- [ ] Выход/истечение сессии не восстанавливает приватный профиль другому аккаунту.
- [ ] Языки и keyboard/mobile navigation проверены.

## Alternatives

Оставить только общую ссылку For Hosts; копировать редактируемые поля в Messages.

## Rejected

Показывать владельцу свой приватный профиль как публичную гостевую карточку; раскрывать данные профиля собеседнику или создавать дублирующий редактор.

## Success criteria

Владелец находит свой профиль из inbox без потери контекста текущей переписки.

## Not doing

Публичный host profile и поля, которые принадлежат PM-022; новый navigation shell.

## Dependencies

[D009](../decisions/D009-host-cabinet-ia.md), [PM-021](PM-021-private-host-profile.md). Если Алексей имел в виду гостевой просмотр публичного профиля хозяина, это другой путь PM-022 и отдельный entry point.

## Evidence

public/messages.html содержит глобальную ссылку For Hosts, но thread context не ведёт напрямую в собственный профиль.

## Discussion / Updates

- 2026-09-24 — **Марк / Product Manager:** зафиксирована формулировка «хозяин открывает собственный private profile»; гостевой просмотр public profile остаётся в PM-022.
- 2026-09-25 07:58 UTC — **Денис / Developer:** беру PM-028 по поручению Алексея. **Agent:** Денис. **Role:** Developer. **Scope:** frontend Messages → приватный профиль PM-021 → возврат к диалогу того же аккаунта; без backend, публичного профиля и новых полей. **Model check:** рекомендация Luna / Low подходит для простой ссылки, но для проверки границ гостя, logout/смены аккаунта и восстановления контекста использую текущий Sol / Medium. **Change:** claim и статус in progress. **Related task:** PM-028. **Branch:** `denis/pm028-private-profile`. **Следующий шаг:** сверить контракт диалога и сессию, реализовать и проверить переход на desktop/mobile, затем PR и QA Бориса.
- 2026-09-25 08:04 UTC — **Денис / Developer:** backend `ConversationView` содержит `hostProfileId` и `guestProfileId`, `/conversations/{id}` доступен только участнику. В активном диалоге ссылка видна лишь при совпадении `hostProfileId` с `actor.profile.id`; сохраняю `accountId` и `conversationId` только в `sessionStorage` вкладки, Host console показывает возврат после проверки той же сессии. Logout и смена аккаунта очищают контекст. **Agent:** Денис. **Role:** Developer. **Change:** локально реализовал PM-028 в frontend, переводы RU/EN/ES/CA, тесты на host/guest/switch/expiry. **Related task:** PM-028. **Checks:** `npm test` 122/122 PASS, `git diff --check` PASS. **Следующий шаг:** PR/CI, выпуск и доступный live smoke; независимый мобильный/клавиатурный QA Бориса после релиза.
- 2026-09-25 08:08 UTC — **Денис / Developer:** frontend [PR #32](https://github.com/lelik112/parrot669/pull/32) слит в `main` (`234cafe`); GitHub CI и Cloudflare Workers production build `b630d138-edcc-4d60-88a5-bd8a222aead9` завершились SUCCESS. Production Messages отдаёт новый элемент; в доступном диалоге сессии `lelik` (участник, не host) ссылка на личный профиль скрыта. Владелец диалога в этой сессии недоступен, поэтому live-переход хозяина не приписываю себе. **Agent:** Денис. **Role:** Developer. **Change:** релиз, статус in review. **Related task:** PM-028. **Checks:** `npm test` 122/122 PASS, PR/main CI + Cloudflare SUCCESS, production non-host smoke PASS. **Handoff Борису / QA:** двумя аккаунтами проверить host → свой PM-021 профиль → назад в тот же conversation, гость без ссылки, logout/смена/истечение сессии, четыре языка, клавиатуру и mobile touch 390 px. Записать результат каждого критерия отдельно; до этого acceptance остаётся открытым.
