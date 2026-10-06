// ==UserScript==
// @name         Trakt Titles
// @namespace    trakt-titles
// @version      1.1.6
// @description  Restores missing titles on Trakt poster-only cards.
// @author       lunanfo
// @homepageURL  https://github.com/lunanfo/TraktTitles
// @supportURL   https://github.com/lunanfo/TraktTitles/issues
// @updateURL    https://raw.githubusercontent.com/lunanfo/TraktTitles/main/userscript/TraktTitles.user.js
// @downloadURL  https://raw.githubusercontent.com/lunanfo/TraktTitles/main/userscript/TraktTitles.user.js
// @icon         data:image/png;base64,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
// @match        https://trakt.tv/*
// @match        https://app.trakt.tv/*
// @grant        none
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
`;
  (document.head || document.documentElement).appendChild(style);

/**
 * Trakt Titles - restores names on cards that render only a poster,
 * and adds localized Chinese titles on smart list views and search.
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
  interceptFetch();

  const observer = new MutationObserver(schedule);

  // 网页端（Svelte）改写标题时是直接改文本节点，只会触发 characterData，
  // childList 观察器看不到。单独盯一眼标题文本：官方把中文退回英文时马上补回来。
  const titleObserver = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target;
      const element = target && target.nodeType === 3 ? target.parentElement : target;
      if (element && element.classList && element.classList.contains('trakt-card-title')) {
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
    scan();
  };

  start();
  window.addEventListener('load', scan, { once: true });
  window.addEventListener('popstate', schedule);
})();

})();
