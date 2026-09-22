const STORAGE_KEY = "parrot669-host-state";
const LANG_KEY = "parrot669-language";

const copy = {
  en: {
    title:"PARROT 669 — Host console", consoleLabel:"HOST CONSOLE", backToSite:"← Back to site", tabSearch:"Find availability", tabHost:"For hosts", deleteProperty:"Delete property", deleteListing:"Remove external listing", showListingInSearch:"Show external link in search results", listingVisibilitySaved:"External link visibility updated.",
    toolsEyebrow:"HOST TOOLS", heroTitle:"Publish availability.<br><span>Keep the deal elsewhere.</span>",
    heroLead:"Add a property, link the original Airbnb listing and maintain only the dates when the property is physically free.",
    accountTitle:"Host account", accountHelp:"Sign in with email and password. Your session is kept in a secure HttpOnly cookie.", loginTitle:"Log in", signupTitle:"Create account", emailLabel:"Email", passwordLabel:"Password", loginButton:"Log in →", signupButton:"Create account →", logoutButton:"Log out", signedInAs:"Signed in as", recoveryNote:"Password recovery is not available yet.", loggingIn:"Logging in…", signingUp:"Creating account…", loggedOut:"Logged out.", legacyMigrated:"Your existing host profile was connected to this account.", legacyMigrationFailed:"Signed in, but the existing browser profile could not be connected. Its old credentials were kept for retry.",
    identityTitle:"Host identity", identityHelp:"The edit token stays in this browser. PARROT stores only its hash.",
    nameLabel:"Name / host label", contactLabel:"Contact", contactPlaceholder:"Email or WhatsApp", createProfile:"Create host profile →",
    forgetSession:"Forget this browser session", propertiesTitle:"Properties",
    propertiesHelp:"No photos or copied descriptions. Only enough data to search availability.",
    internalLabel:"Internal label", propertyPlaceholder:"Poblenou apartment", cityLabel:"City", accommodationTypeLabel:"Accommodation type", entirePlace:"Entire place", privateRoom:"Private room", bedroomsLabel:"Bedrooms", sleepsLabel:"Sleeping places", minStayLabel:"Minimum stay, days", propertySettings:"Property settings", savePropertySettings:"Save settings", propertySettingsSaved:"Property settings saved.", enableCalendar:"Enable", disableCalendar:"Disable", calendarEnabled:"Airbnb calendar enabled.", calendarDisabled:"Airbnb calendar disabled.", calendarDisabledStatus:"Disabled", calendarConnectedStatus:"Connected", expandProperty:"Expand", collapseProperty:"Collapse", addProperty:"Add property →",
    creatingProfile:"Creating host profile…", profileCreated:"Host profile created. This browser now holds the edit token; there is no recovery yet.",
    addingProperty:"Adding property…", propertyAdded:"Property added.", resetConfirm:"Forget the PARROT edit token and local property list from this browser?",
    sessionRemoved:"Local host session removed.", savingListing:"Saving external listing…", listingSaved:"Airbnb link saved.",
    addingAvailability:"Adding availability…", availabilityAdded:"Availability added.", updatingAvailability:"Updating availability…",
    availabilityUpdated:"Availability updated.", deletingAvailability:"Deleting availability…", availabilityDeleted:"Availability deleted.",
    deleteConfirm:(a,b)=>`Delete ${a} → ${b}?`, deletePropertyConfirm:n=>`Delete property “${n}” and all its PARROT availability data?`, deleteListingConfirm:"Remove the external Airbnb listing from this property?", propertyDeleted:"Property deleted.", listingDeleted:"External listing removed.", noProperties:"No properties yet.", externalListing:"External listing",
    saveAirbnb:"Save Airbnb ID", cleaningFee:"Cleaning fee, € (optional)", saveCleaning:"Save cleaning fee", nightlyPrice:"€/night (optional)", calendarSync:"Airbnb calendar sync", calendarHelp:"Paste Airbnb's iCal export link. PARROT uses only events marked Reserved to block dates; Airbnb (Not available) events are stored but ignored for physical availability.", calendarUrl:"Airbnb iCal export URL", connectCalendar:"Connect calendar", syncNow:"Sync now", disconnectCalendar:"Delete", disconnectCalendarConfirm:"Delete the Airbnb calendar connection?", calendarConnected:"Airbnb calendar connected.", calendarDisconnected:"Airbnb calendar deleted.", calendarSynced:"Airbnb calendar synced.", reservationsImported:n=>`${n} reservation block${n===1?"":"s"} imported`, ignoredBlocks:n=>`${n} Airbnb availability block${n===1?"":"s"} ignored`, lastSync:v=>`Last sync: ${v}`, neverSynced:"Not synced yet", calendarError:"Calendar sync error", airbnbIdHelp:"Open the public Airbnb listing and copy the number after /rooms/. Example: 910841261983250037", airbnbIdPlaceholder:"Airbnb listing ID", availability:"PARROT availability", addDates:"Add dates", loading:"Loading…",
    noPeriods:"No availability periods.", save:"Save", remove:"Delete", bedroom:n=>n===1?"1 bedroom":`${n} bedrooms`, sleepSummary:n=>n===1?"1 sleeping place":`${n} sleeping places`, minSummary:n=>`minimum ${n} day${n===1?"":"s"}`
  },
  es: {
    title:"PARROT 669 — Panel de propietarios", consoleLabel:"PANEL DE PROPIETARIOS", backToSite:"← Volver al sitio", tabSearch:"Buscar disponibilidad", tabHost:"Para propietarios", deleteProperty:"Eliminar vivienda", deleteListing:"Eliminar anuncio externo", showListingInSearch:"Mostrar enlace externo en los resultados", listingVisibilitySaved:"Visibilidad del enlace actualizada.",
    toolsEyebrow:"HERRAMIENTAS PARA PROPIETARIOS", heroTitle:"Publica la disponibilidad.<br><span>La operación ocurre fuera.</span>",
    heroLead:"Añade una vivienda, enlaza el anuncio original de Airbnb y mantén únicamente las fechas en las que está físicamente libre.",
    accountTitle:"Cuenta de propietario", accountHelp:"Inicia sesión con email y contraseña. La sesión se guarda en una cookie HttpOnly segura.", loginTitle:"Iniciar sesión", signupTitle:"Crear cuenta", emailLabel:"Email", passwordLabel:"Contraseña", loginButton:"Entrar →", signupButton:"Crear cuenta →", logoutButton:"Cerrar sesión", signedInAs:"Sesión iniciada como", recoveryNote:"La recuperación de contraseña todavía no está disponible.", loggingIn:"Iniciando sesión…", signingUp:"Creando cuenta…", loggedOut:"Sesión cerrada.", legacyMigrated:"Tu perfil de propietario existente se ha conectado a esta cuenta.", legacyMigrationFailed:"Has iniciado sesión, pero no se pudo conectar el perfil guardado en este navegador. Sus credenciales antiguas se conservaron para reintentar.",
    identityTitle:"Identidad del propietario", identityHelp:"El token de edición se queda en este navegador. PARROT solo guarda su hash.",
    nameLabel:"Nombre / etiqueta", contactLabel:"Contacto", contactPlaceholder:"Email o WhatsApp", createProfile:"Crear perfil →",
    forgetSession:"Olvidar esta sesión del navegador", propertiesTitle:"Viviendas",
    propertiesHelp:"Sin fotos ni descripciones copiadas. Solo los datos mínimos para buscar disponibilidad.",
    internalLabel:"Etiqueta interna", propertyPlaceholder:"Apartamento Poblenou", cityLabel:"Ciudad", accommodationTypeLabel:"Tipo de alojamiento", entirePlace:"Alojamiento entero", privateRoom:"Habitación privada", bedroomsLabel:"Dormitorios", sleepsLabel:"Plazas para dormir", minStayLabel:"Estancia mínima, días", propertySettings:"Ajustes de la vivienda", savePropertySettings:"Guardar ajustes", propertySettingsSaved:"Ajustes guardados.", enableCalendar:"Activar", disableCalendar:"Desactivar", calendarEnabled:"Calendario de Airbnb activado.", calendarDisabled:"Calendario de Airbnb desactivado.", calendarDisabledStatus:"Desactivado", calendarConnectedStatus:"Conectado", expandProperty:"Expandir", collapseProperty:"Contraer", addProperty:"Añadir vivienda →",
    creatingProfile:"Creando perfil…", profileCreated:"Perfil creado. Este navegador guarda ahora el token de edición; todavía no hay recuperación.",
    addingProperty:"Añadiendo vivienda…", propertyAdded:"Vivienda añadida.", resetConfirm:"¿Olvidar el token de edición de PARROT y la lista local de viviendas de este navegador?",
    sessionRemoved:"Sesión local eliminada.", savingListing:"Guardando anuncio externo…", listingSaved:"Enlace de Airbnb guardado.",
    addingAvailability:"Añadiendo disponibilidad…", availabilityAdded:"Disponibilidad añadida.", updatingAvailability:"Actualizando disponibilidad…",
    availabilityUpdated:"Disponibilidad actualizada.", deletingAvailability:"Eliminando disponibilidad…", availabilityDeleted:"Disponibilidad eliminada.",
    deleteConfirm:(a,b)=>`¿Eliminar ${a} → ${b}?`, deletePropertyConfirm:n=>`¿Eliminar “${n}” y todos sus datos de disponibilidad en PARROT?`, deleteListingConfirm:"¿Eliminar el anuncio externo de Airbnb de esta vivienda?", propertyDeleted:"Vivienda eliminada.", listingDeleted:"Anuncio externo eliminado.", noProperties:"Todavía no hay viviendas.", externalListing:"Anuncio externo",
    saveAirbnb:"Guardar ID de Airbnb", cleaningFee:"Limpieza, € (opcional)", saveCleaning:"Guardar limpieza", nightlyPrice:"€/noche (opcional)", calendarSync:"Sincronización del calendario Airbnb", calendarHelp:"Pega el enlace de exportación iCal de Airbnb. PARROT solo usa los eventos marcados Reserved para bloquear fechas; los eventos Airbnb (Not available) se guardan pero se ignoran para la disponibilidad física.", calendarUrl:"URL de exportación iCal de Airbnb", connectCalendar:"Conectar calendario", syncNow:"Sincronizar ahora", disconnectCalendar:"Eliminar", disconnectCalendarConfirm:"¿Eliminar la conexión del calendario de Airbnb?", calendarConnected:"Calendario de Airbnb conectado.", calendarDisconnected:"Calendario de Airbnb eliminado.", calendarSynced:"Calendario de Airbnb sincronizado.", reservationsImported:n=>`${n} bloqueo${n===1?"":"s"} de reserva importado${n===1?"":"s"}`, ignoredBlocks:n=>`${n} bloqueo${n===1?"":"s"} de disponibilidad de Airbnb ignorado${n===1?"":"s"}`, lastSync:v=>`Última sincronización: ${v}`, neverSynced:"Aún no sincronizado", calendarError:"Error de sincronización", airbnbIdHelp:"Abre el anuncio público de Airbnb y copia el número que aparece después de /rooms/. Ejemplo: 910841261983250037", airbnbIdPlaceholder:"ID del anuncio de Airbnb", availability:"Disponibilidad en PARROT", addDates:"Añadir fechas", loading:"Cargando…",
    noPeriods:"No hay periodos de disponibilidad.", save:"Guardar", remove:"Eliminar", bedroom:n=>n===1?"1 dormitorio":`${n} dormitorios`, sleepSummary:n=>n===1?"1 plaza":`${n} plazas`, minSummary:n=>`mínimo ${n} día${n===1?"":"s"}`
  },
  ca: {
    title:"PARROT 669 — Panell de propietaris", consoleLabel:"PANELL DE PROPIETARIS", backToSite:"← Tornar al web", tabSearch:"Cercar disponibilitat", tabHost:"Per a propietaris", deleteProperty:"Eliminar habitatge", deleteListing:"Eliminar anunci extern", showListingInSearch:"Mostrar l'enllaç extern als resultats", listingVisibilitySaved:"Visibilitat de l'enllaç actualitzada.",
    toolsEyebrow:"EINES PER A PROPIETARIS", heroTitle:"Publica la disponibilitat.<br><span>L'operació passa fora.</span>",
    heroLead:"Afegeix un habitatge, enllaça l'anunci original d'Airbnb i mantén només les dates en què està físicament lliure.",
    accountTitle:"Compte de propietari", accountHelp:"Inicia sessió amb correu i contrasenya. La sessió es desa en una cookie HttpOnly segura.", loginTitle:"Inicia sessió", signupTitle:"Crea un compte", emailLabel:"Correu electrònic", passwordLabel:"Contrasenya", loginButton:"Entra →", signupButton:"Crea el compte →", logoutButton:"Tanca la sessió", signedInAs:"Sessió iniciada com", recoveryNote:"La recuperació de contrasenya encara no està disponible.", loggingIn:"Iniciant sessió…", signingUp:"Creant el compte…", loggedOut:"Sessió tancada.", legacyMigrated:"El teu perfil de propietari existent s'ha connectat a aquest compte.", legacyMigrationFailed:"Has iniciat sessió, però no s'ha pogut connectar el perfil guardat en aquest navegador. S'han conservat les credencials antigues per tornar-ho a provar.",
    identityTitle:"Identitat del propietari", identityHelp:"El token d'edició es queda en aquest navegador. PARROT només en desa el hash.",
    nameLabel:"Nom / etiqueta", contactLabel:"Contacte", contactPlaceholder:"Email o WhatsApp", createProfile:"Crear perfil →",
    forgetSession:"Oblidar aquesta sessió del navegador", propertiesTitle:"Habitatges",
    propertiesHelp:"Sense fotos ni descripcions copiades. Només les dades mínimes per cercar disponibilitat.",
    internalLabel:"Etiqueta interna", propertyPlaceholder:"Apartament Poblenou", cityLabel:"Ciutat", accommodationTypeLabel:"Tipus d'allotjament", entirePlace:"Allotjament sencer", privateRoom:"Habitació privada", bedroomsLabel:"Dormitoris", sleepsLabel:"Places per dormir", minStayLabel:"Estada mínima, dies", propertySettings:"Configuració de l'habitatge", savePropertySettings:"Desar configuració", propertySettingsSaved:"Configuració desada.", enableCalendar:"Activar", disableCalendar:"Desactivar", calendarEnabled:"Calendari d'Airbnb activat.", calendarDisabled:"Calendari d'Airbnb desactivat.", calendarDisabledStatus:"Desactivat", calendarConnectedStatus:"Connectat", expandProperty:"Desplegar", collapseProperty:"Plegar", addProperty:"Afegir habitatge →",
    creatingProfile:"Creant perfil…", profileCreated:"Perfil creat. Aquest navegador desa ara el token d'edició; encara no hi ha recuperació.",
    addingProperty:"Afegint habitatge…", propertyAdded:"Habitatge afegit.", resetConfirm:"Oblidar el token d'edició de PARROT i la llista local d'habitatges d'aquest navegador?",
    sessionRemoved:"Sessió local eliminada.", savingListing:"Desant l'anunci extern…", listingSaved:"Enllaç d'Airbnb desat.",
    addingAvailability:"Afegint disponibilitat…", availabilityAdded:"Disponibilitat afegida.", updatingAvailability:"Actualitzant disponibilitat…",
    availabilityUpdated:"Disponibilitat actualitzada.", deletingAvailability:"Eliminant disponibilitat…", availabilityDeleted:"Disponibilitat eliminada.",
    deleteConfirm:(a,b)=>`Eliminar ${a} → ${b}?`, deletePropertyConfirm:n=>`Eliminar “${n}” i totes les seves dades de disponibilitat de PARROT?`, deleteListingConfirm:"Eliminar l'anunci extern d'Airbnb d'aquest habitatge?", propertyDeleted:"Habitatge eliminat.", listingDeleted:"Anunci extern eliminat.", noProperties:"Encara no hi ha habitatges.", externalListing:"Anunci extern",
    saveAirbnb:"Desar ID d'Airbnb", cleaningFee:"Neteja, € (opcional)", saveCleaning:"Desar neteja", nightlyPrice:"€/nit (opcional)", calendarSync:"Sincronització del calendari Airbnb", calendarHelp:"Enganxa l'enllaç d'exportació iCal d'Airbnb. PARROT només utilitza els esdeveniments marcats Reserved per bloquejar dates; els esdeveniments Airbnb (Not available) es desen però s'ignoren per a la disponibilitat física.", calendarUrl:"URL d'exportació iCal d'Airbnb", connectCalendar:"Connectar calendari", syncNow:"Sincronitzar ara", disconnectCalendar:"Eliminar", disconnectCalendarConfirm:"Eliminar la connexió del calendari d'Airbnb?", calendarConnected:"Calendari d'Airbnb connectat.", calendarDisconnected:"Calendari d'Airbnb eliminat.", calendarSynced:"Calendari d'Airbnb sincronitzat.", reservationsImported:n=>`${n} bloqueig${n===1?"":"s"} de reserva importat${n===1?"":"s"}`, ignoredBlocks:n=>`${n} bloqueig${n===1?"":"s"} de disponibilitat d'Airbnb ignorat${n===1?"":"s"}`, lastSync:v=>`Última sincronització: ${v}`, neverSynced:"Encara no sincronitzat", calendarError:"Error de sincronització", airbnbIdHelp:"Obre l'anunci públic d'Airbnb i copia el número que hi ha després de /rooms/. Exemple: 910841261983250037", airbnbIdPlaceholder:"ID de l'anunci d'Airbnb", availability:"Disponibilitat a PARROT", addDates:"Afegir dates", loading:"Carregant…",
    noPeriods:"No hi ha períodes de disponibilitat.", save:"Desar", remove:"Eliminar", bedroom:n=>n===1?"1 dormitori":`${n} dormitoris`, sleepSummary:n=>n===1?"1 plaça":`${n} places`, minSummary:n=>`mínim ${n} dia${n===1?"":"s"}`
  },
  ru: {
    title:"PARROT 669 — Кабинет владельца", consoleLabel:"КАБИНЕТ ВЛАДЕЛЬЦА", backToSite:"← Назад на сайт", tabSearch:"Найти жильё", tabHost:"Владельцам", deleteProperty:"Удалить объект", deleteListing:"Удалить внешнее объявление", showListingInSearch:"Показывать внешнюю ссылку в поиске", listingVisibilitySaved:"Видимость внешней ссылки обновлена.",
    toolsEyebrow:"ИНСТРУМЕНТЫ ВЛАДЕЛЬЦА", heroTitle:"Публикуйте свободные даты.<br><span>Сделка остаётся снаружи.</span>",
    heroLead:"Добавьте объект, укажите исходное объявление Airbnb и поддерживайте только даты, когда жильё физически свободно.",
    accountTitle:"Аккаунт владельца", accountHelp:"Войдите по email и паролю. Сессия хранится в защищённой HttpOnly cookie.", loginTitle:"Вход", signupTitle:"Регистрация", emailLabel:"Email", passwordLabel:"Пароль", loginButton:"Войти →", signupButton:"Создать аккаунт →", logoutButton:"Выйти", signedInAs:"Выполнен вход", recoveryNote:"Восстановление пароля пока недоступно.", loggingIn:"Входим…", signingUp:"Создаём аккаунт…", loggedOut:"Вы вышли из аккаунта.", legacyMigrated:"Старый профиль владельца привязан к этому аккаунту.", legacyMigrationFailed:"Вход выполнен, но старый профиль из этого браузера привязать не удалось. Старые данные сохранены для повторной попытки.",
    identityTitle:"Профиль владельца", identityHelp:"Токен редактирования остаётся в этом браузере. PARROT хранит только его hash.",
    nameLabel:"Имя / название", contactLabel:"Контакт", contactPlaceholder:"Email или WhatsApp", createProfile:"Создать профиль →",
    forgetSession:"Забыть сессию в этом браузере", propertiesTitle:"Объекты",
    propertiesHelp:"Без фотографий и скопированных описаний. Только минимум данных для поиска свободных дат.",
    internalLabel:"Название для себя", propertyPlaceholder:"Квартира в Poblenou", cityLabel:"Город", accommodationTypeLabel:"Тип жилья", entirePlace:"Жильё целиком", privateRoom:"Отдельная комната", bedroomsLabel:"Спальни", sleepsLabel:"Спальных мест", minStayLabel:"Минимум дней", propertySettings:"Настройки объекта", savePropertySettings:"Сохранить настройки", propertySettingsSaved:"Настройки объекта сохранены.", enableCalendar:"Включить", disableCalendar:"Выключить", calendarEnabled:"Календарь Airbnb включён.", calendarDisabled:"Календарь Airbnb выключен.", calendarDisabledStatus:"Выключен", calendarConnectedStatus:"Подключён", expandProperty:"Развернуть", collapseProperty:"Свернуть", addProperty:"Добавить объект →",
    creatingProfile:"Создаём профиль…", profileCreated:"Профиль создан. Токен редактирования теперь хранится в этом браузере; восстановления пока нет.",
    addingProperty:"Добавляем объект…", propertyAdded:"Объект добавлен.", resetConfirm:"Забыть токен PARROT и локальный список объектов в этом браузере?",
    sessionRemoved:"Локальная сессия удалена.", savingListing:"Сохраняем внешнее объявление…", listingSaved:"Ссылка Airbnb сохранена.",
    addingAvailability:"Добавляем свободные даты…", availabilityAdded:"Свободные даты добавлены.", updatingAvailability:"Обновляем даты…",
    availabilityUpdated:"Даты обновлены.", deletingAvailability:"Удаляем даты…", availabilityDeleted:"Даты удалены.",
    deleteConfirm:(a,b)=>`Удалить период ${a} → ${b}?`, deletePropertyConfirm:n=>`Удалить объект «${n}» и все его данные о свободных датах из PARROT?`, deleteListingConfirm:"Удалить внешнее объявление Airbnb у этого объекта?", propertyDeleted:"Объект удалён.", listingDeleted:"Внешнее объявление удалено.", noProperties:"Объектов пока нет.", externalListing:"Внешнее объявление",
    saveAirbnb:"Сохранить ID Airbnb", cleaningFee:"Уборка, € (необязательно)", saveCleaning:"Сохранить уборку", nightlyPrice:"€/ночь (необязательно)", calendarSync:"Синхронизация календаря Airbnb", calendarHelp:"Вставьте экспортную iCal-ссылку Airbnb. PARROT блокирует даты только по событиям Reserved; Airbnb (Not available) сохраняются, но не считаются физической занятостью.", calendarUrl:"Экспортная iCal-ссылка Airbnb", connectCalendar:"Подключить календарь", syncNow:"Обновить сейчас", disconnectCalendar:"Удалить", disconnectCalendarConfirm:"Удалить календарь Airbnb?", calendarConnected:"Календарь Airbnb подключён.", calendarDisconnected:"Календарь Airbnb удалён.", calendarSynced:"Календарь Airbnb обновлён.", reservationsImported:n=>`Импортировано броней: ${n}`, ignoredBlocks:n=>`Игнорируемых блокировок Airbnb: ${n}`, lastSync:v=>`Последняя синхронизация: ${v}`, neverSynced:"Ещё не синхронизировался", calendarError:"Ошибка синхронизации", airbnbIdHelp:"Откройте публичную страницу объявления Airbnb и скопируйте число после /rooms/. Например: 910841261983250037", airbnbIdPlaceholder:"ID объявления Airbnb", availability:"Свободные даты в PARROT", addDates:"Добавить даты", loading:"Загрузка…",
    noPeriods:"Свободных периодов пока нет.", save:"Сохранить", remove:"Удалить", bedroom:n=>n===1?"1 спальня":n<5?`${n} спальни`:`${n} спален`, sleepSummary:n=>`${n} спальных мест`, minSummary:n=>`минимум ${n} дн.`
  }
};

