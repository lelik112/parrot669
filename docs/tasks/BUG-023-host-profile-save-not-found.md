# BUG-023 — Имя хозяина не сохраняется

**Title:** сохранение публичного имени в кабинете показывает Not found.
**Status:** in review — PR #45 merged, Worker live route smoke PASS; authenticated save/reload and invalid/privacy QA open. **Priority:** P1.
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
