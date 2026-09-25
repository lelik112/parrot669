# PM-034-FE — технический аудит frontend

**Title:** детально проверить frontend находки обзорного [PM-034](PM-034-backend-frontend-refactoring-audit.md).

**Status:** done — read-only frontend report submitted 2026-09-25; Mark to synthesize PM-034. **Priority:** P2. **Owner:** Денис — предполагаемый исполнитель; факт начала фиксируется только его подписанным claim.

**Agent:** Денис / Developer. **Role:** Developer. **Scope:** только read-only frontend аудит в `lelik112/parrot669`, отчёт; без реализации.

**Recommended model:** Sol. **Recommended reasoning:** Medium. **Reason:** ограниченный обзор UI-модулей и переходов между страницами; сложность выше при подтверждённом пересечении с авторизацией, тогда сначала объяснить повышение. **Model check:** Денис подтверждает или мотивированно предлагает изменение до работы.

## Goal

Доказать или опровергнуть frontend гипотезы Марка, сохранив приоритет гостевого поиска и контакта.

## Problem / Context

Обзор [PM-034](PM-034-backend-frontend-refactoring-audit.md) нашёл большой `host.js` (~97 KB) с состоянием авторизации, профиля, объекта и календаря, а также разные API/auth пути в host, search и messages. Размер файла и различие функций сами по себе не означают дефект. [BUG-021](BUG-021-blocking-signs-out-host.md) пока не воспроизведён, не приписывать его frontend. PM-020/021/023–028 и связанные UI задачи ждут QA.

## Requirements

- Сверить свежий main и claims; записать `Agent / Role / Scope / Model check / дата / next`. Не пересекаться с активным узким исправлением Дениса или Игоря.
- Проверить реальные сценарии: вход/выход и 401/403/5xx; публикация объекта и редактирование свободных дат; поиск → контакт → сообщения; переход из диалога к объекту/профилю. Посмотреть состояния форм, refresh и язык, при необходимости mobile/desktop.
- Сравнить `host.js` с `host-address.js`, `calendar-verification.js`, `messaging-common.js`, `search.js`, `messages.js`: указать конкретные пересечения или повторы и какие уже есть тесты. API/auth пути различать по бизнес-причине, не предлагать общий модуль ради формы.
- Если предложено точечное выделение: назвать границу, состояние, инварианты, тесты и минимальный порядок без изменения URL и пользовательского поведения. Отдельно записать гипотезы, которые не подтвердились.
- Результат в этой карточке или подписанном `docs/tasks/logs/PM-034-frontend.md`, ссылка сюда.

## Acceptance criteria

- Есть ссылки на точные файлы/функции и конкретный flow или пример изменения для каждой находки.
- Для каждой рекомендации: влияние на доступность/поиск/контакт/выпуск, размер S/M/L, риск Low/Medium/High, минимальный вариант, проверка регресса, приоритет NOW/NEXT/LATER/DO NOT TOUCH.
- Не названа причина BUG-021 без воспроизведения и не запущен UI rewrite по одному размеру `host.js`.
- Передан отчёт Марку для сводки PM-034; статус `done` только у этой дочерней карточки после отчёта.

## Not doing

Код, PR, перенос всего frontend в framework, смена auth/cookie/QA-origin, новая фича, изменение продукта под видом аудита.

## Dependencies

P1 QA и подтверждённые UX-дефекты приоритетнее; backend аудит [PM-034-BE](PM-034-BE-backend-audit.md) идёт независимо по своей карточке. Репозиторий не будит Дениса автоматически.

## Discussion / Updates

- 2026-09-25 14:29 UTC — **Agent:** Денис. **Role:** Developer. **Scope:** read-only аудит frontend по PM-034-FE, отчёт с проверяемыми находками; код и API не менять. **Model check:** Sol / Medium достаточно для обзора указанных модулей и сопоставления текущих тестов; если auth-пересечение потребует более глубокого решения, зафиксирую границу как отдельную задачу. **Change:** claim после выпуска BUG-023 в QA. **Related task:** PM-034-FE. **Next:** сверить свежий main и сообщения команды, проверить конкретные сценарии и функции, передать Марку отчёт.

## Frontend audit report — Денис / Developer, 2026-09-25

**Baseline:** frontend main after BUG-023 PR #45, no code changes for this audit. Examined `public/assets/host.js`, `host-address.js`, `calendar-verification.js`, `messaging-common.js`, `messages.js`, `search.js`, Worker `src/index.js`, and relevant `tests/*.test.cjs`. PM-034-BE is separate; no competing frontend implementation claim found. BUG-021's cause is unverified and is not inferred here.

### Findings and recommendations

