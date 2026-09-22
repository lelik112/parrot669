const LANG_KEY = "parrot669-language";

const copy = {
  en:{page:"PARROT 669 — Availability search",label:"AVAILABILITY",back:"← Back to site",tabSearch:"Find availability",tabHost:"For hosts",owner:n=>`Host: ${n}`,eyebrow:"LIVE AVAILABILITY",title:"Find a property that is<br><span>actually free.</span>",lead:"Search host-reported availability and continue to the original Airbnb listing for rental terms.",city:"City",from:"Check-in",to:"Check-out",bedrooms:"Bedrooms",sleeps:"Sleeping places",search:"Search availability",pricedOnly:"Only with a price",priceUnknown:"Price: ask the host or check the external site",priceNote:"Indicative price. Final terms and other charges are with the host or on the external site.",priceEstimate:(amount,nights)=>`≈ €${amount} for ${nights} night${nights===1?"":"s"}`,cleaning:n=>`including €${n} cleaning`,live:"Connected to the live PARROT availability index",disclaimer:"Availability is physical availability. Rental terms and permitted stay duration are defined by the host and the external listing.",loading:"Searching live availability…",empty:"No matching availability yet.",error:"Availability search is temporarily unavailable.",bed:n=>n===1?"1 bedroom":`${n} bedrooms`,sleep:n=>n===1?"1 sleeping place":`${n} sleeping places`,min:n=>`minimum stay ${n} day${n===1?"":"s"}`,period:(a,b)=>`Available ${a} → ${b}`,view:"View on Airbnb"},
  es:{page:"PARROT 669 — Buscar disponibilidad",label:"DISPONIBILIDAD",back:"← Volver al sitio",tabSearch:"Buscar disponibilidad",tabHost:"Para propietarios",owner:n=>`Propietario: ${n}`,eyebrow:"DISPONIBILIDAD EN DIRECTO",title:"Encuentra una vivienda que esté<br><span>realmente libre.</span>",lead:"Busca disponibilidad declarada por propietarios y continúa al anuncio original de Airbnb para consultar las condiciones.",city:"Ciudad",from:"Entrada",to:"Salida",bedrooms:"Dormitorios",sleeps:"Plazas para dormir",search:"Buscar disponibilidad",pricedOnly:"Solo con precio",priceUnknown:"Precio: consulta al propietario o al sitio externo",priceNote:"Precio orientativo. Las condiciones finales y otros cargos están con el propietario o en el sitio externo.",priceEstimate:(amount,nights)=>`≈ €${amount} por ${nights} noche${nights===1?"":"s"}`,cleaning:n=>`incluye €${n} de limpieza`,live:"Conectado al índice de disponibilidad de PARROT",disclaimer:"La disponibilidad indica que la vivienda está físicamente libre. Las condiciones y la duración permitida las define el propietario y el anuncio externo.",loading:"Buscando disponibilidad…",empty:"Todavía no hay resultados.",error:"La búsqueda no está disponible temporalmente.",bed:n=>n===1?"1 dormitorio":`${n} dormitorios`,sleep:n=>n===1?"1 plaza":`${n} plazas`,min:n=>`estancia mínima ${n} día${n===1?"":"s"}`,period:(a,b)=>`Disponible ${a} → ${b}`,view:"Ver en Airbnb"},
  ca:{page:"PARROT 669 — Cercar disponibilitat",label:"DISPONIBILITAT",back:"← Tornar al web",tabSearch:"Cercar disponibilitat",tabHost:"Per a propietaris",owner:n=>`Propietari: ${n}`,eyebrow:"DISPONIBILITAT EN DIRECTE",title:"Troba un habitatge que estigui<br><span>realment lliure.</span>",lead:"Cerca disponibilitat declarada pels propietaris i continua a l'anunci original d'Airbnb per consultar les condicions.",city:"Ciutat",from:"Entrada",to:"Sortida",bedrooms:"Dormitoris",sleeps:"Places per dormir",search:"Cercar disponibilitat",pricedOnly:"Només amb preu",priceUnknown:"Preu: consulta el propietari o el lloc extern",priceNote:"Preu orientatiu. Les condicions finals i altres càrrecs són amb el propietari o al lloc extern.",priceEstimate:(amount,nights)=>`≈ €${amount} per ${nights} nit${nights===1?"":"s"}`,cleaning:n=>`inclou €${n} de neteja`,live:"Connectat a l'índex de disponibilitat de PARROT",disclaimer:"La disponibilitat indica que l'habitatge està físicament lliure. Les condicions i la durada permesa les defineixen el propietari i l'anunci extern.",loading:"Cercant disponibilitat…",empty:"Encara no hi ha resultats.",error:"La cerca no està disponible temporalment.",bed:n=>n===1?"1 dormitori":`${n} dormitoris`,sleep:n=>n===1?"1 plaça":`${n} places`,min:n=>`estada mínima ${n} dia${n===1?"":"s"}`,period:(a,b)=>`Disponible ${a} → ${b}`,view:"Veure a Airbnb"},
  ru:{page:"PARROT 669 — Поиск свободного жилья",label:"СВОБОДНЫЕ ДАТЫ",back:"← Назад на сайт",tabSearch:"Найти жильё",tabHost:"Владельцам",owner:n=>`Владелец: ${n}`,eyebrow:"АКТУАЛЬНАЯ ДОСТУПНОСТЬ",title:"Найдите жильё, которое<br><span>реально свободно.</span>",lead:"Ищите свободные даты, указанные владельцами, а условия аренды смотрите в исходном объявлении Airbnb.",city:"Город",from:"Заезд",to:"Выезд",bedrooms:"Спальни",sleeps:"Спальных мест",search:"Найти свободное",pricedOnly:"Только с ценой",priceUnknown:"Цена: уточнить у владельца или на внешнем сайте",priceNote:"Цена ориентировочная. Финальные условия и остальные платежи — у владельца или на внешнем сайте.",priceEstimate:(amount,nights)=>`≈ €${amount} за ${nights} ноч.`,cleaning:n=>`включая €${n} уборки`,live:"Подключено к живому индексу доступности PARROT",disclaimer:"Здесь показывается физическая доступность жилья. Условия аренды и допустимый срок определяются владельцем и внешним объявлением.",loading:"Ищем свободные даты…",empty:"Подходящих вариантов пока нет.",error:"Поиск временно недоступен.",bed:n=>n===1?"1 спальня":n<5?`${n} спальни`:`${n} спален`,sleep:n=>`${n} спальных мест`,min:n=>`минимум ${n} дн.`,period:(a,b)=>`Свободно ${a} → ${b}`,view:"Открыть на Airbnb"}
};