const emptyState = () => ({user:null, properties:[]});
let state = emptyState();
let lang = loadLanguage();
let legacyState = loadLegacyState();
const expandedPropertyIds = new Set();

const statusNode = document.getElementById("host-status");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authForms = document.getElementById("host-auth-forms");
const recoveryNote = document.getElementById("recovery-note");
const propertyPanel = document.getElementById("property-panel");
const propertyForm = document.getElementById("property-form");
const hostSession = document.getElementById("host-session");
const hostAccountEmail = document.getElementById("host-account-email");
const hostParrotId = document.getElementById("host-parrot-id");
const propertiesNode = document.getElementById("host-properties");
const logoutButton = document.getElementById("logout-host");
const langButtons = document.querySelectorAll("[data-host-lang]");

function loadLegacyState(){
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return null;
    const profileId = String(parsed.profileId || "");
    const editToken = String(parsed.editToken || "");
    return profileId && editToken ? {profileId, editToken, parrotId:String(parsed.parrotId || "")} : null;
  } catch {
    return null;
  }
}

function clearLegacyState(){
  localStorage.removeItem(STORAGE_KEY);
  legacyState = null;
}

function loadLanguage(){
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && copy[saved]) return saved;
  const browser = (navigator.language || "en").slice(0,2);
  return copy[browser] ? browser : "en";
}

