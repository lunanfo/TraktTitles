/**
 * Trakt Titles - 扩展后台。
 *
 * tvtime.trakt.tv 的 content script 跑在页面环境（world: MAIN），受同源策略约束，
 * 直接请求 api.trakt.tv 会被 CORS 挡掉。
 * 这里把译名请求放到扩展自己的上下文里发（扩展有 host_permissions，不受页面 CORS 限制），
 * 再通过消息把结果回传给 content script。
 */
const DEFAULT_API_KEY = '201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d';
const API_VERSION = '2';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== 'trakt-titles:fetch-translations') return false;

  const { path, apiKey } = message;
  if (typeof path !== 'string' || !/^\/(?:shows|movies)\/[^/]+\/(?:translations\/[a-z]{2,3}|seasons\/\d+\/(?:episodes\/\d+\/)?translations\/[a-z]{2,3})$/.test(path)) {
    sendResponse({ ok: false, error: 'bad path' });
    return false;
  }

  fetch(`https://api.trakt.tv${path}`, {
    headers: {
      'trakt-api-key': apiKey || DEFAULT_API_KEY,
      'trakt-api-version': API_VERSION,
      'accept': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        sendResponse({ ok: false, status: res.status });
        return null;
      }
      return res.json();
    })
    .then((list) => {
      if (list === null || list === undefined) return;
      // 语言和地区的匹配放在 content script，保证扩展与油猴版本共用同一套规则。
      sendResponse({ ok: true, translations: Array.isArray(list) ? list : [] });
    })
    .catch((error) => sendResponse({ ok: false, error: String(error) }));

  // 异步响应
  return true;
});
