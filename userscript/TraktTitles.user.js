// ==UserScript==
// @name         Trakt Titles
// @namespace    trakt-titles
// @version      1.0.0
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

/* Lift the centered cover badge slightly so its card title stays on the same
   baseline as cards without a badge. */
.trakt-helper-cover-badge {
    transform: translateY(-6px) !important;
}
`;
  (document.head || document.documentElement).appendChild(style);

/**
 * Trakt Titles - restores names on cards that render only a poster,
 * and keeps the centered cover badge clear of the injected title.
 * The script uses titles already present in Trakt's DOM and never changes API
 * requests or adds a translation service.
 */
(function () {
  'use strict';

  const TITLE_CLASS = 'trakt-helper-poster-title';
  const CARD_SELECTOR = '.trakt-card, .mini_card, .grid-item, [data-card]';
  const EXCLUDED_SELECTOR = 'header, nav, footer, [role="navigation"], [role="menu"], [role="menubar"], .breadcrumbs, .navbar, .comments, .trakt-now-playing-container, table, tbody';

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
    // The accessible label is the localized title followed by “海报”.
    const labelTitle = cleanTitle(link.getAttribute('aria-label') || link.getAttribute('title'));
    if (labelTitle) return labelTitle;

    const textTitle = cleanTitle(link.textContent);
    if (textTitle && !/海报|poster/i.test(link.textContent || '')) return textTitle;

    const image = link.querySelector('img[alt]');
    return image ? cleanTitle(image.alt) : '';
  }

  function hasNativeTitle(card) {
    return !!card.querySelector(
      '.trakt-card-title,' +
      `.${TITLE_CLASS}`
    );
  }

  function injectTitle(card) {
    if (card.closest(EXCLUDED_SELECTOR) || hasNativeTitle(card)) return;
    const mediaLink = card.querySelector('a[href*="/shows/"], a[href*="/movies/"]');
    if (!mediaLink) return;

    const title = titleFromLink(mediaLink);
    if (!title) return;

    const node = document.createElement('p');
    node.className = `trakt-card-title ${TITLE_CLASS}`;
    if (window.location.pathname === '/search') {
      node.classList.add('trakt-helper-search-title');
    }
    node.textContent = title;
    node.title = title;

    const parent = mediaLink.parentElement || card;
    parent.insertBefore(node, mediaLink.nextSibling);
  }

  function scan() {
    document.querySelectorAll('.trakt-now-playing-container .trakt-helper-poster-title').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      markCoverBadgeCard(card);
      injectTitle(card);
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

  let timer = null;
  function schedule() {
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      scan();
    }, 80);
  }

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

})();
