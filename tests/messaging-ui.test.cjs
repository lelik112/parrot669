const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const file = name => fs.readFileSync(path.join(__dirname,'../public',name),'utf8');
const ids = ['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444'];
const [property, conversation, otherConversation, profile] = ids;
const user = {accountId:'guest-account',username:'guest',profile:{id:profile}};
const detail = (id=conversation, extra={}) => ({id,propertyId:property,propertyTitle:id===conversation?'Apartment':'Room',
  otherDisplayName:'Host',lastSequence:1,readThroughSequence:0,unreadCount:1,lastMessagePreview:'Hello',
  updatedAt:'2026-09-23T10:00:00Z',canReply:true,blockedByMe:false,blockedByOther:false,...extra});
const message = (sequence=1, extra={}) => ({id:`message-${sequence}`,sequence,senderProfileId:'host',clientMessageId:'old',
  body:`Message ${sequence}`,from:null,to:null,createdAt:'2026-09-23T10:00:00Z',...extra});
const flush = async () => { for(let i=0;i<8;i++) await new Promise(resolve=>setImmediate(resolve)); };
const deferred = () => { let resolve; const promise=new Promise(r=>resolve=r); return {promise,resolve}; };
const response = (data,status=200) => new Response(JSON.stringify(data),{status});

async function harness(t,{url='/messages.html',handler=()=>undefined,loggedIn=true,page='messages.html'}={}) {
  const dom = new JSDOM(file(page),{url:`https://parrot669.com${url}`,runScripts:'outside-only',pretendToBeVisual:true});
  t.after(()=>dom.window.close());
  const w=dom.window, calls=[], intervals=[];
  w.setInterval=fn=>{intervals.push(fn);return intervals.length;};
  w.confirm=()=>true;
  w.fetch=async(raw,options={})=>{
    const request={path:new URL(raw,w.location.origin).pathname,query:new URL(raw,w.location.origin).searchParams,
      method:options.method||'GET',body:options.body?JSON.parse(options.body):null};
    calls.push(request);
    const custom=await handler(request);
    if(custom!==undefined) return custom instanceof Response?custom:response(custom);
    if(request.path==='/api/host/auth/me') return loggedIn?response(user):response({error:'unauthorized'},401);
    if(request.path==='/api/messaging/unread') return response({conversations:1,messages:1});
    if(request.path==='/api/messaging/conversations') return response({items:[],nextCursor:null});
    if(request.path===`/api/messaging/conversations/for-property/${property}`) return response(null);
    if(request.path===`/api/messaging/contact-options/${property}`) return response({propertyId:property,propertyTitle:'Apartment',hostDisplayName:'Host',hostProfileId:'host',acceptingNewConversations:true});
    if(request.path.endsWith('/read')) return response({throughSequence:request.body.throughSequence});
    throw Error(`Unexpected request: ${request.method} ${raw}`);
  };
  w.eval(file('assets/messaging-common.js'));
  if(page==='messages.html') w.eval(file('assets/messages.js'));
  await flush();
  return {w,calls,intervals,$:id=>w.document.getElementById(id),submit:form=>form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true})),
    input:(element,value)=>{element.value=value;element.dispatchEvent(new w.Event('input',{bubbles:true}));}};
}

test('login preserves enquiry and checkout dates; first send creates a thread and renders text safely',async t=>{
  let sent=null;
  const h=await harness(t,{loggedIn:false,url:`/messages.html?property=${property}&from=2027-05-01&to=2027-05-04`,handler:r=>{
    if(r.path==='/api/host/auth/login') return user;
    if(r.path==='/api/messaging/conversations' && r.method==='POST') {sent=r.body;return {conversationId:conversation,message:message()};}
    if(r.path===`/api/messaging/conversations/${conversation}`) return detail();
    if(r.path.endsWith(`/${conversation}/messages`)) return {items:[message(1,{...sent,senderProfileId:profile})],nextAfterSequence:null};
  }});
  assert.equal(h.$('msg-auth').hidden,false);
  const login=h.$('msg-login-form'); login.elements.login.value='guest';login.elements.password.value='test-password-123';
  h.submit(login);await flush();
  const form=h.$('msg-compose');
  assert.equal(form.hidden,false);assert.equal(form.elements.from.value,'2027-05-01');assert.equal(form.elements.to.value,'2027-05-04');
  h.input(form.elements.body,'  <img src=x onerror=alert(1)>  ');h.submit(form);await flush();
  assert.equal(sent.propertyId,property);assert.equal(sent.body,'<img src=x onerror=alert(1)>');assert.equal(sent.to,'2027-05-04');
  assert.equal(h.$('msg-history').querySelector('img'),null);
  assert.match(h.$('msg-history').textContent,/<img src=x onerror=alert\(1\)>/);
  assert.equal(h.w.location.search,`?conversation=${conversation}`);
  assert.equal(login.elements.password.value,'');assert.equal(form.elements.body.value,'');
});

