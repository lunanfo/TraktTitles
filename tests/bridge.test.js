const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'extension', 'bridge.js'), 'utf8');

function setup(fakeChrome) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
  });
  if (fakeChrome !== undefined) dom.window.chrome = fakeChrome;
  dom.window.eval(source);
  return dom;
}

function ask(dom, requestId = 'req-1') {
  return new Promise((resolve) => {
    const onMessage = (event) => {
      const message = event.data;
      if (!message || message.type !== 'trakt-titles:translations-response') return;
      if (message.requestId !== requestId) return;
      dom.window.removeEventListener('message', onMessage);
      resolve(message.response);
    };
    dom.window.addEventListener('message', onMessage);
    dom.window.postMessage({
      type: 'trakt-titles:request-translations',
      requestId,
      path: '/shows/severance/translations/zh',
      apiKey: 'client-id',
      token: 'user-token',
    }, dom.window.location.origin);
  });
}

(async () => {
  // 1. 扩展被卸载/失效：chrome 不存在，不能抛未捕获异常，要回一条错误。
  let dom = setup(undefined);
  let response = await ask(dom);
  assert.strictEqual(response.ok, false);
  assert.ok(/invalidated/i.test(response.error), 'missing chrome is reported as invalidated');

  // 2. chrome.runtime 存在但没有 id（扩展已失效）。
  dom = setup({ runtime: {} });
  response = await ask(dom);
  assert.strictEqual(response.ok, false);
  assert.ok(/invalidated/i.test(response.error));

  // 3. 调用瞬间扩展被重新加载：sendMessage 抛 "Extension context invalidated."。
  dom = setup({
    runtime: {
      id: 'extension-id',
      lastError: null,
      sendMessage() { throw new Error('Extension context invalidated.'); },
    },
  });
  response = await ask(dom);
  assert.strictEqual(response.ok, false);
  assert.ok(/invalidated/i.test(response.error), 'sendMessage errors are caught and relayed');

  // 4. 正常转发：带 path / apiKey / token。
  const calls = [];
  dom = setup({
    runtime: {
      id: 'extension-id',
      lastError: null,
      sendMessage(message, callback) {
        calls.push(message);
        callback({ ok: true, translations: [{ title: '人生切割术' }] });
      },
    },
  });
  response = await ask(dom);
  assert.strictEqual(response.ok, true);
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].type, 'trakt-titles:fetch-translations');
  assert.strictEqual(calls[0].path, '/shows/severance/translations/zh');
  assert.strictEqual(calls[0].apiKey, 'client-id');
  assert.strictEqual(calls[0].token, 'user-token');

  console.log('[bridge] RESULT: ALL PASS');
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
