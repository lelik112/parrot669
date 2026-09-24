# PM-026 — Убрать дублирующий переход Messages

**Title:** оставить одну кнопку Messages в кабинете хозяина.
**Status:** planned — NEXT; исполнитель не назначен. **Priority:** P2.
**Owner:** будущий Developer; QA Борис.
**Agent:** будущий Developer. **Role:** Developer. **Scope:** навигация Host; не переписывание Messages или unread behavior.
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

- 2026-09-24 — **Марк / Product Manager:** по просьбе владельца выбираю сохранить глобальную Messages-вкладку и убрать повтор из Host shortcuts.
