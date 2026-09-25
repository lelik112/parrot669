# PM-040 — повторяемый web smoke

Из корня frontend:

```sh
npm ci
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Playwright сам запускает локальный static server на `127.0.0.1:4173`. Публичный UI `/search.html` и `/messages.html` получает контролируемые ответы `/api/*` из `tests/e2e/public-fixture.cjs`: один объект в Барселоне на 10–17 ноября 2026 года, анонимную сессию, контакт владельца. Любой незапланированный API-запрос возвращает 501; нет production-запросов, реальных сообщений и credentials. `npm test` остаётся отдельным быстрым набором.

Проекты: `chromium-desktop`, `webkit-desktop`, `mobile-emulation` (WebKit, профиль iPhone 13). Последний проверяет адаптивный web UI и touch emulation, **не** является тестом физического iPhone Safari, нативного picker/keyboard/autofill. Такие критерии остаются в PM-041.

`npm run test:e2e -- --project=webkit-desktop` запускает один проект. Отчёт содержит task ID в названии сценария. При провале локально остаются trace и screenshot в `test-results/`; CI сохраняет их и HTML-отчёт на 3 дня только при ошибке. Fixture не включает личные данные, cookie и токены. Никита может использовать этот smoke для web regression evidence; Борис сопоставляет результат с критериями исходной карточки. Зелёный fixture smoke проверяет UI-путь и контракт ожидаемых ответов, а доступность production backend проверяется отдельным ручным QA.

Двухаккаунтный сценарий PM-003/BUG-020 пока BLOCKED по PM-036: повторный вход `qa2` отклонён. Когда появится отдельная безопасная пара, запускать сценарий в двух отдельных `browser.newContext()` с согласованными тестовыми данными и без сохранения `storageState`/секретов в git; не подмешивать его в текущий публичный CI.