test('uncertain delivery retains a stable idempotency key; a rate error remains visible and editable',async t=>{
  const attempts=[];let success=false;
  const h=await harness(t,{url:`/messages.html?conversation=${conversation}`,handler:r=>{
    if(r.path===`/api/messaging/conversations/${conversation}`) return detail();
    if(r.path.endsWith('/messages') && r.method==='GET') return {items:success?[message(2,{...attempts.at(-1),senderProfileId:profile})]:[message()],nextAfterSequence:null};
    if(r.path.endsWith('/messages') && r.method==='POST') {
      attempts.push(r.body);
      if(attempts.length===1) throw Error('Connection lost');
      if(attempts.length===2) {success=true;return message(2);}
      return response({error:'too many'},429);
    }
  }});
  const form=h.$('msg-compose');h.input(form.elements.body,'Hello');h.submit(form);await flush();
  assert.equal(form.elements.body.disabled,true);assert.match(h.$('msg-send').textContent,/Retry/);
  h.submit(form);await flush();
  assert.deepEqual(attempts[0],attempts[1]);assert.equal(form.elements.body.disabled,false);
  h.input(form.elements.body,'Another');h.submit(form);await flush();
  assert.match(h.$('msg-thread-notice').textContent,/Too many/);assert.equal(form.elements.body.disabled,false);
  assert.equal(form.elements.body.value,'Another');
});

test('send refresh starts at the last fetched cursor and does not skip a concurrent incoming message',async t=>{
  let sent=false;const after=[];
  const h=await harness(t,{url:`/messages.html?conversation=${conversation}`,handler:r=>{
    if(r.path===`/api/messaging/conversations/${conversation}`) return detail();
    if(r.path.endsWith('/messages') && r.method==='POST') {sent=true;return message(3);}
    if(r.path.endsWith('/messages')) {after.push(r.query.get('afterSequence'));return {items:sent?[message(2,{body:'Incoming'}),message(3,{body:'Outgoing',senderProfileId:profile})]:[message()],nextAfterSequence:null};}
  }});
  h.input(h.$('msg-compose').elements.body,'Outgoing');h.submit(h.$('msg-compose'));await flush();
  assert.deepEqual(after,['0','1']);assert.match(h.$('msg-history').textContent,/Incoming/);
  assert.equal(h.$('msg-history').children.length,3);
});

test('late block metadata cannot overwrite another selected conversation; account switch clears private content',async t=>{
  const late=deferred();let blocking=false;
  const h=await harness(t,{url:`/messages.html?conversation=${conversation}`,handler:r=>{
    if(r.path==='/api/messaging/conversations') return {items:[detail(),detail(otherConversation)],nextCursor:null};
    if(r.path.endsWith('/block')) {blocking=true;return {blocked:true};}
    if(r.path===`/api/messaging/conversations/${conversation}`) return blocking?late.promise:detail();
    if(r.path===`/api/messaging/conversations/${otherConversation}`) return detail(otherConversation);
    if(r.path.endsWith('/messages')) return {items:[message()],nextAfterSequence:null};
  }});
  h.$('msg-block').click();await flush();
  [...h.$('msg-list').children].find(el=>el.textContent.includes('Room')).click();await flush();
  late.resolve(detail(conversation,{blockedByMe:true,canReply:false}));await flush();
  assert.equal(h.$('msg-property').textContent,'Room');assert.equal(h.$('msg-compose').hidden,false);
  h.input(h.$('msg-compose').elements.body,'Private draft');
  h.w.ParrotMessaging.setUser(null);await flush();
  assert.equal(h.$('msg-history').textContent,'');assert.equal(h.$('msg-compose').elements.body.value,'');
  assert.equal(h.$('msg-property').textContent,'');assert.equal(h.$('msg-other').textContent,'');
  h.w.history.replaceState(null,'','/messages.html');
  h.w.ParrotMessaging.setUser({...user,accountId:'another-account',profile:{id:'another-profile'}});await flush();
  assert.equal(h.$('msg-compose').elements.body.value,'');
});

