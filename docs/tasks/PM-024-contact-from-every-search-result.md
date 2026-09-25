# PM-024 — Контакт с хозяином из каждого результата поиска

**Title:** дать гостю действующий путь написать хозяину любого объекта, который PARROT показывает в поиске.
**Status:** in review — live search CTA → first message → host reply PASS for one QA listing; all-result, no-link/unverified-calendar, block/rate-limit cases remain open. **Priority:** P1.
**Owner:** Игорь / Developer (назначен Алексеем 2026-09-25, claim подтверждён); QA Борис.
**Agent:** Игорь. **Role:** Developer. **Scope:** выдача поиска, contact options и правила первого сообщения; не публикация личных контактов.
**Recommended model:** Sol. **Recommended reasoning:** High. **Reason:** задача меняет связанный frontend/backend contract контакта, общий host opt-in и антиабьюзные границы.

## Goal

Гость может начать PARROT-обращение с каждого отображаемого объекта и довести поиск до контакта.

## Problem

Текущий contact CTA скрывается, если хозяин выключил общий приём новых обращений. Объект при этом остаётся в выдаче, но гость не может связаться с хозяином через PARROT.

## Context

Решение принято в [D011](../decisions/D011-contact-always-available.md). Сейчас кнопка Message host в поиске зависит от acceptingNewConversations; задачу нужно отличать от переноса auth-gate перед отправкой в [PM-023](PM-023-guest-message-onboarding.md). Airbnb-ссылка и её verification status регулируются [D010](../decisions/D010-external-link-independent-verification.md) отдельно от контакта.

## User

Гость, который нашёл объект в поиске; хозяин, разместивший объект в PARROT.

## Value

Каждый результат даёт понятный следующий шаг; полезность поиска не зависит от наличия Airbnb-ссылки или настройки общего opt-in.

## Solution

Для объектов, возвращаемых в поиске, всегда показывать переход к PARROT-обращению. Требовать вход/регистрацию и подтверждённый аккаунт перед отправкой. Сохранить защиту от злоупотреблений и блокировку отдельных пар участников.

## Requirements

- Показывать «Написать владельцу» для каждого доступного в поиске объекта независимо от host-wide acceptingNewConversations, Airbnb URL и статуса calendar verification.
- Backend разрешает первое обращение по объекту в поиске независимо от прежнего opt-in; аутентификация и подтверждение email остаются обязательными.
- Удалить или переопределить общий переключатель хозяина, который отключает первые обращения; его текст не должен обещать запрет входящих сообщений.
- Сохранить существующие ограничения частоты, блокировки пары, авторизацию, приватность истории и доступ к своим объектам.
- Если хозяин заблокировал конкретного гостя, не обходить блокировку новым объектом.
- Действие D010 «попросить подтвердить календарь» открывает подготовленный черновик и ничего не отправляет автоматически.
- Обновить RU/EN/ES/CA, тесты UI и API contract.

## Acceptance criteria

- [ ] Любой активный объект, который вернулся в поисковой выдаче, имеет видимый рабочий контактный переход.
- [ ] Выключенное прежнее host-wide сообщение не скрывает CTA и не блокирует создание первого диалога.
- [ ] Сообщение невозможно отправить без действующей сессии и подтверждённого аккаунта.
- [ ] Rate limits и блокировка конкретного участника продолжают работать и проверены.
- [ ] Наличие/отсутствие Airbnb-ссылки и verification не меняет возможность начать PARROT-обращение.
- [ ] Старые диалоги, ответы хозяина и настройка email-уведомлений не ломаются.
- [ ] QA подтверждает поиск → первое обращение → ответ хозяина на двух аккаунтах; детали полного сценария остаются в PM-003.

## Alternatives

Оставить opt-in и показывать Airbnb; показывать кнопку с ошибкой после перехода; автоматически открывать внешний контакт.

## Rejected

Результаты без действия связи, анонимная отправка, публикация email/телефона без отдельного согласия и отключение защит от злоупотреблений.

## Success criteria

Снизить число результатов, из которых гость не может начать контакт; в пилоте считать результат поиска → начало обращения → отправка → ответ. Числовой порог определить после базовых наблюдений.

## Not doing

Гарантия ответа хозяина, бронь/оплата, публикация raw contact, автоматическая отправка calendar nudge, изменение Airbnb trust status.

## Dependencies

[D011](../decisions/D011-contact-always-available.md), текущий messaging API, [PM-003](PM-003-contact-acceptance.md), [PM-023](PM-023-guest-message-onboarding.md). Перед началом сверить активные claims; PM-023 меняет только момент auth, PM-024 — доступность контакта.

## Evidence

- 2026-09-25 — Борис / Cloud Chrome, `qa` guest on Worker origin and `lelik` host on primary origin. Barcelona search 2027-06-11 → 2027-06-14 showed `lelik` QA property with external Airbnb link and calendar-verification marker; CTA opened a composer with matching property and dates. `qa` sent the first message, `lelik` received and replied, and `qa` saw the reply after refresh. This confirms one object path only; no-link/unverified listing variants, third-party account denial, rate limit and pair block remain untested here. See [PM-003](PM-003-contact-acceptance.md).

