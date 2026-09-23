const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'public/assets/host.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'public/host.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/assets/styles.css'), 'utf8');

// Run the real controller against a small DOM/API test double. No live accounts
// or network requests are used. Layout is checked separately in the browser.
function element(tag = 'div') {
  const listeners = new Map();
  const attributes = new Map();
  const children = [];
  const controls = [];
  return {
    tagName: tag.toUpperCase(), children,
    hidden: false, open: false, disabled: false, value: '', textContent: '',
    dataset: {}, elements: {}, controls, classList: {toggle() {}},
    addEventListener(type, fn) {
      listeners.set(type, [...(listeners.get(type) || []), fn]);
    },
    async emit(type, extra = {}) {
      for (const fn of listeners.get(type) || []) {
        await fn({preventDefault() {}, target: this, ...extra});
      }
    },
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
    removeAttribute(name) { attributes.delete(name); },
    append(...nodes) { children.push(...nodes); },
    replaceChildren() { children.length = 0; },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0];
    },
    querySelectorAll(selector) {
      const descendants = [...controls, ...children.flatMap(n => [n, ...n.querySelectorAll('*')])];
      return [...new Set(descendants)].filter(n => selector === '*' || selector.split(',').some(s =>
        s.startsWith('.') ? n.className?.split(' ').includes(s.slice(1)) :
        n.tagName === s.toUpperCase() || controls.includes(n) && ['input','button'].includes(s)));
    },
    focus() { this.focused = true; },
    showModal() { this.open = true; },
    close() { this.open = false; void this.emit('close'); },
    getBoundingClientRect() { return {left:100, right:500, top:100, bottom:600}; }
  };
}

