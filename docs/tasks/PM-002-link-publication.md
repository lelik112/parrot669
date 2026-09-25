# PM-002 — Внешняя ссылка и честный verification status

**Title:** унифицировать Airbnb-переход, calendar verification status и запрос владельцу пройти проверку.

**Status:** in review — previous production QA partial PASS; BUG-017 code merged, Cloudflare status and Boris retest open; nudge and remaining verification states need isolated guest/session QA. **Priority:** P1. **Owner:** Игорь / Developer; QA Борис.

**Implementation branches:** `feat/pm002-link-contract` in backend, `feat/pm002-guest` in frontend. Baselines: backend `59c046f`, frontend `2af2816`. Model: Sol, High. Scope: shared public link projection, search card and messaging draft; no calendar sync or future profile UI.

**Recommended model:** Sol. **Recommended reasoning:** High.

**Product decision:** [D010 accepted](../decisions/D010-external-link-independent-verification.md). [D003](../decisions/D003-link-publication-proposal.md) superseded before acceptance.

## Goal

Разделить:
1. право гостя открыть валидную опубликованную Airbnb-ссылку;
2. trust signal о том, подтверждён ли контроль текущего календаря.

## Requirements

- Валидная Airbnb-ссылка показывается, если владелец разрешил публикацию, независимо от calendar verification.
- Непроверенная ссылка остаётся кликабельной.
- Verified label показывается только для текущего источника, успешно подтверждённого по D002.
- Pending / unverified / failed / blocked / expired / lost показываются честно и не маскируются под verified.
- Legacy v1 verified не считать D002 verification.
- Невалидный или mismatched URL публично не показывать.
- Замена источника снимает verification прежнего источника; новый валидный URL может быть видим как unverified.
- Удаление URL убирает переход.
- Disable/enable sync само по себе verification не меняет.
- Объект без URL или с выключенной публикацией остаётся searchable.
- Для unverified/pending/lost состояния добавить действие **«Попросить владельца подтвердить календарь»**, если host принимает новые PARROT-сообщения.
- Nudge не должен скрытно отправлять сообщение; допустим переход в диалог с подготовленным текстом.
- Если messaging недоступен, Airbnb-переход всё равно остаётся доступен.
- Search и будущий public host profile используют один контракт.
- Не обещать identity / ownership / right-to-rent verification.

## State table

| State | Airbnb link | Verification status | Ask host |
| --- | --- | --- | --- |
| No URL / publish OFF | no | — | no |
| Valid URL, unverified | yes | not verified | yes, if messaging available |
| Pending | yes | verification in progress | yes, if messaging available |
| Verified D002 | yes | calendar control verified | no |
| Failed / blocked / expired / lost | yes | not verified | yes, if messaging available |
| Legacy v1 only | yes | not D002 verified | yes, if messaging available |
| Invalid / mismatched URL | no | no verified claim | no |

## Acceptance criteria

- [x] D010 используется как действующий контракт.
- [x] Search/result card не блокирует валидный опубликованный Airbnb URL из-за verification.
- [x] Trust status соответствует таблице (unit/API contract; независимая QA открыта).
- [x] Legacy v1 не выдаётся за новый verified.
- [x] Nudge доступен там, где можно начать messaging conversation.
- [x] Nudge не отправляет скрытое сообщение.
- [x] Invalid/mismatched URL не публикуется.
- [x] Отсутствие ссылки не скрывает объект из поиска.
- [x] Будущий public host profile использует тот же контракт (существующий JSON; новая страница вне scope).
- [ ] QA проверяет основные состояния и messaging/no-messaging варианты.

## Not doing

Identity verification, ownership/right-to-rent verification, обязательный Airbnb для поиска, новый рейтинг PARROT, реализация будущего public host profile, изменение iCal sync semantics.

## Dependencies

D010 accepted. Смысл verified берётся из D002. Незавершённая оставшаяся QA PM-001 не блокирует старт реализации PM-002.

## Evidence