В public/assets/messaging-common.js contact link сейчас показывается только при acceptingNewConversations; public/host.html содержит общий переключатель с текстом «выключение запрещает новые обращения». Поиск и backend должны быть приведены к принятому D011.

## Discussion / Updates

- 2026-09-24 — **Марк / Product Manager:** оформлено принятое владельцем решение D011 и задача реализации.
- 2026-09-25 — **Марк / Product Manager:** Алексей поручил PM-024 Игорю. Это назначение, не claim: перед началом Игорю нужно подтвердить claim и Model check по D005. **Next:** Игорь фиксирует claim/model check; Борис проводит независимый end-to-end QA.
- 2026-09-25 06:01 UTC — **Agent:** Игорь. **Role:** Developer. **Scope:** frontend поиск и настройки сообщений, backend messaging contract/первое обращение; без PM-021 профиля Дениса, PM-023 авторизации до отправки и PM-025 layout. **Change:** беру PM-024, ветки `igor/pm024-contact` от актуальных main двух репозиториев. **Model check:** Sol / High достаточно для связанных frontend/backend изменений и регрессий авторизации, блокировок и rate limits. **Related task:** PM-024. **Next:** убрать общий gate и ввести регрессионные проверки, затем CI и релиз.
- 2026-09-25 06:23 UTC — **Agent:** Игорь. **Role:** Developer. **Change:** [backend PR #26](https://github.com/lelik112/parrot669-backend/pull/26) слит как `1dcc5aa`; [PR CI](https://github.com/lelik112/parrot669-backend/actions/runs/36101612892) и [main CI](https://github.com/lelik112/parrot669-backend/actions/runs/36101858866) успешны с PostgreSQL messaging suite, smoke и Docker. Railway production deployment `1f0ab040-a8d0-404a-9070-9422b531876b` SUCCESS на точном `1dcc5aa`. [Frontend PR #25](https://github.com/lelik112/parrot669/pull/25) слит как `312306e`; [PR CI](https://github.com/lelik112/parrot669/actions/runs/36101751058) и [main CI](https://github.com/lelik112/parrot669/actions/runs/36102370506) успешны, локальные UI тесты 116/116. Живой `/host` больше не содержит общего переключателя; живой поиск Barcelona 2026-10-01 → 2026-10-08 показал три карточки, все три с переходом к обращению и датами; переход открыл composer нужного объекта без отправки. Backend deprecated `/settings` и `contact-options` возвращают `acceptingNewConversations: true` для старых клиентов, прежние false-значения не используются. **Related task:** PM-024 / D011. **Model check:** Sol / High хватило. **Next:** Борис отдельно проверяет с двумя разными аккаунтами сообщение при ранее выключенном opt-in, ответ хозяина, блокировку пары, auth и rate limit; PM-003 хранит полный контактный сценарий. Cloudflare version ID/SHA отдельно не получен; наличие новых UI-маркеров проверено на live site.
- 2026-09-25 — **Борис / QA:** owner-assisted iPhone Safari: аккаунт Минкс открыл из поиска `The therd` на 2026-10-01 → 2026-10-08; CTA открыл переписку с нужным объектом и датами. Тестовое сообщение появилось у отправителя, хозяин `lelik112` подтвердил появление нового диалога. При этом ни пункт «Сообщения», ни строка диалога не показали видимого нового/непрочитанного состояния; строка выглядела неаккуратно до открытия. Это отдельный [BUG-020](BUG-020-unread-message-discoverability.md). В этой конкретной переписке ответ хозяина ещё не проверен; rate limit не проверялся. **Next:** разработчик подтверждает claim PM-024 и закрывает оставшиеся acceptance criteria; BUG-020 — отдельная задача.
- 2026-09-25 — **Борис / QA:** продолжил проверку через отдельный Cloud Chrome-сеанс `lelik`, Browser B; Browser A у Алексея — iPhone Safari `lelik112`. Из подготовленного CTA диалога для `The therd` отправил новое первое обращение с датами 2026-10-01 → 2026-10-08; после отправки сообщение отображается в истории у гостя. Скрин состояния сохранён в рабочем QA-свидетельстве. **Next:** Алексей подтверждает, что новое обращение пришло в inbox `lelik112` на iPhone Safari; затем отвечает, Борис проверяет получение ответа в Cloud Browser. Тест сообщения от Минкс уже отдельно подтвердил появление диалога, но индикаторы unread отсутствовали — см. BUG-020.

- 2026-09-25 09:24 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Chrome, `lelik`, Barcelona 01–08.10.2026, три live-результата; без отправки новых сообщений. **Change:** PARTIAL PASS: все три результата владельца `lelik112` имеют `Написать владельцу` с разными property ID и общими датами поиска. CTA третьей карточки `The second` открыл composer с правильным названием и обеими датами. **Открыто:** подтверждение доставки/ответа на прежнее отправленное Cloud-сообщение в `The therd` и иные состояния link/opt-in без второго управляемого аккаунта. **Related task:** PM-024; PM-025; PM-016. **Next:** PM-029, затем полный обмен; статус in review.
