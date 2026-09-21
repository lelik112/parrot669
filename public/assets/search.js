const LANG_KEY = "parrot669-language";

const copy = {
  en:{page:"PARROT 669 — Availability search",label:"AVAILABILITY",back:"← Back to site",tabSearch:"Find availability",tabHost:"For hosts",owner:n=>`Host: ${n}`,eyebrow:"LIVE AVAILABILITY",title:"Find a property that is<br><span>actually free.</span>",lead:"Search host-reported availability and continue to the original Airbnb listing for rental terms.",city:"City",from:"From",to:"To",bedrooms:"Bedrooms",sleeps:"Sleeping places",search:"Search availability",live:"Connected to the live PARROT availability index",disclaimer:"Availability is physical availability. Rental terms and permitted stay duration are defined by the host and the external listing.",loading:"Searching live availability…",empty:"No matching availability yet.",error:"Availability search is temporarily unavailable.",bed:n=>n===1?"1 bedroom":`${n} bedrooms`,sleep:n=>n===1?"1 sleeping place":`${n} sleeping places`,min:n=>`minimum stay ${n} day${n===1?"":"s"}`,period:(a,b)=>`Available ${a} → ${b}`,view:"View on Airbnb"},
  es:{page:"PARROT 669 — Buscar disponibilidad",label:"DISPONIBILIDAD",back:"← Volver al sitio",tabSearch:"Buscar disponibilidad",tabHost:"Para propietarios",owner:n=>`Propietario: ${n}`,eyebrow:"DISPONIBILIDAD EN DIRECTO",title:"Encuentra una vivienda que esté<br><span>realmente libre.</span>",lead:"Busca disponibilidad declarada por propietarios y continúa al anuncio original de Airbnb para consultar las condiciones.",city:"Ciudad",from:"Desde",to:"Hasta",bedrooms:"Dormitorios",sleeps:"Plazas para dormir",search:"Buscar disponibilidad",live:"Conectado al índice de disponibilidad de PARROT",disclaimer:"La disponibilidad indica que la vivienda está físicamente libre. Las condiciones y la duración permitida las define el propietario y el anuncio externo.",loading:"Buscando disponibilidad…",empty:"Todavía no hay resultados.",error:"La búsqueda no está disponible temporalmente.",bed:n=>n===1?"1 dormitorio":`${n} dormitorios`,sleep:n=>n===1?"1 plaza":`${n} plazas`,min:n=>`estancia mínima ${n} día${n===1?"":"s"}`,period:(a,b)=>`Disponible ${a} → ${b}`,view:"Ver en Airbnb"},
  ca:{page:"PARROT 669 — Cercar disponibilitat",label:"DISPONIBILITAT",back:"← Tornar al web",tabSearch:"Cercar disponibilitat",tabHost:"Per a propietaris",owner:n=>`Propietari: ${n}`,eyebrow:"DISPONIBILITAT EN DIRECTE",title:"Troba un habitatge que estigui<br><span>realment lliure.</span>",lead:"Cerca disponibilitat declarada pels propietaris i continua a l'anunci original d'Airbnb per consultar les condicions.",city:"Ciutat",from:"Des de",to:"Fins a",bedrooms:"Dormitoris",sleeps:"Places per dormir",search:"Cercar disponibilitat",live:"Connectat a l'índex de disponibilitat de PARROT",disclaimer:"La disponibilitat indica que l'habitatge està físicament lliure. Les condicions i la durada permesa les defineixen el propietari i l'anunci extern.",loading:"Cercant disponibilitat…",empty:"Encara no hi ha resultats.",error:"La cerca no està disponible temporalment.",bed:n=>n===1?"1 dormitori":`${n} dormitoris`,sleep:n=>n===1?"1 plaça":`${n} places`,min:n=>`estada mínima ${n} dia${n===1?"":"s"}`,period:(a,b)=>`Disponible ${a} → ${b}`,view:"Veure a Airbnb"},
  ru:{page:"PARROT 669 — Поиск свободного жилья",label:"СВОБОДНЫЕ ДАТЫ",back:"← Назад на сайт",tabSearch:"Найти жильё",tabHost:"Владельцам",owner:n=>`Владелец: ${n}`,eyebrow:"АКТУАЛЬНАЯ ДОСТУПНОСТЬ",title:"Найдите жильё, которое<br><span>реально свободно.</span>",lead:"Ищите свободные даты, указанные владельцами, а условия аренды смотрите в исходном объявлении Airbnb.",city:"Город",from:"С",to:"По",bedrooms:"Спальни",sleeps:"Спальных мест",search:"Найти свободное",live:"Подключено к живому индексу доступности PARROT",disclaimer:"Здесь показывается физическая доступность жилья. Условия аренды и допустимый срок определяются владельцем и внешним объявлением.",loading:"Ищем свободные даты…",empty:"Подходящих вариантов пока нет.",error:"Поиск временно недоступен.",bed:n=>n===1?"1 спальня":n<5?`${n} спальни`:`${n} спален`,sleep:n=>`${n} спальных мест`,min:n=>`минимум ${n} дн.`,period:(a,b)=>`Свободно ${a} → ${b}`,view:"Открыть на Airbnb"}
};

