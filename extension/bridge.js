/**
 * Bridge between the page-world title script and the extension service worker.
 *
 * content.js runs with `world: MAIN`, where chrome.runtime is not available.
 * This isolated-world script relays translation requests through postMessage.
 */
(() => {
  'use strict';

  const REQUEST_TYPE = 'trakt-titles:request-translations';
  const RESPONSE_TYPE = 'trakt-titles:translations-response';
  const READY_TYPE = 'trakt-titles:bridge-ready';
  const READY_REQUEST_TYPE = 'trakt-titles:bridge-ready-request';

  // jsdom 的 MessageEvent 不提供 source，因此 source/origin 仅在存在时校验。
  function isPageMessage(event) {
    return (!event.source || event.source === window)
      && (!event.origin || event.origin === window.location.origin);
  }

  // MAIN world 脚本和隔离世界脚本的注入顺序并不固定。
  // 桥主动广播一次，同时响应页面脚本的 ready 询问。
  window.postMessage({ type: READY_TYPE }, window.location.origin);
  window.addEventListener('message', (event) => {
    if (isPageMessage(event) && event.data && event.data.type === READY_REQUEST_TYPE) {
      window.postMessage({ type: READY_TYPE }, window.location.origin);
    }
  });

  function respond(requestId, response) {
    window.postMessage({
      type: RESPONSE_TYPE,
      requestId,
      response: response || { ok: false },
    }, window.location.origin);
  }

  window.addEventListener('message', (event) => {
    if (!isPageMessage(event)) return;
    const message = event.data;
    if (!message || message.type !== REQUEST_TYPE || typeof message.requestId !== 'string') return;

    // 扩展被重新加载/更新/卸载后，已注入的隔离世界脚本还活着，但 chrome.runtime 已经失效。
    // 这时直接 sendMessage 会抛 "Extension context invalidated."，每个标签页都冒一条
    // 未捕获异常；这里先探测再调用，失败也回一条错误，页面脚本不用干等 12 秒超时。
    let runtime = null;
    try {
      runtime = typeof chrome !== 'undefined' && chrome ? chrome.runtime : null;
    } catch (e) {
      runtime = null;
    }
    if (!runtime || !runtime.id) {
      respond(message.requestId, { ok: false, error: 'extension context invalidated' });
      return;
    }

    try {
      runtime.sendMessage(
        {
          type: 'trakt-titles:fetch-translations',
          path: message.path,
          apiKey: message.apiKey,
          token: message.token,
        },
        (response) => {
          let relayed = { ok: false };
          try {
            relayed = runtime.lastError
              ? { ok: false, error: runtime.lastError.message }
              : (response || { ok: false });
          } catch (e) {
            relayed = { ok: false, error: String(e) };
          }
          respond(message.requestId, relayed);
        }
      );
    } catch (e) {
      // 读取 runtime 与 sendMessage 之间扩展刚好被重新加载时也会走到这里。
      respond(message.requestId, { ok: false, error: String(e && e.message ? e.message : e) });
    }
  });
})();
