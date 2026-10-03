const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const target = process.env.TARGET === 'userscript'
  ? path.join(root, 'userscript/TraktTitles.user.js')
  : path.join(root, 'extension/content.js');
const source = fs.readFileSync(target, 'utf8');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSearchTest() {
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
}

async function runSmartListTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card runner-card">
      <div class="trakt-card-content">
        <a href="/movies/runner-2026">
          <div class="trakt-card-cover"><img src="runner.jpg"></div>
        </a>
        <p class="trakt-card-title">Runner</p>
        <p class="trakt-card-subtitle">动作</p>
      </div>
    </div>
    <div class="trakt-card coyote-card">
      <div class="trakt-card-content">
        <a href="/movies/coyote-vs-acme-2026">
          <div class="trakt-card-cover"><img src="coyote.jpg"></div>
        </a>
        <p class="trakt-card-title">Coyote vs. Acme</p>
        <p class="trakt-card-subtitle">家庭</p>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/lists/smart/view/2026-50250a71b58016a6',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  // Pre-seed cache in sessionStorage to test translation rendering
  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'movie:runner-2026': { type: 'movie', slug: 'runner-2026', id: 1125169, title: 'Runner' },
    'movie:coyote-vs-acme-2026': { type: 'movie', slug: 'coyote-vs-acme-2026', id: 970531, title: 'Coyote vs. Acme' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'movie:1125169': '行者',
    'movie:970531': '歪心狼对阵ACME'
  }));

  dom.window.eval(source);
  await wait(180);

  const doc = dom.window.document;
  const runnerTitle = doc.querySelector('.runner-card .trakt-card-title');
  const runnerSub = doc.querySelector('.runner-card .trakt-helper-original-title');
  assert.strictEqual(runnerTitle.textContent, '行者');
  assert(runnerSub, 'Runner card receives bilingual original title subtitle');
  assert.strictEqual(runnerSub.textContent, '(Runner)');

  const coyoteTitle = doc.querySelector('.coyote-card .trakt-card-title');
  const coyoteSub = doc.querySelector('.coyote-card .trakt-helper-original-title');
  assert.strictEqual(coyoteTitle.textContent, '歪心狼对阵ACME');
  assert(coyoteSub, 'Coyote card receives bilingual original title subtitle');
  assert.strictEqual(coyoteSub.textContent, '(Coyote vs. Acme)');
}

async function runSmartListOverviewPosterTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card runner-poster-card">
      <div class="trakt-card-content">
        <a href="/movies/runner-2026" aria-label="Runner海报">
          <div class="trakt-card-cover"><img src="runner.jpg"></div>
        </a>
        <p class="trakt-card-subtitle">2026 · 1小时 37分钟</p>
      </div>
    </div>
    <div class="trakt-card coyote-poster-card">
      <div class="trakt-card-content">
        <a href="/movies/coyote-vs-acme-2026" aria-label="Coyote vs. Acme海报">
          <div class="trakt-card-cover"><img src="coyote.jpg"></div>
        </a>
        <p class="trakt-card-subtitle">2026 · 1小时 43分钟</p>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/lists/smart/view',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'movie:runner-2026': { type: 'movie', slug: 'runner-2026', id: 1125169, title: 'Runner' },
    'movie:coyote-vs-acme-2026': { type: 'movie', slug: 'coyote-vs-acme-2026', id: 970531, title: 'Coyote vs. Acme' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'movie:1125169': '行者',
    'movie:970531': '歪心狼对阵ACME'
  }));

  dom.window.eval(source);
  await wait(180);

  const doc = dom.window.document;
  const runnerTitle = doc.querySelector('.runner-poster-card .trakt-helper-poster-title');
  const runnerSub = doc.querySelector('.runner-poster-card .trakt-helper-original-title');
  assert(runnerTitle, 'Runner poster card on /lists/smart/view must receive a title');
  assert.strictEqual(runnerTitle.textContent, '行者');
  assert.strictEqual(runnerTitle.title, '行者 (Runner)');
  assert.strictEqual(runnerSub, null, 'Poster card should not have separate subtitle line to preserve tight spacing');

  const coyoteTitle = doc.querySelector('.coyote-poster-card .trakt-helper-poster-title');
  const coyoteSub = doc.querySelector('.coyote-poster-card .trakt-helper-original-title');
  assert(coyoteTitle, 'Coyote poster card on /lists/smart/view must receive a title');
  assert.strictEqual(coyoteTitle.textContent, '歪心狼对阵ACME');
  assert.strictEqual(coyoteTitle.title, '歪心狼对阵ACME (Coyote vs. Acme)');
  assert.strictEqual(coyoteSub, null, 'Poster card should not have separate subtitle line to preserve tight spacing');
}

