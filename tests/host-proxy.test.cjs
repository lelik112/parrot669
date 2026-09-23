const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/index.js'),'utf8')
  .replace('export default {','globalThis.worker = {');
const id='11111111-1111-4111-8111-111111111111';

test('address autocomplete proxy preserves encoded query, session and provider error status', async () => {
  let forwarded;
  const sandbox={URL,Headers,Response,console,fetch:async(url,init)=>{
    forwarded={url,...init};
    return new Response(JSON.stringify({error:'Address autocomplete is temporarily unavailable'}),{status:503});
  }};
  vm.createContext(sandbox); vm.runInContext(source,sandbox);
  const query='?type=street&country=ES&cityId=51f07665660fc4024059dc0a96dfac6c123&city=Barcelona&q=alfo';
  const response=await sandbox.worker.fetch(new Request('https://parrot669.com/api/host/geocode/autocomplete'+query,{
    headers:{Cookie:'other=secret; parrot_session=test-session'}
  }),{});
  assert.equal(response.status,503);
  assert.equal(forwarded.url,'https://api.parrot669.com/api/geocode/autocomplete'+query);
  assert.equal(forwarded.headers.get('Cookie'),'parrot_session=test-session');
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.match((await response.json()).error,/unavailable/);
});

for (const [method,route,status] of [
  ['GET','/geocode/countries',200],
  ['GET',`/properties/${id}/unavailability`,200],
  ['POST',`/properties/${id}/unavailability`,409],
  ['PUT',`/unavailability/${id}`,400],
  ['DELETE',`/unavailability/${id}`,204]
]) {
  test(`manual blocks proxy forwards ${method} and HTTP ${status}`, async () => {
    let forwarded;
    const sandbox={URL,Headers,Response,console,fetch:async(url,init)=>{
      forwarded={url,...init,body:init.body?await new Response(init.body).json():null};
      return new Response(status===204?null:JSON.stringify({error:'range error'}),{status});
    }};
    vm.createContext(sandbox); vm.runInContext(source,sandbox);
    const body={from:'2030-04-10',to:'2030-04-15'};
    const req=new Request('https://parrot669.com/api/host'+route,{
      method,headers:{Origin:'https://parrot669.com',Cookie:'other=x; parrot_session=test-session','Content-Type':'application/json'},
      ...(['POST','PUT'].includes(method)?{body:JSON.stringify(body)}:{})
    });
    const response=await sandbox.worker.fetch(req,{});
    assert.equal(response.status,status);
    assert.equal(forwarded.url,'https://api.parrot669.com/api'+route);
    assert.equal(forwarded.method,method);
    assert.equal(forwarded.headers.get('Cookie'),'parrot_session=test-session');
    if (['POST','PUT'].includes(method)) assert.deepEqual(forwarded.body,body);
    if (status!==204) assert.deepEqual(await response.json(),{error:'range error'});
  });
}