function tr(key, ...args){
  const value = (copy[lang] || copy.en)[key] ?? copy.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function applyLanguage(next){
  lang = copy[next] ? next : "en";
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.title = tr("title");

  document.querySelectorAll("[data-host-i18n]").forEach(node => {
    node.textContent = tr(node.dataset.hostI18n);
  });
  document.querySelectorAll("[data-host-i18n-html]").forEach(node => {
    node.innerHTML = tr(node.dataset.hostI18nHtml);
  });
  document.querySelectorAll("[data-host-placeholder]").forEach(node => {
    node.placeholder = tr(node.dataset.hostPlaceholder);
  });
  langButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.hostLang === lang));
  renderProperties();
}

function saveState(){
  // Auth state is server-side. localStorage is intentionally not an auth source of truth.
}

function message(text, kind = ""){
  statusNode.textContent = text || "";
  statusNode.className = `host-status ${kind}`.trim();
}

async function api(path, options = {}){
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`/api/host${path}`, {
    ...options,
    headers,
    credentials:"same-origin"
  });
  if (response.status === 204) return null;

  let data = null;
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function setBusy(form, busy){
  form?.querySelectorAll("button,input,select").forEach(node => node.disabled = busy);
}

function setFormError(form, text = ""){
  let node = form?.querySelector(".host-form-error");
  if (!node && text) {
    node = document.createElement("p");
    node.className = "host-inline-error host-form-error";
    node.setAttribute("role", "alert");
    form.append(node);
  }
  if (node) {
    node.textContent = text;
    node.hidden = !text;
  }
}