Backend `PublicLinks` reads latest D002 attempt and current calendar metadata without returning its secret, verifies URL/listing/source match and supplies one `calendarControlStatus` for search and public-profile JSON. UI labels four states and opens a messaging draft only when host accepts new conversations; send remains explicit. Backend [PR #24](https://github.com/lelik112/parrot669-backend/pull/24) merged `5db88ce`, [PR CI](https://github.com/lelik112/parrot669-backend/actions/runs/36015061454) and [main CI](https://github.com/lelik112/parrot669-backend/actions/runs/36015679982) passed, production Railway `e496a322-6390-4127-be99-aa53121b2a6f` SUCCESS and health 200. Frontend local tests: 111/111; [PR #19](https://github.com/lelik112/parrot669/pull/19) CI green. Independent QA and frontend release pending.

## Discussion / Updates

- 2026-09-24 — Алекс / Strategy: Алексей принял новый контракт. Непроверенную валидную опубликованную Airbnb-ссылку не блокируем; показываем честный status и даём гостю возможность попросить host пройти verification.


- 2026-09-24 — **Борис / QA:** беру PM-002 на независимый live-прогон после merge frontend PR #19 и backend PR #24. **Scope:** production search-card для валидной опубликованной ссылки и доступного verification state; публичный текст/ссылка, nudge как несентнутый draft, условия показа по host messaging opt-in, отсутствие публикации для invalid/mismatch при доступных состояниях. Не отправляю сообщение, не меняю связь Airbnb и не читаю секретный iCal URL. **Следующий шаг:** подтвердить, что frontend PR #19 попал в production; затем проверить карточку через безопасный QA-период и убрать временную доступность. Недоступные состояния отмечу как «Нужна проверка». **Related task:** PM-002.


### 2026-09-24 — Борис / QA — production-прогон

**Среда:** production parrot669.com, desktop Chrome, owner profile lelik; PM-002 frontend live (merged PR #19) + deployed backend PR #24. Тестовая выдача: Barcelona, 2027-06-11—2027-06-14, QA-only property. Временный период доступности 2027-06-10—2027-06-15 (€123.45/night) после теста удалён. Исходные доступные и закрытые периоды сохранены; publish link и messaging opt-in возвращены в исходное состояние ON. Airbnb/iCal connection не менялась. Сообщения не отправлялись; secret iCal URL не читался.

- **PASS — lost/reverification state:** карточка остаётся в результатах с валидной опубликованной Airbnb-ссылкой и статусом «Требуется повторная проверка». EN/ES/CA показывают соответствующие переводы; ни один язык не называет это подтверждённой проверкой.
- **PASS — publication OFF:** после отключения «Показывать внешнюю ссылку в поиске» объект остался в выдаче; ссылка, trust status и nudge отсутствовали. После включения ссылка и потерянный статус вернулись.
- **BUG-017 — P3: подпись при выключенной публикации говорит, что ссылка не добавлена.** Шаги: у объекта оставить сохранённый Airbnb URL, выключить публикацию и выполнить тот же поиск. Фактически в карточке показано «Внешняя ссылка пока не добавлена». Гость может понять это как отсутствие Airbnb-объявления, хотя владелец просто не публикует переход. Ожидаемо — нейтрально скрыть строку или написать, что ссылка недоступна гостям; не утверждать, что владелец её не добавил.
- **Нужна проверка — nudge и no-messaging:** в единственном сеансе вошёл владелец этой же карточки, поэтому создать обращение к самому себе нельзя; CTA не появился. Второй независимый гостевой аккаунт/сеанс ждёт PM-016. Не проверены подготовленный текст и отсутствие скрытой отправки.
- **Нужна проверка:** unverified, pending, verified D002, failed/blocked/expired отдельно, legacy v1, замена/удаление URL, invalid/mismatch. Не менял Airbnb и URL, потому что это затрагивает рабочее состояние календаря/источника.

**Итог:** частичный PASS; полный acceptance PM-002 не подтверждён до проверки nudge и остальных статусов.  
**Agent:** Борис. **Role:** QA. **Change:** production-прогон состояния lost и publish OFF; зарегистрирован BUG-017. **Related task:** PM-002.

### 2026-09-25 05:51 UTC — Игорь / Developer — BUG-017

**Agent:** Игорь. **Role:** Developer. **Scope:** только нейтральный fallback-текст карточки поиска в EN/ES/CA/RU (`public/assets/search.js`), продуктовый контекст и запись результата; backend/API, статус D002, host/messaging и другие QA-сценарии не меняю. **Claim:** возобновляю свою PM-002 для BUG-017 в `fix/bug017-hidden-link-copy`. **Model check:** Sol / High соответствует PM-002; для этого узкого copy fix дополнительная модель не нужна. **Next:** прогнать frontend tests/CI, выпустить изменение и передать Борису ретест publish OFF. **Related task:** PM-002 / BUG-017.

### 2026-09-25 05:54 UTC — Игорь / Developer — BUG-017 release handoff

**Agent:** Игорь. **Role:** Developer. **Change:** заменил misleading fallback во всех четырёх локалях на нейтральное «внешний переход недоступен»; API и остальные действия карточки не менялись. [Frontend PR #22](https://github.com/lelik112/parrot669/pull/22) merged as `7b46763`; [PR CI](https://github.com/lelik112/parrot669/actions/runs/36100467923) and [main CI](https://github.com/lelik112/parrot669/actions/runs/36100507398) succeeded, locally 113/113 UI tests with cached jsdom. Cloudflare Worker deployment for this SHA not verified from current environment. **Next:** Борис / QA проверяет текст при publish OFF в production и EN/ES/CA/RU; остальные PM-002 сценарии (nudge, состояния D002) остаются открыты. **Related task:** PM-002 / BUG-017.