async function runLiveResolveTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card runner-card">
      <div class="trakt-card-content">
        <a href="/movies/runner-2026">
          <div class="trakt-card-cover"><img src="runner.jpg"></div>
        </a>
        <p class="trakt-card-title">Runner</p>
        <p class="trakt-card-subtitle">动作</p>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/lists/smart/view/2026-50250a71b58016a6',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.localStorage.setItem('oidc.user:https://trakt.tv:201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d', JSON.stringify({
    access_token: 'MRFxwLmnjEtkmuEvPMuuiELNaiPRoFYd'
  }));

  dom.window.fetch = async (url) => {
    if (url.includes('/movies/runner-2026')) {
      return {
        ok: true,
        json: async () => ({
          title: 'Runner',
          ids: { trakt: 1125169, slug: 'runner-2026' }
        })
      };
    }
    if (url.includes('/intl/bulk')) {
      return {
        ok: true,
        json: async () => ({
          movie: { '1125169': { title: '行者' } },
          show: {}
        })
      };
    }
    throw new Error('Unknown URL: ' + url);
  };

  dom.window.eval(source);
  await wait(280);

  const doc = dom.window.document;
  const runnerTitle = doc.querySelector('.runner-card .trakt-card-title');
  const runnerSub = doc.querySelector('.runner-card .trakt-helper-original-title');
  assert.strictEqual(runnerTitle.textContent, '行者');
  assert(runnerSub, 'Runner card receives bilingual original title subtitle via live resolve');
  assert.strictEqual(runnerSub.textContent, '(Runner)');
}

async function runLivePosterResolveTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card runner-live-poster-card">
      <div class="trakt-card-content">
        <a href="/movies/runner-2026" aria-label="Runner海报">
          <div class="trakt-card-cover"><img src="runner.jpg"></div>
        </a>
        <p class="trakt-card-subtitle">2026 · 1小时 37分钟</p>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/lists/smart/view',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.localStorage.setItem('oidc.user:https://trakt.tv:201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d', JSON.stringify({
    access_token: 'MRFxwLmnjEtkmuEvPMuuiELNaiPRoFYd'
  }));

  dom.window.fetch = async (url) => {
    if (url.includes('/movies/runner-2026')) {
      return {
        ok: true,
        json: async () => ({
          title: 'Runner',
          ids: { trakt: 1125169, slug: 'runner-2026' }
        })
      };
    }
    if (url.includes('/intl/bulk')) {
      return {
        ok: true,
        json: async () => ({
          movie: { '1125169': { title: '行者' } },
          show: {}
        })
      };
    }
    throw new Error('Unknown URL: ' + url);
  };

  dom.window.eval(source);
  await wait(280);

  const doc = dom.window.document;
  const runnerTitle = doc.querySelector('.runner-live-poster-card .trakt-helper-poster-title');
  const runnerSub = doc.querySelector('.runner-live-poster-card .trakt-helper-original-title');
  assert(runnerTitle, 'Runner live poster card on /lists/smart/view must receive a title');
  assert.strictEqual(runnerTitle.textContent, '行者');
  assert.strictEqual(runnerTitle.title, '行者 (Runner)');
  assert.strictEqual(runnerSub, null, 'Poster card should not have separate subtitle line');
}

