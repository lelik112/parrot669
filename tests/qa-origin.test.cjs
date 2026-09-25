const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/index.js'),'utf8')
  .replace('export default {','globalThis.worker = {');
const secret='test-worker-secret-with-at-least-thirty-two-characters';
const propertyId='11111111-1111-4111-8111-111111111111';
const qaHosts=['qa.parrot669.com','parrot669.cheltsov112.workers.dev',
  'parrot669-regression-a.cheltsov112.workers.dev',
  'parrot669-regression-b.cheltsov112.workers.dev'];

test('regression Workers get separate addresses and the same proxied assets',()=>{
  const config=JSON.parse(fs.readFileSync(path.join(__dirname,'../wrangler.jsonc'),'utf8'));
  for(const slot of ['a','b']) {
    const environment=config.env[`regression-${slot}`];
    assert.equal(environment.workers_dev,true);
    assert.deepEqual(environment.assets,config.assets);
    assert.ok(qaHosts.includes(`${config.name}-regression-${slot}.cheltsov112.workers.dev`));
  }
});

function harness() {
  const calls=[];
  const sandbox={URL,Headers,Response,console,fetch:async(url,init)=>{
    calls.push({url,init});
    return new Response(JSON.stringify({ok:true}),{status:200,
      headers:{'Set-Cookie':'parrot_session=second-session; Path=/; HttpOnly; Secure; SameSite=Lax'}});
  }};
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  const env={QA_WORKER_SECRET:secret,ASSETS:{fetch:async()=>new Response('HTML',{status:200})}};
  return {worker:sandbox.worker,calls,env};
}

test('both QA hosts forward only their own cookie and attestation for every API family',async()=>{
  const {worker,calls,env}=harness();
  const routes=['/api/host/auth/login','/api/host/auth/me','/api/host/dashboard',
    '/api/locations/countries','/api/search?country=ES','/api/messaging/conversations',
    `/api/messaging/contact-options/${propertyId}`];
  for(const host of qaHosts) for(const route of routes) {
    const login=route.endsWith('/login');
    const response=await worker.fetch(new Request('https://'+host+route,{
      method:login?'POST':'GET',
      headers:{Origin:'https://'+host,Cookie:'other=x; parrot_session=qa-session',
        'X-Parrot-QA-Origin':'forged','X-Parrot-QA-Worker':'forged'},
      ...(login?{body:'{}'}:{})
    }),env);
    assert.equal(response.status,200);
    assert.match(response.headers.get('Set-Cookie'),/second-session/);
  }
  assert.equal(calls.length,routes.length*qaHosts.length);
  for(const {init} of calls){
    assert.equal(init.headers.get('Cookie'),'parrot_session=qa-session');
    assert.equal(init.headers.get('X-Parrot-QA-Origin'),'qa');
    assert.equal(init.headers.get('X-Parrot-QA-Worker'),secret);
  }
});

test('QA origin fails closed without secret, rejects contact/unknown API and cross-origin writes',async()=>{
  const {worker,calls,env}=harness();
  for(const host of qaHosts) {
    const base='https://'+host;
    assert.equal((await worker.fetch(new Request(base+'/host.html'),{...env,QA_WORKER_SECRET:undefined})).status,503);
    assert.equal((await worker.fetch(new Request(base+'/api/search'),{...env,QA_WORKER_SECRET:'short'})).status,503);
  }
  const base='https://parrot669-regression-a.cheltsov112.workers.dev';
  assert.equal((await worker.fetch(new Request(base+'/api/contact',{method:'POST',body:'{}'}),env)).status,403);
  assert.equal((await worker.fetch(new Request(base+'/api/private'),env)).status,404);
  assert.equal((await worker.fetch(new Request(base+'/api/host/auth/logout',{
    method:'POST',headers:{Origin:'https://evil.example'}
  }),env)).status,403);
  assert.equal(calls.length,0);
});

test('QA recovery page leads to the ordinary origin while QA reset API stays closed',async()=>{
  const {worker,calls,env}=harness();
  for(const host of qaHosts){
    const response=await worker.fetch(new Request(`https://${host}/recover.html?lang=ru`),env);
    assert.equal(response.status,302);
    assert.equal(response.headers.get('Location'),'https://parrot669.com/recover.html?lang=ru');
  }
  const main=await worker.fetch(new Request('https://parrot669.com/recover.html'),env);
  assert.equal(main.status,200);
  assert.equal(calls.length,0);
});

test('ordinary origin keeps its existing proxy and never forwards QA headers',async()=>{
  const {worker,calls,env}=harness();
  const response=await worker.fetch(new Request('https://parrot669.com/api/host/auth/me',{
    headers:{Cookie:'parrot_session=main-session','X-Parrot-QA-Origin':'qa','X-Parrot-QA-Worker':secret}
  }),env);
  assert.equal(response.status,200);
  assert.equal(calls[0].init.headers.get('Cookie'),'parrot_session=main-session');
  assert.equal(calls[0].init.headers.get('X-Parrot-QA-Origin'),null);
  assert.equal(calls[0].init.headers.get('X-Parrot-QA-Worker'),null);
  const lookalike=await worker.fetch(new Request('https://parrot669.cheltsov112.workers.dev.evil.example/api/host/auth/me',{
    headers:{'X-Parrot-QA-Origin':'qa','X-Parrot-QA-Worker':secret}
  }),env);
  assert.equal(lookalike.status,200);
  assert.equal(calls[1].init.headers.get('X-Parrot-QA-Origin'),null);
  assert.equal(calls[1].init.headers.get('X-Parrot-QA-Worker'),null);
});