function renderAuthState(){
  const ready = Boolean(state.user);
  authForms.hidden = ready;
  recoveryNote.hidden = ready;
  hostSession.hidden = !ready;
  propertyPanel.hidden = !ready;

  if (ready) {
    hostAccountEmail.textContent = state.user.email || "";
    hostParrotId.textContent = state.user.profile?.parrotId || "";
  } else {
    state.properties = [];
    renderProperties();
  }
}

async function migrateLegacyIfNeeded(){
  if (!state.user || !legacyState) return false;

  if (state.user.profile?.id === legacyState.profileId) {
    clearLegacyState();
    return false;
  }

  try {
    const user = await api("/auth/claim-legacy", {
      method:"POST",
      body:JSON.stringify({
        profileId:legacyState.profileId,
        editToken:legacyState.editToken
      })
    });
    state.user = user;
    clearLegacyState();
    message(tr("legacyMigrated"), "success");
    return true;
  } catch (error) {
    message(tr("legacyMigrationFailed"), "error");
    return false;
  }
}

async function syncDashboard(){
  message(tr("loading"));
  try {
    const dashboard = await api("/dashboard");
    state.properties = (dashboard.properties || []).map(property => ({
      ...property,
      listing: Array.isArray(property.listings) ? (property.listings[0] || null) : null,
      availability: Array.isArray(property.availability) ? property.availability : [],
      calendars: Array.isArray(property.calendars) ? property.calendars : []
    }));
    if (state.user?.profile) {
      state.user.profile.parrotId = dashboard.profile.parrotId || state.user.profile.parrotId;
      state.user.profile.displayName = dashboard.profile.displayName || state.user.profile.displayName;
    }
    hostParrotId.textContent = dashboard.profile.parrotId || state.user?.profile?.parrotId || "";
    renderProperties();
    if (!statusNode.classList.contains("error") && !statusNode.classList.contains("success")) message("");
  } catch (error) {
    if (error.status === 401) {
      state = emptyState();
      renderAuthState();
      message("");
      return;
    }
    message(error.message, "error");
    state.properties = [];
    renderProperties();
  }
}