| ID / evidence and flow | Effect; size; risk | Minimum recommendation; regression; priority |
| --- | --- | --- |
| **FE-1 — unsaved property draft disappears on language change.** [host.js](../../public/assets/host.js) `applyLanguage` (~250–270) calls `renderProperties` without checking dirty state; `renderProperties` (~1131–1140) resets `unsavedHostChanges` and replaces all property cards. Repro from code: expand an object, edit its title or stay conditions, click EN/ES/CA/RU before Save. The form node and values are removed without the navigation warning. Existing navigation test in `tests/auth-ui.test.cjs` (~912) checks link exit and account-specific return, but not a language change with a dirty form. | User loses an unpublished edit. **S**, **Low–Medium** risk for a focused guard; larger if form state is preserved across rerenders. | Before a language rerender, prompt with existing `discardChanges` for dirty property forms, or preserve a per-form draft and restore it. Keep selected language and existing URLs. Add a test with a changed title, cancel/accept and all four languages; ensure cancel retains input and accept updates labels. **NOW** (P2 UX defect; Mark to triage into a narrow task). |
| **FE-2 — dashboard refresh can overwrite unrelated form drafts.** `syncCalendar`/`setCalendarEnabled`/`connectCalendar` in [host.js](../../public/assets/host.js) (~944–987) call `syncDashboard`; it writes `hostProfileForm.elements.displayName.value` (~416–425) from server and calls `renderProperties` (~439–440). Repro from code: type a new public host name but do not save, then sync the calendar; the name reverts. The same rerender removes unsaved edits in another property form. `hostProfileForm` is outside the property-panel dirty listeners (~113–120), so it has no exit warning either. `tests/auth-ui.test.cjs` tests save/400 and independent calendar actions, but not interleaved drafts. | Loss of edited name or another property draft; PM-021 impact. **M**, **Medium** risk because multiple forms and asynchronous refresh are involved. | Track dirty state per form; refresh only data affected by the calendar operation or preserve and restore draft values on dashboard refresh. Save success should clear only its own dirty state. Test edit name/property, complete calendar sync, retain draft; then save and reload. **NEXT**, promote to NOW if QA reproduces during PM-021 acceptance. |
| **FE-3 — transient dashboard failure empties an existing property list.** `syncDashboard` catch (~451–460) clears `state.properties` for every error, including 5xx or network, then `renderProperties` displays `noProperties` (~1139–1150), despite an authenticated session and earlier loaded objects. This is code-path evidence, not a live incident. | Misleading empty state on failed refresh; **S**, **Low–Medium** risk. | Preserve the last loaded list for non-401 errors and keep the visible error; on first load show a retry state rather than “No properties yet”. Retain sign-out handling on 401. Test loaded objects → dashboard 503 and first-load 503 separately. **NEXT**. |

### API/auth matrix and hypotheses not confirmed

| Flow | Current behavior / evidence | Conclusion |
| --- | --- | --- |
| Host login, dashboard, writes | `host.js api()` (~294–326) uses `/api/host/*`, same-origin cookie, JSON error mapping; 401 on dashboard clears session, 400 form saves retain input, 5xx uses server/detail error. Worker allowlist/rewrite in `src/index.js` controls each path. BUG-023 proved a missing route; [PR #45](https://github.com/lelik112/parrot669/pull/45) fixed only profile PATCH and added a production/QA proxy test. | Do a narrow route-contract inventory when adding new host endpoints. No evidence that replacing the host request helper is needed. |
| Guest search → contact | `search.js` (~172–220, ~376–397) calls public locations/search directly; 5xx produces localized generic error and keeps search controls usable. `messaging-common.js attachContact` (~153–177) checks account/self and builds the Messages link. `tests/search-ui.test.cjs` covers filters, old responses and contact paths. | Public search has no host session requirement; its different request path is intentional. No shared auth abstraction proposed. |
| Messages and cross-page session | `messaging-common.js request()` (~87–103) applies a 15s timeout; `refreshSession` and `refreshUnread` (~114–138) clear user on 401 and tolerate transient failure. `messages.js activateSession` (~280–310) changes account-scoped drafts and view; cross-page return context is account-bound. `tests/messaging-ui.test.cjs` covers account switching/drafts, `tests/qa-origin.test.cjs` covers cookie/QA headers. | Different timeout and account-draft handling serve Messages flows. No demonstrated need to unify these modules with host API. Do not attribute BUG-021 to this difference. |
| 403 and 5xx across screens | Host exposes server detail for most errors; Messages maps common statuses to translated guidance; public search gives generic error. | Behavior differs by business context. FE-3 is a concrete 5xx presentation issue; a general-purpose error rewrite has no demonstrated benefit now. |

**Suggested order:** Mark creates narrow FE-1 and FE-2/FE-3 tasks after P1 QA triage; confirm FE-2 with a host draft + calendar sync in QA. Keep current URLs, auth/cookie boundary and search/contact behavior. No framework migration or extraction based solely on the size of `host.js`. This audit made no product decision and no implementation change.

- 2026-09-25 — **Agent:** Денис. **Role:** Developer. **Change:** submitted read-only report with code paths, impact, estimates, priorities, test seams and rejected hypotheses. **Related task:** PM-034-FE. **Next:** Марк incorporates findings into PM-034 and decides whether to create narrow tasks; Boris retains P1 acceptance ownership.
