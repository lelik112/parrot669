const STORAGE_KEY = "parrot669-host-state";
const LANG_KEY = "parrot669-language";

const copy = {
  en: {
    title:"PARROT 669 — Host console", consoleLabel:"HOST CONSOLE", backToSite:"← Back to site",
    toolsEyebrow:"HOST TOOLS", heroTitle:"Publish availability.<br><span>Keep the deal elsewhere.</span>",
    heroLead:"Add a property, link the original Airbnb listing and maintain only the dates when the property is physically free.",
    identityTitle:"Host identity", identityHelp:"The edit token stays in this browser. PARROT stores only its hash.",
    nameLabel:"Name / host label", contactLabel:"Contact", contactPlaceholder:"Email or WhatsApp", createProfile:"Create host profile →",
    forgetSession:"Forget this browser session", propertiesTitle:"Properties",
    propertiesHelp:"No photos, prices or copied descriptions. Only enough data to search availability.",
    internalLabel:"Internal label", propertyPlaceholder:"Poblenou apartment", cityLabel:"City", bedroomsLabel:"Bedrooms", sleepsLabel:"Sleeping places", minStayLabel:"Minimum stay, days", addProperty:"Add property →",
    creatingProfile:"Creating host profile…", profileCreated:"Host profile created. This browser now holds the edit token; there is no recovery yet.",
    addingProperty:"Adding property…", propertyAdded:"Property added.", resetConfirm:"Forget the PARROT edit token and local property list from this browser?",
    sessionRemoved:"Local host session removed.", savingListing:"Saving external listing…", listingSaved:"Airbnb link saved.",
    addingAvailability:"Adding availability…", availabilityAdded:"Availability added.", updatingAvailability:"Updating availability…",
    availabilityUpdated:"Availability updated.", deletingAvailability:"Deleting availability…", availabilityDeleted:"Availability deleted.",
    deleteConfirm:(a,b)=>`Delete ${a} → ${b}?`, noProperties:"No properties yet.", externalListing:"External listing",
    saveAirbnb:"Save Airbnb ID", airbnbIdHelp:"Open the public Airbnb listing and copy the number after /rooms/. Example: 910841261983250037", airbnbIdPlaceholder:"Airbnb listing ID", availability:"Availability", addDates:"Add dates", loading:"Loading…",
    noPeriods:"No availability periods.", save:"Save", remove:"Delete", bedroom:n=>n===1?"1 bedroom":`${n} bedrooms`
  },
  es: {
    title:"PARROT 669 — Panel de propietarios", consoleLabel:"PANEL DE PROPIETARIOS", backToSite:"← Volver al sitio",
    toolsEyebrow:"HERRAMIENTAS PARA PROPIETARIOS", heroTitle:"Publica la disponibilidad.<br><span>La operación ocurre fuera.</span>",
    heroLead:"Añade una vivienda, enlaza el anuncio original de Airbnb y mantén únicamente las fechas en las que está físicamente libre.",
    identityTitle:"Identidad del propietario", identityHelp:"El token de edición se queda en este navegador. PARROT solo guarda su hash.",
    nameLabel:"Nombre / etiqueta", contactLabel:"Contacto", contactPlaceholder:"Email o WhatsApp", createProfile:"Crear perfil →",
    forgetSession:"Olvidar esta sesión del navegador", propertiesTitle:"Viviendas",
    propertiesHelp:"Sin fotos, precios ni descripciones copiadas. Solo los datos mínimos para buscar disponibilidad.",
    internalLabel:"Etiqueta interna", propertyPlaceholder:"Apartamento Poblenou", cityLabel:"Ciudad", bedroomsLabel:"Dormitorios", sleepsLabel:"Plazas para dormir", minStayLabel:"Estancia mínima, días", addProperty:"Añadir vivienda →",
    creatingProfile:"Creando perfil…", profileCreated:"Perfil creado. Este navegador guarda ahora el token de edición; todavía no hay recuperación.",
    addingProperty:"Añadiendo vivienda…", propertyAdded:"Vivienda añadida.", resetConfirm:"¿Olvidar el token de edición de PARROT y la lista local de viviendas de este navegador?",
    sessionRemoved:"Sesión local eliminada.", savingListing:"Guardando anuncio externo…", listingSaved:"Enlace de Airbnb guardado.",
    addingAvailability:"Añadiendo disponibilidad…", availabilityAdded:"Disponibilidad añadida.", updatingAvailability:"Actualizando disponibilidad…",
    availabilityUpdated:"Disponibilidad actualizada.", deletingAvailability:"Eliminando disponibilidad…", availabilityDeleted:"Disponibilidad eliminada.",
    deleteConfirm:(a,b)=>`¿Eliminar ${a} → ${b}?`, noProperties:"Todavía no hay viviendas.", externalListing:"Anuncio externo",
    saveAirbnb:"Guardar ID de Airbnb", airbnbIdHelp:"Abre el anuncio público de Airbnb y copia el número que aparece después de /rooms/. Ejemplo: 910841261983250037", airbnbIdPlaceholder:"ID del anuncio de Airbnb", availability:"Disponibilidad", addDates:"Añadir fechas", loading:"Cargando…",
    noPeriods:"No hay periodos de disponibilidad.", save:"Guardar", remove:"Eliminar", bedroom:n=>n===1?"1 dormitorio":`${n} dormitorios`
  },
  ca: {
    title:"PARROT 669 — Panell de propietaris", consoleLabel:"PANELL DE PROPIETARIS", backToSite:"← Tornar al web",
    toolsEyebrow:"EINES PER A PROPIETARIS", heroTitle:"Publica la disponibilitat.<br><span>L'operació passa fora.</span>",
    heroLead:"Afegeix un habitatge, enllaça l'anunci original d'Airbnb i mantén només les dates en què està físicament lliure.",
    identityTitle:"Identitat del propietari", identityHelp:"El token d'edició es queda en aquest navegador. PARROT només en desa el hash.",
    nameLabel:"Nom / etiqueta", contactLabel:"Contacte", contactPlaceholder:"Email o WhatsApp", createProfile:"Crear perfil →",
    forgetSession:"Oblidar aquesta sessió del navegador", propertiesTitle:"Habitatges",
    propertiesHelp:"Sense fotos, preus ni descripcions copiades. Només les dades mínimes per cercar disponibilitat.",
    internalLabel:"Etiqueta interna", propertyPlaceholder:"Apartament Poblenou", cityLabel:"Ciutat", bedroomsLabel:"Dormitoris", sleepsLabel:"Places per dormir", minStayLabel:"Estada mínima, dies", addProperty:"Afegir habitatge →",
    creatingProfile:"Creant perfil…", profileCreated:"Perfil creat. Aquest navegador desa ara el token d'edició; encara no hi ha recuperació.",
    addingProperty:"Afegint habitatge…", propertyAdded:"Habitatge afegit.", resetConfirm:"Oblidar el token d'edició de PARROT i la llista local d'habitatges d'aquest navegador?",
    sessionRemoved:"Sessió local eliminada.", savingListing:"Desant l'anunci extern…", listingSaved:"Enllaç d'Airbnb desat.",
    addingAvailability:"Afegint disponibilitat…", availabilityAdded:"Disponibilitat afegida.", updatingAvailability:"Actualitzant disponibilitat…",
    availabilityUpdated:"Disponibilitat actualitzada.", deletingAvailability:"Eliminant disponibilitat…", availabilityDeleted:"Disponibilitat eliminada.",
    deleteConfirm:(a,b)=>`Eliminar ${a} → ${b}?`, noProperties:"Encara no hi ha habitatges.", externalListing:"Anunci extern",
    saveAirbnb:"Desar ID d'Airbnb", airbnbIdHelp:"Obre l'anunci públic d'Airbnb i copia el número que hi ha després de /rooms/. Exemple: 910841261983250037", airbnbIdPlaceholder:"ID de l'anunci d'Airbnb", availability:"Disponibilitat", addDates:"Afegir dates", loading:"Carregant…",
    noPeriods:"No hi ha períodes de disponibilitat.", save:"Desar", remove:"Eliminar", bedroom:n=>n===1?"1 dormitori":`${n} dormitoris`
  },
  ru: {
    title:"PARROT 669 — Кабинет владельца", consoleLabel:"КАБИНЕТ ВЛАДЕЛЬЦА", backToSite:"← Назад на сайт",
    toolsEyebrow:"ИНСТРУМЕНТЫ ВЛАДЕЛЬЦА", heroTitle:"Публикуйте свободные даты.<br><span>Сделка остаётся снаружи.</span>",
    heroLead:"Добавьте объект, укажите исходное объявление Airbnb и поддерживайте только даты, когда жильё физически свободно.",
    identityTitle:"Профиль владельца", identityHelp:"Токен редактирования остаётся в этом браузере. PARROT хранит только его hash.",
    nameLabel:"Имя / название", contactLabel:"Контакт", contactPlaceholder:"Email или WhatsApp", createProfile:"Создать профиль →",
    forgetSession:"Забыть сессию в этом браузере", propertiesTitle:"Объекты",
    propertiesHelp:"Без фотографий, цен и скопированных описаний. Только минимум данных для поиска свободных дат.",
    internalLabel:"Название для себя", propertyPlaceholder:"Квартира в Poblenou", cityLabel:"Город", bedroomsLabel:"Спальни", sleepsLabel:"Спальных мест", minStayLabel:"Минимум дней", addProperty:"Добавить объект →",
    creatingProfile:"Создаём профиль…", profileCreated:"Профиль создан. Токен редактирования теперь хранится в этом браузере; восстановления пока нет.",
    addingProperty:"Добавляем объект…", propertyAdded:"Объект добавлен.", resetConfirm:"Забыть токен PARROT и локальный список объектов в этом браузере?",
    sessionRemoved:"Локальная сессия удалена.", savingListing:"Сохраняем внешнее объявление…", listingSaved:"Ссылка Airbnb сохранена.",
    addingAvailability:"Добавляем свободные даты…", availabilityAdded:"Свободные даты добавлены.", updatingAvailability:"Обновляем даты…",
    availabilityUpdated:"Даты обновлены.", deletingAvailability:"Удаляем даты…", availabilityDeleted:"Даты удалены.",
    deleteConfirm:(a,b)=>`Удалить период ${a} → ${b}?`, noProperties:"Объектов пока нет.", externalListing:"Внешнее объявление",
    saveAirbnb:"Сохранить ID Airbnb", airbnbIdHelp:"Откройте публичную страницу объявления Airbnb и скопируйте число после /rooms/. Например: 910841261983250037", airbnbIdPlaceholder:"ID объявления Airbnb", availability:"Свободные даты", addDates:"Добавить даты", loading:"Загрузка…",
    noPeriods:"Свободных периодов пока нет.", save:"Сохранить", remove:"Удалить", bedroom:n=>n===1?"1 спальня":n<5?`${n} спальни`:`${n} спален`
  }
};

