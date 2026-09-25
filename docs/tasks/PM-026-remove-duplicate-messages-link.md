# PM-026 — Убрать дублирующий переход Messages

**Title:** оставить одну кнопку Messages в кабинете хозяина.
**Status:** in review — ожидает независимую QA. **Priority:** P2.
**Owner:** Денис / Developer; QA Борис.
**Agent:** Денис. **Role:** Developer. **Scope:** удалить повторную ссылку из Host shortcuts; сохранить глобальную Messages-вкладку, unread badge, локализацию и пути.
**Recommended model:** Luna. **Recommended reasoning:** Low. **Reason:** небольшой UI cleanup с однозначным выбором по текущей структуре навигации.

## Goal

Владелец видит один понятный переход в переписку с любого экрана Host.

## Problem

У вошедшего хозяина на /host.html повторяется «Messages»: есть основная ссылка в housing-tabs и дополнительный shortcut в host-shortcuts. На узком экране дублируются и действие, и unread badge.

## User

Владелец, работающий в кабинете.

## Value

Навигация занимает меньше места и не заставляет выбирать между двумя одинаковыми действиями.

## Solution

Сохранить **Messages** в общей верхней навигации Search / Host / Messages, которая одинакова между основными разделами. Удалить дублирующую ссылку из host-shortcuts; там оставить контекстные «My properties» и «Host profile».

## Requirements

- Удалить только повторную Messages-ссылку из блока быстрых действий Host.
- Сохранить основную глобальную ссылку Messages и её unread badge.
- Сохранить shortcuts на объекты и профиль хозяина; их маршруты и права не менять.
- На Messages page оставить единственную активную глобальную Messages-ссылку.

## Acceptance criteria

- [ ] Авторизованный Host показывает ровно один actionable переход Messages на desktop и mobile.
- [ ] Основная навигация Search / Host / Messages остаётся доступна и визуально согласована.
- [ ] Unread badge виден на оставшейся ссылке и обновляется как раньше.
- [ ] Языки RU/EN/ES/CA и клавиатура проверены.
- [ ] На Messages странице не появляется второй дублирующий переход к той же странице.

## Alternatives

Удалить глобальную вкладку Messages и оставить только shortcut Host; оставить обе кнопки с разными подписями.

## Rejected

Две одинаково подписанные кнопки, конкурирующие unread badges и удаление стандартной глобальной точки входа в Messages.

## Success criteria

Владелец распознаёт одну основную точку входа в переписку.

## Not doing

Переименование раздела, новая навигационная архитектура, перенос inbox или изменение PM-020.

## Dependencies

[D009](../decisions/D009-host-cabinet-ia.md), [PM-020](PM-020-host-cabinet-navigation.md). Перед изменением сверить active claims PM-020/PM-021, чтобы не перезаписать их Host navigation work.

## Evidence

public/host.html: общая ссылка housing-tabs и повтор host-shortcuts отображаются для авторизованного владельца.

## Discussion / Updates

- 2026-09-25 06:05 UTC — **Денис / Developer:** **Agent:** Денис. **Role:** Developer. **Change:** убрана только ссылка `/messages.html` из Host shortcuts; глобальная вкладка со счётчиком непрочитанных и ссылки на объекты/профиль сохранены. **Related task:** PM-026. Проверка: `npm test`, 114/114; `git diff --check`. Код в frontend PR (ссылка после публикации). Следующий шаг — Борис / QA проверяет desktop/mobile, RU/EN/ES/CA, keyboard и unread badge после релиза; до его проверки критерии не закрыты. Ограничение: изменение только frontend.

- 2026-09-25 06:03 UTC — **Денис / Developer:** беру PM-026 по поручению Алексея. **Agent:** Денис. **Role:** Developer. **Scope:** только дублирующая ссылка в `public/host.html` и узко связанные тесты; Messages/unread логику и backend не меняю. **Model check:** рекомендованных Luna / Low достаточно для удаления ссылки и проверки навигации; текущая модель также достаточна. **Change:** claim, статус in progress. **Related task:** PM-026. Следующий шаг — удалить shortcut в отдельной ветке, проверить тесты, передать Борису на QA.

- 2026-09-24 — **Марк / Product Manager:** по просьбе владельца выбираю сохранить глобальную Messages-вкладку и убрать повтор из Host shortcuts.

- 2026-09-25 09:24 UTC — **Agent:** Борис. **Role:** QA. **Scope:** независимый production desktop Chrome, авторизованный `lelik`, RU; read-only навигация. **Change:** PARTIAL PASS: в Host после входа виден один actionable переход `Сообщения` в общей навигации; внутри `Инструменты владельца` повторной кнопки Messages нет. В открытой Messages-странице также один пункт общей навигации, повторного перехода в основном контенте нет. **Открыто:** входящее непрочитанное для badge сейчас не создано; EN/ES/CA, клавиатура и реальный mobile/touch не проверены. Попытка переключить язык на тяжёлой странице Host завершилась таймаутом browser UI, состояние осталось RU. **Related task:** PM-026; BUG-020. **Next:** подтвердить badge после нового входящего и оставшиеся языки/клавиатуру/mobile; статус in review.

- 2026-09-25 13:42 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Chrome, authenticated `qa`, Worker origin `parrot669.cheltsov112.workers.dev`; read-only navigation. **Change:** PASS for duplicate-link and locale checks: Host page contains exactly one actionable `/messages.html` link, in the global navigation; verified RU (`Сообщения`), EN (`Messages`), ES (`Mensajes`) and CA (`Missatges`). Messages page also shows only the global navigation link. **Open:** unread badge behavior, keyboard navigation and real mobile/touch remain unverified. Existing QA conversation is blocked, so no fresh incoming unread message was generated. **Related task:** PM-026, BUG-020. **Next:** verify badge after a new incoming message; keyboard and mobile require their corresponding test conditions.

- 2026-09-25 14:05 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Chrome, authenticated qa, parrot669.com; keyboard only. **Change:** PASS: from a fresh Host load, Tab reached the single global «Сообщения» link (10th focus stop); Enter opened /messages in the same tab. Earlier RU/EN/ES/CA link count and labels remain recorded above. **Open:** unread badge after new incoming message and real mobile/touch. **Related task:** PM-026. **Next:** finish badge/touch with second participant/device.
