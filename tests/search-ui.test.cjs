const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');

const file = name => fs.readFileSync(path.join(__dirname, '../public', name), 'utf8');
const flush = async () => { for (let i=0; i<4; i++) await new Promise(resolve=>setImmediate(resolve)); };
const deferred = () => { let resolve; const promise=new Promise(r=>resolve=r); return {promise,resolve}; };
const response = data => new Response(JSON.stringify(data));
const property = city => ({propertyId:city,propertyTitle:`Home in ${city}`,city,bedrooms:1,sleeps:2,links:[]});

async function harness(t, {handler=()=>undefined, saved=null}={}) {
  const dom=new JSDOM(file('search.html'),{url:'https://parrot669.com/search',runScripts:'outside-only'});
  t.after(()=>dom.window.close());
  const w=dom.window, calls=[];
  w.localStorage.setItem('parrot669-language','ru');
  if(saved) w.localStorage.setItem('parrot669-search-state',JSON.stringify(saved));
  w.fetch=async raw=>{
    const url=new URL(raw,w.location.origin);
    calls.push(url);
    const custom=await handler(url);
    if(custom!==undefined) return custom instanceof Response?custom:response(custom);
    if(url.pathname==='/api/locations/countries') return response([{code:'ES',name:'Spain'},{code:'BY',name:'Belarus'}]);
    if(url.pathname==='/api/locations/cities') return response((url.searchParams.get('country')==='ES'?
      ['Barcelona','Sant Cugat del Vallès']:['Minsk']).map(name=>({name})));
    if(url.pathname==='/api/search') return response([property(url.searchParams.get('city'))]);
    throw Error(`Unexpected request: ${raw}`);
  };
  w.eval(file('assets/search.js'));
  await flush();
  const form=w.document.getElementById('availability-form');
  const change=(control,value,event='change')=>{
    control.value=value;
    control.dispatchEvent(new w.Event(event,{bubbles:true}));
  };
  const submit=async()=>{form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await flush();};
  const h={w,form,calls,change,submit,$:id=>w.document.getElementById(id),
    results:w.document.getElementById('availability-results'),
    searches:()=>calls.filter(url=>url.pathname==='/api/search'),
    language:lang=>w.document.querySelector(`[data-search-lang="${lang}"]`).click()};
  h.barcelona=async()=>{
    change(form.elements.country,'ES');await flush();
    change(form.elements.city,'Barcelona');
    change(form.elements.from,'2026-10-01');change(form.elements.to,'2026-10-08');
    await submit();
  };
  return h;
}

test('GEO-001: changing city hides old cards; filters cannot search the old city',async t=>{
  const h=await harness(t);await h.barcelona();
  assert.match(h.results.textContent,/Home in Barcelona/);
  h.change(h.form.elements.city,'Barcelona');
  assert.equal(h.results.querySelectorAll('article').length,1,'unchanged values keep the results');
  h.change(h.form.elements.city,'Sant Cugat del Vallès');
  assert.equal(h.results.querySelectorAll('article').length,0);
  assert.match(h.results.textContent,/Параметры изменены/);
  assert.equal(JSON.parse(h.w.localStorage.getItem('parrot669-search-state')).searched,false);
  h.change(h.$('filter-accommodation-type'),'private_room');await flush();
  assert.equal(h.searches().length,1,'do not run an old query after a draft edit');
  h.language('es');
  assert.match(h.results.textContent,/Has cambiado los datos/);
  await h.submit();
  assert.match(h.results.textContent,/Home in Sant Cugat del Vallès/);
  assert.equal(h.searches().at(-1).searchParams.get('accommodationType'),'private_room');
  h.change(h.$('filter-accommodation-type'),'entire_place');await flush();
  assert.equal(h.searches().at(-1).searchParams.get('city'),'Sant Cugat del Vallès');
  assert.equal(h.searches().at(-1).searchParams.get('accommodationType'),'entire_place');
});

test('country, stay dates and capacity edits also invalidate previous results',async t=>{
  const h=await harness(t);
  for(const [field,value,event] of [
    ['country','BY','change'],['from','2026-10-02','input'],['to','2026-10-09','change'],
    ['bedrooms','2','change'],['sleeps','3','change']
  ]){
    await h.barcelona();
    assert.equal(h.results.querySelectorAll('article').length,1);
    h.change(h.form.elements[field],value,event);await flush();
    assert.equal(h.results.querySelectorAll('article').length,0,field);
    assert.match(h.results.textContent,/Параметры изменены/);
  }
});

