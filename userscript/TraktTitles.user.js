// ==UserScript==
// @name         Trakt Titles
// @namespace    trakt-titles
// @version      1.4.2
// @description  Restores missing titles on Trakt poster-only cards.
// @author       lunanfo
// @homepageURL  https://github.com/lunanfo/TraktTitles
// @supportURL   https://github.com/lunanfo/TraktTitles/issues
// @updateURL    https://raw.githubusercontent.com/lunanfo/TraktTitles/main/userscript/TraktTitles.user.js
// @downloadURL  https://raw.githubusercontent.com/lunanfo/TraktTitles/main/userscript/TraktTitles.user.js
// @icon         data:image/png;base64,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
// @match        https://trakt.tv/*
// @match        https://app.trakt.tv/*
// @match        https://tvtime.trakt.tv/*
// @match        https://og.trakt.tv/*
// @grant        GM_xmlhttpRequest
// @connect      api.trakt.tv
// @run-at       document-start
// ==/UserScript==
(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `/* Trakt Titles - title for poster-only cards */

.trakt-helper-poster-title {
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    margin: 2px 0 -10px !important;
    padding: 0 !important;
    overflow: hidden !important;
    font-size: calc(1rem - 2px) !important;
    font-weight: 600 !important;
    line-height: 1.25 !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}

/* Search 页在原生卡片上额外保留了一点标题下间距，轻微收紧。 */
.trakt-helper-search-title {
    margin-bottom: -16px !important;
    line-height: 1.25 !important;
}

/* 原名副标题（在有充裕垂直空间的摘要/详情卡片中使用，如智能列表详情网格页） */
.trakt-helper-original-title {
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    margin: -4px 0 2px !important;
    padding: 0 !important;
    overflow: hidden !important;
    font-size: calc(1rem - 4px) !important;
    font-weight: 400 !important;
    line-height: 1.25 !important;
    color: var(--color-text-secondary, #999) !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}

/* Discover 页（/discover/trending 等）的原名行要和官方那一行完全一致。
   官方那行是没有颜色类的裸 <p>（实测文字像素 ≈249，和剧名 246 一样亮），只有「科幻」那种
   类型行才是次级色（≈143）。所以这里把上面那条给智能列表写的次级色 + 收紧间距全部复位：
   颜色改成继承容器（与官方同一个父节点，天然一致），字号回到 --font-size-text。 */
.trakt-helper-original-title.trakt-helper-discover-original-title {
    margin: 0 !important;
    font-size: var(--font-size-text, 1rem) !important;
    font-weight: 400 !important;
    color: inherit !important;
}

/* Lift the centered cover badge slightly so its card title stays on the same
   baseline as cards without a badge. */
.trakt-helper-cover-badge {
    transform: translateY(-6px) !important;
}

/* 「正在播放」浮层：季集行是本脚本插入的，让它贴紧剧名成为一个标题块，
   并与下面的「剩余/结束」拉开一点，形成 标签 → 标题组 → 时间信息 的层级。
   选择器全部锁在 .trakt-now-playing-container 里，只影响这一个浮层。
   官方原有的行间距是 --gap-xxs(4px)，这里 -2px 即变成 2px。

   颜色故意不覆盖：网页卡片里的集标题是 .trakt-card-subtitle，
   即 var(--color-text-secondary) + 字重 500 + 12px；我们这行同样用
   small/secondary 类，所以暗色 67%、亮色 shade-800，与主页面那行完全一致。
   这里只补官方有、我们缺的 500 字重。（早先为毛玻璃提亮的 shade-100 已按要求撤掉。） */
.trakt-now-playing-container .trakt-helper-now-playing-episode {
    margin-top: -2px !important;
    font-weight: 500 !important;
}

.trakt-now-playing-content:has(.trakt-helper-now-playing-episode) .trakt-now-playing-progress {
    margin-top: 2px !important;
}

/* ---------------------------------------------------------------------------
   tvtime.trakt.tv（新版 TV Time 网页）的横版卡片
   \`article.media-row\` 的标题是 \`a.media-row-title\`，官方把英文原名直接写在
   aria-label 里，没有中文。扩展补上中文后，把英文原名缩成标题下面那行，
   视觉上跟新站自己的「标题 / meta / 副标题」三级结构保持一致。
   选择器全部锁在 .media-row-body 里，只影响我们新建的这一行。
--------------------------------------------------------------------------- */
.media-row-body > .trakt-helper-original-title {
    margin: -2px 0 2px !important;
    font-size: calc(1rem - 5px) !important;
    line-height: 1.2 !important;
    font-weight: 400 !important;
    color: var(--color-text-secondary, #999) !important;
}

/* Popular / Discover / 详情页推荐位的竖版海报卡。原名紧贴标题，
   比主标题小一档，不改变海报本身尺寸。 */
.poster-card > .trakt-helper-original-title.poster-card-original {
    margin: 2px 0 0 !important;
    font-size: calc(1rem - 5px) !important;
    line-height: 1.2 !important;
    font-weight: 400 !important;
    color: var(--color-text-secondary, #999) !important;
}

/* Discover 顶部焦点位：独立译名节点在上，Svelte 管理的原链接作为英文副标题。 */
.discover-spotlight-content > .trakt-helper-discover-localized-title {
    display: block !important;
}

.discover-spotlight-content > .discover-spotlight-title.trakt-helper-discover-original-title {
    display: block !important;
    margin: 0 0 8px !important;
    font-size: calc(1rem - 4px) !important;
    line-height: 1.25 !important;
    font-weight: 400 !important;
    color: var(--color-text-secondary, #999) !important;
}

/* ---------------------------------------------------------------------------
   og.trakt.tv（OG Redux：经典 Trakt 界面重制版）
   卡片 / 焦点位的标题常常是英文 logo 图，有中文译名时把它换成中文文本
   （logo 无法翻译），详情页和焦点位再补一行英文原名。
   选择器都带 trakt-helper-og 前缀，只影响脚本自己插入的节点或明确隐藏的 logo。
--------------------------------------------------------------------------- */
.trakt-helper-og-logo-hidden {
    display: none !important;
}

.trakt-helper-og-title {
    display: inline-block !important;
    max-inline-size: 100% !important;
    font: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    letter-spacing: inherit !important;
    text-align: inherit !important;
    text-transform: none !important;
    text-shadow: inherit !important;
    color: inherit !important;
}

/* 详情页 / 榜单 / Discover 焦点位的英文原名行：
   字号跟随标题（em），但压到副标题的层级，不喧宾夺主。 */
.trakt-helper-og-original {
    display: block !important;
    margin: 0.25em 0 0.5em !important;
    max-inline-size: 100% !important;
    font-family: var(--font-body, inherit) !important;
    font-size: clamp(12px, 0.34em, 20px) !important;
    font-weight: 400 !important;
    line-height: 1.3 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    text-shadow: none !important;
    color: var(--color-text-secondary, rgba(255, 255, 255, 0.65)) !important;
}
`;
  (document.head || document.documentElement).appendChild(style);

  // 油猴跨域桥接：模拟 chrome.runtime.sendMessage 的语义
  var __gmBridge = (function () {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) return null;
    if (typeof GM_xmlhttpRequest !== 'function') return null;
    return function (message, callback) {
      if (!message || message.type !== 'trakt-titles:fetch-translations') return false;
      if (!/^\/(?:shows|movies)\/[^/]+\/(?:translations\/[a-z]{2,3}|seasons\/\d+\/(?:episodes\/\d+\/)?translations\/[a-z]{2,3})$/.test(message.path)) {
        callback({ ok: false, error: 'bad path' });
        return false;
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.trakt.tv' + message.path,
        headers: {
          'trakt-api-key': message.apiKey,
          'trakt-api-version': '2',
          'accept': 'application/json'
        },
        onload: function (res) {
          try {
            var list = JSON.parse(res.responseText);
            callback({ ok: true, translations: Array.isArray(list) ? list : [] });
          } catch (e) {
            callback({ ok: false });
          }
        },
        onerror: function () { callback({ ok: false }); }
      });
      return true;
    };
  })();
/**
 * Trakt Titles - restores names on cards that render only a poster,
 * adds localized titles on smart list views and search, follows the account
 * language on tvtime.trakt.tv, and translates titles plus overviews on
 * og.trakt.tv (OG Redux).
 */
