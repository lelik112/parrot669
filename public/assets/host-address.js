(function(root){
  function create({id, tr, request, initial = null, required = false, location = null, onUnauthorized = () => {}}){
    const node = document.createElement("div");
    node.className = "host-address-field";
    const label = document.createElement("label");
    const heading = document.createElement("span");
    const input = document.createElement("input");
    input.id = id;
    input.name = "addressQuery";
    input.type = "text";
    input.maxLength = 256;
    input.required = required;
    input.autocomplete = "off";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", `${id}-options`);
    input.setAttribute("aria-describedby", `${id}-help ${id}-status`);
    label.append(heading, input);
    const help = document.createElement("p");
    help.id = `${id}-help`;
    help.className = "host-address-help";
    const dropdown = document.createElement("div");
    dropdown.className = "host-address-dropdown";
    dropdown.hidden = true;
    const list = document.createElement("ul");
    list.id = `${id}-options`;
    list.className = "host-address-options";
    list.setAttribute("role", "listbox");
    const attribution = document.createElement("a");
    attribution.className = "host-address-attribution";
    attribution.href = "https://www.geoapify.com/";
    attribution.target = "_blank";
    attribution.rel = "noopener noreferrer";
    attribution.textContent = "Powered by Geoapify";
    dropdown.append(list, attribution);
    const status = document.createElement("p");
    status.id = `${id}-status`;
    status.className = "host-address-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "text-button host-address-retry";
    retry.hidden = true;
    const summary = document.createElement("div");
    summary.className = "host-address-location";
    const country = document.createElement("div");
    const countryLabel = document.createElement("span");
    const countryValue = document.createElement("strong");
    country.append(countryLabel, countryValue);
    const city = document.createElement("div");
    const cityLabel = document.createElement("span");
    const cityValue = document.createElement("strong");
    city.append(cityLabel, cityValue);
    summary.append(country, city);
    node.append(label, dropdown, help, status, retry, summary);

    let selected = initial, suggestions = [], active = -1, timer, controller, sequence = 0;
    let statusKey = "", statusError = false;
    input.value = initial?.address || "";
    function showLocation(value){
      summary.hidden = !value;
      countryValue.textContent = value?.country || "";
      cityValue.textContent = value?.city || "";
    }
    function showStatus(key, error = false){
      statusKey = key;
      statusError = error;
      status.textContent = key ? tr(key) : "";
      status.hidden = !key;
      status.className = `host-address-status${error ? " host-inline-error" : ""}`;
    }
    function cancel(){
      clearTimeout(timer);
      controller?.abort();
      sequence += 1;
      input.setAttribute("aria-busy", "false");
    }
    function close(){
      dropdown.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }
    function choose(value){
      cancel();
      selected = {
        address:value.address, countryCode:value.countryCode, country:value.country,
        city:value.city, latitude:value.latitude, longitude:value.longitude, placeId:value.placeId,
        street:value.street, houseNumber:value.houseNumber, resultType:value.resultType
      };
      input.value = selected.address;
      input.removeAttribute("aria-invalid");
      retry.hidden = true;
      showLocation(selected);
      showStatus("addressSelected");
      close();
      input.focus();
    }
    function isComplete(value){
      return value && typeof value.address === "string" && value.address.trim() &&
        /^[a-z]{2}$/i.test(value.countryCode || "") && value.country && value.city &&
        typeof value.street === "string" && value.street.trim() &&
        typeof value.houseNumber === "string" && value.houseNumber.trim() &&
        ["building", "amenity"].includes(value.resultType) &&
        Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90 &&
        Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180 && value.placeId;
    }
    function renderOptions(){
      list.replaceChildren();
      suggestions.forEach((value, index) => {
        const option = document.createElement("li");
        option.id = `${id}-option-${index}`;
        option.className = "host-address-option";
        option.tabIndex = -1;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        const title = document.createElement("span");
        title.textContent = value.address;
        const detail = document.createElement("small");
        detail.textContent = `${value.city} · ${value.country}`;
        option.append(title, detail);
        option.addEventListener("click", () => choose(value));
        list.append(option);
      });
      active = -1;
      dropdown.hidden = !suggestions.length;
      input.setAttribute("aria-expanded", String(suggestions.length > 0));
    }
    async function search(){
      cancel();
      const query = input.value.trim();
      retry.hidden = true;
      if (query.length < 3) { close(); showStatus(query ? "addressMore" : ""); return; }
      if (query.length > 256) { close(); showStatus("addressTooLong", true); return; }
      const current = sequence;
      controller = new AbortController();
      input.setAttribute("aria-busy", "true");
      showStatus("addressLoading");
      try {
        const results = await request(`/geocode/autocomplete?q=${encodeURIComponent(query)}`, {signal:controller.signal});
        if (current !== sequence) return;
        suggestions = (Array.isArray(results) ? results : []).filter(isComplete).slice(0,5);
        renderOptions();
        showStatus(suggestions.length ? "addressChoose" : "addressNoResults");
      } catch(error) {
        if (current !== sequence || error.name === "AbortError") return;
        close();
        showStatus(error.status === 401 ? "addressSignIn" : "addressUnavailable", true);
        retry.hidden = error.status === 401;
        if (error.status === 401) onUnauthorized();
      } finally {
        if (current === sequence) input.setAttribute("aria-busy", "false");
      }
    }
    input.addEventListener("input", () => {
      cancel();
      selected = null;
      suggestions = [];
      input.removeAttribute("aria-invalid");
      retry.hidden = true;
      showLocation(null);
      close();
      const length = input.value.trim().length;
      showStatus(length && length < 3 ? "addressMore" : "");
      if (length >= 3) timer = setTimeout(search, 300);
    });
    input.addEventListener("focus", () => {
      if (!selected && input.value.trim().length >= 3) {
        if (suggestions.length) renderOptions();
        else { cancel(); timer = setTimeout(search, 300); }
      }
    });
    input.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); cancel(); close(); showStatus(""); return; }
      if (dropdown.hidden || !suggestions.length) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        active = (active + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length;
        Array.from(list.children).forEach((option, index) => option.setAttribute("aria-selected", String(index === active)));
        input.setAttribute("aria-activedescendant", `${id}-option-${active}`);
        list.children[active].scrollIntoView?.({block:"nearest"});
      } else if (event.key === "Enter") {
        event.preventDefault();
        choose(suggestions[Math.max(active, 0)]);
      } else if (event.key === "Tab") { cancel(); close(); }
    });
    function dismiss(){
      cancel(); close();
      if (statusKey === "addressLoading") showStatus("");
    }
    // Mobile Safari can blur the input with relatedTarget=null before dispatching
    // the suggestion's click. Keep it mounted; outside taps dismiss independently.
    node.addEventListener("focusout", event => {
      if (event.relatedTarget && !node.contains(event.relatedTarget)) dismiss();
    });
    function outsidePointerDown(event){
      if (!node.contains(event.target)) dismiss();
    }
    document.addEventListener("pointerdown", outsidePointerDown);
    retry.addEventListener("click", search);
    function updateLanguage(){
      heading.textContent = tr("addressLabel");
      input.placeholder = tr("addressPlaceholder");
      list.setAttribute("aria-label", tr("addressSuggestions"));
      help.textContent = tr("addressHelp");
      countryLabel.textContent = tr("countryLabel");
      cityLabel.textContent = tr("cityLabel");
      retry.textContent = tr("addressRetry");
      showStatus(statusKey, statusError);
    }
    showLocation(initial || location);
    updateLanguage();
    return {
      node, input, updateLanguage,
      dispose(){ cancel(); document.removeEventListener("pointerdown", outsidePointerDown); },
      getValue(){
        // An unchanged historical address is preserved by omitting the update.
        if (!required && initial && selected === initial && input.value.trim() === initial.address) return undefined;
        if (selected && input.value.trim() === selected.address && isComplete(selected)) return {...selected};
        if (!required && !initial && !input.value.trim()) return undefined;
        showStatus("addressChoose", true);
        input.setAttribute("aria-invalid", "true");
        input.focus();
        throw new Error(tr("addressChoose"));
      },
      reset(){ cancel(); selected = null; input.value = ""; suggestions = []; close(); showStatus(""); showLocation(null); retry.hidden = true; input.removeAttribute("aria-invalid"); }
    };
  }
  root.ParrotAddress = {create};
})(window);
