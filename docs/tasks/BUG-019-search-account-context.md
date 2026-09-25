# BUG-019 — Поиск не показывает аккаунт и не объясняет скрытый контакт

**Title:** показать текущий аккаунт в поиске и явно пометить собственный объект.
**Status:** in review — desktop Chrome авторизованный self/other и четыре языка PASS; signed-out и iPhone Safari QA открыты. **Priority:** P2.
**Owner:** Денис / Developer; QA: Борис.
**Agent:** Денис. **Role:** Developer. **Scope:** `public/search.html`, `public/assets/search.js`, `public/assets/messaging-common.js`, `public/assets/styles.css`, search/messaging UI tests, and this task/index; account indicator and own-property label only, with no changes to messaging access rules.
**Recommended model:** Luna. **Recommended reasoning:** Low. **Reason:** небольшой локализованный UI-текст; важно сохранить публичный поиск и запрет писать самому себе.

## Problem

На iPhone в Safari пользователь вошёл как `lelik112` и увидел три результата поиска. У своей карточки `The therd` не было действия «Написать владельцу». Поиск также не показывал, под каким аккаунтом открыт сайт, поэтому причина отсутствия кнопки была непонятна.

Проверка кода подтверждает, что контакт намеренно скрывается у собственного объекта: сравнивается профиль владельца карточки с профилем текущего пользователя. Это корректно для запрета писать самому себе; проблема — интерфейс не объясняет это состояние. В шапке поиска индикатора текущего аккаунта нет.

## User

Хозяин, который ищет жильё и может одновременно быть авторизован в PARROT.

## Goal

Пользователь понимает, под каким аккаунтом открыт поиск, и почему у собственной карточки нет действия контакта.

## Requirements

- Показывать понятный индикатор входа и имя пользователя на странице поиска для авторизованного пользователя.
- Для собственного объекта вместо молча отсутствующей кнопки показывать локализованную пометку, например «Ваш объект».
- Не показывать действие связи с хозяином для собственного объекта и не разрешать создавать диалог с самим собой.
- Не менять доступность контакта с чужими объектами или правила авторизации сообщений.
- Проверить RU/EN/ES/CA, desktop и iPhone Safari.

## Acceptance criteria

- [ ] Авторизованный пользователь видит в поиске, под каким аккаунтом он вошёл.
- [ ] Собственная карточка явно обозначена; отсутствие кнопки контакта больше не выглядит поломкой.
- [ ] Чужие карточки сохраняют рабочий переход «Написать владельцу».
- [ ] Публичный поиск без входа остаётся доступен и не показывает фиктивный аккаунт.
- [ ] Подписи проверены на RU/EN/ES/CA и в iPhone Safari.

## Not doing

Изменение блокировок, права писать самому себе, API сообщений, полей публичного профиля или общего порядка навигации.

## Evidence

