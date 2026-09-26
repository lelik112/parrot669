# PM-050 — Сообщения: убрать лишний текст и ручное обновление

**Title:** упростить Messages без нового механизма опроса.
**Status:** prepared / NOW; address handoff sent, developer claim pending. **Priority:** P2.
**Owner / expected Agent:** Игорь / Developer — PM-048 complete; address handoff sent, claim pending; verify shared-file state after PM-049 PR #69. **Role:** Developer.
**Recommended model:** Sol. **Recommended reasoning:** Medium (4/6 default; собственный Model check). **Reason:** небольшой UI, но автообновление и auth edge cases требуют проверки.
**Scope:** Messages email help и кнопка Refresh; текущую частоту опроса менять только при доказанной проблеме нагрузки/задержки.

## Goal / Problem / User / Value

В настройке уведомлений фраза «Короткое уведомление и ссылка на диалог. Текст переписки остаётся на сайте.» лишняя для текущего экрана. Кнопка «Обновить» в списке диалогов создаёт впечатление, что входящие появляются лишь вручную. В `public/assets/messages.js` уже есть видимый polling каждые **15 секунд**, плюс focus/visibility resume; новый минутный таймер не нужен. Одноминутный интервал снизит число запросов, но удлинит задержку нового сообщения, поэтому менять его вслепую не требуется.

## Requirements

1. Убрать указанную фразу и неиспользуемые переводы RU/EN/ES/CA; сохранить действующие настройки email и короткое утверждение о приватности в заголовке Messages.
2. Убрать кнопку «Обновить» из обычного inbox и её обработчик; устранить обращения к удалённому DOM ID. Сохранить явный retry при реальной ошибке, если он нужен для восстановления, и видимые статусы загрузки/ошибки.
3. Проверить текущий polling: на видимой странице новые входящие появляются без кнопки; скрытая вкладка не делает периодические запросы, возвращение фокуса/видимости обновляет данные, нет накладывающихся запросов; logout/account switch не показывает старый inbox. Если факты покажут лишнюю нагрузку или 15 секунд неприемлемы, записать замеры и предложить настройку частоты отдельно до изменения продуктового ожидания.
4. Не путать с [BUG-020](BUG-020-unread-message-discoverability.md): unread badge/foreground/read-clear остаются в его QA и разработке.

## Acceptance criteria

- [ ] Нет указанного help и ручной кнопки в четырёх языках; email-настройки и безошибочный загрузочный путь работают.
- [ ] Свежий диалог/сообщение появляется в пределах действующего интервала на видимой странице; hidden/focus/visibility и logout проверены.
- [ ] Ошибка сети даёт понятное состояние/восстановление; нет DOM exception после удаления кнопки. Desktop/mobile web smoke, настоящий телефон отдельно PM-041.
- [ ] BUG-020 и PM-026 не закрываются этим PR без своего evidence.

## Not doing

WebSockets, push, новый scheduler, backend email, смена частоты без наблюдения, изменение общего header PM-049.

## Dependencies / Handoff

Игорь после PM-048 и решения возможных shared-file конфликтов с PM-049 делает отдельный signed claim. QA regression после PR, критический контакт остаётся за Борисом.

## Evidence / Discussion / Updates

- 2026-09-26 — **Agent:** Марк. **Role:** Product Manager. **Scope:** UI постановка по замечаниям Алексея. **Change:** автообновление уже существует с интервалом 15 секунд; убираем обманчивую ручную кнопку, не плодим новый polling. **Related task:** PM-050. **Model check:** Sol 4/6 достаточно. **Next:** после PM-048 передать Игорю; claim ещё нет.

- 2026-09-26T14:24:15Z — **Agent:** Марк. **Role:** Product Manager. **Wake ID:** `PM-050-IGOR-MESSAGES-CLEANUP-20260926-1427`. **Source:** [PR #61 comment #5847030797](https://github.com/lelik112/parrot669/pull/61#issuecomment-5847030797). **Related task:** PM-050. **Handoff:** после закрытия PM-048 Игорю передана узкая Messages cleanup: убрать email-help и обычный Refresh, сохранить polling 15 секунд, focus/visibility resume, error recovery и auth-state clearing; общий header PM-049, BUG-020/PM-026, backend email и смена частоты исключены. Это доставка, не claim. **Next:** fresh shared-file check, Model check Sol 4/6, отдельный signed claim и узкий PR.
