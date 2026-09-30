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
