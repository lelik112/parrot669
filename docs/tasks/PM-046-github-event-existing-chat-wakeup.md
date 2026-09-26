# PM-046 — запуск существующего агентского чата по событию GitHub

**Title:** проверить событийное пробуждение существующего чата после назначения задачи в репозитории.
**Status:** in progress / PR inbox pilot — PR #59 proved one `opened` → Igor's existing chat; PR #60 proved one addressed comment → Mark's existing chat. Igor's dedicated draft inbox PR #61 is prepared; Igor's PR #61 `enable_comments` trigger is enabled in his existing chat as of 2026-09-26 05:47 UTC; delivery of a matching test comment remains unverified. His old #59 trigger is disabled.
**Priority:** P2.
**Agent:** Игорь / Developer — completed the one-off technical run 2026-09-26 05:31 UTC; no active dev claim. **Owner / next:** Марк / Product Manager created PR #61 and instructions; Igor enabled the trigger in his existing chat; Mark sends one unique test comment and verifies a signed result. This is owner-directed PM-046 process pilot, not a new code assignment.
**Recommended model:** Sol. **Recommended reasoning:** Medium.
**Reason:** нужно установить реальные границы GitHub event и Automations на одном существующем чате, без разработки продукта.

## Goal

Установить, можно ли после обычного push в `docs/tasks/` автоматически запустить **нынешний чат назначенного исполнителя**, чтобы он прочитал конкретную карточку и безопасно подтвердил claim. Нового агента не создавать.

## Problem

Репозиторий хранит назначение, но push сам по себе не будит чаты. PM-043 доказала только **одноразовый запуск по времени** внутри существующего чата Игоря: scheduler вернул тот же conversation ID, затем run прочёл тестовую карточку и записал один claim. PM-045 закрыла попытку повторять это каждые пять минут. Работа по GitHub push ещё не выполнена.

## Context

В доступных event-triggered Automations GitHub поддерживает **активность pull request** (включая обновления коммитов PR), а не произвольный push на main. PM-043 описала GitHub Actions `push` → API опубликованного Workspace Agent только как архитектурный вариант: он не доказывает пробуждение существующих чатов. Никакой такой workflow, токен или published agent не создан.

## Requirements

1. Проверить текущую схему доступного GitHub-триггера и явно ответить, может ли **обычный push карточки на main** запускать задачу внутри существующего чата. Записать точное ограничение и источник.
2. Если прямого push нет, проверить, можно ли одним ограниченным тестом использовать поддержанное событие PR в том же существующем чате без нового агента, фиктивной постоянной PR-очереди и изменений приложения. До теста описать, какой реальный процесс назначения потребовался бы команде.
3. При доступном безопасном тесте зафиксировать: GitHub event → тот же conversation ID → чтение точного Assignment ID → один claim; затем выключить триггер. Если нет доступа или реального теста, честно отметить только документированную возможность.
4. Отдельно оценить стоимость, задержку, защиту от повторных событий и труд команды на каждое назначение. Сравнить с ручной передачей. Не включать общий механизм до решения владельца.

## Acceptance criteria

- [x] Push на `main` не поддержан в текущей GitHub webhook schema: доступен только `pull_request`; PM-043 — отдельный одноразовый scheduled run.
- [x] PR `opened` → прежний conversation ID → один CAS claim проверены. Для `opened` нужен отдельный PR на назначение (ветка + файл + PR + закрытие/merge); комментарий к PR #60 → существующий чат Марка проверен; отдельный inbox Игоря #61 ждёт его настройки и сквозной проверки.
- [x] Нового агента и фонового механизма нет; временный PR #59 закрыт без merge, пилотный trigger отключён после проверки.
- [ ] Игорь включил в прежнем чате GitHub PR #61 `enable_comments`; Марк ещё проверяет один уникальный адресный комментарий → тот же чат Игоря → одну запись в карточке. После этого PM фиксирует пригодность или отказ от постоянного inbox.

## Not doing

Создание опубликованного Workspace Agent, GitHub Actions, секретов и новых репозиториев; продуктовый код PARROT; запуск команды по непроверенной схеме.

## Dependencies

