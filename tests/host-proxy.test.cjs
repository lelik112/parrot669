const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/index.js'),'utf8')
  .replace('export default {','globalThis.worker = {');
const id='11111111-1111-4111-8111-111111111111';

for (const [method,route,status] of [
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
