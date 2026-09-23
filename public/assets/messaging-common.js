(() => {
  "use strict";
  const texts = {
    en: {
      messages:"Messages", writeHost:"Message host", conversations:"Conversations", emptyInbox:"No conversations yet. Start from a property in search.", chooseConversation:"Choose a conversation", from:"Check-in", to:"Check-out", datesOptional:"Stay dates (optional)", send:"Send message", sending:"Sending…", messageLabel:"Your message", placeholder:"Ask about the property or the stay…", loading:"Loading…", retry:"Try again", loadMore:"More conversations", earlier:"Earlier messages", backList:"All conversations", refresh:"Refresh", newEnquiry:"New enquiry", privacy:"Your email and phone number are not shared automatically.", notBooking:"A message does not reserve the property.", login:"Log in", register:"Create account", loginLabel:"Email or username", password:"Password", username:"Username", displayName:"Display name", email:"Email", passwordHelp:"At least 10 characters.", usernameHelp:"Unique, case-insensitive. No @ symbol.", authLead:"Log in to message hosts and see your conversations.", registered:"Account created. Check your email (including spam), confirm it, then return here.", logout:"Log out", sessionExpired:"Log in again to continue. Your draft is kept for your account.", errorNetwork:"Could not connect. Please try again.", errorRate:"Too many messages. Wait a little and try again.", errorBlocked:"Messaging is blocked between these participants.", errorDisabled:"This host is not accepting new enquiries. Existing conversations remain available in Messages.", errorDeleted:"This property was deleted. You can still read the conversation.", errorMissing:"This conversation or property is unavailable.", errorInput:"Check the message and dates.", hostSetting:"Accept messages about my properties", hostSettingHelp:"Guests can start a private conversation. Turning this off stops new enquiries; existing conversations stay open.", settingSaved:"Saved", block:"Block participant", unblock:"Unblock participant", confirmBlock:"Block this participant? Neither of you will be able to send messages to the other, including about other properties. History stays available.", blockedMe:"You blocked this participant. Unblock to resume messaging.", blockedOther:"This participant has blocked messaging.", pendingRetry:"Retry sending", pendingUnknown:"Delivery was not confirmed. Retry the same message safely; it will not be duplicated.", invalidDates:"Choose both dates. Check-out must be after check-in.", noSelf:"This is your property. You can reply to guests from your inbox.", newMessages:"New messages ↓", characterLimit:"Use 1–4000 characters.", authError:"Check your email/username and password.", verifyFirst:"Confirm your email before logging in.", draftRestored:"Draft restored", closed:"Read-only conversation", savedDates:"Stay", settingsTitle:"Guest messages"
    },
    es: {
      messages:"Mensajes", writeHost:"Escribir al propietario", conversations:"Conversaciones", emptyInbox:"Aún no hay conversaciones. Empieza desde una vivienda en la búsqueda.", chooseConversation:"Elige una conversación", from:"Entrada", to:"Salida", datesOptional:"Fechas de estancia (opcional)", send:"Enviar mensaje", sending:"Enviando…", messageLabel:"Tu mensaje", placeholder:"Pregunta por la vivienda o la estancia…", loading:"Cargando…", retry:"Reintentar", loadMore:"Más conversaciones", earlier:"Mensajes anteriores", backList:"Todas las conversaciones", refresh:"Actualizar", newEnquiry:"Nueva consulta", privacy:"Tu email y teléfono no se comparten automáticamente.", notBooking:"Un mensaje no reserva la vivienda.", login:"Entrar", register:"Crear cuenta", loginLabel:"Email o usuario", password:"Contraseña", username:"Usuario", displayName:"Nombre visible", email:"Email", passwordHelp:"Al menos 10 caracteres.", usernameHelp:"Único, sin distinguir mayúsculas. Sin @.", authLead:"Entra para escribir a propietarios y ver tus conversaciones.", registered:"Cuenta creada. Revisa tu correo (también spam), confírmalo y vuelve aquí.", logout:"Salir", sessionExpired:"Vuelve a entrar para continuar. Tu borrador se conserva para tu cuenta.", errorNetwork:"No se pudo conectar. Inténtalo de nuevo.", errorRate:"Demasiados mensajes. Espera un poco y vuelve a intentarlo.", errorBlocked:"La comunicación entre estos participantes está bloqueada.", errorDisabled:"Este propietario no acepta nuevas consultas. Las conversaciones existentes siguen en Mensajes.", errorDeleted:"La vivienda se ha eliminado. Puedes seguir leyendo la conversación.", errorMissing:"La conversación o vivienda no está disponible.", errorInput:"Revisa el mensaje y las fechas.", hostSetting:"Aceptar mensajes sobre mis viviendas", hostSettingHelp:"Los huéspedes pueden iniciar una conversación privada. Al desactivarlo se impiden nuevas consultas; las conversaciones existentes siguen abiertas.", settingSaved:"Guardado", block:"Bloquear participante", unblock:"Desbloquear participante", confirmBlock:"¿Bloquear a este participante? Ninguno podrá escribir al otro, tampoco sobre otras viviendas. El historial se conserva.", blockedMe:"Has bloqueado a este participante. Desbloquéalo para continuar.", blockedOther:"Este participante ha bloqueado los mensajes.", pendingRetry:"Reintentar envío", pendingUnknown:"No se confirmó la entrega. Reintenta el mismo mensaje; no se duplicará.", invalidDates:"Elige ambas fechas. La salida debe ser posterior a la entrada.", noSelf:"Esta es tu vivienda. Puedes responder a los huéspedes desde tu bandeja.", newMessages:"Mensajes nuevos ↓", characterLimit:"Usa entre 1 y 4000 caracteres.", authError:"Revisa tu email/usuario y contraseña.", verifyFirst:"Confirma tu email antes de entrar.", draftRestored:"Borrador recuperado", closed:"Conversación de solo lectura", savedDates:"Estancia", settingsTitle:"Mensajes de huéspedes"
    },
    ca: {
      messages:"Missatges", writeHost:"Escriure al propietari", conversations:"Converses", emptyInbox:"Encara no hi ha converses. Comença des d'un habitatge de la cerca.", chooseConversation:"Tria una conversa", from:"Entrada", to:"Sortida", datesOptional:"Dates d'estada (opcional)", send:"Enviar missatge", sending:"Enviant…", messageLabel:"El teu missatge", placeholder:"Pregunta per l'habitatge o l'estada…", loading:"Carregant…", retry:"Torna-ho a provar", loadMore:"Més converses", earlier:"Missatges anteriors", backList:"Totes les converses", refresh:"Actualitzar", newEnquiry:"Nova consulta", privacy:"El teu correu i telèfon no es comparteixen automàticament.", notBooking:"Un missatge no reserva l'habitatge.", login:"Entrar", register:"Crear compte", loginLabel:"Correu o usuari", password:"Contrasenya", username:"Usuari", displayName:"Nom visible", email:"Correu electrònic", passwordHelp:"Com a mínim 10 caràcters.", usernameHelp:"Únic, sense distingir majúscules. Sense @.", authLead:"Entra per escriure als propietaris i veure les teves converses.", registered:"Compte creat. Revisa el correu (també la brossa), confirma'l i torna aquí.", logout:"Sortir", sessionExpired:"Torna a entrar per continuar. L'esborrany es conserva per al teu compte.", errorNetwork:"No s'ha pogut connectar. Torna-ho a provar.", errorRate:"Massa missatges. Espera una mica i torna-ho a provar.", errorBlocked:"La comunicació entre aquests participants està bloquejada.", errorDisabled:"Aquest propietari no accepta noves consultes. Les converses existents continuen a Missatges.", errorDeleted:"L'habitatge s'ha eliminat. Encara pots llegir la conversa.", errorMissing:"La conversa o l'habitatge no està disponible.", errorInput:"Revisa el missatge i les dates.", hostSetting:"Acceptar missatges sobre els meus habitatges", hostSettingHelp:"Els hostes poden iniciar una conversa privada. Desactivar-ho impedeix noves consultes; les converses existents continuen obertes.", settingSaved:"Desat", block:"Bloquejar participant", unblock:"Desbloquejar participant", confirmBlock:"Vols bloquejar aquest participant? Cap dels dos podrà escriure a l'altre, tampoc sobre altres habitatges. Es conserva l'historial.", blockedMe:"Has bloquejat aquest participant. Desbloqueja'l per continuar.", blockedOther:"Aquest participant ha bloquejat els missatges.", pendingRetry:"Reintentar enviament", pendingUnknown:"No s'ha confirmat el lliurament. Reintenta el mateix missatge; no es duplicarà.", invalidDates:"Tria totes dues dates. La sortida ha de ser posterior a l'entrada.", noSelf:"Aquest és el teu habitatge. Pots respondre als hostes des de la bústia.", newMessages:"Missatges nous ↓", characterLimit:"Fes servir entre 1 i 4000 caràcters.", authError:"Revisa el correu/usuari i la contrasenya.", verifyFirst:"Confirma el correu abans d'entrar.", draftRestored:"Esborrany recuperat", closed:"Conversa de només lectura", savedDates:"Estada", settingsTitle:"Missatges dels hostes"
    },
    ru: {
      messages:"Сообщения", writeHost:"Написать владельцу", conversations:"Диалоги", emptyInbox:"Диалогов пока нет. Написать владельцу можно из результатов поиска.", chooseConversation:"Выберите диалог", from:"Заезд", to:"Выезд", datesOptional:"Даты поездки (необязательно)", send:"Отправить", sending:"Отправляем…", messageLabel:"Ваше сообщение", placeholder:"Спросите о жилье или условиях проживания…", loading:"Загружаем…", retry:"Повторить", loadMore:"Ещё диалоги", earlier:"Предыдущие сообщения", backList:"Все диалоги", refresh:"Обновить", newEnquiry:"Новое обращение", privacy:"Ваши email и телефон не передаются собеседнику автоматически.", notBooking:"Сообщение не бронирует жильё.", login:"Войти", register:"Создать аккаунт", loginLabel:"Email или имя пользователя", password:"Пароль", username:"Имя пользователя", displayName:"Отображаемое имя", email:"Email", passwordHelp:"Не менее 10 символов.", usernameHelp:"Уникальное, без учёта регистра. Без символа @.", authLead:"Войдите, чтобы писать владельцам и читать свои диалоги.", registered:"Аккаунт создан. Проверьте почту, включая спам, подтвердите email и вернитесь сюда.", logout:"Выйти", sessionExpired:"Войдите снова, чтобы продолжить. Черновик сохранён для вашего аккаунта.", errorNetwork:"Не удалось связаться с сервером. Попробуйте ещё раз.", errorRate:"Слишком много сообщений. Немного подождите и повторите.", errorBlocked:"Переписка между этими участниками заблокирована.", errorDisabled:"Владелец пока не принимает новые обращения. Начатые диалоги доступны в «Сообщениях».", errorDeleted:"Объект удалён. Историю переписки можно читать.", errorMissing:"Диалог или объект недоступен.", errorInput:"Проверьте текст сообщения и даты.", hostSetting:"Принимать сообщения о моих объектах", hostSettingHelp:"Гости смогут начать личный диалог. Выключение запретит новые обращения, но сохранит возможность отвечать в уже начатых.", settingSaved:"Сохранено", block:"Заблокировать собеседника", unblock:"Разблокировать собеседника", confirmBlock:"Заблокировать собеседника? Вы оба больше не сможете писать друг другу, в том числе о других объектах. История останется доступна.", blockedMe:"Вы заблокировали собеседника. Чтобы продолжить переписку, разблокируйте его.", blockedOther:"Собеседник заблокировал переписку.", pendingRetry:"Повторить отправку", pendingUnknown:"Не удалось подтвердить отправку. Повторите то же сообщение — дубликата не будет.", invalidDates:"Укажите обе даты. Выезд должен быть позже заезда.", noSelf:"Это ваш объект. Ответить гостям можно из списка диалогов.", newMessages:"Новые сообщения ↓", characterLimit:"От 1 до 4000 символов.", authError:"Проверьте email/имя пользователя и пароль.", verifyFirst:"Перед входом подтвердите email.", draftRestored:"Черновик восстановлен", closed:"Диалог только для чтения", savedDates:"Поездка", settingsTitle:"Сообщения от гостей"
    }
  };
  const emailCopy = {
    en:{emailSettings:"Email notifications",emailEnabled:"Email me about unread messages",emailLanguage:"Email language",emailHelp:"A short notification and a link to the conversation. Message text stays on the website."},
    es:{emailSettings:"Notificaciones por email",emailEnabled:"Recibir emails sobre mensajes sin leer",emailLanguage:"Idioma de los emails",emailHelp:"Un aviso breve y un enlace a la conversación. El texto de los mensajes se queda en el sitio web."},
    ca:{emailSettings:"Notificacions per correu",emailEnabled:"Rebre correus sobre missatges sense llegir",emailLanguage:"Idioma dels correus",emailHelp:"Un avís breu i un enllaç a la conversa. El text dels missatges es queda al lloc web."},
    ru:{emailSettings:"Email-уведомления",emailEnabled:"Получать письма о непрочитанных сообщениях",emailLanguage:"Язык писем",emailHelp:"Короткое уведомление и ссылка на диалог. Текст переписки остаётся на сайте."}
  };
  Object.entries(emailCopy).forEach(([key,value]) => Object.assign(texts[key],value));
  let lang = "en", user, revision = 0, unreadBusy = false;
  const subscribers = new Set(), languageSubscribers = new Set();
  const contactCache = new Map();
  let contactActive = 0;
  const contactQueue = [];
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  };
  function t(key) { return texts[lang][key] || texts.en[key] || key; }
  function setLanguage(value) {
    lang = texts[value] ? value : "en";
    document.querySelectorAll("[data-msg-i18n]").forEach(el => el.textContent = t(el.dataset.msgI18n));
    document.querySelectorAll("[data-msg-placeholder]").forEach(el => el.placeholder = t(el.dataset.msgPlaceholder));
    languageSubscribers.forEach(fn => fn(lang));
  }
  function errorText(error) {
    const detail = error?.message || "";
    if (detail.includes("email verification required")) return t("verifyFirst");
    if (detail.includes("blocked between")) return t("errorBlocked");
    if (detail.includes("not accepting")) return t("errorDisabled");
    if (detail.includes("property was deleted")) return t("errorDeleted");
    if (error?.status === 401) return t("sessionExpired");
    if (error?.status === 404) return t("errorMissing");
    if (error?.status === 429) return t("errorRate");
    if (!error?.status || error.status >= 500) return t("errorNetwork");
    return detail || t("errorInput");
  }
  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(path, {...options, credentials:"same-origin", signal:controller.signal,
        headers:{Accept:"application/json", ...(options.body ? {"Content-Type":"application/json"} : {})}});
      const data = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok) {
        const error = new Error(data?.error || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return data;
    } finally { clearTimeout(timeout); }
  }
  const api = (path, options) => request(`/api/messaging${path}`, options);
  const auth = (path, options) => request(`/api/host/auth${path}`, options);
  function setUser(value) {
    const changed = user === undefined || (user?.accountId || null) !== (value?.accountId || null);
    user = value || null;
    if (!changed) return;
    revision++;
    document.querySelectorAll("[data-msg-unread]").forEach(el => { el.textContent = ""; el.hidden = true; });
    subscribers.forEach(fn => fn(user));
    if (user) void refreshUnread();
  }
  async function refreshSession() {
    const version = revision;
    try {
      const current = await auth("/me");
      if (version === revision) setUser(current);
      return user;
    } catch (error) {
      if (error.status === 401) { if (version === revision) setUser(null); return null; }
      throw error;
    }
  }
  async function refreshUnread() {
    if (!user || unreadBusy || document.visibilityState === "hidden") return;
    unreadBusy = true;
    const version = revision;
    try {
      const value = await api("/unread");
      if (version !== revision) return;
      document.querySelectorAll("[data-msg-unread]").forEach(el => {
        el.textContent = value.messages > 99 ? "99+" : String(value.messages);
        el.hidden = !value.messages;
      });
    } catch (error) { if (error.status === 401 && version === revision) setUser(null); }
    finally { unreadBusy = false; }
  }
  function contactOptions(id) {
    const cached = contactCache.get(id);
    if (cached && cached.until > Date.now()) return cached.promise;
    const promise = new Promise((resolve, reject) => { contactQueue.push({id, resolve, reject}); pumpContacts(); });
    if (contactCache.size > 300) contactCache.clear();
    contactCache.set(id, {promise, until:Date.now() + 30000});
    return promise;
  }
  function pumpContacts() {
    while (contactActive < 4 && contactQueue.length) {
      const job = contactQueue.shift(); contactActive++;
      api(`/contact-options/${encodeURIComponent(job.id)}`).then(job.resolve, error => {
        contactCache.delete(job.id); job.reject(error);
      }).finally(() => { contactActive--; pumpContacts(); });
    }
  }
  function attachContact(container, property) {
    const link = node("a", "availability-link message-property-link", t("writeHost"));
    link.dataset.msgI18n = "writeHost";
    link.hidden = true;
    const params = new URLSearchParams({property:property.propertyId});
    if (property.availableFrom && property.availableTo) {
      params.set("from", property.availableFrom); params.set("to", property.availableTo);
    }
    link.href = `/messages.html?${params}`;
    container.append(link);
    contactOptions(property.propertyId).then(options => {
      link.hidden = !options.acceptingNewConversations || options.hostProfileId === user?.profile?.id;
    }).catch(() => {});
  }
  function resumeAfterVerification() {
    try {
      const saved = JSON.parse(localStorage.getItem("parrot669-message-return") || "null");
      localStorage.removeItem("parrot669-message-return");
      if (!saved || saved.expires < Date.now()) return;
      const url = new URL(saved.path, window.location.origin);
      if (url.origin === window.location.origin && ["/messages", "/messages.html"].includes(url.pathname))
        window.location.assign(url.pathname + url.search);
    } catch {}
  }
  function clearDrafts(accountId) {
    try {
      const prefix = `parrot669-draft:${accountId}:`;
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i); if (key?.startsWith(prefix)) sessionStorage.removeItem(key);
      }
    } catch {}
  }
  window.ParrotMessaging = {t, node, api, auth, errorText, setLanguage, setUser, refreshSession, refreshUnread,
    attachContact, resumeAfterVerification, clearDrafts, get user() { return user; },
    onSession(fn) { subscribers.add(fn); if (user !== undefined) fn(user); },
    onLanguage(fn) { languageSubscribers.add(fn); }};
  try { setLanguage(localStorage.getItem("parrot669-language") || navigator.language.slice(0,2)); } catch { setLanguage("en"); }
  setInterval(() => void refreshUnread(), 30000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refreshSession().then(refreshUnread).catch(() => {});
  });

  const settings = document.getElementById("messaging-host-settings");
  if (settings) {
    const toggle = document.getElementById("messaging-host-enabled");
    const status = document.getElementById("messaging-host-status");
    const retry = document.getElementById("messaging-host-retry");
    let saved = false;
    async function load() {
      const version = revision; toggle.disabled = true; status.textContent = t("loading"); retry.hidden = true;
      try {
        const value = await api("/settings");
        if (version !== revision) return;
        saved = value.acceptingNewConversations; toggle.checked = saved; toggle.disabled = false; status.textContent = "";
      } catch (error) {
        if (version !== revision) return;
        status.textContent = errorText(error); retry.hidden = false;
        if (error.status === 401) setUser(null);
      }
    }
    subscribers.add(value => { settings.hidden = !value; if (value) void load(); });
    retry.addEventListener("click", () => void load());
    toggle.addEventListener("change", async () => {
      const version = revision; toggle.disabled = true; status.textContent = t("loading");
      try {
        const value = await api("/settings", {method:"PUT", body:JSON.stringify({acceptingNewConversations:toggle.checked})});
        if (version !== revision) return;
        saved = value.acceptingNewConversations; status.textContent = t("settingSaved");
      } catch (error) {
        if (version !== revision) return;
        status.textContent = errorText(error);
        if (error.status === 401) setUser(null);
      } finally { if (version === revision) { toggle.checked = saved; toggle.disabled = false; } }
    });
  }
  if (document.body.classList.contains("search-page")) void refreshSession().catch(() => {});
})();