async function finishAuthentication(user){
  state.user = user;
  renderAuthState();
  const migrated = await migrateLegacyIfNeeded();
  renderAuthState();
  await syncDashboard();
  return migrated;
}

async function boot(){
  try {
    const user = await api("/auth/me");
    state.user = user;
    renderAuthState();
    await migrateLegacyIfNeeded();
    renderAuthState();
    await syncDashboard();
  } catch (error) {
    if (error.status !== 401) message(error.message, "error");
    state = emptyState();
    renderAuthState();
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(loginForm);
  setBusy(loginForm, true);
  setFormError(loginForm);
  message(tr("loggingIn"));

  try {
    const user = await api("/auth/login", {
      method:"POST",
      body:JSON.stringify({
        email:String(form.get("email") || "").trim(),
        password:String(form.get("password") || "")
      })
    });
    await finishAuthentication(user);
    loginForm.reset();
  } catch (error) {
    setFormError(loginForm, error.message);
    message(error.message, "error");
  } finally {
    setBusy(loginForm, false);
  }
});

registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(registerForm);
  setBusy(registerForm, true);
  setFormError(registerForm);
  message(tr("signingUp"));

  try {
    const user = await api("/auth/register", {
      method:"POST",
      body:JSON.stringify({
        displayName:String(form.get("displayName") || "").trim(),
        email:String(form.get("email") || "").trim(),
        password:String(form.get("password") || "")
      })
    });
    await finishAuthentication(user);
    registerForm.reset();
  } catch (error) {
    setFormError(registerForm, error.message);
    message(error.message, "error");
  } finally {
    setBusy(registerForm, false);
  }
});