const emptyState = () => ({profileId:"", parrotId:"", editToken:"", properties:[]});
let state = loadState();
let lang = loadLanguage();

const statusNode = document.getElementById("host-status");
const profileForm = document.getElementById("profile-form");
const propertyPanel = document.getElementById("property-panel");
const propertyForm = document.getElementById("property-form");
const hostSession = document.getElementById("host-session");
const hostParrotId = document.getElementById("host-parrot-id");
const propertiesNode = document.getElementById("host-properties");
const resetButton = document.getElementById("reset-host");
const langButtons = document.querySelectorAll("[data-host-lang]");

function loadState(){
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return parsed && typeof parsed === "object"
      ? {...emptyState(), ...parsed, properties:Array.isArray(parsed.properties) ? parsed.properties : []}
      : emptyState();
  } catch {
    return emptyState();
  }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function message(text, kind = ""){
  statusNode.textContent = text || "";
  statusNode.className = `host-status ${kind}`.trim();
}

async function api(path, options = {}){
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  if (state.editToken) headers.set("X-Parrot-Token", state.editToken);

  const response = await fetch(`/api/host${path}`, {...options, headers});
  if (response.status === 204) return null;

  let data = null;
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
  return data;
}

function setBusy(form, busy){
  form?.querySelectorAll("button,input,select").forEach(node => node.disabled = busy);
}

