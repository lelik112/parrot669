# BUG-021 — Блокировка собеседника разлогинивает владельца

**Title:** после блокировки переписки аккаунт владельца неожиданно теряет вход.
**Status:** reported — one earlier signout observation; controlled block/unblock repeat on QA Worker did not reproduce it. Root cause of earlier observation remains unknown. **Priority:** P2.
**Owner:** Марк / PM — назначить разработчика после подтверждения; QA: Борис.
**Agent:** Борис. **Role:** QA. **Scope:** пользовательская проверка блокировки пары и состояния сессии; код не менялся.
**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** диагностика должна сопоставить состояние сессии и результат block API с UI Messages; причина пока неизвестна. Если подтвердится пересечение с PM-029 auth security, исполнитель обоснует повышение по D005. **Model check:** будущий Developer до реализации; claim отсутствует.

## Goal

Владелец блокирует нежелательного собеседника и остаётся авторизованным, может понять состояние блокировки и при необходимости отменить её.

## Steps to reproduce

1. Войти под владельцем и открыть существующий диалог с другим тестовым аккаунтом.
2. Нажать «Заблокировать собеседника».
3. Подтвердить системный диалог браузера.

## Actual behavior

В live QA-сеансе после подтверждения основная вкладка перешла к экрану входа без признака авторизованного пользователя. Второй участник увидел «Собеседник заблокировал переписку». Повтор пока не выполнен; причина (разлогинивание, ошибка ответа API или другое состояние UI) не установлена.

## Expected behavior

Блокировка ограничивает переписку пары, сохраняя активный сеанс владельца и явный способ отменить блокировку.

## User impact

Владелец может принять неожиданную потерю входа за успешное завершение действия, не понять как снять блок и потерять контроль над тестовым аккаунтом.

## Evidence / limits

- 2026-09-25, production desktop Cloud Chrome: до действия аккаунт владельца отображался как `lelik`. Нажатие вызвало JavaScript confirm; после подтверждения основной origin показывал форму входа, а сеанс собеседника показывал текст о блокировке.
- При последующем защищённом входе на основном origin в интерфейсе появился `qa` (пользователь подтвердил, что ввёл логин `qa`). Это не восстанавливает владельца `lelik`; сейчас отдельный вход lelik недоступен QA без нового безопасного входа.
- Пара остаётся заблокирована. Свойства объекта/календарь/цены не менялись; одно тестовое обращение и ответ остаются в диалоге.
- Это единичное наблюдение, не утверждение о первопричине. Нужен повтор с двумя управляемыми сеансами и проверка logout/response.

## Next

Марк назначает разработчика на диагностику после проверки, что текущий тестовый блок можно безопасно снять. QA повторяет блокировку, проверяет, что владелец остаётся вошедшим, затем разблокирует пару и подтверждает восстановление отправки.


## PM triage — 2026-09-25

**Agent:** Марк. **Role:** Product Manager. **Change:** сохраняю P2 до безопасного воспроизведения: единичное наблюдение, неизвестно, была ли потеря сессии результатом block API, UI или последующего входа `qa`. Влияние на основной путь и QA восстановление существенное; если подтверждается воспроизводимое разлогинивание владельца, поднять до P1. **Related task:** BUG-021 / PM-003 / PM-016 / PM-029. **Next:** Алексей помогает восстановить отдельный вход `lelik` без передачи пароля в docs; Борис повторяет block/unblock и фиксирует безопасные network status/версию; после evidence Марк отдаёт узкую диагностику свободному разработчику (кандидат Денис для Messages UI, при обнаружении backend/auth границы согласовать с Игорем). Нового claim разработчика этой записью нет.

- 2026-09-25 ~15:25 UTC — **Agent:** Борис. **Role:** QA. **Scope:** production desktop Cloud Chrome; `lelik` host on QA Worker origin, `qa` guest on main, existing conversation. **Change:** clicked Block and accepted browser confirm. Host remained `lelik` with Logout and “Разблокировать собеседника”; after reload guest remained `qa` and saw “Собеседник заблокировал переписку.” Host clicked Unblock; host remained `lelik` with Block action restored, guest after reload regained message composer and Send. Pair left unblocked. **Result:** prior signout did not reproduce in this origin/account placement. Earlier single observation remains unresolved; shared browser cookie jar with another QA is a possible confounder, not established cause. **Assignment:** Марк / PM triage; developer not assigned; Борис / QA. **Related task:** BUG-021 / PM-003 / PM-016.
