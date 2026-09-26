# PM-040 — повторяемый web smoke

Из корня frontend:

```sh
npm ci
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Playwright сам запускает локальный static server на `127.0.0.1:4173`. Публичный UI `/search.html` и `/messages.html` получает контролируемые ответы `/api/*` из `tests/e2e/public-fixture.cjs`: по умолчанию один объект в Барселоне на 10–17 ноября 2026 года, анонимную сессию, контакт владельца. Дополнительный fixture показывает три карточки без внешней ссылки, с verified и pending ссылками; прямой anonymous Messages проверяется без inbox. Отдельный синтетический владелец `fixture-owner` с пустым dashboard проверяет навигацию Host → Messages → Host без входа в реальные аккаунты. Любой незапланированный API-запрос возвращает 501; нет production-запросов, реальных сообщений и credentials. `npm test` остаётся отдельным быстрым набором.

Проекты: `chromium-desktop`, `webkit-desktop`, `mobile-emulation` (WebKit, профиль iPhone 13). Последний проверяет адаптивный web UI и touch emulation, **не** является тестом физического iPhone Safari, нативного picker/keyboard/autofill. Такие критерии остаются в PM-041.

`npm run test:e2e -- --project=webkit-desktop` запускает один проект. Отчёт содержит task ID в названии сценария. При провале локально остаются trace и screenshot в `test-results/`; CI сохраняет их и HTML-отчёт на 3 дня только при ошибке. Fixture не включает личные данные, cookie и токены. Никита может использовать этот smoke для web regression evidence; Борис сопоставляет результат с критериями исходной карточки. Зелёный fixture smoke проверяет UI-путь и контракт ожидаемых ответов, а доступность production backend проверяется отдельным ручным QA.

## Независимый прогон без локальной загрузки браузеров

QA может самостоятельно перезапустить `browser-smoke` в GitHub Actions. Для принятого набора из **18 запусков** используется неизменяемый PR #58 head `c17c79f`: run [`36217996199`](https://github.com/lelik112/parrot669/actions/runs/36217996199), job `browser-smoke` **`108337720648`**. В GitHub UI открыть job и выбрать **Re-run job**. В подключённом GitHub connector вызвать `github_rerun_workflow_job({repo_full_name:"lelik112/parrot669", job_id:108337720648})`, затем читать latest attempt через `github_fetch_workflow_run_jobs({repo_full_name:"lelik112/parrot669", run_id:36217996199})` и итоговый log через `github_fetch_workflow_job_logs` с новым job ID. Нужны Actions write. Записать инициатора QA, commit `c17c79f`, run/attempt, три browser projects и строку `18 passed`; приложить ссылку на attempt. Это независимый запуск QA на инфраструктуре CI, но не локальный запуск и не проверка живого backend. Для последующей регрессии после изменения самих тестов выбирать новый run соответствующего commit, а не этот зафиксированный baseline.

Проверка возможности: 2026-09-26 Денис отдельно перезапустил `browser-smoke` для `d447697`: [run 36217603854, attempt 2](https://github.com/lelik112/parrot669/actions/runs/36217603854/attempts/2), job `108336813626`, PASS 12/12 за 17.5 с. Никита должен выполнить собственный rerun и записать evidence под своим именем; если у его подключения нет Actions write, Марк координирует доступ, не передавая личные credentials.

Двухаккаунтный ручной сценарий PM-036 прошёл с `qa2`/`qa3`: прежний отказ был из-за неверного логина. Автоматический сценарий PM-003/BUG-020 в CI ждёт отдельной безопасной пары, согласованных тестовых данных и способа авторизации без секретов в публичном репозитории. После такой настройки запускать сценарий в двух отдельных `browser.newContext()` с согласованными тестовыми данными и без сохранения `storageState`/секретов в git; не подмешивать его в текущий публичный CI.
