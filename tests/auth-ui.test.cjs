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
function element() {
  const listeners = new Map();
  const attributes = new Map();
  const children = [];
  const controls = [];
  return {
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
    append(node) { children.push(node); },
    replaceChildren() { children.length = 0; },
    querySelector(selector) {
      return selector === 'input' ? controls[0] : children.find(n => n.className?.includes('host-form-error'));
    },
    querySelectorAll() { return controls; },
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
    for (const key of ['email', 'password', 'displayName']) {
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
      get(key) {return this.form.elements[key]?.value;}
    },
    fetch: async url => {
      const route = url.replace('/api/host', '');
      calls.push(route);
      const result = typeof routes[route] === 'function' ? await routes[route]() : routes[route];
      const status = result?.status ?? (!result && route === '/auth/me' ? 401 : 200);
      return {status, ok:status < 400, json:async () => result?.body ?? {error:'Test error'}};
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return {nodes, modes, calls, run: code => vm.runInContext(code, sandbox)};
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const user = {email:'test@example.test'};

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
