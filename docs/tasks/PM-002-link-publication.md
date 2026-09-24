# PM-002 — Внешняя ссылка и честный verification status

**Title:** унифицировать Airbnb-переход, calendar verification status и запрос владельцу пройти проверку.

**Status:** implementation in progress — backend deployed, frontend production rollout and independent QA open. **Priority:** P1. **Owner:** Игорь / Developer.

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
