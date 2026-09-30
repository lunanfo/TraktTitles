const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const target = process.env.TARGET === 'userscript'
  ? path.join(root, 'userscript/TraktTitles.user.js')
  : path.join(root, 'extension/content.js');
const source = fs.readFileSync(target, 'utf8');

const dom = new JSDOM(`<!doctype html><html><body>
  <div class="trakt-card poster-only">
    <div class="trakt-card-content">
      <a href="/shows/for-all-mankind" aria-label="“For All Mankind”海报">
        <div class="trakt-card-cover"><img src="poster.jpg"></div>
      </a>
    </div>
  </div>
  <div class="trakt-card already-titled">
    <a href="/shows/see"><div class="trakt-card-cover"><img src="see.jpg"></div></a>
    <p class="trakt-card-title">See</p>
  </div>
  <div class="trakt-card movie-poster-only">
    <div class="trakt-card-content">
      <a href="/movies/atomic-blonde-2017" aria-label="“极寒之城”海报">
        <div class="trakt-card-cover"><img src="movie.jpg"></div>
      </a>
    </div>
  </div>
  <div class="trakt-card status-only">
    <div class="trakt-card-content">
      <a href="/shows/the-unabomber"><div class="trakt-card-cover"><span class="new-badge">新</span><img src="new.jpg"></div></a>
    </div>
  </div>
  <div class="trakt-now-playing-container">
    <div class="trakt-card now-playing-card">
      <a href="/shows/mobland?view=episode&season=2&episode=2" aria-label="第 2 季 · 第 2 集 - MobLand海报">
        <div class="trakt-card-cover"><img src="now-playing.jpg"></div>
      </a>
    </div>
  </div>
</body></html>`, {
  url: 'https://app.trakt.tv/search?m=media',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});

dom.window.eval(source);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  await wait(180);
  const doc = dom.window.document;
  const posterOnly = doc.querySelector('.poster-only');
  const title = posterOnly.querySelector('.trakt-helper-poster-title');

  assert(title, 'poster-only card receives a title');
  assert.strictEqual(title.textContent, 'For All Mankind');
  assert(title.classList.contains('trakt-card-title'));
  assert(title.classList.contains('trakt-helper-search-title'));
  assert(!title.textContent.includes('海报'));
  assert.strictEqual(doc.querySelector('.already-titled .trakt-helper-poster-title'), null);

  const movieTitle = doc.querySelector('.movie-poster-only .trakt-helper-poster-title');
  assert(movieTitle, 'poster-only movie card receives a title');
  assert.strictEqual(movieTitle.textContent, '极寒之城');
  assert.strictEqual(doc.querySelector('.status-only .trakt-helper-poster-title'), null,
    'status badge is not used as a show title');
  assert.strictEqual(doc.querySelector('.now-playing-card .trakt-helper-poster-title'), null,
    'now-playing card is excluded from title injection');

  const replacement = posterOnly.cloneNode(true);
  posterOnly.replaceWith(replacement);
  await wait(180);
  assert.strictEqual(replacement.querySelectorAll('.trakt-helper-poster-title').length, 1);
  console.log(`[${process.env.TARGET || 'extension'}] RESULT: ALL PASS`);
})();