test('a late response cannot restore old-city cards or unlock a newer pending search',async t=>{
  const old=deferred(),fresh=deferred();
  const h=await harness(t,{handler:url=>url.pathname==='/api/search'?
    (url.searchParams.get('city')==='Barcelona'?old.promise:fresh.promise):undefined});
  await h.barcelona();
  assert.match(h.results.textContent,/Ищем свободные даты/);
  h.change(h.form.elements.city,'Sant Cugat del Vallès');
  assert.match(h.results.textContent,/Параметры изменены/);
  assert.equal(h.$('filter-priced-only').disabled,false);
  await h.submit();
  old.resolve([property('Barcelona')]);await flush();
  assert.equal(h.results.querySelectorAll('article').length,0);
  assert.match(h.results.textContent,/Ищем свободные даты/);
  assert.equal(h.$('filter-priced-only').disabled,true);
  assert.equal(h.form.querySelector('[type="submit"]').disabled,true);
  fresh.resolve([property('Sant Cugat del Vallès')]);await flush();
  assert.match(h.results.textContent,/Home in Sant Cugat del Vallès/);
  assert.equal(h.$('filter-priced-only').disabled,false);
  assert.equal(h.form.querySelector('[type="submit"]').disabled,false);
});

test('a late old-city response after editing remains hidden until an explicit search',async t=>{
  const late=deferred();
  const h=await harness(t,{handler:url=>url.pathname==='/api/search'?late.promise:undefined});
  await h.barcelona();
  h.change(h.form.elements.city,'Sant Cugat del Vallès');
  late.resolve([property('Barcelona')]);await flush();
  assert.equal(h.results.querySelectorAll('article').length,0);
  assert.match(h.results.textContent,/Параметры изменены/);
});

test('a filter replacing a pending search releases controls, including invalid price ranges',async t=>{
  const pending=deferred();
  const h=await harness(t,{handler:url=>url.pathname==='/api/search' && url.searchParams.get('accommodationType')==='any'?pending.promise:undefined});
  await h.barcelona();
  h.change(h.$('filter-accommodation-type'),'private_room');await flush();
  assert.equal(h.form.querySelector('[type="submit"]').disabled,false);
  assert.equal(h.$('filter-priced-only').disabled,false);
  h.change(h.$('filter-accommodation-type'),'any');await flush();
  h.change(h.$('filter-price-from'),'100');h.change(h.$('filter-price-to'),'50');await flush();
  assert.match(h.results.textContent,/Цена «от» не может быть больше/);
  assert.equal(h.form.querySelector('[type="submit"]').disabled,false);
  assert.equal(h.$('filter-priced-only').disabled,false);
  pending.resolve([property('Barcelona')]);await flush();
  assert.match(h.results.textContent,/Цена «от» не может быть больше/);
  assert.equal(h.results.querySelectorAll('article').length,0);
});

test('search drafts are preserved without auto-submit; confirmed searches still restore',async t=>{
  const draft={country:'ES',city:'Sant Cugat del Vallès',from:'2026-10-01',to:'2026-10-08',searched:false};
  const h=await harness(t,{saved:draft});
  assert.equal(h.form.elements.city.value,draft.city);
  assert.equal(h.searches().length,0);
  const confirmed=await harness(t,{saved:{...draft,searched:true}});
  assert.equal(confirmed.searches().length,1);
  assert.match(confirmed.results.textContent,/Home in Sant Cugat del Vallès/);
});

test('GEO-002: country and city use their translated native labels in all four languages',async t=>{
  const h=await harness(t);
  for(const [lang,country,city] of [['ru','Страна','Город'],['es','País','Ciudad'],['ca','País','Ciutat'],['en','Country','City']]){
    h.language(lang);
    for(const [control,expected] of [[h.form.elements.country,country],[h.form.elements.city,city]]){
      assert.equal(control.getAttribute('aria-label'),null,'no fixed English name overrides the native label');
      assert.equal(control.labels.length,1);
      assert.equal(control.labels[0].querySelector('span').textContent,expected);
    }
  }
});
