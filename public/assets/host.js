const STORAGE_KEY = "parrot669-host-state";

const emptyState = () => ({profileId:"", parrotId:"", editToken:"", properties:[]});
let state = loadState();

const statusNode = document.getElementById("host-status");
const profileForm = document.getElementById("profile-form");
const propertyPanel = document.getElementById("property-panel");
const propertyForm = document.getElementById("property-form");
const hostSession = document.getElementById("host-session");
const hostParrotId = document.getElementById("host-parrot-id");
const propertiesNode = document.getElementById("host-properties");
const resetButton = document.getElementById("reset-host");

function loadState(){
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return parsed && typeof parsed === "object" ? {...emptyState(), ...parsed, properties:Array.isArray(parsed.properties) ? parsed.properties : []} : emptyState();
  } catch {
    return emptyState();
  }
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
    renderProperties();
  }
}

profileForm.addEventListener("submit", async event => {
  event.preventDefault();
  setBusy(profileForm, true);
  message("Creating host profile…");

  const form = new FormData(profileForm);
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
    message("Host profile created. Save this browser session; there is no token recovery yet.", "success");
    boot();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(profileForm, false);
  }
});

propertyForm.addEventListener("submit", async event => {
  event.preventDefault();
  setBusy(propertyForm, true);
  message("Adding property…");

  const form = new FormData(propertyForm);
  try {
    const created = await api(`/profiles/${state.profileId}/properties`, {
      method:"POST",
      body:JSON.stringify({
        title:String(form.get("title") || "").trim(),
        city:String(form.get("city") || "").trim(),
        bedrooms:Number(form.get("bedrooms"))
      })
    });

    state.properties.push({
      id:created.id,
      title:created.title,
      city:created.city,
      bedrooms:created.bedrooms,
      listing:null
    });
    saveState();
    propertyForm.elements.title.value = "";
    message("Property added.", "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(propertyForm, false);
  }
});

resetButton.addEventListener("click", () => {
  if (!confirm("Forget the PARROT edit token and local property list from this browser?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = emptyState();
  message("Local host session removed.");
  boot();
});

async function addListing(property, form){
  setBusy(form, true);
  message("Saving external listing…");
  const data = new FormData(form);

  try {
    const created = await api(`/properties/${property.id}/listings`, {
      method:"POST",
      body:JSON.stringify({
        platform:"airbnb",
        url:String(data.get("url") || "").trim()
      })
    });
    property.listing = {id:created.id, platform:created.platform, url:created.url};
    saveState();
    message("Airbnb link saved.", "success");
    renderProperties();
  } catch (error) {
    message(error.message, "error");
  } finally {
    setBusy(form, false);
  }
}

async function addAvailability(property, form){
  setBusy(form, true);
  message("Adding availability…");
  const data = new FormData(form);

  try {
    await api(`/properties/${property.id}/availability`, {
      method:"POST",
      body:JSON.stringify({from:data.get("from"), to:data.get("to")})
    });
    message("Availability added.", "success");
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
    if (rerender) renderProperties();
  } catch (error) {
    property.availabilityError = error.message;
    if (rerender) renderProperties();
  }
}

async function updateAvailability(property, period, from, to){
  message("Updating availability…");
  try {
    await api(`/availability/${period.id}`, {
      method:"PUT",
      body:JSON.stringify({from, to})
    });
    message("Availability updated.", "success");
    await refreshAvailability(property, true);
  } catch (error) {
    message(error.message, "error");
  }
}

async function deleteAvailability(property, period){
  if (!confirm(`Delete ${period.from} → ${period.to}?`)) return;
  message("Deleting availability…");
  try {
    await api(`/availability/${period.id}`, {method:"DELETE"});
    message("Availability deleted.", "success");
    await refreshAvailability(property, true);
  } catch (error) {
    message(error.message, "error");
  }
}

function renderProperties(){
  propertiesNode.replaceChildren();

  if (!state.properties.length) {
    const empty = document.createElement("div");
    empty.className = "host-empty";
    empty.textContent = "No properties yet.";
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
    meta.textContent = `${property.city} · ${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}`;
    title.append(strong, meta);
    head.append(title);

    const listing = document.createElement("div");
    listing.className = "host-subpanel";
    const listingTitle = document.createElement("h3");
    listingTitle.textContent = "External listing";
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
      form.innerHTML = '<input type="url" name="url" required placeholder="https://www.airbnb.com/rooms/…" /><button class="button button-small" type="submit">Save Airbnb link</button>';
      form.addEventListener("submit", event => {
        event.preventDefault();
        addListing(property, form);
      });
      listing.append(form);
    }

    const calendar = document.createElement("div");
    calendar.className = "host-subpanel";
    const calendarTitle = document.createElement("h3");
    calendarTitle.textContent = "Availability";
    calendar.append(calendarTitle);

    const addForm = document.createElement("form");
    addForm.className = "host-inline-form host-dates";
    addForm.innerHTML = '<input type="date" name="from" required /><input type="date" name="to" required /><button class="button button-small" type="submit">Add dates</button>';
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
      loading.textContent = "Loading…";
      periods.append(loading);
      refreshAvailability(property, true);
    } else if (!property.availability.length) {
      const empty = document.createElement("p");
      empty.className = "host-inline-muted";
      empty.textContent = "No availability periods.";
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
        save.textContent = "Save";
        save.addEventListener("click", () => updateAvailability(property, period, from.value, to.value));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "text-button danger";
        remove.textContent = "Delete";
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

boot();
