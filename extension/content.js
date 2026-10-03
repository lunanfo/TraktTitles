/**
 * Trakt Titles - restores names on cards that render only a poster,
 * and adds localized Chinese titles on smart list views and search.
 */
(function () {
  'use strict';

  const TITLE_CLASS = 'trakt-helper-poster-title';
  const ORIGINAL_TITLE_CLASS = 'trakt-helper-original-title';
  const CARD_SELECTOR = '.trakt-card, .mini_card, .grid-item, [data-card]';
  const EXCLUDED_SELECTOR = 'header, nav, footer, [role="navigation"], [role="menu"], [role="menubar"], .breadcrumbs, .navbar, .comments, .trakt-now-playing-container, table, tbody';

  const DEFAULT_API_KEY = '201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d';
  const API_VERSION = '2';
  const ZH_REGEX = /[\u4e00-\u9fa5]/;

  // Caches
  const mediaInfoCache = new Map(); // `${type}:${slug}` -> { type, slug, id, title }
  const translationCache = new Map(); // `${type}:${id}` -> zhTitle | null
  const resolvingSlugs = new Set();
  const pendingBulkIds = { movie: new Set(), show: new Set() };
  const inFlightIds = { movie: new Set(), show: new Set() };

  let capturedAuthToken = null;
  let capturedApiKey = DEFAULT_API_KEY;
  let bulkTimer = null;
  let renderTimer = null;

  function isSmartListPage() {
    return window.location.pathname.startsWith('/lists/smart');
  }

  function isSearchPage() {
    return window.location.pathname.startsWith('/search');
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
    } catch (e) {}
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
    } catch (e) {}
  }

  function getAuthToken() {
    if (capturedAuthToken) return capturedAuthToken;
    const storages = [];
    try { if (window.localStorage) storages.push(window.localStorage); } catch (e) {}
    try { if (window.sessionStorage) storages.push(window.sessionStorage); } catch (e) {}

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
      } catch (e) {}
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
      } catch (e) {}

      const response = await origFetch.apply(this, args);

      try {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        if (url && (url.includes('trakt.tv') || url.includes('/api/') || url.includes('multi_search'))) {
          response.clone().json().then((data) => {
            extractMediaFromPayload(data);
            schedule();
          }).catch(() => {});
        }
      } catch (e) {}

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
    } catch (e) {} finally {
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

  async function flushBulkTranslations() {
    const movieIds = Array.from(pendingBulkIds.movie);
    const showIds = Array.from(pendingBulkIds.show);
    pendingBulkIds.movie.clear();
    pendingBulkIds.show.clear();

    if (movieIds.length === 0 && showIds.length === 0) return;

    movieIds.forEach((id) => inFlightIds.movie.add(id));
    showIds.forEach((id) => inFlightIds.show.add(id));

    const token = getAuthToken();
    if (token) {
      try {
        const params = new URLSearchParams({ language: 'zh', country: 'CN' });
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

        if (res.ok) {
          const data = await res.json();
          const moviesRes = data.movie || {};
          const showsRes = data.show || {};

          for (const id of movieIds) {
            const zh = moviesRes[id]?.title || null;
            translationCache.set(`movie:${id}`, zh);
          }
          for (const id of showIds) {
            const zh = showsRes[id]?.title || null;
            translationCache.set(`show:${id}`, zh);
          }

          saveStoredCache();
          schedule();
          return;
        }
      } catch (e) {}
    }

    // Fallback: public single translations if no token or bulk failed
    const allIds = [
      ...movieIds.map((id) => ({ type: 'movie', id })),
      ...showIds.map((id) => ({ type: 'show', id }))
    ];

    await Promise.all(allIds.map(async ({ type, id }) => {
      try {
        const res = await (window.fetch || fetch)(`https://api.trakt.tv/${type}s/${id}/translations/zh`, {
          headers: {
            'trakt-api-key': capturedApiKey || DEFAULT_API_KEY,
            'trakt-api-version': API_VERSION,
            'accept': 'application/json'
          }
        });
        if (res.ok) {
          const list = await res.json();
          const item = (list && list.find((t) => t.country === 'cn')) || list?.[0];
          translationCache.set(`${type}:${id}`, item?.title || null);
        } else {
          translationCache.set(`${type}:${id}`, null);
        }
      } catch (e) {
        translationCache.set(`${type}:${id}`, null);
      }
    }));

    saveStoredCache();
    schedule();
  }

  function cleanTitle(value) {
    if (!value) return '';
    let title = String(value).replace(/\s+/g, ' ').trim();
    const quoted = title.match(/[“\"]\s*([^”\"]+?)\s*[”\"]/);
    if (quoted) title = quoted[1].trim();

    title = title
      .replace(/^\s*\d+(?:\.\d+)?\s*/, '')
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

    const nativeTitleEl = card.querySelector(`.trakt-card-title:not(.${TITLE_CLASS})`);

    // 1. 卡片本身已有原生标题元素（如智能列表详情网格页 /lists/smart/view/:slug）
    if (nativeTitleEl) {
      if (isSmart) {
        handleSmartListTitledCard(card, nativeTitleEl, type, slug);
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

  function scan() {
    document.querySelectorAll('.trakt-now-playing-container .trakt-helper-poster-title').forEach((element) => {
      element.remove();
    });
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
  const start = () => {
    const root = document.documentElement || document.body;
    if (!root) return setTimeout(start, 20);
    observer.observe(root, { childList: true, subtree: true });
    scan();
  };

  start();
  window.addEventListener('load', scan, { once: true });
  window.addEventListener('popstate', schedule);
})();