let lang=(()=>{const saved=localStorage.getItem(LANG_KEY);if(saved&&copy[saved])return saved;const b=(navigator.language||"en").slice(0,2);return copy[b]?b:"en"})();
const form=document.getElementById("availability-form");
const results=document.getElementById("availability-results");
const buttons=document.querySelectorAll("[data-search-lang]");

function t(key,...args){const v=(copy[lang]||copy.en)[key];return typeof v==="function"?v(...args):v}
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
    const city=document.createElement("strong");city.textContent=item.city||"Barcelona";
    const meta=document.createElement("span");meta.textContent=`${t("bed",Number(item.bedrooms))} · ${t("sleep",Number(item.sleeps))}`;
    head.append(city,meta);
    const owner=document.createElement("div");owner.className="availability-owner";owner.textContent=t("owner", item.ownerDisplayName || "PARROT host");
    const stay=document.createElement("div");stay.className="availability-stay";stay.textContent=t("min",Number(item.minStayDays||1));
    const period=document.createElement("div");period.className="availability-period";period.textContent=t("period",item.availableFrom,item.availableTo);
    const links=document.createElement("div");links.className="availability-links";
    (item.links||[]).forEach(link=>{try{const u=new URL(link.url);if(u.protocol!=="https:")return;const a=document.createElement("a");a.className="availability-link";a.href=u.toString();a.target="_blank";a.rel="noopener noreferrer";a.textContent=t("view");links.append(a)}catch{}});
    card.append(head,owner,stay,period,links);results.append(card);
  });
}
form.elements.from.addEventListener("change",()=>{form.elements.to.min=form.elements.from.value;if(form.elements.to.value<form.elements.from.value)form.elements.to.value=form.elements.from.value});
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const submit=form.querySelector('button[type="submit"]');
  const fd=new FormData(form);
  const params=new URLSearchParams({city:"Barcelona",from:String(fd.get("from")||""),to:String(fd.get("to")||""),bedrooms:String(fd.get("bedrooms")||"1"),sleeps:String(fd.get("sleeps")||"1")});
  submit.disabled=true;state(t("loading"),"loading");
  try{const response=await fetch(`/api/search?${params}`,{headers:{Accept:"application/json"}});if(!response.ok)throw new Error(`HTTP ${response.status}`);const items=await response.json();render(Array.isArray(items)?items:[])}
  catch(error){console.error(error);state(t("error"),"error")}
  finally{submit.disabled=false}
});
buttons.forEach(b=>b.addEventListener("click",()=>applyLanguage(b.dataset.searchLang)));
applyLanguage(lang);