const housingCopy = {
  en:{accommodationType:"Accommodation type",anyType:"Any type",entirePlace:"Entire place",privateRoom:"Private room",noExternalLink:"External listing link not added yet",lead:"Search host-reported physical availability. When an external listing is attached, continue there for rental terms."},
  es:{accommodationType:"Tipo de alojamiento",anyType:"Cualquier tipo",entirePlace:"Alojamiento entero",privateRoom:"Habitación privada",noExternalLink:"Todavía no se ha añadido un enlace externo",lead:"Busca disponibilidad física declarada por propietarios. Si hay un anuncio externo, continúa allí para consultar las condiciones."},
  ca:{accommodationType:"Tipus d'allotjament",anyType:"Qualsevol tipus",entirePlace:"Allotjament sencer",privateRoom:"Habitació privada",noExternalLink:"Encara no s'ha afegit cap enllaç extern",lead:"Cerca disponibilitat física declarada pels propietaris. Si hi ha un anunci extern, continua-hi per consultar les condicions."},
  ru:{accommodationType:"Тип жилья",anyType:"Любой тип",entirePlace:"Жильё целиком",privateRoom:"Отдельная комната",noExternalLink:"Внешняя ссылка пока не добавлена",lead:"Ищите физически свободное жильё по данным владельцев. Если добавлена внешняя площадка, условия аренды смотрите там."}
};

let lang=(()=>{const saved=localStorage.getItem(LANG_KEY);if(saved&&copy[saved])return saved;const b=(navigator.language||"en").slice(0,2);return copy[b]?b:"en"})();
const form=document.getElementById("availability-form");
const results=document.getElementById("availability-results");
const buttons=document.querySelectorAll("[data-search-lang]");