[PM-043](PM-043-agent-wake-up-feasibility.md) done как исследование и [PM-045](PM-045-five-minute-agent-wake-up-pilot.md) closed как пятиминутный пилот. Технический исполнитель подтверждает claim перед опытом; текущая продуктовая и QA-работа P1 выше по приоритету.

## Discussion / Updates

- 2026-09-26 — **Марк / PM:** после уточнения Алексея сохранил открытую цель автоматического запуска **существующих** чатов отдельно от закрытого пятиминутного варианта. GitHub push пока не доказан; PR event описан платформой, но сквозной тест для PARROT не проводился. Игорь — предлагаемый исполнитель, а не подтверждённый claim.

- 2026-09-26 05:12 UTC — **Игорь / Developer:** claim по прямому поручению Алексея. **Scope:** проверить реальную схему GitHub event для push/PR, затем один ограниченный тест существующего чата, если инструмент это позволяет; никаких product/QA/prod изменений, нового агента или постоянного триггера. **Model check:** GPT-6 Codex, текущая техническая проверка соответствует Sol / Medium. **Next:** прочитать схему триггера, подтвердить или исключить push на main, оценить безопасный PR-пилот и стоимость процесса. **Related task:** PM-046.

- 2026-09-26 05:14 UTC — **Игорь / Developer:** `automations_discover_webhook_schema(github)` вернул ровно `pull_request` с фильтрами repository/PR number/author/title/label и опциональными `enable_commit_updates`, `enable_comments`, `enable_reviews`. События opened/ready_for_review/closed, а synchronize/comments — только при opt-in. **Обычный push в `main` не поддерживается** и не может напрямую будить этот чат через данный trigger. Для назначения нужен отдельный PR или изменение/комментарий в уже существующем PR: создать ветку, положить карточку с Assignment ID, открыть PR, затем закрыть/слить его; это заметно больше работы и шум CI по сравнению с одной записью в `main`. Узкий пилот: docs-only тестовый PR с уникальным ID и webhook-фильтром по title, после события проверить тот же conversation и один CAS-claim в тестовой карточке, затем выключить automation. Не считать схему доказательством сквозного пробуждения до фактического run. **Next:** подготовить test card и однократный PR event, без приложения/production. **Related task:** PM-046.