test('existing conversation remains usable after host opts out; invalid checkout dates prevent sending',async t=>{
  const h=await harness(t,{url:`/messages.html?property=${property}&from=2027-05-01&to=2027-05-04`,handler:r=>{
    if(r.path.includes('/contact-options/')) return {acceptingNewConversations:false};
    if(r.path.includes('/for-property/')) return detail();
    if(r.path.endsWith('/messages')) return {items:[message()],nextAfterSequence:null};
  }});
  assert.equal(h.$('msg-compose').hidden,false);
  const form=h.$('msg-compose');h.input(form.elements.body,'One night');h.input(form.elements.to,'2027-05-01');
  h.submit(form);await flush();
  assert.equal(h.calls.filter(r=>r.method==='POST').length,0);
  assert.notEqual(form.elements.to.validationMessage,'');
});

test('read acknowledgements require visible focused history and the latest messages in view',async t=>{
  const h=await harness(t,{url:`/messages.html?conversation=${conversation}`,handler:r=>{
    if(r.path===`/api/messaging/conversations/${conversation}`) return detail();
    if(r.path.endsWith('/messages')) return {items:[message()],nextAfterSequence:null};
  }});
  assert.equal(h.calls.filter(r=>r.path.endsWith('/read')).length,0);
  const history=h.$('msg-history');history.getClientRects=()=>[{}];h.w.document.hasFocus=()=>true;
  Object.defineProperty(history,'scrollHeight',{value:1000});Object.defineProperty(history,'clientHeight',{value:200});
  history.scrollTop=0;history.dispatchEvent(new h.w.Event('scroll'));await flush();
  assert.equal(h.calls.filter(r=>r.path.endsWith('/read')).length,0);
  history.scrollTop=800;history.dispatchEvent(new h.w.Event('scroll'));await flush();
  assert.equal(h.calls.find(r=>r.path.endsWith('/read')).body.throughSequence,1);
});

test('host opt-in is read from server; a failed change restores the saved value',async t=>{
  const h=await harness(t,{page:'host.html',url:'/host.html',handler:r=>{
    if(r.path==='/api/messaging/settings') return r.method==='GET'?{acceptingNewConversations:false}:response({error:'Unavailable'},503);
  }});
  h.w.ParrotMessaging.setUser(user);await flush();
  const toggle=h.$('messaging-host-enabled');assert.equal(toggle.checked,false);assert.equal(toggle.disabled,false);
  toggle.checked=true;toggle.dispatchEvent(new h.w.Event('change'));await flush();
  assert.equal(toggle.checked,false);assert.match(h.$('messaging-host-status').textContent,/connect/i);
  h.w.ParrotMessaging.setUser(null);assert.equal(h.$('messaging-host-settings').hidden,true);
});

test('search contact actions respect opt-in and pass the result dates without external listing dependencies',async t=>{
  const h=await harness(t,{page:'search.html',url:'/search.html',loggedIn:false});
  const container=h.w.document.createElement('div');h.w.document.body.append(container);
  h.w.ParrotMessaging.attachContact(container,{propertyId:property,availableFrom:'2027-05-01',availableTo:'2027-05-04',links:[]});
  await flush();const link=container.querySelector('a');assert.equal(link.hidden,false);
  assert.equal(new URL(link.href).searchParams.get('to'),'2027-05-04');
  h.w.ParrotMessaging.setLanguage('ru');assert.equal(link.textContent,'Написать владельцу');
});
