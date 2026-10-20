const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

function startWithUrl(url) {
  const loadedUrls = [];
  let ready = false;
  const app = {
    commandLine: { appendSwitch() {} },
    whenReady() {
      ready = true;
      return { then(callback) { callback(); } };
    },
    on() {},
    quit() {},
    dock: { hide() {} }
  };
  class BrowserWindow {
    constructor() { this.webContents = { on() {} }; }
    on() {}
    setAlwaysOnTop() {}
    setVisibleOnAllWorkspaces() {}
    loadURL(value) { loadedUrls.push(value); }
  }
  const yargs = { argv: { url, width: 1280, height: 720, title: null, pin: false } };
  for (const method of ['scriptName', 'usage', 'example', 'option', 'describe', 'default']) {
    yargs[method] = () => yargs;
  }
  const modules = {
    electron: { app, BrowserWindow, screen: { getPrimaryDisplay: () => ({ scaleFactor: 1 }) } },
    process: { platform: 'linux', on() {} },
    path,
    'electron-context-menu': () => {},
    yargs
  };
  vm.runInNewContext(source, {
    __dirname: path.join(__dirname, '..'),
    require(name) {
      assert.ok(Object.prototype.hasOwnProperty.call(modules, name), `Unexpected module: ${name}`);
      return modules[name];
    }
  }, { timeout: 1000 });
  assert.equal(ready, true);
  return loadedUrls;
}

for (const [input, expected] of [
  ['vdo.ninja', 'https://vdo.ninja'],
  ['vdo.ninja/?view=example', 'https://vdo.ninja/?view=example'],
  ['localhost:8080', 'https://localhost:8080'],
  ['https://vdo.ninja/?view=example', 'https://vdo.ninja/?view=example'],
  ['http://localhost:8080', 'http://localhost:8080']
]) {
  test(`URL option opens ${input}`, () => {
    assert.deepEqual(startWithUrl(input), [expected]);
  });
}