propertyForm.addEventListener("submit", async event => {
  event.preventDefault();

  const form = new FormData(propertyForm);
  setBusy(propertyForm, true);
  message(tr("addingProperty"));

  try {
    const created = await api("/properties", {
      method:"POST",
      body:JSON.stringify({
        title:String(form.get("title") || "").trim(),
        city:String(form.get("city") || "").trim(),
        accommodationType:String(form.get("accommodationType") || "entire_place"),
        bedrooms:Number(form.get("bedrooms")),
        sleeps:Number(form.get("sleeps"))
      })
    });

    state.properties.push({
      id:created.id,
      title:created.title,
      city:created.city,
      accommodationType:created.accommodationType,
      bedrooms:created.bedrooms,
      sleeps:created.sleeps,
      minStayDays:created.minStayDays,
      cleaningFeeCents:created.cleaningFeeCents,
      listing:null,
      availability:[],
      calendars:[]
    });
    expandedPropertyIds.add(created.id);
    propertyForm.elements.title.value = "";
    message(tr("propertyAdded"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(propertyForm, false);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await api("/auth/logout", {method:"POST"});
  } catch {}
  state = emptyState();
  expandedPropertyIds.clear();
  renderAuthState();
  message(tr("loggedOut"), "success");
});

function eurosToCents(value){
  const raw=String(value??"").trim().replace(",",".");
  if(!raw) return null;
  const amount=Number(raw);
  return Number.isFinite(amount) ? Math.round(amount*100) : null;
}
function centsToEuros(value){
  if(value==null) return "";
  return (Number(value)/100).toFixed(2).replace(/\.00$/,"");
}

async function updatePropertySettings(property, form){
  const data=new FormData(form);
  setBusy(form,true);
  message(tr("loading"));
  try{
    const updated=await api(`/properties/${property.id}`,{
      method:"PUT",
      body:JSON.stringify({
        accommodationType:String(data.get("accommodationType")||"entire_place"),
        minStayDays:Number(data.get("minStayDays")),
        cleaningFeeCents:eurosToCents(data.get("cleaningFee"))
      })
    });
    property.accommodationType=updated.accommodationType;
    property.minStayDays=updated.minStayDays;
    property.cleaningFeeCents=updated.cleaningFeeCents;
    saveState();
    message(tr("propertySettingsSaved"),"success");
    renderProperties();
  }catch(error){message(error.message,"error")}
  finally{setBusy(form,false)}
}

async function addListing(property, form){
  const data = new FormData(form);
  setBusy(form, true);
  message(tr("savingListing"));

  try {
    const created = await api(`/properties/${property.id}/listings`, {
      method:"POST",
      body:JSON.stringify({
        platform:"airbnb",
        externalId:String(data.get("externalId") || "").trim()
      })
    });
    property.listing = {id:created.id, platform:created.platform, externalId:created.externalId, url:created.url, showInSearch:created.showInSearch!==false};
    saveState();
    message(tr("listingSaved"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(form, false);
  }
}

function plusDays(iso, days){
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function addAvailability(property, form){
  const data = new FormData(form);
  setBusy(form, true);
  message(tr("addingAvailability"));

  try {
    await api(`/properties/${property.id}/availability`, {
      method:"POST",
      body:JSON.stringify({from:data.get("from"), to:data.get("to"), nightlyPriceCents:eurosToCents(data.get("nightlyPrice"))})
    });
    message(tr("availabilityAdded"), "success");
    await refreshAvailability(property, true);
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(form, false);
  }
}

async function refreshAvailability(property, rerender = false){
  try {
    property.availability = await api(`/properties/${property.id}/availability`);
    property.availabilityError = "";
    if (rerender) renderProperties();
  } catch (error) {
    property.availabilityError = error.message;
    if (rerender) renderProperties();
  }
}

async function updateAvailability(property, period, from, to, nightlyPrice){
  message(tr("updatingAvailability"));
  try {
    await api(`/availability/${period.id}`, {
      method:"PUT",
      body:JSON.stringify({from, to, nightlyPriceCents:eurosToCents(nightlyPrice)})
    });
    message(tr("availabilityUpdated"), "success");
    await refreshAvailability(property, true);
  } catch (error) {
    message(error.message, "error");
  }
}

async function deleteAvailability(property, period){
  if (!confirm(tr("deleteConfirm", period.from, period.to))) return;
  message(tr("deletingAvailability"));
  try {
    await api(`/availability/${period.id}`, {method:"DELETE"});
    message(tr("availabilityDeleted"), "success");
    await refreshAvailability(property, true);
  } catch (error) {
    message(error.message, "error");
  }
}

async function deleteProperty(property){
  if (!confirm(tr("deletePropertyConfirm", property.title))) return;
  message(tr("deletingAvailability"));
  try {
    await api(`/properties/${property.id}`, {method:"DELETE"});
    state.properties = state.properties.filter(item => item.id !== property.id);
    expandedPropertyIds.delete(property.id);
    saveState();
    message(tr("propertyDeleted"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  }
}

async function updateListingVisibility(property, checkbox){
  if(!property.listing?.id) return;
  checkbox.disabled=true;
  try{
    const updated=await api(`/listings/${property.listing.id}`,{
      method:"PUT",
      body:JSON.stringify({showInSearch:checkbox.checked})
    });
    property.listing.showInSearch=updated.showInSearch!==false;
    checkbox.checked=property.listing.showInSearch;
    message(tr("listingVisibilitySaved"),"success");
  }catch(error){
    checkbox.checked=property.listing.showInSearch!==false;
    message(error.message,"error");
  }finally{
    checkbox.disabled=false;
  }
}

async function deleteListing(property){
  if (!property.listing?.id || !confirm(tr("deleteListingConfirm"))) return;
  message(tr("savingListing"));
  try {
    await api(`/listings/${property.listing.id}`, {method:"DELETE"});
    property.listing = null;
    property.calendars = [];
    saveState();
    message(tr("listingDeleted"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  }
}

async function connectCalendar(property, form){
  const data=new FormData(form);
  setFormError(form);
  setBusy(form,true);
  message(tr("loading"));
  try{
    await api(`/properties/${property.id}/calendars`,{
      method:"POST",
      body:JSON.stringify({provider:"airbnb",icalUrl:String(data.get("icalUrl")||"").trim()})
    });
    message(tr("calendarConnected"),"success");
    await syncDashboard();
  }catch(error){
    setFormError(form,error.message);
    message(error.message,"error");
  }
  finally{setBusy(form,false)}
}

async function syncCalendar(calendar){
  message(tr("loading"));
  try{
    await api(`/calendars/${calendar.id}/sync`,{method:"POST"});
    message(tr("calendarSynced"),"success");
    await syncDashboard();
  }catch(error){message(error.message,"error")}
}

async function setCalendarEnabled(calendar, enabled){
  message(tr("loading"));
  try{
    await api(`/calendars/${calendar.id}`,{method:"PUT",body:JSON.stringify({enabled})});
    message(tr(enabled ? "calendarEnabled" : "calendarDisabled"),"success");
    await syncDashboard();
  }catch(error){message(error.message,"error")}
}

async function disconnectCalendar(calendar){
  if(!confirm(tr("disconnectCalendarConfirm"))) return;
  message(tr("loading"));
  try{
    await api(`/calendars/${calendar.id}`,{method:"DELETE"});
    message(tr("calendarDisconnected"),"success");
    await syncDashboard();
  }catch(error){message(error.message,"error")}
}

function formatSyncTime(value){
  if(!value) return tr("neverSynced");
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(document.documentElement.lang);
}

function renderProperties(){
  if (!propertiesNode) return;
  propertiesNode.replaceChildren();

  if (!state.user) return;

  if (!state.properties.length) {
    const empty = document.createElement("div");
    empty.className = "host-empty";
    empty.textContent = tr("noProperties");
    propertiesNode.append(empty);
    return;
  }

  state.properties.forEach(property => {
    const expanded=expandedPropertyIds.has(property.id);
    const card = document.createElement("article");
    card.className = `host-property ${expanded?"expanded":"collapsed"}`;

    const head = document.createElement("div");
    head.className = "host-property-head";
    const title = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = property.title;
    const meta = document.createElement("span");
    const sleeps = Number(property.sleeps || property.bedrooms || 1);
    const accommodationType = property.accommodationType === "private_room" ? tr("privateRoom") : tr("entirePlace");
    meta.textContent = `${property.city} · ${accommodationType} · ${tr("bedroom", Number(property.bedrooms))} · ${tr("sleepSummary", sleeps)}`;
    title.append(strong, meta);
    const headActions=document.createElement("div");
    headActions.className="host-property-head-actions";
    const togglePropertyButton=document.createElement("button");
    togglePropertyButton.type="button";
    togglePropertyButton.className="host-property-toggle";
    togglePropertyButton.textContent=expanded?"▴":"▾";
    togglePropertyButton.title=tr(expanded?"collapseProperty":"expandProperty");
    togglePropertyButton.setAttribute("aria-label",tr(expanded?"collapseProperty":"expandProperty"));
    togglePropertyButton.addEventListener("click",()=>{
      if(expanded) expandedPropertyIds.delete(property.id);
      else expandedPropertyIds.add(property.id);
      renderProperties();
    });
    headActions.append(togglePropertyButton);
    if(expanded){
      const deletePropertyButton = document.createElement("button");
      deletePropertyButton.type = "button";
      deletePropertyButton.className = "text-button danger";
      deletePropertyButton.textContent = tr("deleteProperty");
      deletePropertyButton.addEventListener("click", () => deleteProperty(property));
      headActions.append(deletePropertyButton);
    }
    head.append(title, headActions);
    card.append(head);
    if(!expanded){
      propertiesNode.append(card);
      return;
    }

    const settings=document.createElement("div");
    settings.className="host-subpanel host-property-settings";
    const settingsTitle=document.createElement("h3");
    settingsTitle.textContent=tr("propertySettings");
    const settingsForm=document.createElement("form");
    settingsForm.className="host-settings-form";
    const accommodationLabel=document.createElement("label");
    const accommodationText=document.createElement("span");
    accommodationText.textContent=tr("accommodationTypeLabel");
    const accommodationSelect=document.createElement("select");
    accommodationSelect.name="accommodationType";
    const entireOption=document.createElement("option");
    entireOption.value="entire_place";entireOption.textContent=tr("entirePlace");
    const roomOption=document.createElement("option");
    roomOption.value="private_room";roomOption.textContent=tr("privateRoom");
    accommodationSelect.append(entireOption,roomOption);
    accommodationSelect.value=property.accommodationType==="private_room"?"private_room":"entire_place";
    accommodationLabel.append(accommodationText,accommodationSelect);
    const minStayLabel=document.createElement("label");
    const minStayText=document.createElement("span");
    minStayText.textContent=tr("minStayLabel");
    const minStayInput=document.createElement("input");
    minStayInput.type="number";minStayInput.name="minStayDays";minStayInput.min="1";minStayInput.max="365";minStayInput.required=true;minStayInput.value=String(property.minStayDays||1);
    minStayLabel.append(minStayText,minStayInput);
    const cleaningLabel=document.createElement("label");
    const cleaningText=document.createElement("span");
    cleaningText.textContent=tr("cleaningFee");
    const propertyCleaningInput=document.createElement("input");
    propertyCleaningInput.type="number";propertyCleaningInput.name="cleaningFee";propertyCleaningInput.min="0";propertyCleaningInput.step="0.01";propertyCleaningInput.value=centsToEuros(property.cleaningFeeCents);
    cleaningLabel.append(cleaningText,propertyCleaningInput);
    const saveSettings=document.createElement("button");
    saveSettings.className="button button-small";saveSettings.type="submit";saveSettings.textContent=tr("savePropertySettings");
    settingsForm.append(accommodationLabel,minStayLabel,cleaningLabel,saveSettings);
    settingsForm.addEventListener("submit",event=>{event.preventDefault();updatePropertySettings(property,settingsForm)});
    settings.append(settingsTitle,settingsForm);

    const listing = document.createElement("div");
    listing.className = "host-subpanel";
    const listingTitle = document.createElement("h3");
    listingTitle.textContent = tr("externalListing");
    listing.append(listingTitle);

    if (property.listing?.url) {
      const a = document.createElement("a");
      a.href = property.listing.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "host-saved-link";
      a.textContent = property.listing.url;
      const actions = document.createElement("div");
      actions.className = "host-listing-actions";
      const visibility=document.createElement("label");
      visibility.className="host-listing-visibility";
      const visibilityCheckbox=document.createElement("input");
      visibilityCheckbox.type="checkbox";
      visibilityCheckbox.checked=property.listing.showInSearch!==false;
      visibilityCheckbox.addEventListener("change",()=>updateListingVisibility(property,visibilityCheckbox));
      const visibilityText=document.createElement("span");
      visibilityText.textContent=tr("showListingInSearch");
      visibility.append(visibilityCheckbox,visibilityText);
      const removeListing = document.createElement("button");
      removeListing.type = "button";
      removeListing.className = "text-button danger";
      removeListing.textContent = tr("deleteListing");
      removeListing.addEventListener("click", () => deleteListing(property));
      const listingControls=document.createElement("div");
      listingControls.className="host-listing-controls";
      listingControls.append(visibility,removeListing);
      actions.append(a, listingControls);
      listing.append(actions);
    } else {
      const form = document.createElement("form");
      form.className = "host-inline-form";
      const help = document.createElement("p");
      help.className = "host-inline-muted host-listing-help";
      help.textContent = tr("airbnbIdHelp");
      listing.append(help);

      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.pattern = "[0-9]+";
      input.name = "externalId";
      input.required = true;
      input.placeholder = tr("airbnbIdPlaceholder");
      const button = document.createElement("button");
      button.className = "button button-small";
      button.type = "submit";
      button.textContent = tr("saveAirbnb");
      form.append(input, button);
      form.addEventListener("submit", event => {
        event.preventDefault();
        addListing(property, form);
      });
      listing.append(form);
    }

    const syncPanel=document.createElement("div");
    syncPanel.className="host-subpanel host-calendar-sync";
    const syncTitle=document.createElement("h3");
    syncTitle.textContent=tr("calendarSync");
    syncPanel.append(syncTitle);

    const externalCalendar=Array.isArray(property.calendars) ? property.calendars.find(item=>item.provider==="airbnb") : null;

    if(externalCalendar){
      const status=document.createElement("div");
      status.className=`host-calendar-status ${externalCalendar.enabled===false ? "disabled" : (externalCalendar.status||"")}`;

      const statusTop=document.createElement("div");
      const statusLabel=document.createElement("strong");
      statusLabel.textContent=externalCalendar.enabled===false
        ? `Airbnb · ${tr("calendarDisabledStatus")}`
        : (externalCalendar.status==="connected" ? `Airbnb · ${tr("calendarConnectedStatus")}` : `Airbnb · ${tr("calendarError")}`);
      const last=document.createElement("span");
      last.textContent=tr("lastSync",formatSyncTime(externalCalendar.lastSyncedAt));
      statusTop.append(statusLabel,last);

      const stats=document.createElement("div");
      stats.className="host-calendar-stats";
      const reservations=Array.isArray(externalCalendar.reservationBlocks)?externalCalendar.reservationBlocks:[];
      const imported=document.createElement("span");
      imported.textContent=tr("reservationsImported",reservations.length);
      const ignored=document.createElement("span");
      ignored.textContent=tr("ignoredBlocks",Number(externalCalendar.platformUnavailableCount||0));
      stats.append(imported,ignored);

      const actions=document.createElement("div");
      actions.className="host-calendar-actions";
      const controlGroup=document.createElement("div");
      controlGroup.className="host-calendar-control-group";
      const syncButton=document.createElement("button");
      syncButton.type="button";syncButton.className="button button-small";syncButton.textContent=tr("syncNow");syncButton.disabled=externalCalendar.enabled===false;
      syncButton.addEventListener("click",()=>syncCalendar(externalCalendar));
      const toggleButton=document.createElement("button");
      toggleButton.type="button";toggleButton.className="text-button";toggleButton.textContent=tr(externalCalendar.enabled===false ? "enableCalendar" : "disableCalendar");
      toggleButton.addEventListener("click",()=>setCalendarEnabled(externalCalendar,externalCalendar.enabled===false));
      const disconnectButton=document.createElement("button");
      disconnectButton.type="button";disconnectButton.className="text-button danger host-calendar-delete";disconnectButton.textContent=tr("disconnectCalendar");
      disconnectButton.addEventListener("click",()=>disconnectCalendar(externalCalendar));
      controlGroup.append(syncButton,toggleButton);
      actions.append(controlGroup,disconnectButton);

      status.append(statusTop,stats);
      if(externalCalendar.lastError){
        const err=document.createElement("p");err.className="host-inline-error";err.textContent=externalCalendar.lastError;status.append(err);
      }

      if(reservations.length){
        const blocks=document.createElement("div");
        blocks.className="host-calendar-blocks";
        reservations.forEach(block=>{
          const item=document.createElement("span");
          item.textContent=`${block.from} → ${block.to}`;
          blocks.append(item);
        });
        status.append(blocks);
      }

      syncPanel.append(status,actions);
    }else{
      const help=document.createElement("p");
      help.className="host-inline-muted host-listing-help";
      help.textContent=tr("calendarHelp");
      const form=document.createElement("form");
      form.className="host-inline-form host-calendar-form";
      const input=document.createElement("input");
      input.type="url";input.name="icalUrl";input.required=true;input.autocomplete="off";input.placeholder=tr("calendarUrl");
      const button=document.createElement("button");
      button.className="button button-small";button.type="submit";button.textContent=tr("connectCalendar");
      form.append(input,button);
      form.addEventListener("submit",event=>{event.preventDefault();connectCalendar(property,form)});
      syncPanel.append(help,form);
    }

    const calendar = document.createElement("div");
    calendar.className = "host-subpanel";
    const calendarTitle = document.createElement("h3");
    calendarTitle.textContent = tr("availability");
    calendar.append(calendarTitle);

    const addForm = document.createElement("form");
    addForm.className = "host-inline-form host-dates";
    const fromInput = document.createElement("input");
    fromInput.type = "date";
    fromInput.name = "from";
    fromInput.required = true;
    const toInput = document.createElement("input");
    toInput.type = "date";
    toInput.name = "to";
    toInput.required = true;
    fromInput.addEventListener("change", () => {
      const minCheckout = plusDays(fromInput.value, 1);
      toInput.min = minCheckout;
      if (!toInput.value || toInput.value <= fromInput.value) toInput.value = minCheckout;
    });
    const nightlyInput=document.createElement("input");
    nightlyInput.type="number";nightlyInput.min="0.01";nightlyInput.step="0.01";nightlyInput.name="nightlyPrice";nightlyInput.placeholder=tr("nightlyPrice");
    const addButton = document.createElement("button");
    addButton.className = "button button-small";
    addButton.type = "submit";
    addButton.textContent = tr("addDates");
    addForm.append(fromInput, toInput, nightlyInput, addButton);
    addForm.addEventListener("submit", event => {
      event.preventDefault();
      addAvailability(property, addForm);
    });
    calendar.append(addForm);

    const periods = document.createElement("div");
    periods.className = "host-periods";

    if (property.availabilityError) {
      const err = document.createElement("p");
      err.className = "host-inline-error";
      err.textContent = property.availabilityError;
      periods.append(err);
    } else if (!Array.isArray(property.availability)) {
      const loading = document.createElement("p");
      loading.className = "host-inline-muted";
      loading.textContent = tr("loading");
      periods.append(loading);
      refreshAvailability(property, true);
    } else if (!property.availability.length) {
      const empty = document.createElement("p");
      empty.className = "host-inline-muted";
      empty.textContent = tr("noPeriods");
      periods.append(empty);
    } else {
      property.availability.forEach(period => {
        const row = document.createElement("div");
        row.className = "host-period";

        const from = document.createElement("input");
        from.type = "date";
        from.value = period.from;
        const to = document.createElement("input");
        to.type = "date";
        to.value = period.to;
        to.min = plusDays(period.from, 1);
        from.addEventListener("change", () => {
          const minCheckout = plusDays(from.value, 1);
          to.min = minCheckout;
          if (!to.value || to.value <= from.value) to.value = minCheckout;
        });

        const nightly=document.createElement("input");
        nightly.type="number";nightly.min="0.01";nightly.step="0.01";nightly.placeholder=tr("nightlyPrice");nightly.value=centsToEuros(period.nightlyPriceCents);

        const save = document.createElement("button");
        save.type = "button";
        save.className = "text-button";
        save.textContent = tr("save");
        save.addEventListener("click", () => updateAvailability(property, period, from.value, to.value, nightly.value));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "text-button danger";
        remove.textContent = tr("remove");
        remove.addEventListener("click", () => deleteAvailability(property, period));

        row.append(from, to, nightly, save, remove);
        periods.append(row);
      });
    }

    calendar.append(periods);
    card.append(settings, listing);
    if(property.listing) card.append(syncPanel);
    card.append(calendar);
    propertiesNode.append(card);
  });
}

langButtons.forEach(btn => btn.addEventListener("click", () => applyLanguage(btn.dataset.hostLang)));

applyLanguage(lang);
boot();