function t(key,...args){const v=(housingCopy[lang]||housingCopy.en)[key]??(copy[lang]||copy.en)[key];return typeof v==="function"?v(...args):v}
function applyLanguage(next){
  lang=copy[next]?next:"en";
  localStorage.setItem(LANG_KEY,lang);
  document.documentElement.lang=lang;
  document.title=t("page");
  document.querySelectorAll("[data-search-i18n]").forEach(n=>n.textContent=t(n.dataset.searchI18n));
  document.querySelectorAll("[data-search-i18n-html]").forEach(n=>n.innerHTML=t(n.dataset.searchI18nHtml));
  buttons.forEach(b=>b.classList.toggle("active",b.dataset.searchLang===lang));
}
function state(text,kind=""){results.replaceChildren();const n=document.createElement("div");n.className=`availability-state ${kind}`.trim();n.textContent=text;results.append(n)}
function render(items){
  results.replaceChildren();
  if(!items.length){state(t("empty"),"empty");return}
  items.forEach(item=>{
    const card=document.createElement("article");card.className="availability-card";
    const head=document.createElement("div");head.className="availability-card-heading";
    const city=document.createElement("strong");city.textContent=item.propertyTitle||"Property";
    const meta=document.createElement("span");meta.textContent=`${t("bed",Number(item.bedrooms))} · ${t("sleep",Number(item.sleeps))}`;
    head.append(city,meta);
    const accommodationType=document.createElement("div");accommodationType.className="availability-type";accommodationType.textContent=item.accommodationType==="private_room"?t("privateRoom"):t("entirePlace");
    const owner=document.createElement("div");owner.className="availability-owner";owner.textContent=t("owner", item.ownerDisplayName || "PARROT host");
    const stay=document.createElement("div");stay.className="availability-stay";stay.textContent=t("min",Number(item.minStayDays||1));
    const period=document.createElement("div");period.className="availability-period";period.textContent=t("period",item.availableFrom,item.availableTo);
    const price=document.createElement("div");price.className="availability-price";
    if(item.price){
      const amount=(Number(item.price.estimatedAmountCents||0)/100).toLocaleString(document.documentElement.lang,{minimumFractionDigits:0,maximumFractionDigits:2});
      price.textContent=t("priceEstimate",amount,Number(item.price.nights||0));
      if(item.price.cleaningFeeCents != null){
        const cleaning=(Number(item.price.cleaningFeeCents)/100).toLocaleString(document.documentElement.lang,{minimumFractionDigits:0,maximumFractionDigits:2});
        const small=document.createElement("small");small.textContent=t("cleaning",cleaning);price.append(" · ",small);
      }
    } else {
      price.classList.add("unknown");
      price.textContent=t("priceUnknown");
    }
    const priceNote=document.createElement("div");priceNote.className="availability-price-note";priceNote.textContent=t("priceNote");
    const links=document.createElement("div");links.className="availability-links";
    (item.links||[]).forEach(link=>{try{const u=new URL(link.url);if(u.protocol!=="https:")return;const a=document.createElement("a");a.className="availability-link";a.href=u.toString();a.target="_blank";a.rel="noopener noreferrer";a.textContent=t("view");links.append(a)}catch{}});
    if(!links.childElementCount){const missing=document.createElement("span");missing.className="availability-link-missing";missing.textContent=t("noExternalLink");links.append(missing)}
    card.append(head,accommodationType,owner,stay,period,price,priceNote,links);results.append(card);
  });
}
function plusDays(iso, days){
  if(!iso) return "";
  const [year,month,day]=iso.split("-").map(Number);
  const date=new Date(Date.UTC(year,month-1,day));
  date.setUTCDate(date.getUTCDate()+days);
  return date.toISOString().slice(0,10);
}
form.elements.from.addEventListener("change",()=>{
  const minCheckout=plusDays(form.elements.from.value,1);
  form.elements.to.min=minCheckout;
  if(!form.elements.to.value||form.elements.to.value<=form.elements.from.value) form.elements.to.value=minCheckout;
});
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const submit=form.querySelector('button[type="submit"]');
  const fd=new FormData(form);
  const params=new URLSearchParams({city:"Barcelona",from:String(fd.get("from")||""),to:String(fd.get("to")||""),bedrooms:String(fd.get("bedrooms")||"1"),sleeps:String(fd.get("sleeps")||"1"),accommodationType:String(fd.get("accommodationType")||"any"),pricedOnly:fd.get("pricedOnly")?"true":"false"});
  submit.disabled=true;state(t("loading"),"loading");
  try{const response=await fetch(`/api/search?${params}`,{headers:{Accept:"application/json"}});if(!response.ok)throw new Error(`HTTP ${response.status}`);const items=await response.json();render(Array.isArray(items)?items:[])}
  catch(error){console.error(error);state(t("error"),"error")}
  finally{submit.disabled=false}
});
buttons.forEach(b=>b.addEventListener("click",()=>applyLanguage(b.dataset.searchLang)));
applyLanguage(lang);