function setup(routes = {}, search = '') {
  const nodes = new Map([...html.matchAll(/id="([^"]+)"/g)].map(match => [match[1], element()]));
  for (const id of ['login-form', 'register-form']) {
    const form = nodes.get(id);
    for (const key of ['login', 'username', 'email', 'password', 'displayName']) {
      form.elements[key] = element();
      form.elements[key].value = key === 'email' ? 'test@example.test' : 'test-value-123';
      form.controls.push(form.elements[key]);
    }
    form.controls.push(element());
  }
  const modes = ['login', 'register'].map(mode => {
    const node = element();
    node.dataset.authMode = mode;
    return node;
  });
  const calls = [];
  const requests = [];
  const sandbox = {
    document: {
      documentElement: {},
      getElementById: id => nodes.get(id),
      querySelectorAll: selector => selector === '[data-auth-mode]' ? modes : [],
      createElement: element
    },
    navigator: {language:'en'},
    localStorage: {getItem() {return null;}, setItem() {}},
    window: {location: {search, pathname:'/host', hash:''}},
    history: {replaceState() {}},
    Headers, URLSearchParams,
    FormData: class {
      constructor(form) {this.form = form;}
      get(key) {return (this.form.elements[key] || this.form.querySelectorAll('*').find(n => n.name === key))?.value;}
      has(key) {return this.get(key) !== undefined;}
    },
    fetch: async (url, options) => {
      const route = url.replace('/api/host', '');
      calls.push(route);
      requests.push({route, body: options.body ? JSON.parse(options.body) : null});
      const result = typeof routes[route] === 'function' ? await routes[route]() : routes[route];
      const status = result?.status ?? (!result && route === '/auth/me' ? 401 : 200);
      return {status, ok:status < 400, json:async () => result?.body ?? {error:'Test error'}};
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return {nodes, modes, calls, requests, run: code => vm.runInContext(code, sandbox)};
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const user = {email:'test@example.test'};

function propertyCard(app) {
  app.run(`state = {...emptyState(), authenticated:true, properties:[{
    id:'property-1', title:'Test home', city:'Barcelona', bedrooms:1, sleeps:2,
    availability:[{id:'period-1', from:'2026-10-01', to:'2026-10-05', nightlyPriceCents:10000}]
  }]}; expandedPropertyIds.add('property-1'); renderProperties();`);
  return app.nodes.get('host-properties').children[0];
}

for (const status of [400, 409]) {
  for (const action of ['add', 'edit']) {
    test(`${action} range: HTTP ${status} is shown beside dates and keeps the draft`, async () => {
      const route = action === 'add' ? '/properties/property-1/availability' : '/availability/period-1';
      const app = setup({[route]:{status,body:{error:'availability period overlaps an existing period'}}});
      await settle();
      app.run('lang = "ru"');
      const card = propertyCard(app);
      const form = card.querySelector(action === 'add' ? '.host-dates' : '.host-period');
      const inputs = form.querySelectorAll('input');
      inputs[0].value = '2026-10-03';
      inputs[1].value = '2026-10-09';
      inputs[2].value = '125';
      await inputs[0].emit('input');
      await form.emit('submit');
      assert.match(form.querySelector('.host-form-error').textContent, /пересекаются/);
      assert.equal(form.querySelector('.host-form-error').getAttribute('role'), 'alert');
      assert.equal(app.nodes.get('host-status').getAttribute('role'), 'alert');
      assert.equal(inputs[0].value, '2026-10-03');
      assert.equal(inputs[1].value, '2026-10-09');
      assert.equal(inputs[2].value, '125');
      assert.equal(inputs.every(input => !input.disabled), true);
      assert.equal(app.nodes.get('host-properties').children[0], card);
      assert.equal(app.requests.find(r => r.route === route).body.nightlyPriceCents, 12500);
      const close = app.nodes.get('host-status').querySelector('.host-status-close');
      await close.emit('click');
      assert.equal(app.nodes.get('host-status').textContent, '');
      assert.equal(form.querySelector('.host-form-error').hidden, false);
    });
  }
}

test('saving a range blocks duplicate submits; retry clears its old error and refreshes on success', async () => {
  let resolve;
  const routes = {'/availability/period-1':{status:400,body:{error:'Invalid range'}}};
  const app = setup(routes);
  await settle();
  const form = propertyCard(app).querySelector('.host-period');
  await form.emit('submit');
  assert.equal(form.querySelector('.host-form-error').textContent, 'Invalid range');
  routes['/availability/period-1'] = () => new Promise(r => resolve = r);
  routes['/properties/property-1/availability'] = {body:[{id:'period-1',from:'2026-10-06',to:'2026-10-10'}]};
  form.querySelectorAll('input')[0].value = '2026-10-06';
  form.querySelectorAll('input')[1].value = '2026-10-10';
  const pending = form.emit('submit');
  assert.equal(form.querySelector('.host-form-error').hidden, true);
  assert.equal(form.getAttribute('aria-busy'), 'true');
  assert.equal(form.querySelectorAll('input').every(input => input.disabled), true);
  await form.emit('submit');
  assert.equal(app.calls.filter(route => route === '/availability/period-1').length, 2);
  resolve({body:{}});
  await pending;
  const updated = app.nodes.get('host-properties').children[0].querySelector('.host-period');
  assert.notEqual(updated, form);
  assert.equal(updated.querySelectorAll('input')[0].value, '2026-10-06');
  assert.equal(updated.querySelector('.host-form-error'), undefined);
});

test('collapse stays alone in the header; destructive action is only in the expanded footer', async () => {
  const app = setup();
  await settle();
  let card = propertyCard(app);
  assert.equal(card.querySelector('.host-property-head-actions').children.length, 1);
  assert.equal(card.querySelector('.host-property-toggle').getAttribute('aria-expanded'), 'true');
  assert.match(card.querySelector('.host-property-footer').children[0].textContent, /Delete/);
  await card.querySelector('.host-property-toggle').emit('click');
  card = app.nodes.get('host-properties').children[0];
  assert.equal(card.querySelector('.host-property-head-actions').children.length, 1);
  assert.equal(card.querySelector('.host-property-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(card.querySelector('.host-property-footer'), undefined);
  await card.querySelector('.host-property-toggle').emit('click');
  assert.equal(app.nodes.get('host-properties').children[0].querySelector('.host-property-head-actions').children.length, 1);
});

test('mobile menu has one Housing entry opening search; search stays left of hosts', () => {
  const home = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const search = fs.readFileSync(path.join(root, 'public/search.html'), 'utf8');
  assert.match(home, /<nav aria-label="Mobile navigation">\s*<a class="mobile-housing-primary" href="\/search.html"/);
  assert.match(css, /\.mobile-menu nav a\.mobile-housing-primary\{[^}]*background:var\(--lime\)/);
  const mobileMenu = home.split('id="mobile-menu"')[1].split('<main')[0];
  assert.equal((mobileMenu.match(/data-i18n="navHousing"/g) || []).length, 1);
  assert.equal((mobileMenu.match(/href="\/search.html"/g) || []).length, 1);
  for (const page of [html, search]) {
    const tabs = page.match(/<nav class="housing-tabs"[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.deepEqual([...tabs.matchAll(/href="([^"]+)"/g)].map(match => match[1]), ['/search.html', '/host.html']);
  }
  assert.doesNotMatch(css, /\.housing-tabs[^{}]*\{[^}]*\border\s*:/);
  assert.match(css, /\.housing-tabs a\.active\{background:var\(--lime\)/);
  assert.match(html, /class="active housing-host-link" aria-current="page"/);
  assert.match(search, /href="\/search.html" class="active" aria-current="page"/);
  assert.match(search, /class="housing-host-link"/);
  assert.match(css, /\.host-status\.error\{\s*position:fixed/);
});

test('login sends either email or username in the login field', async () => {
  for (const value of ['  My Name  ', '  test@example.test  ']) {
    const app = setup({'/auth/login':{body:{...user, username:'My Name'}}, '/dashboard':{body:{properties:[]}}});
    await settle();
    app.nodes.get('login-form').elements.login.value = value;
    await app.nodes.get('login-form').emit('submit');
    const request = app.requests.find(r => r.route === '/auth/login');
    assert.equal(request.body.login, value.trim());
    assert.equal(request.body.email, undefined);
    assert.equal(app.nodes.get('host-account-email').textContent, 'My Name');
    assert.equal(app.nodes.get('host-account-email').title, user.email);
  }
  assert.match(html, /name="login" type="text" autocomplete="username"/);
});

test('registration sends username separately from display name and email', async () => {
  const app = setup({'/auth/register':{status:201, body:{}}});
  await settle();
  const form = app.nodes.get('register-form');
  form.elements.username.value = '  Aleksey  ';
  form.elements.displayName.value = 'Host name';
  await form.emit('submit');
  const request = app.requests.find(r => r.route === '/auth/register');
  assert.equal(request.body.username, 'Aleksey');
  assert.equal(request.body.displayName, 'Host name');
  assert.equal(request.body.email, user.email);
  assert.equal(app.nodes.get('host-account-session').hidden, true);
});

test('hidden overrides all author display rules and initial auth links are hidden', () => {
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important\s*\}/);
  assert.match(html, /id="host-auth-links" hidden/);
  assert.match(html, /id="auth-dialog" aria-labelledby="auth-dialog-title"/);
});

test('session loading blocks opening auth; restored session hides guest controls', async () => {
  let resolve;
  const app = setup({'/auth/me': () => new Promise(r => resolve = r), '/dashboard':{body:{properties:[]}}});
  app.run('openAuth("login")');
  assert.equal(app.nodes.get('auth-dialog').open, false);
  resolve({body:user});
  await settle();
  assert.equal(app.nodes.get('host-auth-links').hidden, true);
  assert.equal(app.nodes.get('host-account-session').hidden, false);
  assert.equal(app.nodes.get('host-account-email').textContent, user.email);
  assert.equal(app.nodes.get('property-panel').hidden, false);
  app.run('openAuth("register")');
  assert.equal(app.nodes.get('auth-dialog').open, false);
});

test('guest sees only login controls; dialog shows exactly one form', async () => {
  const app = setup();
  await settle();
  assert.equal(app.nodes.get('host-auth-links').hidden, false);
  assert.equal(app.nodes.get('host-account-session').hidden, true);
  assert.equal(app.nodes.get('property-panel').hidden, true);
  await app.nodes.get('open-login').emit('click');
  assert.equal(app.nodes.get('login-form').hidden, false);
  assert.equal(app.nodes.get('register-form').hidden, true);
  await app.modes[1].emit('click');
  assert.equal(app.nodes.get('login-form').hidden, true);
  assert.equal(app.nodes.get('register-form').hidden, false);
  assert.equal(app.modes[1].getAttribute('aria-pressed'), 'true');
});

test('dialog padding does not dismiss; backdrop does and clears passwords', async () => {
  const app = setup();
  await settle();
  app.run('openAuth("login")');
  const dialog = app.nodes.get('auth-dialog');
  await dialog.emit('click', {clientX:110, clientY:110});
  assert.equal(dialog.open, true);
  await dialog.emit('click', {clientX:10, clientY:10});
  assert.equal(dialog.open, false);
  assert.equal(app.nodes.get('login-form').elements.password.value, '');
});

test('successful login closes modal and shows only authenticated controls', async () => {
  const app = setup({'/auth/login':{body:user}, '/dashboard':{body:{properties:[]}}});
  await settle();
  app.run('openAuth("login")');
  await app.nodes.get('login-form').emit('submit');
  assert.equal(app.nodes.get('auth-dialog').open, false);
  assert.equal(app.nodes.get('host-auth-links').hidden, true);
  assert.equal(app.nodes.get('host-account-session').hidden, false);
  await app.nodes.get('register-form').emit('submit');
  assert.equal(app.calls.includes('/auth/register'), false);
});

test('auth request disables switching and duplicate submission; errors stay in form', async () => {
  let resolve;
  const app = setup({'/auth/login': () => new Promise(r => resolve = r)});
  await settle();
  app.run('openAuth("login")');
  const submission = app.nodes.get('login-form').emit('submit');
  assert.equal(app.modes[1].disabled, true);
  app.run('openAuth("register")');
  await app.nodes.get('login-form').emit('submit');
  assert.equal(app.calls.filter(p => p === '/auth/login').length, 1);
  resolve({status:503, body:{error:'Try again'}});
  await submission;
  assert.equal(app.nodes.get('auth-dialog').open, true);
  assert.equal(app.nodes.get('register-form').hidden, true);
  assert.equal(app.nodes.get('login-form').querySelector('.host-form-error').textContent, 'Try again');
  assert.equal(app.modes[1].disabled, false);
});

test('registration keeps user logged out until email is verified', async () => {
  const app = setup({'/auth/register':{status:201, body:{}}});
  await settle();
  app.run('openAuth("register")');
  await app.nodes.get('register-form').emit('submit');
  assert.equal(app.nodes.get('auth-dialog').open, false);
  assert.equal(app.nodes.get('host-account-session').hidden, true);
  assert.match(app.nodes.get('host-status').textContent, /Check your email/);
});

test('logout failure preserves authenticated UI; success restores guest UI', async () => {
  const routes = {'/auth/me':{body:user}, '/dashboard':{body:{properties:[]}}, '/auth/logout':{status:503}};
  const app = setup(routes);
  await settle();
  await app.nodes.get('reset-host').emit('click');
  assert.equal(app.nodes.get('host-auth-links').hidden, true);
  assert.equal(app.nodes.get('host-account-session').hidden, false);
  routes['/auth/logout'] = {status:204};
  await app.nodes.get('reset-host').emit('click');
  assert.equal(app.nodes.get('host-auth-links').hidden, false);
  assert.equal(app.nodes.get('host-account-session').hidden, true);
  assert.equal(app.nodes.get('property-panel').hidden, true);
});

test('failed session check releases loading guard', async () => {
  const app = setup({'/auth/me':{status:503}});
  await settle();
  app.run('openAuth("login")');
  assert.equal(app.nodes.get('auth-dialog').open, true);
});

test('verification restores session without showing auth modal', async () => {
  const app = setup({'/auth/verify-email':{body:user}, '/dashboard':{body:{properties:[]}}}, '?verifyEmail=test-token');
  await settle();
  assert.equal(app.nodes.get('host-auth-links').hidden, true);
  assert.equal(app.nodes.get('host-account-session').hidden, false);
  assert.equal(app.nodes.get('auth-dialog').open, false);
  assert.equal(app.run('sessionLoading'), false);
});