async function runNowPlayingTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-now-playing-container">
      <div class="trakt-card now-playing-card">
        <a href="/movies/unabomber-2026" aria-label="UNABOMBER海报">
          <div class="trakt-card-cover"><img src="now-playing.jpg"></div>
        </a>
      </div>
      <div class="trakt-now-playing-content svelte-11wjdk4">
        <div class="trakt-now-playing-header svelte-11wjdk4"><span class="secondary small">正在播放</span></div>
        <span class="bold ellipsis">UNABOMBER</span>
        <div class="trakt-now-playing-progress svelte-11wjdk4">
          <div class="trakt-now-playing-info svelte-11wjdk4">
            <span class="trakt-now-playing-remaining ellipsis small svelte-11wjdk4">剩余 1小时 24分钟</span>
            <span class="trakt-now-playing-ends-at ellipsis small svelte-11wjdk4">结束于 12:26</span>
          </div>
        </div>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/home',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'movie:unabomber-2026': { type: 'movie', slug: 'unabomber-2026', id: 1224034, title: 'UNABOMBER' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'movie:1224034': '大学炸弹客'
  }));

  dom.window.eval(source);
  await wait(180);

  const doc = dom.window.document;
  const title = doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis');
  assert.strictEqual(title.textContent, '大学炸弹客', 'now playing movie title becomes the official Chinese name');
  assert.strictEqual(
    doc.querySelector('.trakt-now-playing-remaining').textContent,
    '剩余 1小时 24分钟',
    'now playing remaining time is untouched'
  );
  assert.strictEqual(doc.querySelector('.trakt-now-playing-ends-at').textContent, '结束于 12:26',
    'now playing end time is untouched');
  assert.strictEqual(doc.querySelectorAll('.trakt-now-playing-container .trakt-helper-poster-title').length, 0,
    'no extra title node is injected into the now playing toast');
  assert.strictEqual(doc.querySelector('.trakt-helper-now-playing-episode'), null,
    'movies get no second line');
  assert.strictEqual(
    doc.querySelector('.trakt-now-playing-content:has(.trakt-helper-now-playing-episode)'),
    null,
    'movie toast never matches the episode-only spacing rule'
  );
}

async function runNowPlayingEpisodeTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-now-playing-container">
      <div class="trakt-card now-playing-card">
        <a href="/shows/the-night-agent/seasons/2/episodes/1" aria-label="第 2 季 · 第 1 集 - The Night Agent海报">
          <div class="trakt-card-cover"><img src="now-playing.jpg"></div>
        </a>
      </div>
      <div class="trakt-now-playing-content svelte-11wjdk4">
        <div class="trakt-now-playing-header svelte-11wjdk4"><span class="secondary small">正在播放</span></div>
        <span class="bold ellipsis">第 2 季 · 第 1 集 - The Night Agent</span>
        <div class="trakt-now-playing-progress svelte-11wjdk4">
          <div class="trakt-now-playing-info svelte-11wjdk4">
            <span class="trakt-now-playing-remaining ellipsis small svelte-11wjdk4">剩余 43分钟</span>
            <span class="trakt-now-playing-ends-at ellipsis small svelte-11wjdk4">结束于 13:09</span>
          </div>
        </div>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/home',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'show:the-night-agent': { type: 'show', slug: 'the-night-agent', id: 170228, title: 'The Night Agent' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'show:170228': '暗夜情报员'
  }));

  dom.window.eval(source);
  await wait(180);

  const doc = dom.window.document;
  const title = doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis');
  assert.strictEqual(title.textContent, '暗夜情报员', 'show name sits on the first line');
  const episodeLine = doc.querySelector('.trakt-now-playing-content > .trakt-helper-now-playing-episode');
  assert(episodeLine, 'episodes get a dedicated second line');
  assert.strictEqual(episodeLine.textContent, 'S2 • E1');
  assert(episodeLine.classList.contains('small') && episodeLine.classList.contains('secondary'),
    'second line reuses the app small/secondary styles');
  assert(doc.querySelector('.trakt-now-playing-content:has(.trakt-helper-now-playing-episode)'),
    'episode toast matches the episode-only spacing rule');
}

async function runNowPlayingEpisodeTitleTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-now-playing-container">
      <div class="trakt-card now-playing-card">
        <a href="/shows/the-gentlemen/seasons/2/episodes/5" aria-label="第 2 季 • 第 5 集 - The Gentlemen海报">
          <div class="trakt-card-cover"><img src="now-playing.jpg"></div>
        </a>
      </div>
      <div class="trakt-now-playing-content svelte-11wjdk4">
        <div class="trakt-now-playing-header svelte-11wjdk4"><span class="secondary small">正在播放</span></div>
        <span class="bold ellipsis">第 2 季 • 第 5 集 - The Gentlemen</span>
        <div class="trakt-now-playing-progress svelte-11wjdk4">
          <div class="trakt-now-playing-info svelte-11wjdk4">
            <span class="trakt-now-playing-remaining ellipsis small svelte-11wjdk4">剩余 1小时 1分钟</span>
            <span class="trakt-now-playing-ends-at ellipsis small svelte-11wjdk4">结束于 12:32</span>
          </div>
        </div>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/home',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'show:the-gentlemen': { type: 'show', slug: 'the-gentlemen', id: 211407, title: 'The Gentlemen' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'show:211407': '绅士们'
  }));

  const requested = [];
  dom.window.fetch = async (url) => {
    requested.push(String(url));
    if (String(url).includes('/shows/the-gentlemen/seasons/2/episodes')) {
      return {
        ok: true,
        clone() { return this; },
        json: async () => ([
          {
            season: 2,
            number: 5,
            title: 'A Suburban A-Road on the Outskirts of Basingstoke',
            ids: { trakt: 13408834 },
            translations: [
              { language: 'zh', country: 'tw', title: '貝辛斯托克郊區的一條主幹道' },
              { language: 'zh', country: 'cn', title: '贝辛斯托克郊区的一条主干道' }
            ]
          }
        ])
      };
    }
    throw new Error('Unknown URL: ' + url);
  };

  dom.window.eval(source);
  await wait(300);

  const doc = dom.window.document;
  const title = doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis');
  assert.strictEqual(title.textContent, '绅士们', 'show name sits on the first line');
  assert.strictEqual(
    doc.querySelector('.trakt-now-playing-content > .trakt-helper-now-playing-episode').textContent,
    'S2 • E5 - 贝辛斯托克郊区的一条主干道',
    'second line is SxEy plus the official Chinese episode title'
  );
  assert(
    requested.some((url) => url.includes('/shows/the-gentlemen/seasons/2/episodes?translations=zh')),
    'season episodes are requested once with translations=zh'
  );
  assert.strictEqual(
    doc.querySelector('.trakt-now-playing-remaining').textContent,
    '剩余 1小时 1分钟',
    'now playing remaining time is still untouched'
  );
}

async function runNowPlayingSwitchToMovieTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-now-playing-container">
      <div class="trakt-card now-playing-card">
        <a class="np-link" href="/shows/the-night-agent/seasons/2/episodes/1" aria-label="第 2 季 · 第 1 集 - The Night Agent海报">
          <div class="trakt-card-cover"><img src="now-playing.jpg"></div>
        </a>
      </div>
      <div class="trakt-now-playing-content svelte-11wjdk4">
        <div class="trakt-now-playing-header svelte-11wjdk4"><span class="secondary small">正在播放</span></div>
        <span class="bold ellipsis">第 2 季 · 第 1 集 - The Night Agent</span>
        <div class="trakt-now-playing-progress svelte-11wjdk4">
          <div class="trakt-now-playing-info svelte-11wjdk4">
            <span class="trakt-now-playing-remaining ellipsis small svelte-11wjdk4">剩余 43分钟</span>
            <span class="trakt-now-playing-ends-at ellipsis small svelte-11wjdk4">结束于 13:09</span>
          </div>
        </div>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/home',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'show:the-night-agent': { type: 'show', slug: 'the-night-agent', id: 170228, title: 'The Night Agent' },
    'movie:unabomber-2026': { type: 'movie', slug: 'unabomber-2026', id: 1224034, title: 'UNABOMBER' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'show:170228': '暗夜情报员',
    'movie:1224034': '大学炸弹客'
  }));

  dom.window.eval(source);
  await wait(200);

  const doc = dom.window.document;
  assert.strictEqual(doc.querySelector('.trakt-helper-now-playing-episode').textContent, 'S2 • E1',
    'episode shows the second line first');

  // 模拟 App 把浮层内容换成一部电影（改链接 + 改标题，触发 MutationObserver）
  doc.querySelector('.np-link').setAttribute('href', '/movies/unabomber-2026');
  doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis').textContent = 'UNABOMBER';
  await wait(200);

  const title = doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis');
  assert.strictEqual(title.textContent, '大学炸弹客', 'movie title is localized after the switch');
  assert.strictEqual(doc.querySelector('.trakt-helper-now-playing-episode'), null,
    'stale episode line is removed when the toast switches to a movie');
  assert.strictEqual(
    doc.querySelector('.trakt-now-playing-content:has(.trakt-helper-now-playing-episode)'),
    null,
    'movie toast does not match the episode-only spacing rule after the switch'
  );
}

(async () => {
  await runSearchTest();
  await runSmartListTest();
  await runSmartListOverviewPosterTest();
  await runLiveResolveTest();
  await runLivePosterResolveTest();
  await runNowPlayingTest();
  await runNowPlayingEpisodeTest();
  await runNowPlayingEpisodeTitleTest();
  await runNowPlayingSwitchToMovieTest();
  console.log(`[${process.env.TARGET || 'extension'}] RESULT: ALL PASS`);
  process.exit(0);
})();
