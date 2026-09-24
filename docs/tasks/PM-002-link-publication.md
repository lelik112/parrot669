# PM-002 — Внешняя ссылка и честный verification status

**Title:** унифицировать Airbnb-переход, calendar verification status и запрос владельцу пройти проверку.

**Status:** planned — product decision accepted, implementation unclaimed. **Priority:** P1. **Owner:** не назначен.

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

- [ ] D009 используется как действующий контракт.
- [ ] Search/result card не блокирует валидный опубликованный Airbnb URL из-за verification.
- [ ] Trust status соответствует таблице.
- [ ] Legacy v1 не выдаётся за новый verified.
- [ ] Nudge доступен там, где можно начать messaging conversation.
- [ ] Nudge не отправляет скрытое сообщение.
- [ ] Invalid/mismatched URL не публикуется.
- [ ] Отсутствие ссылки не скрывает объект из поиска.
- [ ] Будущий public host profile использует тот же контракт.
- [ ] QA проверяет основные состояния и messaging/no-messaging варианты.

## Not doing

Identity verification, ownership/right-to-rent verification, обязательный Airbnb для поиска, новый рейтинг PARROT, реализация будущего public host profile, изменение iCal sync semantics.

## Dependencies

D010 accepted. Смысл verified берётся из D002. Незавершённая оставшаяся QA PM-001 не блокирует старт реализации PM-002.

## Evidence

Implementation по новому контракту ещё не начата.

## Discussion / Updates

- 2026-09-24 — Алекс / Strategy: Алексей принял новый контракт. Непроверенную валидную опубликованную Airbnb-ссылку не блокируем; показываем честный status и даём гостю возможность попросить host пройти verification.