(function () {
  'use strict';

  const TITLE_CLASS = 'trakt-helper-poster-title';
  const ORIGINAL_TITLE_CLASS = 'trakt-helper-original-title';
  const DISCOVER_ORIGINAL_TITLE_CLASS = 'trakt-helper-discover-original-title';
  const CARD_SELECTOR = '.trakt-card, .mini_card, .grid-item, [data-card]';
  const EXCLUDED_SELECTOR = 'header, nav, footer, [role="navigation"], [role="menu"], [role="menubar"], .breadcrumbs, .navbar, .comments, .trakt-now-playing-container, table, tbody';

  const DEFAULT_API_KEY = '201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d';
  const API_VERSION = '2';
  const ZH_REGEX = /[\u4e00-\u9fa5]/;
  // 官方 /v3/intl/bulk 每个类型最多收 100 个 id，和网页端自己的上限保持一致。
  const BULK_ID_CAP = 100;

  // Caches
  const mediaInfoCache = new Map(); // `${type}:${slug}` -> { type, slug, id, title }
  const translationCache = new Map(); // `${type}:${id}` -> zhTitle | null
  const episodeTitleCache = new Map(); // `${slug}:${season}:${number}` -> { en, zh }
  const attemptedEpisodeSeasons = new Set(); // `${slug}:${season}`
  const resolvingSlugs = new Set();
  const pendingBulkIds = { movie: new Set(), show: new Set() };
  const inFlightIds = { movie: new Set(), show: new Set() };

  let capturedAuthToken = null;
  let capturedApiKey = DEFAULT_API_KEY;
  let bulkTimer = null;
  let renderTimer = null;
  // 中文名的语言/地区固定走简体：网页端自己的请求是 zh + CN，我们也不去跟它的地区走，
  // 免得在繁体界面之外的场景混进繁体译名。
  const INTL_LANGUAGE = 'zh';
  const INTL_COUNTRY = 'CN';

  // ---------------------------------------------------------------------------
  // tvtime.trakt.tv（新版 TV Time 网页）的剧名 / 单集名本地化
  //
  // 新站用横版大卡片：`article.media-row`，标题是 `a.media-row-title`，
  // 单集名是 `a.media-row-subtitle`。看了它的 Svelte 源码（chunks/BPArmwY0.js）可以确认：
  //   aria-label = entry.title / entry.episodeTitle
  // 也就是**英文原本名**，aria-label 这条路拿不到译名（这点和 app.trakt.tv 不同）。
  // 所以只能调新站自己用的那个官方接口（详情页实测就是这个请求，无需登录 token）：
  //   https://api.trakt.tv/shows/{slug}/translations/{language}
  //   https://api.trakt.tv/shows/{slug}/seasons/{s}/episodes/{e}/translations/{language}
  // 返回是同一语言的多个地区变体。页面当前的 `html[lang]` 就是 Trakt 设置语言，
  // 取对应地区（例如 zh-CN → cn、ja-JP → jp、fr-CA → ca），再退回通用条目。
  // 取到后把译名写进标题、英文原名缩成副行，和新站自己的「标题 / meta / 副标题」结构一致。
  // ---------------------------------------------------------------------------
  const TVTIME_HOST = 'tvtime.trakt.tv';
  const MEDIA_ROW_SELECTOR = 'article.media-row';
  const POSTER_CARD_SELECTOR = '.poster-card';
  const SPOTLIGHT_TITLE_SELECTOR = '.discover-spotlight-title';
  const SPOTLIGHT_LOCALIZED_CLASS = 'trakt-helper-discover-localized-title';
  const TVTIME_TITLE_CLASSES = new Set([
    'trakt-card-title',
    'media-row-title',
    'media-row-subtitle',
    'poster-title',
    'discover-spotlight-title',
  ]);
  // 用公开 API（api.trakt.tv），**不要**用新站前端那个 apiz.trakt.tv：
  // 实测 apiz 只对 trakt.tv 自有页面放开，从 tvtime.trakt.tv 以页面身份请求会 403 Forbidden
  // （未登录时偶尔放行，登录后必 403，很容易被误判成"能用"）。
  // api.trakt.tv 的 /translations/{language} 是公开接口，不需要用户 token。
  const TVTIME_API_ORIGIN = 'https://api.trakt.tv';
  const BRIDGE_REQUEST_TYPE = 'trakt-titles:request-translations';
  const BRIDGE_RESPONSE_TYPE = 'trakt-titles:translations-response';
  const BRIDGE_READY_TYPE = 'trakt-titles:bridge-ready';
  const BRIDGE_READY_REQUEST_TYPE = 'trakt-titles:bridge-ready-request';
  let bridgeReady = false;
  let bridgeFailed = false;
  let bridgeWaitTimer = null;
  let bridgeWaiters = [];
  let bridgeRequestSequence = 0;
  const DEFAULT_LOCALE_COUNTRIES = {
    ar: 'sa',
    bg: 'bg',
    ca: 'es',
    da: 'dk',
    de: 'de',
    el: 'gr',
    en: 'us',
    es: 'es',
    fa: 'ir',
    fr: 'fr',
    hu: 'hu',
    id: 'id',
    it: 'it',
    ja: 'jp',
    nb: 'no',
    nl: 'nl',
    pl: 'pl',
    pt: 'pt',
    ro: 'ro',
    ru: 'ru',
    sv: 'se',
    tr: 'tr',
    uk: 'ua',
    zh: 'cn',
  };

  // `${localeKey}|${type}:${slug}` -> 本地化剧名 / null
  const mediaRowTitleCache = new Map();
  const mediaRowResolving = new Set();
  // `${localeKey}|show:${slug}:${season}:${number}` -> 本地化单集名 / null
  const tvTimeEpisodeTitleCache = new Map();
  const tvTimeEpisodeResolving = new Set();

  // postMessage 在部分测试环境（jsdom）里没有 event.source；只在字段存在时校验，
  // 真实浏览器仍会拒绝来自其他窗口或源的消息。
  function isPageMessage(event) {
    return (!event.source || event.source === window)
      && (!event.origin || event.origin === window.location.origin);
  }

  // 首轮扫描可能早于隔离世界的 bridge.js 注入完成。清除失败结果，
  // 等桥就绪后重新请求，避免把“桥还没准备好”误缓存成“没有译名”。
  function clearUnresolvedTvTimeCache() {
    [mediaRowTitleCache, tvTimeEpisodeTitleCache].forEach((cache) => {
      cache.forEach((value, key) => {
        if (value === null) cache.delete(key);
      });
    });
  }

  function isTvTimeApp() {
    return window.location.hostname === TVTIME_HOST;
  }

  // 从链接上解析出类型 / slug / 季集号（slug 是媒体的唯一标识，新站全部接口都用它）。
  function tvTimeEntryOf(link) {
    const href = link.getAttribute('href') || '';
    const match = href.match(/^\/(movies|shows)\/([^/?#]+)/);
    if (!match) return null;
    const type = match[1] === 'movies' ? 'movie' : 'show';
    const episodeMatch = href.match(/\/seasons\/(\d+)\/episodes\/(\d+)/);
    return {
      type,
      slug: match[2],
      season: episodeMatch ? parseInt(episodeMatch[1], 10) : null,
      number: episodeMatch ? parseInt(episodeMatch[2], 10) : null,
    };
  }

  // 读取新站当前界面语言。服务端会在 html[lang] 写入 Trakt 设置值；
  // cookie 是页面脚本更新语言后、html[lang] 尚未刷新时的补充来源。
  function getTvTimeLocale() {
    const htmlLang = document.documentElement && document.documentElement.lang;
    const cookieMatch = String(document.cookie || '').match(/(?:^|;\s*)PARAGLIDE_LOCALE=([^;]+)/);
    const raw = String(htmlLang || (cookieMatch && decodeURIComponent(cookieMatch[1])) || '').trim();
    if (!raw) return null;

    const parts = raw.toLowerCase().replace(/_/g, '-').split('-');
    const language = parts[0];
    if (!/^[a-z]{2,3}$/.test(language)) return null;

    const region = parts.slice(1).find(
      (part) => /^[a-z]{2}$/.test(part) && part !== 'hans' && part !== 'hant'
    );
    const country = region || DEFAULT_LOCALE_COUNTRIES[language] || null;
    return { language, country, key: `${language}:${country || ''}` };
  }

  function translationCountry(entry) {
    return String((entry && entry.country) || '').toLowerCase();
  }

  // 同一语言下优先精确地区，再退回无地区条目。简体与繁体是不同的书写系统，
  // 因此 zh-CN 不会拿 tw/hk 补位，反之亦然。
  function pickLocalizedTitle(list, locale) {
    if (!locale) return null;
    const entries = (Array.isArray(list) ? list : []).filter((entry) => {
      if (!entry || !entry.title) return false;
      const language = String(entry.language || locale.language).toLowerCase();
      return language === locale.language;
    });

    const exact = locale.country
      ? entries.find((entry) => translationCountry(entry) === locale.country)
      : null;
    if (exact) return String(exact.title).trim() || null;

    const generic = entries.find((entry) => !translationCountry(entry));
    if (generic) return String(generic.title).trim() || null;

    if (locale.language === 'zh') {
      const traditionalFallbacks = locale.country === 'hk' ? ['tw'] : locale.country === 'tw' ? ['hk'] : [];
      const fallback = entries.find((entry) => traditionalFallbacks.includes(translationCountry(entry)));
      return fallback ? String(fallback.title).trim() || null : null;
    }

    return entries.length > 0 ? String(entries[0].title).trim() || null : null;
  }

  // content script 跑在页面环境（world: MAIN），直接请求 api.trakt.tv 会被 CORS 挡掉，
  // 所以交给隔离世界的 bridge.js，再转扩展后台（background.js）代发。
  // 注意：MAIN world 里拿不到 chrome.runtime，不能在这里直接调用它。
  // 没有可用后台时（例如油猴脚本）退化成直接 fetch，至少 app.trakt.tv 同源场景还能用。
  // undefined = 没有可用桥接，可由调用方尝试页面 fetch；
  // null = 桥接存在但请求失败；对象 = 后台成功返回。
  function requestTranslations(path, locale) {
    return new Promise((resolve) => {
      try {
        // 油猴脚本由 build-userscript.js 注入 __gmBridge，扩展则有 chrome.runtime
        if (typeof window.__gmBridge === 'function') {
          window.__gmBridge(
            {
              type: 'trakt-titles:fetch-translations',
              path,
              apiKey: capturedApiKey || DEFAULT_API_KEY,
              language: locale.language,
              country: locale.country,
            },
            (response) => resolve(response && response.ok ? response : null)
          );
          return;
        }

        // 扩展版：content.js 在 MAIN world，chrome.runtime 不可用。
        // 首轮扫描可能早于 bridge.js 注入，等桥就绪后再发请求；
        // 没有桥时返回 undefined，由调用方走页面 fetch 兜底。
        const sendBridgeRequest = () => {
          const requestId = `trakt-titles-${Date.now()}-${++bridgeRequestSequence}`;
          let settled = false;
          const finish = (response) => {
            if (settled) return;
            settled = true;
            window.removeEventListener('message', onMessage);
            clearTimeout(timer);
            resolve(response && response.ok ? response : null);
          };
          const onMessage = (event) => {
            if (!isPageMessage(event)) return;
            const message = event.data;
            if (!message || message.type !== BRIDGE_RESPONSE_TYPE || message.requestId !== requestId) return;
            finish(message.response);
          };
          const timer = setTimeout(() => finish(null), 12000);
          window.addEventListener('message', onMessage);
          window.postMessage({
            type: BRIDGE_REQUEST_TYPE,
            requestId,
            path,
            apiKey: capturedApiKey || DEFAULT_API_KEY,
            language: locale.language,
            country: locale.country,
          }, window.location.origin);
        };

        if (bridgeReady) {
          sendBridgeRequest();
          return;
        }
        if (bridgeFailed) {
          resolve(undefined);
          return;
        }
        bridgeWaiters.push((ready) => {
          if (ready) sendBridgeRequest();
          else resolve(undefined);
        });
        if (bridgeWaitTimer === null) {
          bridgeWaitTimer = setTimeout(() => {
            bridgeWaitTimer = null;
            bridgeFailed = true;
            const waiters = bridgeWaiters;
            bridgeWaiters = [];
            waiters.forEach((waiter) => waiter(false));
          }, 1000);
        }
      } catch (e) {
        resolve(undefined);
      }
    });
  }

  window.addEventListener('message', (event) => {
    if (isPageMessage(event) && event.data && event.data.type === BRIDGE_READY_TYPE) {
      bridgeReady = true;
      if (bridgeWaitTimer !== null) {
        clearTimeout(bridgeWaitTimer);
        bridgeWaitTimer = null;
      }
      const waiters = bridgeWaiters;
      bridgeWaiters = [];
      waiters.forEach((waiter) => waiter(true));
      clearUnresolvedTvTimeCache();
      schedule();
    }
  });
  window.postMessage({ type: BRIDGE_READY_REQUEST_TYPE }, window.location.origin);

  async function fetchTvTimeTranslations(path, locale) {
    const fromBackground = await requestTranslations(path, locale);
    // 后台成功响应即使没有匹配译名也会带 translations 数组；
    // null 表示桥接已存在但请求失败，不能再发一个必然被 CORS 拦截的页面请求。
    if (fromBackground !== null) {
      if (fromBackground === undefined) return fetchTvTimeTranslationsInPage(path, locale);
      return pickLocalizedTitle(fromBackground.translations, locale);
    }

    return null;
  }

  async function fetchTvTimeTranslationsInPage(path, locale) {
    try {
      const res = await (window.fetch || fetch)(`${TVTIME_API_ORIGIN}${path}`, {
        headers: {
          'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
          'trakt-api-version': API_VERSION,
          'accept': 'application/json',
        },
      });
      if (!res.ok) return null;
      return pickLocalizedTitle(await res.json(), locale);
    } catch (e) {
      return null;
    }
  }

  async function fetchMediaRowTitle(type, slug, locale) {
    const cacheKey = `${locale.key}|${type}:${slug}`;
    if (mediaRowTitleCache.has(cacheKey) || mediaRowResolving.has(cacheKey)) return;
    mediaRowResolving.add(cacheKey);

    try {
      const title = await fetchTvTimeTranslations(
        `/${type}s/${encodeURIComponent(slug)}/translations/${locale.language}`,
        locale
      );
      mediaRowTitleCache.set(cacheKey, title);
    } catch (e) {
      mediaRowTitleCache.set(cacheKey, null);
    } finally {
      mediaRowResolving.delete(cacheKey);
      schedule();
    }
  }

  async function fetchMediaRowEpisodeTitle(slug, season, number, locale) {
    const cacheKey = `${locale.key}|show:${slug}:${season}:${number}`;
    if (tvTimeEpisodeTitleCache.has(cacheKey) || tvTimeEpisodeResolving.has(cacheKey)) return;
    tvTimeEpisodeResolving.add(cacheKey);

    try {
      const title = await fetchTvTimeTranslations(
        `/shows/${encodeURIComponent(slug)}/seasons/${season}/episodes/${number}/translations/${locale.language}`,
        locale
      );
      tvTimeEpisodeTitleCache.set(cacheKey, title);
    } catch (e) {
      tvTimeEpisodeTitleCache.set(cacheKey, null);
    } finally {
      tvTimeEpisodeResolving.delete(cacheKey);
      schedule();
    }
  }

  function tvTimeOriginalTitle(titleElement, fallback) {
    return titleElement.dataset.traktTitlesOriginal
      || fallback
      || titleElement.getAttribute('aria-label')
      || titleElement.textContent.trim();
  }

  function sameTitle(left, right) {
    return String(left || '').trim().toLocaleLowerCase() === String(right || '').trim().toLocaleLowerCase();
  }

  function removeTvTimeOriginalLine(titleElement) {
    const body = titleElement.parentElement;
    const line = body && body.querySelector(
      `[data-trakt-titles-original-line], .${ORIGINAL_TITLE_CLASS}`
    );
    if (line) line.remove();
  }

  function removeDiscoverSpotlightLocalization(titleElement) {
    const body = titleElement && titleElement.parentElement;
    if (!body) return;
    const localizedNode = body.querySelector(`.${SPOTLIGHT_LOCALIZED_CLASS}`);
    if (localizedNode) localizedNode.remove();
    // 兼容旧版本直接改写 Svelte 文本时留下的状态，升级后首轮扫描会清掉。
    body.querySelectorAll('.trakt-helper-original-title').forEach((element) => element.remove());
    titleElement.classList.remove(DISCOVER_ORIGINAL_TITLE_CLASS);
    delete titleElement.dataset.traktTitlesOriginal;
  }

  function restoreOriginalTitle(titleElement, original) {
    if (!titleElement || !original) return;
    if (titleElement.textContent.trim() !== original) titleElement.textContent = original;
    removeTvTimeOriginalLine(titleElement);
  }

  // 把译名写进标题节点，英文原名缩成下面那行（只加一次，重复调用不叠行）。
  // 接口回落的标题如果就是原名，保持单行，不制造重复的副标题。
  function applyLocalizedTitle(titleElement, localizedTitle, options = {}) {
    if (!titleElement || !localizedTitle) return;
    const original = tvTimeOriginalTitle(titleElement, options.original);
    if (!original) return;
    if (!titleElement.dataset.traktTitlesOriginal) {
      titleElement.dataset.traktTitlesOriginal = original;
    }

    if (sameTitle(localizedTitle, original)) {
      restoreOriginalTitle(titleElement, original);
      return;
    }

    if (titleElement.textContent.trim() !== localizedTitle) {
      titleElement.textContent = localizedTitle;
    }

    const body = titleElement.parentElement;
    if (!body) return;
    let originalLine = body.querySelector('[data-trakt-titles-original-line]');
    if (!originalLine) {
      originalLine = document.createElement(options.tagName || 'p');
      originalLine.className = [
        ORIGINAL_TITLE_CLASS,
        options.lineClass || 'media-row-original',
      ].join(' ');
      originalLine.dataset.traktTitlesOriginalLine = '1';
      // 紧跟在标题下面，meta / 副标题都往后顺延
      titleElement.insertAdjacentElement('afterend', originalLine);
    }
    if (originalLine.textContent !== original) originalLine.textContent = original;
  }

  function applyLocalizedEpisodeTitle(subtitleLink, localizedTitle) {
    if (!subtitleLink || !localizedTitle) return;
    const original = tvTimeOriginalTitle(subtitleLink);
    if (!original) return;
    if (!subtitleLink.dataset.traktTitlesOriginal) subtitleLink.dataset.traktTitlesOriginal = original;

    if (sameTitle(localizedTitle, original)) {
      if (subtitleLink.textContent.trim() !== original) subtitleLink.textContent = original;
      return;
    }
    if (subtitleLink.textContent.trim() !== localizedTitle) subtitleLink.textContent = localizedTitle;
  }

  function applyCachedTvTimeTitle(titleElement, entry, locale, options) {
    const titleKey = `${locale.key}|${entry.type}:${entry.slug}`;
    if (mediaRowTitleCache.has(titleKey)) {
      const localizedTitle = mediaRowTitleCache.get(titleKey);
      if (localizedTitle) {
        applyLocalizedTitle(titleElement, localizedTitle, options);
      } else {
        restoreOriginalTitle(
          titleElement,
          tvTimeOriginalTitle(titleElement, options && options.original)
        );
      }
    } else {
      fetchMediaRowTitle(entry.type, entry.slug, locale);
    }
  }

  function scanMediaRow(row, locale) {
    const titleLink = row.querySelector('a.media-row-title');
    if (!titleLink) return;

    const entry = tvTimeEntryOf(titleLink);
    if (!entry) return;

    applyCachedTvTimeTitle(titleLink, entry, locale, { lineClass: 'media-row-original' });

    // 单集名（卡片上「S02 E02」下面那一行）。
    // 季集号要从 subtitle 链接自己的 href 里取——标题链接的 href 只到剧集层级
    // （/shows/:slug），拿它解析永远得不到 season/number。
    const subtitleLink = row.querySelector('a.media-row-subtitle');
    const episodeEntry = subtitleLink ? tvTimeEntryOf(subtitleLink) : null;
    if (subtitleLink && episodeEntry && episodeEntry.season != null && episodeEntry.number != null) {
      const episodeKey = `${locale.key}|show:${entry.slug}:${episodeEntry.season}:${episodeEntry.number}`;
      if (tvTimeEpisodeTitleCache.has(episodeKey)) {
        const localizedEpisode = tvTimeEpisodeTitleCache.get(episodeKey);
        if (localizedEpisode) {
          applyLocalizedEpisodeTitle(subtitleLink, localizedEpisode);
        } else {
          const originalEpisode = tvTimeOriginalTitle(subtitleLink);
          if (subtitleLink.textContent.trim() !== originalEpisode) {
            subtitleLink.textContent = originalEpisode;
          }
        }
      } else {
        fetchMediaRowEpisodeTitle(entry.slug, episodeEntry.season, episodeEntry.number, locale);
      }
    }
  }

  // Popular / Discover / 详情页「更多类似」都复用 .poster-card。
  // 海报链接的 aria-label 是新站渲染时保留的英文原名，正好作为第二行。
  function scanPosterCard(card, locale) {
    const titleElement = card.querySelector('.poster-title');
    if (!titleElement) return;

    const mediaLink = card.querySelector('a[href^="/shows/"], a[href^="/movies/"]');
    const entry = mediaLink ? tvTimeEntryOf(mediaLink) : null;
    if (!entry) return;

    applyCachedTvTimeTitle(titleElement, entry, locale, {
      original: mediaLink.getAttribute('aria-label') || '',
      lineClass: 'poster-card-original',
    });
  }

  // Discover 顶部焦点位会被 Svelte 复用：切换作品时同一个 <a> 只更新 href 和文本。
  // 因此不能改写这个链接的文本（会把 Svelte 下一次渲染覆盖掉，留下上一部作品的标题），
  // 而是在它前面插入独立译名节点，原链接只作为英文副标题显示。
  function applyDiscoverSpotlightTitle(titleElement, localizedTitle) {
    const body = titleElement.parentElement;
    if (!body) return;

    let localizedNode = body.querySelector(`.${SPOTLIGHT_LOCALIZED_CLASS}`);
    if (!localizedTitle || sameTitle(localizedTitle, titleElement.textContent)) {
      removeDiscoverSpotlightLocalization(titleElement);
      return;
    }

    if (!localizedNode) {
      localizedNode = document.createElement('span');
      localizedNode.className = [
        'discover-spotlight-title',
        SPOTLIGHT_LOCALIZED_CLASS,
      ].join(' ');
    }
    if (localizedNode.textContent !== localizedTitle) localizedNode.textContent = localizedTitle;
    titleElement.classList.add(DISCOVER_ORIGINAL_TITLE_CLASS);
    if (localizedNode.nextElementSibling !== titleElement) {
      titleElement.insertAdjacentElement('beforebegin', localizedNode);
    }
  }

  function applyCachedDiscoverSpotlightTitle(titleElement, entry, locale) {
    const titleKey = `${locale.key}|${entry.type}:${entry.slug}`;
    if (mediaRowTitleCache.has(titleKey)) {
      applyDiscoverSpotlightTitle(titleElement, mediaRowTitleCache.get(titleKey));
    } else {
      // 媒体身份变化后先撤掉上一部的译名，等新译名回来再插入。
      removeDiscoverSpotlightLocalization(titleElement);
      fetchMediaRowTitle(entry.type, entry.slug, locale);
    }
  }

  function scanDiscoverSpotlight(titleElement, locale) {
    const entry = tvTimeEntryOf(titleElement);
    if (!entry) {
      removeDiscoverSpotlightLocalization(titleElement);
      return;
    }

    applyCachedDiscoverSpotlightTitle(titleElement, entry, locale);
  }

  function scanTvTime() {
    const locale = getTvTimeLocale();
    if (!locale) return;
    document.querySelectorAll(MEDIA_ROW_SELECTOR).forEach((row) => scanMediaRow(row, locale));
    document.querySelectorAll(POSTER_CARD_SELECTOR).forEach((card) => scanPosterCard(card, locale));
    document.querySelectorAll(SPOTLIGHT_TITLE_SELECTOR).forEach(
      (title) => scanDiscoverSpotlight(title, locale)
    );
  }

  // ---------------------------------------------------------------------------
  // og.trakt.tv（OG Redux：用经典 Trakt 界面重做的网站）的标题 / 简介本地化
  //
  // 这个站是 trakt-web 的 fork，界面和接口数据都是英文，标题有两种渲染方式：
  //   1. 纯文本：`h1`（详情页）、`h3 > a.titles-link`（卡片）、`h2.name > a`（焦点位）
  //   2. logo 图：`img.trimmed-logo[alt]`，放在 `h3.title-logo` / `h2.name` 里
  // logo 是英文美术字，没法「翻译」，所以有中文名时把它隐藏、换成中文文本；
  // 详情页和焦点位再补一行英文原名，卡片则把原名放进 tooltip（不挤占卡片高度）。
  //
  // 简介都在 `.overview` 里（详情页 `.summary-frame .details > .overview`，
  // 榜单/Discover 焦点位 `p.overview`），宣传语是 `.tagline`。
  //
  // 译名/简介仍然只走公开接口：
  //   /shows|movies/{slug}/translations/zh
  //   /shows/{slug}/seasons/{s}/translations/zh
  //   /shows/{slug}/seasons/{s}/episodes/{e}/translations/zh
  // 只取 country=cn 的简体条目，没有简体就不拿繁体补位。
  // ---------------------------------------------------------------------------
  const OG_HOST = 'og.trakt.tv';
  const OG_CACHE_STORAGE_KEY = 'trakt_og_zh_cache';
  const OG_LOCALE = { language: 'zh', country: 'cn', key: 'zh:cn' };
  const OG_TITLE_CLASS = 'trakt-helper-og-title';
  const OG_ORIGINAL_CLASS = 'trakt-helper-og-original';
  const OG_LOGO_HIDDEN_CLASS = 'trakt-helper-og-logo-hidden';
  // 榜单页面的 /shows/<x> 是列表路由，不是媒体详情。
  const OG_CHART_SLUGS = new Set([
    'trending',
    'popular',
    'anticipated',
    'recommended',
    'favorited',
    'watched',
    'played',
    'collected',
    'boxoffice',
  ]);

  // `${type}:${slug}` -> { title, overview, tagline } | null
  const ogMediaCache = new Map();
  // `${slug}:${season}` -> { title, overview } | null
  const ogSeasonCache = new Map();
  // `${slug}:${season}:${episode}` -> { title, overview } | null
  const ogEpisodeCache = new Map();
  const ogResolving = new Set();
  let ogSaveTimer = null;
  // 一页榜单可能有四五十张卡片。限到 6 个并发，避免一次性打出一串请求被 CDN 限流。
  const OG_MAX_CONCURRENT_REQUESTS = 6;
  const ogRequestQueue = [];
  let ogActiveRequests = 0;

  function isOgRedux() {
    return window.location.hostname === OG_HOST;
  }

  function loadOgCache() {
    if (!isOgRedux()) return;
    try {
      const raw = sessionStorage.getItem(OG_CACHE_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const restore = (map, source) => {
        if (!source || typeof source !== 'object') return;
        for (const [key, value] of Object.entries(source)) map.set(key, value);
      };
      restore(ogMediaCache, data && data.media);
      restore(ogSeasonCache, data && data.season);
      restore(ogEpisodeCache, data && data.episode);
    } catch (e) { }
  }

  function scheduleOgCacheSave() {
    if (ogSaveTimer !== null) return;
    ogSaveTimer = setTimeout(() => {
      ogSaveTimer = null;
      try {
        const dump = (map) => {
          const out = {};
          map.forEach((value, key) => { out[key] = value; });
          return out;
        };
        sessionStorage.setItem(OG_CACHE_STORAGE_KEY, JSON.stringify({
          media: dump(ogMediaCache),
          season: dump(ogSeasonCache),
          episode: dump(ogEpisodeCache),
        }));
      } catch (e) { }
    }, 250);
  }

  async function requestOgTranslations(path) {
    const fromBackground = await requestTranslations(path, OG_LOCALE);
    // null = 桥接在但请求失败；undefined = 没有桥接（油猴已注入 __gmBridge 的情况下不会出现）。
    if (fromBackground === null) return null;
    if (fromBackground === undefined) return requestOgTranslationsInPage(path);
    return Array.isArray(fromBackground.translations) ? fromBackground.translations : [];
  }

  // 所有标题/简介请求都从这里排队，缓存命中时根本不会走到这里。
  function queueOgTranslations(path) {
    return new Promise((resolve) => {
      ogRequestQueue.push({ path, resolve });
      drainOgRequestQueue();
    });
  }

  function drainOgRequestQueue() {
    while (ogActiveRequests < OG_MAX_CONCURRENT_REQUESTS && ogRequestQueue.length > 0) {
      const job = ogRequestQueue.shift();
      ogActiveRequests += 1;
      requestOgTranslations(job.path)
        .then((list) => job.resolve(list))
        .catch(() => job.resolve(null))
        .finally(() => {
          ogActiveRequests -= 1;
          drainOgRequestQueue();
        });
    }
  }

  async function requestOgTranslationsInPage(path) {
    try {
      const res = await (window.fetch || fetch)(`${TVTIME_API_ORIGIN}${path}`, {
        headers: {
          'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
          'trakt-api-version': API_VERSION,
          'accept': 'application/json',
        },
      });
      if (!res.ok) return null;
      const list = await res.json();
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return null;
    }
  }

  // OG 站是英文界面，固定要简体中文：精确地区 cn → 无地区通用条目，
  // 绝不拿 tw/hk 的繁体补位（与 tvtime 的规则一致）。
  function pickOgTranslation(list) {
    const entries = (Array.isArray(list) ? list : []).filter(
      (entry) => entry && (entry.title || entry.overview || entry.tagline)
    );
    const exact = entries.find(
      (entry) => String(entry.country || '').toLowerCase() === 'cn'
    );
    const chosen = exact || entries.find((entry) => !entry.country) || null;
    if (!chosen) return null;
    return {
      title: chosen.title ? String(chosen.title).trim() : '',
      overview: chosen.overview ? String(chosen.overview).trim() : '',
      tagline: chosen.tagline ? String(chosen.tagline).trim() : '',
    };
  }

  function ensureOgMedia(type, slug) {
    const key = `${type}:${slug}`;
    if (ogMediaCache.has(key)) return ogMediaCache.get(key);
    if (ogResolving.has(key)) return undefined;
    ogResolving.add(key);

    queueOgTranslations(`/${type}s/${encodeURIComponent(slug)}/translations/zh`)
      .then((list) => (list ? pickOgTranslation(list) : null))
      .catch(() => null)
      .then((value) => {
        ogMediaCache.set(key, value);
        ogResolving.delete(key);
        scheduleOgCacheSave();
        schedule();
      });
    return undefined;
  }

  function ensureOgSeason(slug, season) {
    const key = `${slug}:${season}`;
    if (ogSeasonCache.has(key)) return ogSeasonCache.get(key);
    if (ogResolving.has(key)) return undefined;
    ogResolving.add(key);

    queueOgTranslations(
      `/shows/${encodeURIComponent(slug)}/seasons/${season}/translations/zh`
    )
      .then((list) => (list ? pickOgTranslation(list) : null))
      .catch(() => null)
      .then((value) => {
        ogSeasonCache.set(key, value);
        ogResolving.delete(key);
        scheduleOgCacheSave();
        schedule();
      });
    return undefined;
  }

  function ensureOgEpisode(slug, season, number) {
    const key = `${slug}:${season}:${number}`;
    if (ogEpisodeCache.has(key)) return ogEpisodeCache.get(key);
    if (ogResolving.has(key)) return undefined;
    ogResolving.add(key);

    queueOgTranslations(
      `/shows/${encodeURIComponent(slug)}/seasons/${season}/episodes/${number}/translations/zh`
    )
      .then((list) => (list ? pickOgTranslation(list) : null))
      .catch(() => null)
      .then((value) => {
        ogEpisodeCache.set(key, value);
        ogResolving.delete(key);
        scheduleOgCacheSave();
        schedule();
      });
    return undefined;
  }

  // 从链接里解析媒体（电影/剧）或单集；OG 站的链接都是站内相对路径。
  function ogEntryFromHref(href) {
    const match = String(href || '').match(
      /^\/(shows|movies)\/([^/?#]+)(?:\/seasons\/(\d+)\/episodes\/(\d+))?/
    );
    if (!match) return null;
    const slug = decodeURIComponent(match[2]);
    if (OG_CHART_SLUGS.has(slug)) return null;
    // 只有季（没有集）的链接是季海报，标题是界面文案，不当作媒体标题。
    if (match[3] && !match[4]) return null;
    return {
      type: match[1] === 'movies' ? 'movie' : 'show',
      slug,
      season: match[3] ? parseInt(match[3], 10) : null,
      number: match[4] ? parseInt(match[4], 10) : null,
    };
  }

  // 当前页面是不是媒体详情页（剧/电影/季/集）。榜单和统计页没有详情标题。
  function ogDetailRoute() {
    if (!document.querySelector('.summary-title h1, .episode-title h1')) return null;
    const path = window.location.pathname;
    const match = path.match(
      /^\/(shows|movies)\/([^/]+)(?:\/seasons\/(\d+)(?:\/episodes\/(\d+))?)?\/?$/
    );
    if (!match) return null;
    const slug = decodeURIComponent(match[2]);
    if (OG_CHART_SLUGS.has(slug)) return null;
    return {
      type: match[1] === 'movies' ? 'movie' : 'show',
      slug,
      season: match[3] ? parseInt(match[3], 10) : null,
      episode: match[4] ? parseInt(match[4], 10) : null,
    };
  }

  function ogDirectTextNode(element) {
    if (!element) return null;
    return [...element.childNodes].find(
      (node) => node.nodeType === 3 && node.nodeValue.trim()
    ) || null;
  }

  // 保留原文两端的空白，避免把 `MobLand ` 和 year span 之间的间隔吃掉。
  function replaceNodeText(node, value) {
    const current = node.nodeValue || '';
    const leading = (current.match(/^\s*/) || [''])[0];
    const trailing = (current.match(/\s*$/) || [''])[0];
    const next = `${leading}${value}${trailing}`;
    if (current !== next) node.nodeValue = next;
  }

  // 找到真正承载标题文字的元素：h1 自己；带年份的 h3 里则是 `a`；
  // 单集行 h3 里要跳过写着「1x01」的编号链接。
  function ogTitleTextElement(host) {
    if (ogDirectTextNode(host)) return host;
    const anchors = [...host.querySelectorAll('a[href]')];
    return anchors.find((anchor) => {
      // 集号链接有两种写法：`<a><span class="number">1x01</span></a>`
      // 和 `<a class="number">1x01&nbsp;</a>`，都不能当作标题本体。
      if (anchor.classList.contains('number') || anchor.querySelector('.number')) return false;
      // logo 标题和我们已经插入的译名节点都不是「文本标题」，
      // 否则第二轮扫描会把 span / img 一起 textContent 覆盖掉。
      if (anchor.querySelector(`img.trimmed-logo, .${OG_TITLE_CLASS}`)) return false;
      return !!anchor.textContent.trim();
    }) || null;
  }

  function removeOgOriginalLine(host) {
    const next = host.nextElementSibling;
    if (next && next.classList && next.classList.contains(OG_ORIGINAL_CLASS)) next.remove();
  }

  function syncOgOriginalLine(host, original) {
    const parent = host.parentElement;
    if (!parent) return;
    let line = host.nextElementSibling;
    if (!line || !line.classList || !line.classList.contains(OG_ORIGINAL_CLASS)) {
      line = document.createElement('p');
      line.className = OG_ORIGINAL_CLASS;
      host.insertAdjacentElement('afterend', line);
    }
    if (line.textContent !== original) line.textContent = original;
  }

  // 有些卡片把「集号 + 集名」写在同一个文本节点里（Dashboard Up Next 就是 "3x03 集名"），
  // 替换文本时必须把集号原样保留，否则界面上只剩中文集名。
  function ogEpisodeNumberPrefix(text) {
    const match = String(text || '').match(
      /^\s*(S\d+\s*E\d+|Special\s+\d+|\d+x\d+(?:\s*\(\d+\))?)\s+/i
    );
    return match ? match[1] : '';
  }

  function ogTitleNodeText(key, current, localizedTitle) {
    if (key.indexOf('episode:') !== 0) return localizedTitle;
    const prefix = ogEpisodeNumberPrefix(current);
    return prefix ? `${prefix} ${localizedTitle}` : localizedTitle;
  }

  // 把译名写进标题（文本或 logo 两种形态都支持）。
  // 没有译名 / 译名与原名相同时恢复英文，并清掉我们插入的节点。
  function ogApplyTitle(host, key, translation, options = {}) {
    if (!host) return;

    if (host.dataset.traktOgKey !== key) {
      host.dataset.traktOgKey = key;
      delete host.dataset.traktOgOriginal;
      host.querySelectorAll(`.${OG_TITLE_CLASS}`).forEach((node) => node.remove());
      host.querySelectorAll(`img.${OG_LOGO_HIDDEN_CLASS}`).forEach((image) => {
        image.classList.remove(OG_LOGO_HIDDEN_CLASS);
      });
      removeOgOriginalLine(host);
      if (host.dataset.traktOgTooltip === '1') {
        host.removeAttribute('title');
        delete host.dataset.traktOgTooltip;
      }
    }

    const logo = host.querySelector('img.trimmed-logo');
    const textElement = ogTitleTextElement(host);
    const textNode = textElement ? ogDirectTextNode(textElement) : null;
    // 标题文字只取那一个文本节点：h1 后面还挂着年份 / 分级节点，
    // 用 textContent 会把「1999 R」也当成原名。
    const visibleTitle = textNode
      ? textNode.nodeValue.trim()
      : (logo ? (logo.alt || '').trim() : host.textContent.trim());

    const localizedTitle = translation && translation.title ? translation.title.trim() : '';
    // 焦点位轮播会复用同一个节点：标题文本变成另一条内容时，同步刷新英文原名，
    // 否则原名行会停在上一条作品上。
    let original = host.dataset.traktOgOriginal || '';
    const candidate = options.original || visibleTitle;
    if (candidate && !ZH_REGEX.test(candidate) && !sameTitle(candidate, localizedTitle)
      && (!original || !sameTitle(candidate, original))) {
      original = candidate;
      host.dataset.traktOgOriginal = candidate;
    }
    if (!localizedTitle || (original && sameTitle(localizedTitle, original))) {
      if (textElement) {
        const node = ogDirectTextNode(textElement);
        if (node && original && node.nodeValue.trim() !== original) {
          replaceNodeText(node, original);
        }
      }
      if (logo) logo.classList.remove(OG_LOGO_HIDDEN_CLASS);
      host.querySelectorAll(`.${OG_TITLE_CLASS}`).forEach((node) => node.remove());
      removeOgOriginalLine(host);
      if (options.tooltip && host.dataset.traktOgTooltip === '1') {
        host.removeAttribute('title');
        delete host.dataset.traktOgTooltip;
      }
      return;
    }

    if (textElement) {
      const node = ogDirectTextNode(textElement);
      if (node) {
        replaceNodeText(node, ogTitleNodeText(key, node.nodeValue, localizedTitle));
      } else if (!textElement.children.length) {
        textElement.textContent = localizedTitle;
      }
      if (logo) logo.classList.remove(OG_LOGO_HIDDEN_CLASS);
    } else if (logo) {
      logo.classList.add(OG_LOGO_HIDDEN_CLASS);
      let span = host.querySelector(`.${OG_TITLE_CLASS}`);
      if (!span) {
        span = document.createElement('span');
        span.className = OG_TITLE_CLASS;
        (host.querySelector('a') || host).appendChild(span);
      }
      if (span.textContent !== localizedTitle) span.textContent = localizedTitle;
    } else {
      return;
    }

    if (options.bilingual && original) syncOgOriginalLine(host, original);
    else removeOgOriginalLine(host);

    if (options.tooltip) {
      const label = original ? `${localizedTitle} (${original})` : localizedTitle;
      if (host.getAttribute('title') !== label) host.title = label;
      host.dataset.traktOgTooltip = '1';
    }
  }

  // 简介可能是 `.overview` 直接包含文本，也可能再包一层 `.read-more`，
  // 找到真正持有那一个文本节点的元素再改写，Svelte 的注释锚点保持不动。
  function ogOverviewTextHost(element) {
    if (!element) return null;
    const directText = (host) => [...host.childNodes].filter(
      (node) => node.nodeType === 3 && node.nodeValue.trim()
    );
    if (directText(element).length === 1) return element;
    const descendants = [...element.querySelectorAll('div, span, p')];
    return descendants.find((host) => directText(host).length === 1) || null;
  }

  function ogApplyOverview(element, localizedText) {
    const host = ogOverviewTextHost(element);
    if (!host) return;
    const node = [...host.childNodes].find(
      (child) => child.nodeType === 3 && child.nodeValue.trim()
    );
    if (!node) return;
    const current = node.nodeValue.trim();

    let original = host.dataset.traktOgOriginalOverview || '';
    // 页面被复用成另一条内容（例如 Discover 轮播切片）时，用当前的英文文本刷新底稿。
    if (current && current !== original && !ZH_REGEX.test(current)) {
      original = current;
      host.dataset.traktOgOriginalOverview = current;
    }

    const localized = localizedText ? String(localizedText).trim() : '';
    if (localized && !sameTitle(localized, original)) {
      if (current !== localized) node.nodeValue = localized;
      return;
    }
    if (original && current !== original) node.nodeValue = original;
  }

  function scanOgDetail(route) {
    const titleElement = document.querySelector('.summary-title h1, .episode-title h1');
    const overviewElement = document.querySelector('.summary-frame .details > .overview');
    const taglineElement = document.querySelector('.summary-frame .details > .tagline');

    if (route.episode) {
      const data = ensureOgEpisode(route.slug, route.season, route.episode);
      if (data === undefined) return;
      ogApplyTitle(
        titleElement,
        `episode:${route.slug}:${route.season}:${route.episode}`,
        data,
        { bilingual: true }
      );
      ogApplyOverview(overviewElement, data && data.overview);
      return;
    }

    if (route.season) {
      // 季页标题是界面文案「Season 1」，不替换；翻译它的简介和分集标题。
      const data = ensureOgSeason(route.slug, route.season);
      if (data === undefined) return;
      ogApplyOverview(overviewElement, data && data.overview);
      return;
    }

    const data = ensureOgMedia(route.type, route.slug);
    if (data === undefined) return;
    ogApplyTitle(
      titleElement,
      `${route.type}:${route.slug}`,
      data,
      { bilingual: true }
    );
    ogApplyOverview(overviewElement, data && data.overview);
    ogApplyOverview(taglineElement, data && data.tagline);
  }

  // 榜单页 / Discover 顶部的大焦点位：`section.chart-hero`、`section.hero`。
  function scanOgHeroes() {
    document.querySelectorAll('section.chart-hero, section.hero').forEach((section) => {
      const name = section.querySelector('h2.name');
      if (!name) return;
      const link = name.querySelector('a[href]')
        || section.querySelector('a[href^="/shows/"], a[href^="/movies/"]');
      const entry = link ? ogEntryFromHref(link.getAttribute('href')) : null;
      if (!entry) return;

      const data = ensureOgMedia(entry.type, entry.slug);
      if (data === undefined) return;

      ogApplyTitle(name, `${entry.type}:${entry.slug}`, data, { bilingual: true });
      ogApplyOverview(section.querySelector('p.overview'), data && data.overview);
    });
  }

  // 卡片标题。OG 站至少有三种排版：
  //   1. `h3` 里包着详情链接：横幅卡、搜索结果、Dashboard spotlight
  //   2. `a.titles-link` 里包着 h3：Discover 竖版海报卡、首页海报架
  //   3. `img.trimmed-logo`：英文 logo，前面两种都可能出现
  // 一律不碰弹窗、评论区、导航里的小标题。
  const OG_CARD_EXCLUDED = 'dialog, [role="dialog"], .comments, .comment, header, nav, footer';

  function ogApplyCardTitle(title, entry) {
    const isEpisode = entry.season != null && entry.number != null;
    const data = isEpisode
      ? ensureOgEpisode(entry.slug, entry.season, entry.number)
      : ensureOgMedia(entry.type, entry.slug);
    if (data === undefined) return;

    const key = isEpisode
      ? `episode:${entry.slug}:${entry.season}:${entry.number}`
      : `${entry.type}:${entry.slug}`;
    ogApplyTitle(title, key, data, { tooltip: true });
  }

  function scanOgCards() {
    document.querySelectorAll('h3').forEach((title) => {
      if (title.id && title.id.startsWith('episode-')) return;
      if (title.closest(OG_CARD_EXCLUDED)) return;
      const link = title.querySelector('a[href^="/shows/"], a[href^="/movies/"]');
      const entry = link ? ogEntryFromHref(link.getAttribute('href')) : null;
      if (!entry) return;
      ogApplyCardTitle(title, entry);
    });

    document.querySelectorAll('article.poster-card a.titles-link').forEach((anchor) => {
      const entry = ogEntryFromHref(anchor.getAttribute('href'));
      if (!entry) return;
      const title = anchor.querySelector('h3');
      if (!title) return;
      ogApplyCardTitle(title, entry);
    });

    // Dashboard 的 spotlight 卡片带一段简介，和标题分开处理。
    document.querySelectorAll('article.spotlight').forEach((card) => {
      const link = card.querySelector('h3 a[href^="/shows/"], h3 a[href^="/movies/"]');
      const entry = link ? ogEntryFromHref(link.getAttribute('href')) : null;
      if (!entry) return;
      const data = ensureOgMedia(entry.type, entry.slug);
      if (data === undefined) return;
      ogApplyOverview(card.querySelector('.overview'), data && data.overview);
    });
  }

  // 季详情页的分集列表行：`h3#episode-<id>` 里的标题链接 + 同一行的简介。
  function scanOgEpisodeRows() {
    document.querySelectorAll('h3[id^="episode-"]').forEach((title) => {
      const link = ogTitleTextElement(title);
      const entry = link ? ogEntryFromHref(link.getAttribute('href')) : null;
      if (!entry || entry.season == null || entry.number == null) return;

      const data = ensureOgEpisode(entry.slug, entry.season, entry.number);
      if (data === undefined) return;

      ogApplyTitle(
        title,
        `episode:${entry.slug}:${entry.season}:${entry.number}`,
        data,
        { tooltip: true }
      );

      const row = title.closest('article.row, article');
      if (row) ogApplyOverview(row.querySelector('.overview'), data && data.overview);
    });
  }

  // 有些标题不在 h3 里：Dashboard 的 Upcoming Schedule 用 `a.show`（周视图）
  // 和 `.schedule h4 > a`（焦点卡片），日程里的单集名则是 `.episodes` 下的链接，
  // 结构是 `<a href><b>3x04</b> 集名</a>`，只能改文本节点、保留 <b> 集号。
  // 日历卡片的剧名小字也用 `a.show`，一并处理。
  function scanOgInlineTitles() {
    document.querySelectorAll('a.show, a.show-link').forEach((anchor) => {
      const entry = ogEntryFromHref(anchor.getAttribute('href'));
      if (!entry || entry.season != null) return;
      const data = ensureOgMedia(entry.type, entry.slug);
      if (data === undefined) return;
      ogApplyTitle(anchor, `${entry.type}:${entry.slug}`, data, { tooltip: true });
    });

    document.querySelectorAll('.schedule h4 a[href]').forEach((anchor) => {
      const entry = ogEntryFromHref(anchor.getAttribute('href'));
      if (!entry || entry.season != null) return;
      const data = ensureOgMedia(entry.type, entry.slug);
      if (data === undefined) return;
      ogApplyTitle(anchor, `${entry.type}:${entry.slug}`, data, { tooltip: true });
    });

    document.querySelectorAll('.schedule .episodes a[href*="/episodes/"]').forEach((anchor) => {
      const entry = ogEntryFromHref(anchor.getAttribute('href'));
      if (!entry || entry.season == null || entry.number == null) return;
      const data = ensureOgEpisode(entry.slug, entry.season, entry.number);
      if (data === undefined) return;
      ogApplyTitle(
        anchor,
        `episode:${entry.slug}:${entry.season}:${entry.number}`,
        data,
        { tooltip: true }
      );
    });

    // 电影日程没有单集名，下面那行是电影自己的 tagline，也一并翻译。
    document.querySelectorAll('.schedule .episodes .tagline').forEach((line) => {
      const scope = line.closest('article.card, li.row');
      const link = scope && scope.querySelector(
        'h4 a[href^="/shows/"], h4 a[href^="/movies/"], a.show[href^="/shows/"], a.show[href^="/movies/"]'
      );
      const entry = link ? ogEntryFromHref(link.getAttribute('href')) : null;
      if (!entry || entry.season != null) return;
      const data = ensureOgMedia(entry.type, entry.slug);
      if (data === undefined) return;
      ogApplyOverview(line, data && data.tagline);
    });
  }

  function scanOg() {
    // 清理脱离标题的旧原名行（Svelte 重渲染时可能留下孤儿节点）。
    document.querySelectorAll(`.${OG_ORIGINAL_CLASS}`).forEach((line) => {
      const previous = line.previousElementSibling;
      if (!previous || !previous.dataset || !previous.dataset.traktOgKey) line.remove();
    });

    const route = ogDetailRoute();
    if (route) scanOgDetail(route);
    scanOgHeroes();
    scanOgInlineTitles();
    scanOgCards();
    scanOgEpisodeRows();
  }

  function isSmartListPage() {
    return window.location.pathname.startsWith('/lists/smart');
  }

  function isSearchPage() {
    return window.location.pathname.startsWith('/search');
  }

  function isDiscoverPage() {
    return window.location.pathname.startsWith('/discover');
  }

  // Load persistent cache from sessionStorage
  function loadStoredCache() {
    try {
      const storedMedia = sessionStorage.getItem('trakt_media_info_cache');
      if (storedMedia) {
        const obj = JSON.parse(storedMedia);
        for (const [k, v] of Object.entries(obj)) {
          mediaInfoCache.set(k, v);
        }
      }
      const storedIntl = sessionStorage.getItem('trakt_intl_zh_cache');
      if (storedIntl) {
        const obj = JSON.parse(storedIntl);
        for (const [k, v] of Object.entries(obj)) {
          translationCache.set(k, v);
        }
      }
    } catch (e) { }
  }

  function saveStoredCache() {
    try {
      if (mediaInfoCache.size > 0) {
        const mediaObj = {};
        mediaInfoCache.forEach((v, k) => { mediaObj[k] = v; });
        sessionStorage.setItem('trakt_media_info_cache', JSON.stringify(mediaObj));
      }
      if (translationCache.size > 0) {
        const intlObj = {};
        translationCache.forEach((v, k) => { intlObj[k] = v; });
        sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify(intlObj));
      }
    } catch (e) { }
  }

  function getAuthToken() {
    if (capturedAuthToken) return capturedAuthToken;
    const storages = [];
    try { if (window.localStorage) storages.push(window.localStorage); } catch (e) { }
    try { if (window.sessionStorage) storages.push(window.sessionStorage); } catch (e) { }

    for (const storage of storages) {
      try {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (!key) continue;
          if (key.startsWith('oidc.user:') || key.includes('token') || key.includes('auth')) {
            try {
              const val = JSON.parse(storage.getItem(key) || '{}');
              if (val && typeof val === 'object') {
                const token = val.access_token || val.token || val.value;
                if (token && typeof token === 'string' && token.length > 10) {
                  return token;
                }
              }
            } catch (e) {
              const raw = storage.getItem(key);
              if (raw && typeof raw === 'string' && /^[a-zA-Z0-9_-]{20,}$/.test(raw)) {
                return raw;
              }
            }
          }
        }
      } catch (e) { }
    }
    return null;
  }

  function recordMedia(type, slug, id, title) {
    if (!type || !slug || !id) return;
    const normType = type.startsWith('movie') ? 'movie' : 'show';
    const normId = parseInt(id, 10);
    if (isNaN(normId)) return;

    const key = `${normType}:${slug}`;
    if (!mediaInfoCache.has(key)) {
      mediaInfoCache.set(key, { type: normType, slug, id: normId, title: title || '' });
      saveStoredCache();
    }
  }

  function extractMediaFromPayload(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (!item || typeof item !== 'object') continue;
        if (item.movie && item.movie.ids) {
          recordMedia('movie', item.movie.ids.slug, item.movie.ids.trakt, item.movie.title);
        }
        if (item.show && item.show.ids) {
          recordMedia('show', item.show.ids.slug, item.show.ids.trakt, item.show.title);
        }
        if (item.ids && item.ids.slug && item.ids.trakt) {
          recordMedia(item.type || (item.seasons ? 'show' : 'movie'), item.ids.slug, item.ids.trakt, item.title);
        }
      }
      return;
    }
    if (obj.hits && Array.isArray(obj.hits)) {
      for (const hit of obj.hits) {
        const doc = hit.document || hit;
        if (doc && doc.id && doc.slug) {
          const type = doc.type || (doc.seasons ? 'show' : 'movie');
          recordMedia(type, doc.slug, parseInt(doc.id, 10), doc.title);
        }
      }
    }
    if (obj.results && Array.isArray(obj.results)) {
      for (const res of obj.results) {
        extractMediaFromPayload(res);
      }
    }
  }

  // 网页端自己也会请求 /v3/intl/bulk 做「中文名覆盖」。它拿回来的正是官方译名，
  // 直接收进缓存，我们就不用为同一批 id 再打一次接口。
  // 只收简体的官方结果：非 zh 语言、或非 CN 地区的响应一律不写进缓存。
  function captureBulkIntlResponse(url, data) {
    if (!data || typeof data !== 'object') return;

    try {
      const query = String(url).split('?')[1];
      if (query) {
        const params = new URLSearchParams(query);
        const language = String(params.get('language') || '').toLowerCase();
        const country = String(params.get('country') || '').toUpperCase();
        if (!language.startsWith('zh') || country !== INTL_COUNTRY) return;
      }
    } catch (e) { }

    let changed = false;
    for (const type of ['movie', 'show']) {
      const bucket = data[type];
      if (!bucket || typeof bucket !== 'object') continue;
      for (const [rawId, value] of Object.entries(bucket)) {
        const id = parseInt(rawId, 10);
        const title = value && typeof value.title === 'string' ? value.title.trim() : '';
        // 地区拿不到中文时接口会回落成英文原名，这种不能当成「已翻译」。
        if (!Number.isFinite(id) || !title || !ZH_REGEX.test(title)) continue;
        const key = `${type}:${id}`;
        if (translationCache.get(key) === title) continue;
        translationCache.set(key, title);
        changed = true;
      }
    }
    if (changed) saveStoredCache();
  }

  function interceptFetch() {
    const origFetch = window.fetch;
    if (!origFetch || origFetch.__traktTitlesHooked) return;

    const hookedFetch = async function (...args) {
      try {
        const [resource, config] = args;
        const headers = config?.headers;
        if (headers) {
          let auth = null;
          let key = null;
          if (typeof headers.get === 'function') {
            auth = headers.get('authorization') || headers.get('Authorization');
            key = headers.get('trakt-api-key') || headers.get('Trakt-Api-Key');
          } else if (typeof headers === 'object') {
            auth = headers['authorization'] || headers['Authorization'];
            key = headers['trakt-api-key'] || headers['Trakt-Api-Key'];
          }
          if (auth && typeof auth === 'string') {
            const m = auth.match(/^Bearer\s+(.+)$/i);
            if (m) capturedAuthToken = m[1];
          }
          if (key) capturedApiKey = key;
        }
      } catch (e) { }

      const response = await origFetch.apply(this, args);

      try {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        if (url && (url.includes('trakt.tv') || url.includes('/api/') || url.includes('multi_search'))) {
          response.clone().json().then((data) => {
            extractMediaFromPayload(data);
            if (url.includes('/intl/bulk')) captureBulkIntlResponse(url, data);
            schedule();
          }).catch(() => { });
        }
      } catch (e) { }

      return response;
    };

    hookedFetch.__traktTitlesHooked = true;
    window.fetch = hookedFetch;
  }

  async function resolveSlug(type, slug) {
    const key = `${type}:${slug}`;
    if (mediaInfoCache.has(key) || resolvingSlugs.has(key)) return;
    resolvingSlugs.add(key);

    try {
      const token = getAuthToken();
      const headers = {
        'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
        'trakt-api-version': API_VERSION,
        'accept': 'application/json'
      };
      if (token) headers['authorization'] = `Bearer ${token}`;

      const res = await (window.fetch || fetch)(`https://api.trakt.tv/${type}s/${slug}?extended=min`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.ids && data.ids.trakt) {
          recordMedia(type, slug, data.ids.trakt, data.title);
          schedule();
        }
      }
    } catch (e) { } finally {
      resolvingSlugs.delete(key);
    }
  }

  function queueBulkTranslation(type, id) {
    const normType = type === 'movie' ? 'movie' : 'show';
    const normId = parseInt(id, 10);
    if (isNaN(normId)) return;
    const cacheKey = `${normType}:${normId}`;
    if (translationCache.has(cacheKey) || inFlightIds[normType].has(normId)) return;

    pendingBulkIds[normType].add(normId);
    if (bulkTimer !== null) return;
    bulkTimer = setTimeout(() => {
      bulkTimer = null;
      flushBulkTranslations();
    }, 60);
  }

  // 官方批量接口一次最多 100 个 id/类型（Trakt 网页端自己的上限），超了就分批。
  // 返回 `${type}:${id}` -> 中文名 的 Map；请求失败/没有 token 返回 null。
  async function fetchBulkTitles(movieIds, showIds) {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const params = new URLSearchParams({
        language: INTL_LANGUAGE,
        country: INTL_COUNTRY
      });
      if (movieIds.length > 0) params.set('m', movieIds.join(','));
      if (showIds.length > 0) params.set('s', showIds.join(','));

      const res = await (window.fetch || fetch)(`https://apiz.trakt.tv/v3/intl/bulk?${params.toString()}`, {
        headers: {
          'accept': '*/*',
          'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'authorization': `Bearer ${token}`,
          'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
          'trakt-api-version': API_VERSION
        }
      });

      if (!res.ok) return null;

      const data = await res.json();
      const titles = new Map();
      for (const [type, ids] of [['movie', movieIds], ['show', showIds]]) {
        const bucket = (data && data[type]) || {};
        for (const id of ids) {
          const entry = bucket[id];
          const title = entry && typeof entry.title === 'string' ? entry.title.trim() : '';
          // 该地区没有中文时接口会回落成英文原名，这种不算命中。
          if (title && ZH_REGEX.test(title)) titles.set(`${type}:${id}`, title);
        }
      }
      return titles;
    } catch (e) {
      return null;
    }
  }

  // 单体兜底：/translations/zh 按 id 列出全部中文译名（cn/tw/hk…），
  // 不需要用户 token，也不受地区回落影响——官方网页批量接口拿不到的那些中文名靠它补齐。
  // 只取 country=cn 且确实有标题的条目：没简体名就保持英文原名，不拿繁体中/港/新补位。
  async function resolveTranslationTitles(type, id) {
    const cacheKey = `${type}:${id}`;
    try {
      const res = await (window.fetch || fetch)(`https://api.trakt.tv/${type}s/${id}/translations/zh`, {
        headers: {
          'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
          'trakt-api-version': API_VERSION,
          'accept': 'application/json'
        }
      });
      if (!res.ok) {
        translationCache.set(cacheKey, null);
        return;
      }
      const list = await res.json();
      const item = (Array.isArray(list) ? list : []).find((entry) =>
        entry && entry.title && String(entry.country || '').toLowerCase() === 'cn');
      translationCache.set(cacheKey, (item && item.title.trim()) || null);
    } catch (e) {
      translationCache.set(cacheKey, null);
    }
  }

  async function flushBulkTranslations() {
    const movieIds = Array.from(pendingBulkIds.movie);
    const showIds = Array.from(pendingBulkIds.show);
    pendingBulkIds.movie.clear();
    pendingBulkIds.show.clear();

    if (movieIds.length === 0 && showIds.length === 0) return;

    movieIds.forEach((id) => inFlightIds.movie.add(id));
    showIds.forEach((id) => inFlightIds.show.add(id));

    const unresolved = [];
    const chunks = Math.max(
      Math.ceil(movieIds.length / BULK_ID_CAP),
      Math.ceil(showIds.length / BULK_ID_CAP)
    );

    for (let index = 0; index < chunks; index++) {
      const movies = movieIds.slice(index * BULK_ID_CAP, (index + 1) * BULK_ID_CAP);
      const shows = showIds.slice(index * BULK_ID_CAP, (index + 1) * BULK_ID_CAP);
      if (movies.length === 0 && shows.length === 0) continue;

      const titles = await fetchBulkTitles(movies, shows);
      for (const [type, ids] of [['movie', movies], ['show', shows]]) {
        for (const id of ids) {
          const title = titles && titles.get(`${type}:${id}`);
          if (title) {
            translationCache.set(`${type}:${id}`, title);
          } else {
            unresolved.push({ type, id });
          }
        }
      }
    }

    // 批量接口没给出中文（没有 token、请求失败、或该地区只回落成英文）时逐个补齐，
    // 命中与未命中都会写进缓存，同一个 id 不会反复请求。
    await Promise.all(unresolved.map(({ type, id }) => resolveTranslationTitles(type, id)));

    saveStoredCache();
    schedule();
  }

  function cleanTitle(value) {
    if (!value) return '';
    let title = String(value).replace(/\s+/g, ' ').trim();
    const quoted = title.match(/[“\"]\s*([^”\"]+?)\s*[”\"]/);
    if (quoted) title = quoted[1].trim();

    title = title
      //.replace(/^\s*\d+(?:\.\d+)?\s*/, '')
      .replace(/\s*(?:海报|poster|图片|image)\s*$/i, '')
      .replace(/\s*(?:在 Trakt 中播放|在 Trakt 中打开).*$/i, '')
      .replace(/^['“\"]|['”\"]$/g, '')
      .trim();

    if (!title || /^(海报|poster|图片|image|新|new)$/i.test(title)) return '';
    return title;
  }

  function titleFromLink(link) {
    const labelTitle = cleanTitle(link.getAttribute('aria-label') || link.getAttribute('title'));
    if (labelTitle) return labelTitle;

    const textTitle = cleanTitle(link.textContent);
    if (textTitle && !/海报|poster/i.test(link.textContent || '')) return textTitle;

    const image = link.querySelector('img[alt]');
    return image ? cleanTitle(image.alt) : '';
  }

  function hasNativeTitle(card) {
    return !!card.querySelector('.trakt-card-title');
  }

  function injectTitle(card) {
    if (card.closest(EXCLUDED_SELECTOR) || hasNativeTitle(card)) return;
    const mediaLink = card.querySelector('a[href*="/shows/"], a[href*="/movies/"]');
    if (!mediaLink) return;

    const title = titleFromLink(mediaLink);
    if (!title) return;

    const node = document.createElement('p');
    node.className = `trakt-card-title ${TITLE_CLASS}`;
    if (window.location.pathname.startsWith('/search')) {
      node.classList.add('trakt-helper-search-title');
    }
    node.textContent = title;
    node.title = title;

    const parent = mediaLink.parentElement || card;
    parent.insertBefore(node, mediaLink.nextSibling);
  }

  function handleSmartListTitledCard(card, titleEl, type, slug) {
    const mediaKey = `${type}:${slug}`;
    if (!titleEl.dataset.originalTitle) {
      titleEl.dataset.originalTitle = titleEl.textContent.trim();
    }
    const originalTitle = titleEl.dataset.originalTitle;

    const mediaInfo = mediaInfoCache.get(mediaKey);
    if (!mediaInfo) {
      resolveSlug(type, slug);
      return;
    }

    const id = mediaInfo.id;
    const transKey = `${type}:${id}`;
    if (!translationCache.has(transKey)) {
      queueBulkTranslation(type, id);
      return;
    }

    const zhTitle = translationCache.get(transKey);
    if (zhTitle && zhTitle !== originalTitle) {
      if (titleEl.textContent !== zhTitle) {
        titleEl.textContent = zhTitle;
        titleEl.title = zhTitle;
      }
      let sub = card.querySelector(`.${ORIGINAL_TITLE_CLASS}`);
      if (!sub) {
        sub = document.createElement('p');
        sub.className = `trakt-card-subtitle small secondary ellipsis svelte-pcyci5 ${ORIGINAL_TITLE_CLASS}`;
        const bdi = document.createElement('bdi');
        bdi.dir = 'ltr';
        bdi.textContent = `(${originalTitle})`;
        sub.appendChild(bdi);
        titleEl.insertAdjacentElement('afterend', sub);
      } else {
        const bdi = sub.querySelector('bdi') || sub;
        bdi.textContent = `(${originalTitle})`;
      }
    } else {
      if (titleEl.textContent !== originalTitle) {
        titleEl.textContent = originalTitle;
        titleEl.title = originalTitle;
      }
      const sub = card.querySelector(`.${ORIGINAL_TITLE_CLASS}`);
      if (sub) sub.remove();
    }
  }

  // Discover 页（/discover/trending、/discover/anticipated、/discover/popular …）
  // 官方网页本来就会用 /v3/intl/bulk 覆盖剧名，但只有「批量请求成功」且「该 id 在所用地区
  // 有中文」时才生效：一旦请求失败/被取消/回落成英文，卡片就停在英文，直到下一次覆盖。
  // 这里在英文卡片上补回官方中文名，并照抄官方的「中文 / (English)」两行排版；
  // 官方已经写成中文时我们什么都不做，避免两边打架。
  // 海报地址里本来就带着 trakt id：media.trakt.tv/images/shows/000/157/599/… → 157599。
  // Discover 列表经常是网页端从 IndexedDB 里恢复出来的，那次 /discover 请求根本不会再发，
  // 我们也就抓不到 id；这时直接从海报地址推出来，省掉一次 /shows/{slug} 请求。
  function recordMediaFromPoster(card, type, slug) {
    const cached = mediaInfoCache.get(`${type}:${slug}`);
    if (cached) return cached;

    const image = card.querySelector('img[src*="media.trakt.tv/images/"]');
    const src = image ? image.getAttribute('src') || '' : '';
    const match = src.match(/\/images\/(shows|movies)\/((?:\d{3}\/)+)/);
    if (!match) return null;

    const id = parseInt(match[2].replace(/\//g, ''), 10);
    if (!Number.isFinite(id)) return null;

    recordMedia(type, slug, id, '');
    return mediaInfoCache.get(`${type}:${slug}`) || null;
  }

  function handleDiscoverTitledCard(card, titleEl, type, slug) {
    const currentTitle = titleEl.textContent.trim();
    const localizedByUs = titleEl.dataset.traktLocalized === '1';

    if (!ZH_REGEX.test(currentTitle)) {
      titleEl.dataset.originalTitle = currentTitle;
    }
    const originalTitle = titleEl.dataset.originalTitle || currentTitle;
    if (!originalTitle) return;

    // 中文名已经在位：如果是我们写上去的，保证原名行跟着；
    // 如果是官方自己渲染的，就完全交给官方，只清掉我们的兜底行。
    if (ZH_REGEX.test(currentTitle)) {
      if (localizedByUs) {
        syncDiscoverOriginalTitleLine(card, titleEl, originalTitle);
      } else {
        removeHelperOriginalTitle(card);
      }
      return;
    }

    const mediaInfo = mediaInfoCache.get(`${type}:${slug}`) || recordMediaFromPoster(card, type, slug);
    if (!mediaInfo) {
      resolveSlug(type, slug);
      return;
    }

    const transKey = `${type}:${mediaInfo.id}`;
    if (!translationCache.has(transKey)) {
      queueBulkTranslation(type, mediaInfo.id);
      return;
    }

    const zhTitle = translationCache.get(transKey);
    if (zhTitle && zhTitle !== originalTitle) {
      if (currentTitle !== zhTitle) {
        titleEl.textContent = zhTitle;
        titleEl.title = zhTitle;
      }
      titleEl.dataset.traktLocalized = '1';
      syncDiscoverOriginalTitleLine(card, titleEl, originalTitle);
      return;
    }

    // 确实没有官方中文名：保持官方英文渲染。
    if (currentTitle !== originalTitle) {
      titleEl.textContent = originalTitle;
      titleEl.title = originalTitle;
    }
    removeHelperOriginalTitle(card);
  }

  // 官方自己渲染原名用的是 <p class="secondary ellipsis">(English)</p>，
  // 兜底行沿用同一组类名，官方行一出现就让位，避免出现两行原名。
  function syncDiscoverOriginalTitleLine(card, titleEl, originalTitle) {
    const label = `(${originalTitle})`;
    const container = titleEl.parentElement;
    const nativeLine = container
      ? Array.from(container.children).find((element) =>
        element !== titleEl &&
        element.tagName === 'P' &&
        !element.classList.contains(ORIGINAL_TITLE_CLASS) &&
        !element.classList.contains('trakt-card-title') &&
        element.textContent.trim() === label)
      : null;

    const helperLine = card.querySelector(`.${ORIGINAL_TITLE_CLASS}`);
    if (nativeLine) {
      if (helperLine) helperLine.remove();
      return;
    }
    if (helperLine) {
      if (helperLine.textContent.trim() !== label) helperLine.textContent = label;
      return;
    }

    const node = document.createElement('p');
    node.className = `ellipsis ${ORIGINAL_TITLE_CLASS} ${DISCOVER_ORIGINAL_TITLE_CLASS}`;
    node.textContent = label;
    titleEl.insertAdjacentElement('afterend', node);
  }

  function removeHelperOriginalTitle(card) {
    const helperLine = card.querySelector(`.${ORIGINAL_TITLE_CLASS}`);
    if (helperLine) helperLine.remove();
  }

  function handlePosterCardTranslation(card, titleNode, type, slug) {
    const mediaKey = `${type}:${slug}`;
    if (!titleNode.dataset.originalTitle) {
      titleNode.dataset.originalTitle = cleanTitle(titleNode.textContent.trim());
    }
    const originalTitle = titleNode.dataset.originalTitle;

    // If poster name already has Chinese characters, no API request needed:
    if (ZH_REGEX.test(originalTitle)) {
      return;
    }

    const mediaInfo = mediaInfoCache.get(mediaKey);
    if (!mediaInfo) {
      resolveSlug(type, slug);
      return;
    }

    const id = mediaInfo.id;
    const transKey = `${type}:${id}`;
    if (!translationCache.has(transKey)) {
      queueBulkTranslation(type, id);
      return;
    }

    const zhTitle = translationCache.get(transKey);
    // On poster-only cards, display solely the Chinese title in a single line
    // with original tight margins, preventing vertical overflow/scrolling.
    // The original title is preserved in tooltip title attribute.
    if (zhTitle) {
      if (titleNode.textContent !== zhTitle) {
        titleNode.textContent = zhTitle;
      }
      titleNode.title = originalTitle && originalTitle !== zhTitle
        ? `${zhTitle} (${originalTitle})`
        : zhTitle;
    } else if (originalTitle) {
      if (titleNode.textContent !== originalTitle) {
        titleNode.textContent = originalTitle;
        titleNode.title = originalTitle;
      }
    }

    // Clean up any extra subtitle element to preserve single-line spacing
    const sub = card.querySelector(`.${ORIGINAL_TITLE_CLASS}`);
    if (sub) sub.remove();
  }

  function scanCard(card) {
    markCoverBadgeCard(card);

    if (card.closest(EXCLUDED_SELECTOR)) return;
    const mediaLink = card.querySelector('a[href*="/shows/"], a[href*="/movies/"]');
    if (!mediaLink) return;

    const href = mediaLink.getAttribute('href') || '';
    const match = href.match(/\/(movies|shows)\/([^\/?#]+)/);
    if (!match) return;

    const type = match[1] === 'movies' ? 'movie' : 'show';
    const slug = match[2];

    const isSmart = isSmartListPage();
    const isSearch = isSearchPage();
    const isDiscover = isDiscoverPage();
    const isEpisodeCard = /\/seasons\/\d+\/episodes\/\d+/.test(href);

    const nativeTitleEl = card.querySelector(`.trakt-card-title:not(.${TITLE_CLASS})`);

    // 1. 卡片本身已有原生标题元素（如智能列表详情网格页 /lists/smart/view/:slug、
    //    Discover 页 /discover/trending 等）
    if (nativeTitleEl) {
      if (isSmart) {
        handleSmartListTitledCard(card, nativeTitleEl, type, slug);
      } else if (isDiscover && !isEpisodeCard) {
        // /discover/releases 的剧集卡片：标题行是剧名、副标题行才是集名，
        // 官方那层只覆盖集名，这里不碰，免得凭空多出一行原名。
        handleDiscoverTitledCard(card, nativeTitleEl, type, slug);
      }
      return;
    }

    // 2. 纯海报卡片（如智能列表轮播总览页 /lists/smart/view、搜索页 /search 等）：
    // 首先确保执行 injectTitle 补齐单行标题节点，绝不留白
    let titleNode = card.querySelector(`.${TITLE_CLASS}`);
    if (!titleNode) {
      injectTitle(card);
      titleNode = card.querySelector(`.${TITLE_CLASS}`);
    }
    if (!titleNode) return;

    // 若在智能列表或搜索页面，尝试用 bulk API 获取中文译名替换单行标题
    if (isSmart || isSearch) {
      handlePosterCardTranslation(card, titleNode, type, slug);
      return;
    }

    // 其他页面中已在 HTML 后台抓取到中文剧名的海报卡片，injectTitle 已完成补充，无需多余请求
  }

  // 「正在播放」浮层（.trakt-now-playing-container）。
  // 第一行显示剧名/电影名（官方中文优先），单集在下面单独加一行「S1•E1-集标题」。
  // 其余内容（剩余时间、结束时间、进度条、海报）一律不动，
  // 数据复用已有的 mediaInfoCache / translationCache / resolveSlug / queueBulkTranslation。
  function localizeNowPlaying() {
    const container = document.querySelector('.trakt-now-playing-container');
    if (!container) return;

    const content = container.querySelector('.trakt-now-playing-content');
    if (!content) return;
    const titleEl = content.querySelector(':scope > span.bold.ellipsis');
    if (!titleEl) return;

    const mediaLink = container.querySelector('a[href*="/shows/"], a[href*="/movies/"]');
    if (!mediaLink) return;
    const parsed = parseNowPlayingHref(mediaLink.getAttribute('href') || '');
    if (!parsed) return;

    const mediaInfo = mediaInfoCache.get(`${parsed.type}:${parsed.slug}`);
    if (!mediaInfo) {
      resolveSlug(parsed.type, parsed.slug);
      return;
    }

    const transKey = `${parsed.type}:${mediaInfo.id}`;
    if (!translationCache.has(transKey)) {
      queueBulkTranslation(parsed.type, mediaInfo.id);
      return;
    }

    // 第一行：剧名 / 电影名（没有官方中文就保持英文原名）
    const title = translationCache.get(transKey) || mediaInfo.title || '';
    if (title && titleEl.textContent !== title) {
      titleEl.textContent = title;
    }

    // 第二行：只有单集才有，形如 S2•E5-贝辛斯托克郊区的一条主干道
    const episodeLine = parsed.season && parsed.episode
      ? nowPlayingEpisodeLine(parsed.slug, parsed.season, parsed.episode)
      : '';
    let subtitleEl = content.querySelector('.trakt-helper-now-playing-episode');

    if (episodeLine) {
      if (!subtitleEl) {
        subtitleEl = document.createElement('span');
        subtitleEl.className = 'small secondary ellipsis trakt-helper-now-playing-episode';
        titleEl.insertAdjacentElement('afterend', subtitleEl);
      }
      if (subtitleEl.textContent !== episodeLine) {
        subtitleEl.textContent = episodeLine;
      }
    } else if (subtitleEl) {
      subtitleEl.remove();
    }
  }

  // 季集标签跟官方 App 同款写法：S1 • E1，拿到中文集名再接 " - 剧集名"
  function nowPlayingEpisodeLine(slug, season, episode) {
    const episodeTitle = getEpisodeTitle(slug, season, episode);
    const label = `S${season} • E${episode}`;
    return episodeTitle ? `${label} - ${episodeTitle}` : label;
  }

  // 新版 `/shows/<slug>/seasons/<s>/episodes/<e>` 和旧版
  // `/shows/<slug>?view=episode&season=<s>&episode=<e>` 都能解析。
  function parseNowPlayingHref(href) {
    const match = href.match(/\/(movies|shows)\/([^\/?#]+)(?:\/seasons\/(\d+)\/episodes\/(\d+))?/);
    if (!match) return null;

    const parsed = {
      type: match[1] === 'movies' ? 'movie' : 'show',
      slug: decodeURIComponent(match[2])
    };

    let season = match[3];
    let episode = match[4];
    if (!season || !episode) {
      const query = href.split('?')[1];
      if (query) {
        const params = new URLSearchParams(query);
        season = season || params.get('season');
        episode = episode || params.get('episode');
      }
    }
    if (season && episode) {
      parsed.season = parseInt(season, 10);
      parsed.episode = parseInt(episode, 10);
    }
    return parsed;
  }

  // 集标题：官方接口支持 slug + translations=zh，一次拿整季的中英文集名，
  // 且不需要用户 token。结果缓存在内存里，失败也不重试，避免反复刷请求。
  function getEpisodeTitle(slug, season, number) {
    const cached = episodeTitleCache.get(`${slug}:${season}:${number}`);
    if (cached === undefined) {
      resolveEpisodeTitles(slug, season);
      return '';
    }
    return cached.zh || cached.en || '';
  }

  async function resolveEpisodeTitles(slug, season) {
    const seasonKey = `${slug}:${season}`;
    if (attemptedEpisodeSeasons.has(seasonKey)) return;
    attemptedEpisodeSeasons.add(seasonKey);

    try {
      const res = await (window.fetch || fetch)(
        `https://api.trakt.tv/shows/${encodeURIComponent(slug)}/seasons/${season}/episodes?translations=zh`,
        {
          headers: {
            'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
            'trakt-api-version': API_VERSION,
            'accept': 'application/json'
          }
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          for (const episode of list) {
            if (!episode || typeof episode.number !== 'number') continue;
            const translations = (episode.translations || []).filter(
              (item) => item && item.title && String(item.language || '').toLowerCase().startsWith('zh')
            );
            const zh = translations.find((item) => String(item.country || '').toLowerCase() === 'cn')
              || translations[0];
            episodeTitleCache.set(`${slug}:${season}:${episode.number}`, {
              en: episode.title || '',
              zh: (zh && zh.title) || ''
            });
          }
        }
      }
    } catch (e) { } finally {
      schedule();
    }
  }

  function scan() {
    document.querySelectorAll('.trakt-now-playing-container .trakt-helper-poster-title').forEach((element) => {
      element.remove();
    });
    localizeNowPlaying();
    // 新版 TV Time 网页是另一套 DOM（article.media-row），单独走一遍。
    if (isTvTimeApp()) scanTvTime();
    // OG Redux（og.trakt.tv）是经典界面的重制版，又是一套 DOM。
    if (isOgRedux()) scanOg();
    document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      scanCard(card);
    });
  }

  function markCoverBadgeCard(card) {
    const cover = card.querySelector('.trakt-card-cover');
    if (!cover) return;
    card.querySelectorAll('.trakt-helper-cover-badge').forEach((element) => {
      element.classList.remove('trakt-helper-cover-badge');
    });
    const coverRect = cover.getBoundingClientRect();
    if (!coverRect.width || !coverRect.height) return;

    let centeredBottomOverlay = null;
    [...card.querySelectorAll('*')].some((element) => {
      const style = window.getComputedStyle(element);
      if (style.position !== 'absolute') return false;
      const rect = element.getBoundingClientRect();
      const centerDistance = Math.abs((rect.left + rect.width / 2) - (coverRect.left + coverRect.width / 2));
      const nearBottom = rect.top >= coverRect.bottom - 28 && rect.top <= coverRect.bottom + 8;
      if (rect.width < 16 || rect.height < 16 || centerDistance > 30 || !nearBottom) return false;
      centeredBottomOverlay = element;
      return true;
    });

    card.classList.toggle('trakt-helper-cover-badge-card', !!centeredBottomOverlay);
    if (centeredBottomOverlay) centeredBottomOverlay.classList.add('trakt-helper-cover-badge');
  }

  function schedule() {
    if (renderTimer !== null) return;
    renderTimer = setTimeout(() => {
      renderTimer = null;
      scan();
    }, 50);
  }

  loadStoredCache();
  loadOgCache();
  interceptFetch();

  const observer = new MutationObserver(schedule);
  // SvelteKit 切换焦点位 / 详情内容时先改 href，再换文本；两种站都需要立刻重扫。
  const linkObserver = (isTvTimeApp() || isOgRedux()) ? new MutationObserver(schedule) : null;

  // 网页端（Svelte）改写标题时是直接改文本节点，只会触发 characterData，
  // childList 观察器看不到。单独盯一眼标题文本：官方把中文退回英文时马上补回来。
  const titleObserver = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target;
      const element = target && target.nodeType === 3 ? target.parentElement : target;
      if (element && element.classList
        && [...element.classList].some((className) => TVTIME_TITLE_CLASSES.has(className))) {
        schedule();
        return;
      }
      // OG Redux 的标题 / 简介由 Svelte 直接改文本节点，同样只会触发 characterData。
      if (isOgRedux() && element && element.closest
        && element.closest('.summary-title, .overview, .tagline, .title-wrapper, .titles, .caption, h2.name, h3[id^="episode-"]')) {
        schedule();
        return;
      }
    }
  });

  const start = () => {
    const root = document.documentElement || document.body;
    if (!root) return setTimeout(start, 20);
    observer.observe(root, { childList: true, subtree: true });
    titleObserver.observe(root, { characterData: true, subtree: true });
    // Svelte 切换 Discover 焦点位时可能先改 href、稍后才改标题文本。
    // 立即感知身份变化，先撤下旧译名，避免在新文本到达前把上一部作品标成新作品。
    if (linkObserver) {
      linkObserver.observe(root, { attributes: true, subtree: true, attributeFilter: ['href'] });
    }
    scan();
  };

  start();
  window.addEventListener('load', scan, { once: true });
  window.addEventListener('popstate', schedule);
})();

})();