- 2026-09-26 — **Марк / Product Manager:** сверил [тестовую карточку](logs/PM-046-pilot.md) и [PR #59](https://github.com/lelik112/parrot669/pull/59): открытие docs-only draft PR привело к одному automation run в прежнем conversation ID Игоря; в 05:15:33 UTC записаны `State: done` и один claim без сообщения Алексея. Это доказательство **одного** PR-event wake-up, не продолжения работы после завершения run и не прямого push на main. PR #59 позднее закрыт без merge, пилотная automation не подтверждена как выключенная; регулярная схема обмена задачами и стоимость ещё не проверены. **Next:** Марк завершает PM-оценку; не ждать пассивного продолжения Игоря и не записывать его активным исполнителем. **Related task:** PM-046.

- 2026-09-26 05:24–05:26 UTC — **Марк / Product Manager:** по прямому поручению Алексея попробовал разбудить Игоря через существующий тестовый [PR #59](https://github.com/lelik112/parrot669/pull/59): оставил адресный комментарий с `Wake ID: PM-046-COMMENT-20260926-0524`, перевёл draft PR в ready for review, затем закрыл PR без merge по плану временного пилота. После каждого шага проверил карточку и PR: нового ответа Игоря/изменения pilot log не наблюдалось. Это **не отрицательный тест** механизма comments/ready/closed: неизвестно, включены ли эти события в пилотном webhook и активен ли он после первого run. Подтверждённым остаётся только `opened` → один run; PR #59 убран из открытых. **Next:** если использовать один PR на агента, сначала в существующем чате адресата включить `enable_comments`, затем отдельно проверить один комментарий и защиту от повторов. Марк может вести исследование и процессную оценку без dev claim; не писать, что Игорь сейчас работает. **Related task:** PM-046.

- 2026-09-26 05:31 UTC — **Игорь / Developer:** завершил cleanup пилота: точечная automation `PM-046 PR pilot` вернула `success=true`, `is_enabled=false`, `conversation_id=6ab26f…6791`; [PR #59](https://github.com/lelik112/parrot669/pull/59) уже closed/unmerged. [Пилотная карточка](logs/PM-046-pilot.md) на main содержит один claim `05:15:33 UTC`, `State: done`. PR создан в `05:14:52 UTC`, наблюдаемый интервал до записи claim — **41 с** (включает доставку и выполнение, не чистая webhook latency). Повторные ready/closed события не сделали второго claim: CAS-протокол увидел `done`; comments не были включены в trigger и не тестировались. Триггер title-filtered, для обычного push в main он не срабатывает. Один PR на назначение добавляет ветку, docs-коммит, PR и закрытие/merge плюс CI-шум; фактическая денежная стоимость не измерялась. PM может оценить целесообразность без нового developer claim. **Next:** Марк принимает процессное решение, постоянную схему не включать без отдельного решения. **Related task:** PM-046.

- 2026-09-26 05:38:23 UTC — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `PM-046-MARK-COMMENT-20260926-0540`. **PR:** [#60](https://github.com/lelik112/parrot669/pull/60), комментарий [#5843576951](https://github.com/lelik112/parrot669/pull/60#issuecomment-5843576951). GitHub `issue_comment created` с адресом `To: Марк` запустил этот существующий чат через PR comment event; этот run самостоятельно сверил комментарий с карточкой и записал результат. Наблюдаемый target `conversation_id` при создании trigger: `6ab7591a…ac3f`. Это подтверждает один комментарий → запуск чата Марка; повторная доставка и двусторонний handoff пока не проверены. **Related task:** PM-046.

- 2026-09-26 05:42 UTC — **Agent:** Марк. **Role:** Product Manager. **Change:** по поручению Алексея создал отдельный docs-only draft [PR #61 — Igor inbox](https://github.com/lelik112/parrot669/pull/61) с [инструкцией](https://github.com/lelik112/parrot669/blob/mark/pm046-igor-inbox-20260926/docs/tasks/logs/PM-046-igor-inbox.md): в существующем чате Игоря включить GitHub `pull_request` trigger для repo и PR #61 с `enable_comments: true`, затем тестировать `To: Игорь` + уникальный Wake ID, читать task из main и избегать повторной записи. PR создан и открыт; Игорев trigger ещё не включён, ответа на комментарий нет. Его прежний пилот #59 выключен. **Next:** однократная настройка Игорем, затем тест Марка; не считать канал рабочим до PASS. **Related task:** PM-046.

- 2026-09-26 05:47 UTC — **Agent:** Игорь. **Role:** Developer. **Change:** по поручению Алексея прочитал docs-only [PR #61](https://github.com/lelik112/parrot669/pull/61) и его [инструкцию](https://github.com/lelik112/parrot669/blob/mark/pm046-igor-inbox-20260926/docs/tasks/logs/PM-046-igor-inbox.md). Создал в **этом существующем чате** GitHub `pull_request` webhook для `lelik112/parrot669`, фильтр `pull_request_number=61`, `enable_comments=true`, без расписания; ответ сервиса `success=true`, `is_enabled=true`, `conversation_id=6ab26f…6791` совпадает с PM-043/046 пилотом. Старый #59 trigger остаётся выключенным. Prompt читает исходный комментарий, принимает только `To: Игорь` + уникальный Wake ID + путь карточки, сверяет main и CAS, не повторяет записанный ID. **Это подтверждает настройку, не доставку комментария. Next:** Марк отправляет один тестовый адресный комментарий в PR #61 и проверяет подписанную запись; PR остаётся draft/open. **Related task:** PM-046.


- 2026-09-26 05:53:16 UTC — **Agent:** Игорь. **Role:** Developer. **Wake ID:** `PM-046-IGOR-COMMENT-20260926-0552`. **Result:** GitHub `issue_comment created` в [PR #61](https://github.com/lelik112/parrot669/pull/61), комментарий [#5843664191](https://github.com/lelik112/parrot669/pull/61#issuecomment-5843664191), разбудил этот существующий чат без нового сообщения Алексея. Run прочитал исходный комментарий, сверил точные строки адресата/Wake ID/Related task, перечитал PM-046 из `main` с blob SHA `10a5c57991ead7b4fc839f29af700eda2354ef27` и записал ровно один результат через CAS. Target conversation: `6ab26f…6791`. Код, другие задачи, PR и production не менялись; trigger PR #61 остаётся включённым. **Related task:** PM-046.
