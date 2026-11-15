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

  window.addEventListener('message', (event) => {
    if (!isPageMessage(event)) return;
    const message = event.data;
    if (!message || message.type !== REQUEST_TYPE || typeof message.requestId !== 'string') return;

    chrome.runtime.sendMessage(
      {
        type: 'trakt-titles:fetch-translations',
        path: message.path,
        apiKey: message.apiKey,
      },
      (response) => {
        const relayed = chrome.runtime.lastError
          ? { ok: false, error: chrome.runtime.lastError.message }
          : response;
        window.postMessage({
          type: RESPONSE_TYPE,
          requestId: message.requestId,
          response: relayed || { ok: false },
        }, window.location.origin);
      }
    );
  });
})();