function boot(){
  const ready = Boolean(state.profileId && state.editToken);
  profileForm.hidden = ready;
  hostSession.hidden = !ready;
  propertyPanel.hidden = !ready;

  if (ready) {
    hostParrotId.textContent = state.parrotId || state.profileId;
  }
  renderProperties();
}

profileForm.addEventListener("submit", async event => {
  event.preventDefault();

  // Capture values before disabling controls. Disabled controls are omitted by FormData.
  const form = new FormData(profileForm);
  setBusy(profileForm, true);
  message(tr("creatingProfile"));

  try {
    const created = await api("/profiles", {
      method:"POST",
      body:JSON.stringify({
        displayName:String(form.get("displayName") || "").trim(),
        contact:String(form.get("contact") || "").trim()
      })
    });

    state = {
      ...emptyState(),
      profileId:created.id,
      parrotId:created.profile.parrotId,
      editToken:created.editToken
    };
    saveState();
    message(tr("profileCreated"), "success");
    boot();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(profileForm, false);
  }
});

propertyForm.addEventListener("submit", async event => {
  event.preventDefault();

  const form = new FormData(propertyForm);
  setBusy(propertyForm, true);
  message(tr("addingProperty"));

  try {
    const created = await api(`/profiles/${state.profileId}/properties`, {
      method:"POST",
      body:JSON.stringify({
        title:String(form.get("title") || "").trim(),
        city:String(form.get("city") || "").trim(),
        bedrooms:Number(form.get("bedrooms")),
        sleeps:Number(form.get("sleeps")),
        minStayDays:Number(form.get("minStayDays"))
      })
    });

    state.properties.push({
      id:created.id,
      title:created.title,
      city:created.city,
      bedrooms:created.bedrooms,
      sleeps:created.sleeps,
      minStayDays:created.minStayDays,
      listing:null
    });
    saveState();
    propertyForm.elements.title.value = "";
    message(tr("propertyAdded"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(propertyForm, false);
  }
});

resetButton.addEventListener("click", () => {
  if (!confirm(tr("resetConfirm"))) return;
  localStorage.removeItem(STORAGE_KEY);
  state = emptyState();
  message(tr("sessionRemoved"));
  boot();
});

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
    property.listing = {id:created.id, platform:created.platform, externalId:created.externalId, url:created.url};
    saveState();
    message(tr("listingSaved"), "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(form, false);
  }
}

async function addAvailability(property, form){
  const data = new FormData(form);
  setBusy(form, true);
  message(tr("addingAvailability"));

  try {
    await api(`/properties/${property.id}/availability`, {
      method:"POST",
      body:JSON.stringify({from:data.get("from"), to:data.get("to")})
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

async function updateAvailability(property, period, from, to){
  message(tr("updatingAvailability"));
  try {
    await api(`/availability/${period.id}`, {
      method:"PUT",
      body:JSON.stringify({from, to})
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

function renderProperties(){
  if (!propertiesNode) return;
  propertiesNode.replaceChildren();

  if (!state.profileId) return;

  if (!state.properties.length) {
    const empty = document.createElement("div");
    empty.className = "host-empty";
    empty.textContent = tr("noProperties");
    propertiesNode.append(empty);
    return;
  }

  state.properties.forEach(property => {
    const card = document.createElement("article");
    card.className = "host-property";

    const head = document.createElement("div");
    head.className = "host-property-head";
    const title = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = property.title;
    const meta = document.createElement("span");
    const sleeps = Number(property.sleeps || property.bedrooms || 1);
    const minStay = Number(property.minStayDays || 1);
    meta.textContent = `${property.city} · ${tr("bedroom", Number(property.bedrooms))} · ${sleeps} sleeps · min ${minStay} d`;
    title.append(strong, meta);
    head.append(title);

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
      listing.append(a);
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
    const addButton = document.createElement("button");
    addButton.className = "button button-small";
    addButton.type = "submit";
    addButton.textContent = tr("addDates");
    addForm.append(fromInput, toInput, addButton);
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

        const save = document.createElement("button");
        save.type = "button";
        save.className = "text-button";
        save.textContent = tr("save");
        save.addEventListener("click", () => updateAvailability(property, period, from.value, to.value));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "text-button danger";
        remove.textContent = tr("remove");
        remove.addEventListener("click", () => deleteAvailability(property, period));

        row.append(from, to, save, remove);
        periods.append(row);
      });
    }

    calendar.append(periods);
    card.append(head, listing, calendar);
    propertiesNode.append(card);
  });
}

langButtons.forEach(btn => btn.addEventListener("click", () => applyLanguage(btn.dataset.hostLang)));

applyLanguage(lang);
boot();
