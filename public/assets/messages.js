(() => {
  "use strict";
  const M = window.ParrotMessaging, t = M.t, node = M.node;
  const $ = id => document.getElementById(id);
  const app = $("messages-app"), historyNode = $("msg-history"), form = $("msg-compose");
  const loginForm = $("msg-login-form"), registerForm = $("msg-register-form");
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let actor = null, accountVersion = 0, threadVersion = 0, inboxVersion = 0;
  let active = null, inbox = [], nextCursor = null, inboxBusy = false, pollBusy = false;
  let messages = new Map(), fetchedThrough = 0, readThrough = 0, readBusy = false;
  let sending = false, pending = null, authBusy = false, threadError = null;

  function status(text = "", error = false, target = $("msg-status")) {
    target.textContent = text; target.classList.toggle("error", error);
    target.setAttribute("role", error ? "alert" : "status");
  }
  function failed(error, target = $("msg-status")) {
    if (error.status === 401) { M.setUser(null); target = $("msg-status"); }
    if (target === $("msg-thread-notice")) threadError = error;
    status(M.errorText(error), true, target);
  }
  function dateLabel(value) {
    return new Intl.DateTimeFormat(document.documentElement.lang, {day:"numeric", month:"short", year:"numeric", timeZone:"UTC"})
      .format(new Date(value + "T12:00:00Z"));
  }
  function validDates(from, to) {
    if (!from && !to) return true;
    const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
    return valid(from) && valid(to) && to > from;
  }
  function queryDates() {
    const query = new URLSearchParams(window.location.search);
    const from = query.get("from") || "", to = query.get("to") || "";
    return validDates(from,to) ? {from,to} : {from:"",to:""};
  }
  function draftKey(context = active) {
    return actor && context ? `parrot669-draft:${actor.accountId}:${context.id || `property:${context.propertyId}`}` : null;
  }
  function saveDraft() {
    const key = draftKey(); if (!key) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({body:form.elements.body.value,
        from:form.elements.from.value, to:form.elements.to.value, pending, savedAt:Date.now()}));
    } catch {}
  }
  function removeDraft(key) { try { if (key) sessionStorage.removeItem(key); } catch {} }
  function restoreDraft(dates = {}) {
    let draft = null;
    try {
      draft = JSON.parse(sessionStorage.getItem(draftKey()) || "null");
      if (draft?.savedAt < Date.now() - 86400000 || typeof draft?.body !== "string") draft = null;
    } catch {}
    form.reset();
    form.elements.body.value = draft?.body || "";
    form.elements.from.value = draft?.from || dates.from || "";
    form.elements.to.value = draft?.to || dates.to || "";
    pending = draft?.pending || null;
    if (pending && !(uuid.test(pending.payload?.clientMessageId) &&
      (pending.endpoint === "/conversations" && pending.payload.propertyId === active.propertyId ||
       pending.endpoint === `/conversations/${active.id}/messages`))) pending = null;
    $("msg-dates").open = Boolean(form.elements.from.value || form.elements.to.value);
    updateComposer();
  }
  function setUrl(id) {
    const url = new URL(window.location.href); url.search = "";
    if (id) url.searchParams.set("conversation", id);
    window.history.replaceState(null, "", url.pathname + url.search);
  }
  function updateComposer() {
    form.hidden = !active?.canReply;
    for (const input of form.querySelectorAll("textarea,input")) input.disabled = sending || Boolean(pending);
    $("msg-send").disabled = sending || !active?.canReply;
    $("msg-send").textContent = t(sending ? "sending" : pending ? "pendingRetry" : "send");
    $("msg-block").hidden = !active?.id;
    $("msg-block").textContent = t(active?.blockedByMe ? "unblock" : "block");
    const notice = active?.blockedByMe ? "blockedMe" : active?.blockedByOther ? "blockedOther" :
      active?.id && !active.propertyId ? "errorDeleted" : active?.self ? "noSelf" :
      active && !active.canReply ? "errorDisabled" : pending ? "pendingUnknown" : null;
    status(threadError ? M.errorText(threadError) : notice ? t(notice) : "", Boolean(pending || threadError), $("msg-thread-notice"));
  }
  function renderContext() {
    $("msg-property").textContent = active?.propertyTitle || t("newEnquiry");
    $("msg-other").textContent = active?.otherDisplayName || "";
    updateComposer();
  }
  function renderInbox() {
    const list = $("msg-list"); list.replaceChildren();
    for (const item of inbox) {
      const button = node("button", "messages-conversation"); button.type = "button";
      button.setAttribute("aria-current", String(item.id === active?.id));
      button.append(node("strong", "", item.propertyTitle), node("span", "", item.otherDisplayName), node("small", "", item.lastMessagePreview));
      if (item.unreadCount) button.append(node("span", "messaging-badge", item.unreadCount > 99 ? "99+" : item.unreadCount));
      button.addEventListener("click", () => void openConversation(item.id)); list.append(button);
    }
    $("msg-more").hidden = !nextCursor;
    status(inbox.length ? "" : t("emptyInbox"), false, $("msg-inbox-status"));
  }
  async function loadInbox(more = false) {
    if (!actor || inboxBusy) return;
    inboxBusy = true; const version = accountVersion, request = ++inboxVersion;
    $("msg-more").disabled = true; $("msg-refresh").disabled = true;
    try {
      const cursor = more && nextCursor ? `&cursor=${encodeURIComponent(nextCursor)}` : "";
      const page = await M.api(`/conversations?limit=20${cursor}`);
      if (version !== accountVersion || request !== inboxVersion) return;
      const merged = new Map(inbox.map(item => [item.id,item]));
      page.items.forEach(item => merged.set(item.id,item));
      inbox = [...merged.values()].sort((a,b) => Date.parse(b.updatedAt)-Date.parse(a.updatedAt) || b.id.localeCompare(a.id));
      if (more || inbox.length <= 20) nextCursor = page.nextCursor;
      renderInbox();
    } catch (error) { if (version === accountVersion) failed(error,$("msg-inbox-status")); }
    finally { if (version === accountVersion) { inboxBusy = false; $("msg-more").disabled = false; $("msg-refresh").disabled = false; } }
  }
  function atBottom() { return historyNode.scrollHeight - historyNode.scrollTop - historyNode.clientHeight < 45; }
  function threadVisible() { return !document.hidden && document.hasFocus() && historyNode.getClientRects().length > 0; }
  function renderMessages({bottom = false, older = false} = {}) {
    const previousHeight = historyNode.scrollHeight, previousTop = historyNode.scrollTop;
    const wasBottom = atBottom();
    historyNode.replaceChildren();
    for (const item of [...messages.values()].sort((a,b) => a.sequence-b.sequence)) {
      const bubble = node("article", `message-bubble${item.senderProfileId === actor?.profile.id ? " mine" : ""}`);
      if (item.from && item.to) bubble.append(node("p", "message-stay", `${t("savedDates")}: ${dateLabel(item.from)} → ${dateLabel(item.to)}`));
      bubble.append(node("p", "", item.body));
      const time = node("time", "", new Intl.DateTimeFormat(document.documentElement.lang,
        {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(item.createdAt)));
      time.dateTime = item.createdAt; bubble.append(time); historyNode.append(bubble);
    }
    $("msg-earlier").hidden = !messages.size || Math.min(...messages.keys()) <= 1;
    if (older) historyNode.scrollTop = previousTop + historyNode.scrollHeight - previousHeight;
    else if (bottom || wasBottom) historyNode.scrollTop = historyNode.scrollHeight;
    else historyNode.scrollTop = previousTop;
    $("msg-jump").hidden = atBottom();
    requestAnimationFrame(() => void acknowledgeRead());
  }
  async function acknowledgeRead() {
    if (!active?.id || readBusy || !atBottom() || !threadVisible() || fetchedThrough <= readThrough) return;
    const version = threadVersion, id = active.id, sequence = fetchedThrough;
    readBusy = true;
    try {
      const value = await M.api(`/conversations/${id}/read`, {method:"PUT", body:JSON.stringify({throughSequence:sequence})});
      if (version !== threadVersion) return;
      readThrough = Math.max(readThrough,value.throughSequence);
      // Only a fresh server count can account for a simultaneous incoming message.
      void loadInbox(); void M.refreshUnread();
    } catch (error) { if (error.status === 401 && version === threadVersion) M.setUser(null); }
    finally { if (version === threadVersion) readBusy = false; }
  }
  async function fetchMessages(version, {initial = false, older = false} = {}) {
    const id = active.id;
    let after = older ? Math.max(0,Math.min(...messages.keys()) - 51) : initial ? Math.max(0,active.lastSequence-50) : fetchedThrough;
    const page = await M.api(`/conversations/${id}/messages?afterSequence=${after}&limit=${older ? 50 : 100}`);
    if (version !== threadVersion) return;
    let changed = false;
    for (const item of page.items) { if (!messages.has(item.sequence)) changed = true; messages.set(item.sequence,item); }
    if (!older && page.items.length) fetchedThrough = Math.max(fetchedThrough,page.items.at(-1).sequence);
    // A previous send may have committed even when its response was lost.
    if (pending && page.items.some(item => item.senderProfileId === actor.profile.id && item.clientMessageId === pending.payload.clientMessageId)) {
      pending = null; threadError = null; form.reset(); removeDraft(draftKey()); updateComposer();
    }
    if (initial || changed) renderMessages({bottom:initial, older});
    if (!older && page.nextAfterSequence) await fetchMessages(version);
  }
  function prepareThread() {
    saveDraft(); threadVersion++; messages = new Map(); fetchedThrough = 0; readThrough = 0; readBusy = false;
    sending = false; pending = null; active = null; threadError = null;
    form.reset(); form.hidden = true; $("msg-thread").hidden = false; $("msg-empty").hidden = true;
    $("msg-block").disabled = false; $("msg-earlier").disabled = false;
    $("msg-earlier").hidden = true; $("msg-jump").hidden = true;
    historyNode.replaceChildren(); app.classList.add("has-thread");
    renderContext();
    status(t("loading"), false, $("msg-thread-notice"));
    return threadVersion;
  }
  async function openConversation(id, dates = {}, known = null) {
    if (!uuid.test(id)) return status(t("errorMissing"),true);
    const version = prepareThread();
    try {
      const detail = known || await M.api(`/conversations/${id}`);
      if (version !== threadVersion) return;
      active = detail; readThrough = detail.readThroughSequence;
      setUrl(id); restoreDraft(dates); renderContext(); renderInbox(); status();
      await fetchMessages(version,{initial:true});
    } catch (error) { if (version === threadVersion) failed(error,$("msg-thread-notice")); }
  }
  async function openEnquiry(propertyId, dates) {
    const version = prepareThread();
    try {
      const [options, existing] = await Promise.all([M.api(`/contact-options/${propertyId}`), M.api(`/conversations/for-property/${propertyId}`)]);
      if (version !== threadVersion) return;
      if (existing) {
        // Move a pending first send to its server-created conversation without changing its idempotency key.
        try {
          const oldKey = `parrot669-draft:${actor.accountId}:property:${propertyId}`;
          const draft = sessionStorage.getItem(oldKey);
          if (draft) { sessionStorage.setItem(`parrot669-draft:${actor.accountId}:${existing.id}`,draft); sessionStorage.removeItem(oldKey); }
        } catch {}
        return await openConversation(existing.id,dates,existing);
      }
      active = {id:null,propertyId,propertyTitle:options.propertyTitle,otherDisplayName:options.hostDisplayName,
        self:options.hostProfileId === actor.profile.id,
        canReply:options.acceptingNewConversations && options.hostProfileId !== actor.profile.id};
      restoreDraft(dates); renderContext(); status();
    } catch (error) { if (version === threadVersion) failed(error,$("msg-thread-notice")); }
  }
  async function poll() {
    if (!actor || pollBusy || document.hidden) return;
    pollBusy = true; const version = threadVersion, account = accountVersion;
    try {
      await loadInbox();
      if (version !== threadVersion || !active?.id) return;
      const detail = await M.api(`/conversations/${active.id}`);
      if (version !== threadVersion) return;
      active = detail; renderContext();
      await fetchMessages(version); await acknowledgeRead();
    } catch (error) { if (version === threadVersion) failed(error,$("msg-thread-notice")); }
    finally { if (account === accountVersion) pollBusy = false; }
  }
  function activateSession(user) {
    saveDraft(); actor = user; accountVersion++; threadVersion++; inboxVersion++;
    inboxBusy = false; pollBusy = false; readBusy = false; sending = false;
    active = null; inbox = []; nextCursor = null; messages = new Map(); pending = null; threadError = null;
    historyNode.replaceChildren(); $("msg-list").replaceChildren(); form.reset();
    $("msg-property").textContent = ""; $("msg-other").textContent = "";
    $("msg-auth").hidden = Boolean(user); app.hidden = !user; $("msg-account").hidden = !user;
    $("msg-account-name").textContent = user?.username || "";
    $("msg-thread").hidden = true; $("msg-empty").hidden = false; app.classList.remove("has-thread");
    if (!user) return;
    status(); $("msg-session-retry").hidden = true;
    void loadInbox();
    const query = new URLSearchParams(window.location.search);
    if (uuid.test(query.get("conversation") || "")) void openConversation(query.get("conversation"));
    else if (uuid.test(query.get("property") || "")) void openEnquiry(query.get("property"),queryDates());
  }
  async function boot() {
    status(t("loading")); $("msg-session-retry").hidden = true;
    try { await M.refreshSession(); status(); }
    catch (error) { status(M.errorText(error),true); $("msg-session-retry").hidden = false; }
  }
  function switchAuth(mode) {
    if (authBusy) return;
    loginForm.hidden = mode !== "login"; registerForm.hidden = mode !== "register";
    document.querySelectorAll("[data-msg-auth]").forEach(button => button.setAttribute("aria-pressed",String(button.dataset.msgAuth === mode)));
  }
  function busyAuth(busy) {
    authBusy = busy;
    $("msg-auth").querySelectorAll("input,button").forEach(el => el.disabled = busy);
  }
  for (const [authForm,path] of [[loginForm,"/login"],[registerForm,"/register"]]) {
    authForm.addEventListener("submit", async event => {
      event.preventDefault(); if (authBusy || !authForm.reportValidity()) return;
      const values = Object.fromEntries(new FormData(authForm));
      busyAuth(true); status(t("loading"));
      try {
        const result = await M.auth(path,{method:"POST",body:JSON.stringify(values)});
        if (path === "/login") { M.setUser(result); status(); }
        else {
          try { localStorage.setItem("parrot669-message-return",JSON.stringify({path:window.location.pathname+window.location.search,expires:Date.now()+86400000})); } catch {}
          status(t("registered")); loginForm.elements.login.value = values.email;
          busyAuth(false); switchAuth("login");
        }
      } catch (error) {
        status(error.status === 401 && !error.message.includes("verification") ? t("authError") : M.errorText(error),true);
      } finally { authForm.elements.password.value = ""; busyAuth(false); }
    });
  }
  $("msg-logout").addEventListener("click", async () => {
    const account = actor?.accountId; $("msg-logout").disabled = true;
    try { await M.auth("/logout",{method:"POST"}); M.setUser(null); M.clearDrafts(account); status(); }
    catch (error) { failed(error); }
    finally { $("msg-logout").disabled = false; }
  });
  document.querySelectorAll("[data-msg-auth]").forEach(button => button.addEventListener("click",() => switchAuth(button.dataset.msgAuth)));
  form.addEventListener("input", () => {
    threadError = null; updateComposer();
    for (const input of form.querySelectorAll("textarea,input")) input.setCustomValidity("");
    if (!sending && !pending) saveDraft();
  });
  form.addEventListener("submit", async event => {
    event.preventDefault(); if (sending || !actor || !active?.canReply) return;
    const body = form.elements.body.value.trim(), from = form.elements.from.value, to = form.elements.to.value;
    form.elements.body.setCustomValidity(!body || [...body].length > 4000 ? t("characterLimit") : "");
    form.elements.to.setCustomValidity(validDates(from,to) ? "" : t("invalidDates"));
    if (!pending && !form.reportValidity()) return;
    if (!pending) {
      const payload = {clientMessageId:crypto.randomUUID(),body,...(from && to ? {from,to} : {})};
      if (!active.id) payload.propertyId = active.propertyId;
      pending = {endpoint:active.id ? `/conversations/${active.id}/messages` : "/conversations",payload};
    }
    const attempt = pending, version = threadVersion, key = draftKey();
    saveDraft(); sending = true; threadError = null; updateComposer();
    try {
      const response = await M.api(attempt.endpoint,{method:"POST",body:JSON.stringify(attempt.payload)});
      if (!(response?.id || response?.conversationId)) throw new Error("Invalid send response");
      if (version !== threadVersion) return;
      removeDraft(key);
      pending = null; form.reset(); $("msg-dates").open = false; status();
      if (response.conversationId && !active.id) await openConversation(response.conversationId);
      else {
        // Fetch from the last contiguous server cursor, not from the returned send sequence.
        await fetchMessages(version); await loadInbox();
      }
    } catch (error) {
      if (version !== threadVersion) return;
      if (error.status && error.status < 500) pending = null;
      saveDraft(); failed(error,$("msg-thread-notice"));
      if (error.status === 409) void poll();
    } finally {
      if (version === threadVersion) { sending = false; updateComposer(); }
    }
  });
  $("msg-block").addEventListener("click", async () => {
    if (!active?.id || !actor) return;
    const version = threadVersion, id = active.id, blocked = !active.blockedByMe;
    if (blocked && !window.confirm(t("confirmBlock"))) return;
    $("msg-block").disabled = true;
    try {
      await M.api(`/conversations/${id}/block`,{method:"PUT",body:JSON.stringify({blocked})});
      if (version !== threadVersion) return;
      const detail = await M.api(`/conversations/${id}`);
      if (version !== threadVersion) return;
      active = detail; threadError = null;
      renderContext(); await loadInbox();
    } catch (error) { if (version === threadVersion) failed(error,$("msg-thread-notice")); }
    finally { if (version === threadVersion) $("msg-block").disabled = false; }
  });
  $("msg-earlier").addEventListener("click", async () => {
    if (!active?.id || !messages.size) return;
    const version = threadVersion; $("msg-earlier").disabled = true;
    try { await fetchMessages(version,{older:true}); }
    catch (error) { if (version === threadVersion) failed(error,$("msg-thread-notice")); }
    finally { if (version === threadVersion) $("msg-earlier").disabled = false; }
  });
  $("msg-back").addEventListener("click", () => {
    saveDraft(); threadVersion++; active = null; pending = null; sending = false; messages.clear();
    $("msg-thread").hidden = true; $("msg-empty").hidden = false; app.classList.remove("has-thread"); setUrl(null); renderInbox();
  });
  $("msg-jump").addEventListener("click", () => { historyNode.scrollTop = historyNode.scrollHeight; void acknowledgeRead(); });
  historyNode.addEventListener("scroll", () => { $("msg-jump").hidden = atBottom(); void acknowledgeRead(); });
  $("msg-more").addEventListener("click", () => void loadInbox(true));
  $("msg-refresh").addEventListener("click", () => void poll());
  $("msg-session-retry").addEventListener("click", () => void boot());
  window.addEventListener("pagehide",saveDraft);
  window.addEventListener("focus", () => void M.refreshSession().then(poll).catch(() => {}));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void poll(); });
  setInterval(() => void poll(),15000);
  function language(value) {
    document.documentElement.lang = value; document.title = `PARROT 669 — ${t("messages")}`;
    $("msg-search-link").textContent = {en:"Find availability",es:"Buscar disponibilidad",ca:"Cercar disponibilitat",ru:"Найти жильё"}[value];
    $("msg-host-link").textContent = {en:"For hosts",es:"Para propietarios",ca:"Per a propietaris",ru:"Владельцам"}[value];
    document.querySelectorAll("[data-msg-lang]").forEach(button => button.classList.toggle("active",button.dataset.msgLang === value));
    if (actor) { renderInbox(); if (active) { renderContext(); renderMessages(); } }
  }
  M.onLanguage(language);
  document.querySelectorAll("[data-msg-lang]").forEach(button => button.addEventListener("click",() => {
    try { localStorage.setItem("parrot669-language",button.dataset.msgLang); } catch {}
    M.setLanguage(button.dataset.msgLang);
  }));
  try { M.setLanguage(localStorage.getItem("parrot669-language") || navigator.language.slice(0,2)); } catch { M.setLanguage("en"); }
  M.onSession(activateSession); void boot();
})();