- **Среда:** owner-assisted проверка Алексея, iPhone Safari; точные версия iOS/Safari не записаны.
- **Наблюдение:** вошёл как `lelik112`; поиск показал три варианта; у собственной карточки `The therd` не было «Написать владельцу»; аккаунт в шапке поиска не отображался.
- **Проверка реализации:** опубликованный `public/assets/messaging-common.js` скрывает контактную ссылку, если профиль владельца совпадает с профилем текущего пользователя. `public/search.html` не показывает имя текущего аккаунта. Следовательно, запрет самоконтакта выглядит намеренным; отсутствуют объяснение собственного объекта и индикатор аккаунта.
- **QA ограничение:** iPhone Safari непосредственно тестировал Алексей; у Бориса доступен только desktop-браузер.
- **Релиз:** frontend PR [#37](https://github.com/lelik112/parrot669/pull/37) слит в `main` как `1a2cd59c757a6c61135a01d7c30219fe22fa3e0a`; PR CI [#36119555922](https://github.com/lelik112/parrot669/actions/runs/36119555922) прошёл.
- **Production smoke check:** публичный `/search.html` загрузился в cloud browser; локализованный индикатор показал `Аккаунт: @lelik`. Это не аккаунт хозяина `lelik112`, поэтому совпадение с собственным объектом и iPhone Safari остаются независимой QA.

## Discussion / Updates

- 2026-09-25 — **Борис / QA:** оформил P2 по owner-assisted наблюдению Алексея. Правило скрывать сообщение на собственной карточке подтверждено в коде и не считается функциональной ошибкой. **Next:** разработчик берёт claim после сверки области; добавить явную метку собственного объекта и индикатор аккаунта, затем передать на desktop/iPhone Safari QA.
- 2026-09-25 09:26 UTC — **Agent:** Денис. **Role:** Developer. **Scope:** индикатор username текущей сессии в поиске и локализованная метка собственной карточки; правила контакта и доступа остаются прежними. **Change:** беру BUG-019 после сверки свежего `main`, незакрытых claims и файлов поиска. **Model check:** рекомендованные Luna / Low достаточно для локальной frontend-правки и UI-тестов; текущая конфигурация справляется, повышения не требуется. **Related task:** BUG-019. **Next:** реализовать account chip и метку `Your property` по фактическому owner-profile match, добавить RU/EN/ES/CA и signed-out/self/other regressions, затем открыть PR и передать Борису desktop/iPhone Safari QA.
- 2026-09-25 09:31 UTC — **Agent:** Денис. **Role:** Developer. **Change:** поиск показывает `@username` авторизованного пользователя; карточка помечается `Your property` только после совпадения host profile с профилем текущей сессии. Скрытие self-contact и API сообщений не менял. EN/ES/CA/RU, вход/выход, свой и чужой объект покрыты UI-тестом; локально `126/126` тестов PASS, `git diff --check` PASS. **Related task:** BUG-019. **Next:** открыть PR, дождаться CI, затем передать Борису desktop/iPhone Safari проверку.
- 2026-09-25 09:39 UTC — **Agent:** Денис. **Role:** Developer. **Change:** PR #37 слит (`1a2cd59`), PR CI успешен; публичный `/search.html` показывает индикатор аккаунта в активной сессии. BUG-019 переведена в `in review`; owner-assisted сценарий `lelik112` на desktop/iPhone Safari не выдаю за проверенный. **Related task:** BUG-019. **Next:** Борис сверяет self-card/чужую contact CTA, signed-out поиск и четыре языка на desktop/iPhone Safari, записывает среду и результат.

- 2026-09-25 10:07 UTC — **Agent:** Борис. **Role:** QA. **Scope:** независимый production desktop Chrome, вошёл как `lelik`; RU/EN/ES/CA, тестовый объект `QA 2026-09-23 — НЕ ДЛЯ АРЕНДЫ`. **Change:** PARTIAL PASS: после reload в шапке поиска виден `@lelik` на четырёх языках; временно добавил доступность 11–14.06.2027 (€123.45/ночь), поиск Barcelona 11–14.06 показал собственную карточку с меткой `Ваш объект` / `Your property` / `Tu vivienda` / `El teu habitatge` и без CTA сообщения. На чужих карточках `lelik112` для 01–08.10.2026 три CTA `Написать владельцу` остались. Временный период **удалён**: повторно открытый Host показывает только прежние периоды 2020-01-01–07, 2021-01-01–03 и 2026-12-01–07; тестовые брони и другие условия не менял. Скриншот self-card сохранён в QA-беседе. **Открыто:** signed-out поиск (не выходил, чтобы не потерять сеанс), исходный `lelik112` на iPhone Safari и мобильный touch. **Related task:** BUG-019; PM-016. **Next:** отдельная anonymous и iPhone проверка; до этого статус in review.

- 2026-09-25 14:05 UTC — **Agent:** Борис. **Role:** QA. **Scope:** attempt at signed-out search using QA Worker origin in Cloud Chrome; main parrot669.com remains logged in as qa. **Change:** after logout on Worker origin, the main qa session stayed authenticated, confirming origin isolation. Signed-out Worker search loaded its shell but disabled country/city and showed «Поиск временно недоступен», consistent with the QA-only origin guard; this cannot establish public signed-out search behavior. **Open:** independent anonymous public browser state and iPhone Safari remain required. **Related task:** BUG-019 / PM-029. **Next:** test anonymous search on public origin in a separate browser state; no product bug is inferred from QA Worker behavior.
