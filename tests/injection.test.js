const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const target = process.env.TARGET === 'userscript'
  ? path.join(root, 'userscript/TraktTitles.user.js')
  : path.join(root, 'extension/content.js');
const source = fs.readFileSync(target, 'utf8');
// 油猴脚本把 styles.css 内联在同一个文件里，扩展则是独立文件。
const styleSource = process.env.TARGET === 'userscript'
  ? source
  : fs.readFileSync(path.join(root, 'extension/styles.css'), 'utf8');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 源码不再内置 Trakt Client ID：测试通过页面全局注入一个，避免每条用例都等运行时捕获。
function evalSourceWithApiKey(dom) {
  dom.window.__TRAKT_TITLES_CLIENT_ID__ = 'test-client-id';
  dom.window.eval(source);
}

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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
  await wait(280);

  const doc = dom.window.document;
  const runnerTitle = doc.querySelector('.runner-live-poster-card .trakt-helper-poster-title');
  const runnerSub = doc.querySelector('.runner-live-poster-card .trakt-helper-original-title');
  assert(runnerTitle, 'Runner live poster card on /lists/smart/view must receive a title');
  assert.strictEqual(runnerTitle.textContent, '行者');
  assert.strictEqual(runnerTitle.title, '行者 (Runner)');
  assert.strictEqual(runnerSub, null, 'Poster card should not have separate subtitle line');
}

async function runDiscoverTitleTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card trakt-summary-card lanterns-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/shows/lanterns">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="lanterns.jpg" alt="Poster for Lanterns"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">Lanterns</p>
              <p class="trakt-card-subtitle small ellipsis secondary">科幻</p>
            </div>
            <div class="trakt-summary-card-tags"><p class="bold">2.3万</p></div>
          </div>
        </a>
      </div>
    </div>
    <div class="trakt-card trakt-summary-card spider-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/movies/spider-man-brand-new-day-2026">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="spider.jpg" alt="Poster for 蜘蛛侠：崭新之日"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">蜘蛛侠：崭新之日</p>
              <p class="secondary ellipsis">(Spider-Man: Brand New Day)</p>
              <p class="trakt-card-subtitle small ellipsis secondary">科幻</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="trakt-card trakt-summary-card marshals-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/shows/marshals">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="marshals.jpg" alt="Poster for Marshals"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">Marshals</p>
              <p class="trakt-card-subtitle small ellipsis secondary">剧情</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/discover/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'show:lanterns': { type: 'show', slug: 'lanterns', id: 157599, title: 'Lanterns' },
    'show:marshals': { type: 'show', slug: 'marshals', id: 284855, title: 'Marshals' },
    'movie:spider-man-brand-new-day-2026': {
      type: 'movie',
      slug: 'spider-man-brand-new-day-2026',
      id: 905132,
      title: 'Spider-Man: Brand New Day'
    }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'show:157599': '绿灯军团',
    'show:284855': null,
    'movie:905132': '蜘蛛侠：崭新之日'
  }));

  evalSourceWithApiKey(dom);
  await wait(200);

  const doc = dom.window.document;

  // 官方批量翻译没生效的英文卡片：补回官方中文名 + 官方同款原名行
  const lanternsTitle = doc.querySelector('.lanterns-card .trakt-card-title');
  assert.strictEqual(lanternsTitle.textContent, '绿灯军团',
    'discover card falls back to the official Chinese title');
  const lanternsOriginal = doc.querySelector('.lanterns-card .trakt-helper-original-title');
  assert(lanternsOriginal, 'discover card gets the (Original) line back');
  assert.strictEqual(lanternsOriginal.textContent, '(Lanterns)');
  assert(lanternsOriginal.classList.contains('ellipsis'), 'the (Original) line keeps the app its ellipsis class');
  assert(!lanternsOriginal.classList.contains('secondary'),
    'the (Original) line must not use the secondary colour: the app renders it as bright as the title');
  assert.strictEqual(lanternsTitle.nextElementSibling, lanternsOriginal,
    'the (Original) line sits directly under the title, above the genre line');
  assert.strictEqual(lanternsOriginal.nextElementSibling.textContent, '科幻',
    'the genre line is left untouched underneath');
  assert(
    /\.trakt-helper-original-title\.trakt-helper-discover-original-title\s*\{[^}]*color:\s*inherit/.test(styleSource),
    'discover (Original) line inherits the title colour instead of the dim secondary one'
  );

  // 官方已经渲染成中文的卡片：一动不动，也不重复加原名行
  const spiderTitle = doc.querySelector('.spider-card .trakt-card-title');
  assert.strictEqual(spiderTitle.textContent, '蜘蛛侠：崭新之日', 'official Chinese title is left alone');
  assert.strictEqual(doc.querySelectorAll('.spider-card .trakt-helper-original-title').length, 0,
    'no duplicate (Original) line when the app already renders one');
  assert.strictEqual(
    doc.querySelectorAll('.spider-card .trakt-summary-card-titles > p').length,
    3,
    'the official title group keeps exactly its own three lines'
  );

  // 官方没有中文名的卡片：保持英文，不注入任何东西
  const marshalsCard = doc.querySelector('.marshals-card');
  assert.strictEqual(marshalsCard.querySelector('.trakt-card-title').textContent, 'Marshals',
    'titles without an official Chinese name stay English');
  assert.strictEqual(marshalsCard.querySelector('.trakt-helper-original-title'), null,
    'no (Original) line is added without a Chinese title');

  // 官方稍后把标题写回英文（Svelte 直接改文本节点）：必须马上补回中文
  lanternsTitle.firstChild.nodeValue = 'Lanterns';
  await wait(220);
  assert.strictEqual(doc.querySelector('.lanterns-card .trakt-card-title').textContent, '绿灯军团',
    'a later English rewrite by the app is localized again');
  assert.strictEqual(doc.querySelectorAll('.lanterns-card .trakt-helper-original-title').length, 1,
    'the (Original) line is not duplicated by the re-localization');
}

async function runDiscoverTranslationFetchTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card trakt-summary-card lanterns-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/shows/lanterns">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="https://media.trakt.tv/images/shows/000/157/599/posters/thumb/1fdc413e93.jpg.webp" alt="Poster for Lanterns"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">Lanterns</p>
              <p class="trakt-card-subtitle small ellipsis secondary">科幻</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="trakt-card trakt-summary-card ted-lasso-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/shows/ted-lasso">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="https://media.trakt.tv/images/shows/000/162/639/posters/thumb/abc.jpg.webp" alt="Poster for Ted Lasso"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">Ted Lasso</p>
              <p class="trakt-card-subtitle small ellipsis secondary">喜剧</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/discover/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.localStorage.setItem('oidc.user:https://trakt.tv:201dc70c5ec6af530f12f079ea1922733f6e1085ad7b02f36d8e011b75bcea7d', JSON.stringify({
    access_token: 'MRFxwLmnjEtkmuEvPMuuiELNaiPRoFYd'
  }));

  const requested = [];
  dom.window.fetch = async (url) => {
    const target = String(url);
    requested.push(target);
    if (target.includes('/intl/bulk')) {
      // 批量接口这批 id 没给中文（网页端遇到的就是这种情况）
      return { ok: true, clone() { return this; }, json: async () => ({ movie: {}, show: {} }) };
    }
    if (target.includes('/shows/157599/translations/zh')) {
      return {
        ok: true,
        clone() { return this; },
        json: async () => ([
          { language: 'zh', country: 'tw', title: '綠光軍團' },
          { language: 'zh', country: 'cn', title: '绿灯军团' }
        ])
      };
    }
    if (target.includes('/shows/162639/translations/zh')) {
      // cn 记录存在但 title 为空，只有繁体有名字
      return {
        ok: true,
        clone() { return this; },
        json: async () => ([
          { language: 'zh', country: 'hk', title: '乜都得教練' },
          { language: 'zh', country: 'tw', title: '泰德拉索：錯棚教練趣事多' },
          { language: 'zh', country: 'cn', title: null }
        ])
      };
    }
    throw new Error('Unknown URL: ' + target);
  };

  evalSourceWithApiKey(dom);
  await wait(320);

  const doc = dom.window.document;
  const title = doc.querySelector('.lanterns-card .trakt-card-title');
  assert.strictEqual(title.textContent, '绿灯军团',
    'the public translations endpoint fills the gap the bulk endpoint left');
  assert.strictEqual(doc.querySelector('.lanterns-card .trakt-helper-original-title').textContent, '(Lanterns)');
  assert(requested.some((url) => url.includes('/intl/bulk')), 'the bulk endpoint is tried first');
  assert(requested.some((url) => url.includes('/shows/157599/translations/zh')),
    'the translations endpoint is used as the fallback');
  assert(!requested.some((url) => /\/shows\/lanterns\?/.test(url)),
    'the trakt id is read from the poster URL instead of resolving the slug again');

  const tedCard = doc.querySelector('.ted-lasso-card');
  assert.strictEqual(tedCard.querySelector('.trakt-card-title').textContent, 'Ted Lasso',
    'a title that only has traditional Chinese variants stays English');
  assert.strictEqual(tedCard.querySelector('.trakt-helper-original-title'), null,
    'no (Original) line without a simplified Chinese title');
}

async function runDiscoverEpisodeCardTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="trakt-card trakt-summary-card night-agent-card">
      <div class="trakt-card-content">
        <a class="trakt-link" href="/shows/the-night-agent/seasons/2/episodes/1">
          <div class="trakt-summary-poster"><div class="trakt-card-cover"><img src="https://media.trakt.tv/images/shows/000/170/228/posters/thumb/abc.jpg.webp" alt="Poster for The Night Agent"></div></div>
          <div class="trakt-summary-card-details">
            <div class="trakt-summary-card-titles">
              <p class="trakt-card-title ellipsis">The Night Agent</p>
              <p class="trakt-card-subtitle small secondary ellipsis"><bdi dir="ltr">S2 • E1</bdi> - Call</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </body></html>`, {
    url: 'https://app.trakt.tv/discover/releases',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.sessionStorage.setItem('trakt_media_info_cache', JSON.stringify({
    'show:the-night-agent': { type: 'show', slug: 'the-night-agent', id: 170228, title: 'The Night Agent' }
  }));
  dom.window.sessionStorage.setItem('trakt_intl_zh_cache', JSON.stringify({
    'show:170228': '暗夜情报员'
  }));

  evalSourceWithApiKey(dom);
  await wait(200);

  const doc = dom.window.document;
  assert.strictEqual(doc.querySelector('.night-agent-card .trakt-card-title').textContent, 'The Night Agent',
    'episode cards on /discover/releases are left to the app');
  assert.strictEqual(doc.querySelector('.night-agent-card .trakt-helper-original-title'), null,
    'episode cards get no extra original title line');
  assert.strictEqual(doc.querySelector('.night-agent-card .trakt-card-subtitle').textContent, 'S2 • E1 - Call',
    'the episode line is untouched');
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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
  await wait(180);

  const doc = dom.window.document;
  const title = doc.querySelector('.trakt-now-playing-content > span.bold.ellipsis');
  assert.strictEqual(title.textContent, '暗夜情报员', 'show name sits on the first line');
  const episodeLine = doc.querySelector('.trakt-now-playing-content > .trakt-helper-now-playing-episode');
  assert(episodeLine, 'episodes get a dedicated second line');
  assert.strictEqual(episodeLine.textContent, 'S2 • E1');
  assert(episodeLine.classList.contains('small') && episodeLine.classList.contains('secondary'),
    'second line reuses the app small/secondary styles');
  assert(
    /\.trakt-now-playing-container \.trakt-helper-now-playing-episode\s*\{[^}]*font-weight:\s*500/.test(styleSource),
    'the episode line matches the app episode-title weight (500) so it does not read as dim'
  );
  assert(
    !/\.trakt-helper-now-playing-episode[^{};]*\{[^}]*color\s*:/.test(styleSource),
    'the episode line keeps the app colour (same as the page card) instead of overriding it'
  );
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

  evalSourceWithApiKey(dom);
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

  evalSourceWithApiKey(dom);
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


// tvtime.trakt.tv（新版 TV Time 网页）：横版卡片 article.media-row。
// 官方把英文原名写在 aria-label 里，扩展要按页面当前语言
// 调官方 translations 接口补本地化剧名与单集名，并把英文原名缩成副行。
async function runTvTimeMediaRowTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-cn><body>
    <article class="media-row">
      <a class="media-row-thumb-link" href="/shows/cyberpunk-edgerunners" aria-label="Cyberpunk: Edgerunners">
        <div class="media-row-thumb">
          <img src="https://media.trakt.tv/images/shows/000/157/599/posters/thumb/cyberpunk.webp" alt="Cyberpunk: Edgerunners">
        </div>
      </a>
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/cyberpunk-edgerunners" aria-label="Cyberpunk: Edgerunners">Cyberpunk: Edgerunners</a>
        <div class="media-row-meta"><span>S02 E02 · 11/20</span></div>
        <a class="media-row-subtitle" href="/shows/cyberpunk-edgerunners/seasons/2/episodes/2" aria-label="Give Me Another Day">Give Me Another Day</a>
      </div>
    </article>
    <article class="media-row non-media-row">
      <a class="media-row-title" href="/friends" aria-label="Friends">Friends</a>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const isEpisode = String(url).includes('/episodes/2/translations');
    // 接口返回同一语言的多个地区变体，必须挑当前地区 cn 的简体，不能拿 tw/hk 繁体补位。
    const body = isEpisode
      ? [
          { title: '給我一個明天', language: 'zh', country: 'tw' },
          { title: '给我一个明天', language: 'zh', country: 'cn' },
        ]
      : [
          { title: '電馭叛客：邊緣行者', language: 'zh', country: 'tw' },
          { title: '赛博朋克：边缘行者', language: 'zh', country: 'cn' },
        ];
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const row = doc.querySelector('article.media-row');
  const title = row.querySelector('a.media-row-title');
  const subtitle = row.querySelector('a.media-row-subtitle');

  // 剧名和单集名是两次独立的异步请求，按完成顺序先后写回 DOM，
  // 这里轮询等待而不是固定 sleep，避免机器慢时偶发失败。
  for (let i = 0; i < 40 && (title.textContent !== '赛博朋克：边缘行者' || subtitle.textContent !== '给我一个明天'); i++) {
    await wait(50);
  }

  assert.strictEqual(title.textContent, '赛博朋克：边缘行者', 'show title is localized (simplified, not traditional)');
  assert.strictEqual(subtitle.textContent, '给我一个明天', 'episode title is localized (simplified)');
  const original = row.querySelector('.trakt-helper-original-title');
  assert.ok(original, 'original show title line is added');
  assert.strictEqual(original.textContent, 'Cyberpunk: Edgerunners');
  assert.strictEqual(title.nextElementSibling, original, 'original line sits right under the title');

  assert.ok(
    calls.some((u) => u.includes('api.trakt.tv/shows/cyberpunk-edgerunners/translations/zh')),
    'uses the language from html[lang]'
  );
  assert.ok(
    calls.some((u) => u.includes('/seasons/2/episodes/2/translations/zh')),
    'episode translations endpoint is used'
  );
  const secondTitle = doc.querySelectorAll('article.media-row')[1].querySelector('a.media-row-title');
  assert.strictEqual(secondTitle.textContent, 'Friends', 'rows whose title link is not a show/movie are skipped');

  // 重复扫描不能叠加第二行原名
  await wait(200);
  assert.strictEqual(row.querySelectorAll('.trakt-helper-original-title').length, 1, 'original line is not duplicated');
}

// 其他站点不跑 tvtime 的逻辑。
async function runTvTimeIsolationTest() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <article class="media-row">
      <a class="media-row-title" href="/shows/see" aria-label="See">See</a>
      <div class="media-row-body"><img src="https://media.trakt.tv/images/shows/000/123/456/x.webp"></div>
    </article>
  </body></html>`, {
    url: 'https://app.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });
  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), clone() { return this; } });
  };
  evalSourceWithApiKey(dom);
  await wait(200);

  const doc = dom.window.document;
  assert.strictEqual(doc.querySelector('a.media-row-title').textContent, 'See', 'no localization on app.trakt.tv');
  assert.strictEqual(doc.querySelector('.trakt-helper-original-title'), null);
  assert.ok(!calls.some((u) => u.includes('translations/zh')), 'no translations request outside tvtime');
}


// 扩展环境下，请求必须走 postMessage → bridge.js → background 代发，
// 因为 content script 在页面环境（world: MAIN）里直接 fetch 会被 CORS 挡掉，
// 而且 MAIN world 本身也拿不到 chrome.runtime。
async function runTvTimeBackgroundRelayTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-cn><body>
    <article class="media-row">
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/house-of-the-dragon" aria-label="House of the Dragon">House of the Dragon</a>
        <div class="media-row-meta"><span>S02 E05</span></div>
        <a class="media-row-subtitle" href="/shows/house-of-the-dragon/seasons/2/episodes/5" aria-label="Regent">Regent</a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });

  const messages = [];
  // 模拟隔离世界的 bridge.js：页面 fetch 被 CORS 拦截，只有桥接消息能拿到译名。
  dom.window.addEventListener('message', (event) => {
    const message = event.data;
    if (message && message.type === 'trakt-titles:bridge-ready-request') {
      dom.window.postMessage({ type: 'trakt-titles:bridge-ready' }, dom.window.location.origin);
      return;
    }
    if (!message || message.type !== 'trakt-titles:request-translations') return;
    messages.push(message);
    const isEpisode = message.path.includes('/episodes/');
    setTimeout(() => dom.window.postMessage({
      type: 'trakt-titles:translations-response',
      requestId: message.requestId,
      response: {
        ok: true,
        translations: isEpisode
          ? [{ title: '摄政王', language: 'zh', country: 'cn' }]
          : [
              { title: '龍族前傳', language: 'zh', country: 'tw' },
              { title: '权力的游戏前传：龙族', language: 'zh', country: 'cn' },
            ],
      },
    }, dom.window.location.origin), 5);
  });
  dom.window.fetch = () => Promise.reject(new Error('CORS blocked'));

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const row = doc.querySelector('article.media-row');
  const title = row.querySelector('a.media-row-title');
  const subtitle = row.querySelector('a.media-row-subtitle');

  for (let i = 0; i < 40 && title.textContent !== '权力的游戏前传：龙族'; i++) await wait(50);

  assert.ok(messages.length >= 1, 'requests are relayed through the isolated-world bridge');
  assert.strictEqual(messages[0].type, 'trakt-titles:request-translations');
  assert.ok(
    messages.some((m) => m.path === '/shows/house-of-the-dragon/translations/zh'),
    'show translation path is relayed'
  );
  assert.ok(
    messages.some((m) => m.path === '/shows/house-of-the-dragon/seasons/2/episodes/5/translations/zh'),
    'episode translation path is relayed'
  );
  assert.strictEqual(title.textContent, '权力的游戏前传：龙族', 'title comes back from the background relay');
  assert.strictEqual(subtitle.textContent, '摄政王', 'episode title comes back too');
}

// 页面语言不是中文时，必须请求该语言并选中对应地区，而不是继续写死 zh/cn。
async function runTvTimeJapaneseLocaleTest() {
  const dom = new JSDOM(`<!doctype html><html lang=ja-JP><body>
    <article class="media-row">
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/cyberpunk-edgerunners" aria-label="Cyberpunk: Edgerunners">Cyberpunk: Edgerunners</a>
        <div class="media-row-meta"><span>S02 E02</span></div>
        <a class="media-row-subtitle" href="/shows/cyberpunk-edgerunners/seasons/2/episodes/2" aria-label="Give Me Another Day">Give Me Another Day</a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const isEpisode = String(url).includes('/episodes/');
    const body = isEpisode
      ? [{ title: 'もう一日をくれ', language: 'ja', country: 'jp' }]
      : [{ title: 'サイバーパンク：エッジランナーズ', language: 'ja', country: 'jp' }];
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const title = doc.querySelector('a.media-row-title');
  const subtitle = doc.querySelector('a.media-row-subtitle');
  for (let i = 0; i < 40 && (title.textContent !== 'サイバーパンク：エッジランナーズ' || subtitle.textContent !== 'もう一日をくれ'); i++) {
    await wait(50);
  }

  assert.strictEqual(title.textContent, 'サイバーパンク：エッジランナーズ');
  assert.strictEqual(subtitle.textContent, 'もう一日をくれ');
  assert.ok(
    calls.some((u) => u.includes('/shows/cyberpunk-edgerunners/translations/ja')),
    'requests the language shown by html[lang]'
  );
  assert.ok(
    calls.some((u) => u.includes('/seasons/2/episodes/2/translations/ja')),
    'localizes episodes in the configured language'
  );
}

// 桥接已经就绪但请求失败时，页面 fetch 注定会被 CORS 拦截，不能继续制造错误。
async function runTvTimeBridgeFailureDoesNotFallbackTest() {
  const dom = new JSDOM(`<!doctype html><html lang=ja-JP><body>
    <article class="media-row">
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/bridge-failure" aria-label="Bridge Failure">Bridge Failure</a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });

  let pageFetchCalls = 0;
  dom.window.fetch = () => {
    pageFetchCalls++;
    return Promise.reject(new Error('CORS blocked'));
  };
  dom.window.addEventListener('message', (event) => {
    const message = event.data;
    if (message && message.type === 'trakt-titles:bridge-ready-request') {
      dom.window.postMessage({ type: 'trakt-titles:bridge-ready' }, dom.window.location.origin);
      return;
    }
    if (!message || message.type !== 'trakt-titles:request-translations') return;
    setTimeout(() => dom.window.postMessage({
      type: 'trakt-titles:translations-response',
      requestId: message.requestId,
      response: { ok: false, status: 500 },
    }, dom.window.location.origin), 5);
  });

  evalSourceWithApiKey(dom);
  await wait(300);

  assert.strictEqual(pageFetchCalls, 0, 'bridge failures do not fall back to a CORS-blocked page fetch');
  assert.strictEqual(
    dom.window.document.querySelector('a.media-row-title').textContent,
    'Bridge Failure',
    'failed bridge requests leave the original title intact'
  );
}

// 地区精确匹配优先；没有精确地区时允许同语言的通用条目。
async function runTvTimeRegionalFallbackTest() {
  const dom = new JSDOM(`<!doctype html><html lang=fr-CA><body>
    <article class="media-row">
      <div class="media-row-body">
        <a class="media-row-title" href="/movies/arrival-2016" aria-label="Arrival">Arrival</a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/movies/watchlist',
    runScripts: 'outside-only',
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { title: 'Arrivée', language: 'fr', country: null },
        { title: 'L’Arrivée', language: 'fr', country: 'fr' },
      ]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const title = doc.querySelector('a.media-row-title');
  for (let i = 0; i < 40 && title.textContent !== 'Arrivée'; i++) await wait(50);

  assert.strictEqual(title.textContent, 'Arrivée', 'generic French translation is used when fr-CA is absent');
  assert.ok(calls.some((u) => u.includes('/movies/arrival-2016/translations/fr')));
}

// 简体页面不能拿繁体补位；接口只返回英文原名时保持单行，不加重复的副标题。
async function runTvTimeNoFalseTranslationTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-CN><body>
    <article class="media-row simplified">
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/simplified-missing" aria-label="Simplified Missing">Simplified Missing</a>
      </div>
    </article>
    <article class="media-row unchanged">
      <div class="media-row-body">
        <a class="media-row-title" href="/shows/unchanged" aria-label="Unchanged">Unchanged</a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/watchlist',
    runScripts: 'outside-only',
  });

  dom.window.fetch = (url) => {
    const body = String(url).includes('simplified-missing')
      ? [{ title: '繁體譯名', language: 'zh', country: 'tw' }]
      : [{ title: 'Unchanged', language: 'zh', country: 'cn' }];
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);
  await wait(300);

  const doc = dom.window.document;
  const simplified = doc.querySelector('.simplified');
  const unchanged = doc.querySelector('.unchanged');
  assert.strictEqual(simplified.querySelector('a.media-row-title').textContent, 'Simplified Missing');
  assert.strictEqual(simplified.querySelector('.trakt-helper-original-title'), null);
  assert.strictEqual(unchanged.querySelector('a.media-row-title').textContent, 'Unchanged');
  assert.strictEqual(unchanged.querySelector('.trakt-helper-original-title'), null);
}

// Discover、Popular 和详情页「更多类似」共用 .poster-card。
// 标题节点是 <p class="poster-title">，英文原名要从海报链接的 aria-label 保存。
async function runTvTimePosterCardTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-CN><body>
    <div class="poster-card show-card">
      <div class="poster-frame">
        <a href="/shows/cyberpunk-edgerunners" aria-label="Cyberpunk: Edgerunners">
          <img src="https://media.trakt.tv/images/shows/000/163/705/posters/thumb/a.jpg.webp">
        </a>
      </div>
      <p class="poster-title">Cyberpunk: Edgerunners</p>
    </div>
    <div class="poster-card movie-card">
      <div class="poster-frame">
        <a href="/movies/arrival-2016" aria-label="Arrival">
          <img src="https://media.trakt.tv/images/movies/000/114/150/posters/thumb/a.jpg.webp">
        </a>
      </div>
      <p class="poster-title">Arrival</p>
    </div>
    <div class="discover-spotlight-content">
      <span class="discover-spotlight-eyebrow">热门剧集</span>
      <a class="discover-spotlight-title" href="/shows/slow-horses">Slow Horses</a>
      <span class="discover-spotlight-meta">2022</span>
    </div>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/popular/shows',
    runScripts: 'outside-only',
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const path = String(url);
    let body = [];
    if (path.includes('/shows/cyberpunk-edgerunners/')) {
      body = [{ title: '赛博朋克：边缘行者', language: 'zh', country: 'cn' }];
    } else if (path.includes('/movies/arrival-2016/')) {
      body = [{ title: '降临', language: 'zh', country: 'cn' }];
    } else if (path.includes('/shows/slow-horses/')) {
      body = [{ title: '流人', language: 'zh', country: 'cn' }];
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const showTitle = doc.querySelector('.show-card .poster-title');
  const movieTitle = doc.querySelector('.movie-card .poster-title');
  const spotlightTitle = doc.querySelector('.discover-spotlight-title');
  for (let i = 0; i < 40 && (
    showTitle.textContent !== '赛博朋克：边缘行者'
    || movieTitle.textContent !== '降临'
    || spotlightTitle.textContent !== '流人'
  ); i++) {
    await wait(50);
  }

  assert.strictEqual(showTitle.textContent, '赛博朋克：边缘行者');
  assert.strictEqual(
    doc.querySelector('.show-card .trakt-helper-original-title').textContent,
    'Cyberpunk: Edgerunners',
    'poster title keeps the original title from the media link'
  );
  assert.strictEqual(movieTitle.textContent, '降临');
  assert.strictEqual(
    doc.querySelector('.movie-card .trakt-helper-original-title').textContent,
    'Arrival',
    'movie poster titles are localized too'
  );
  assert.strictEqual(
    spotlightTitle.textContent,
    'Slow Horses',
    'the Svelte-managed spotlight link is not overwritten'
  );
  assert.strictEqual(
    doc.querySelector('.trakt-helper-discover-localized-title').textContent,
    '流人',
    'discover spotlight gets a separate localized title node'
  );
  assert.ok(
    spotlightTitle.classList.contains('trakt-helper-discover-original-title'),
    'the original spotlight link is styled as the secondary title'
  );
  assert.ok(calls.some((u) => u.includes('/shows/cyberpunk-edgerunners/translations/zh')));
  assert.ok(calls.some((u) => u.includes('/movies/arrival-2016/translations/zh')));

  await wait(200);
  assert.strictEqual(doc.querySelectorAll('.show-card .trakt-helper-original-title').length, 1);
  assert.strictEqual(doc.querySelectorAll('.trakt-helper-discover-localized-title').length, 1);
}

// Discover 焦点位由 Svelte 复用同一个链接。切换作品时先改 href，再改标题文本；
// 旧译名不能残留，新译名也不能被 Svelte 的后续文本更新覆盖。
async function runTvTimeDiscoverSpotlightSwitchTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-CN><body>
    <div class="discover-spotlight-content">
      <span class="discover-spotlight-eyebrow">热门剧集</span>
      <a class="discover-spotlight-title" href="/shows/slow-horses">Slow Horses</a>
      <span class="discover-spotlight-meta">2022</span>
    </div>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/discover',
    runScripts: 'outside-only',
  });

  dom.window.fetch = (url) => {
    const title = String(url).includes('/shows/dark-matter-2024/')
      ? '暗物质'
      : '流人';
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ title, language: 'zh', country: 'cn' }]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const body = doc.querySelector('.discover-spotlight-content');
  const title = doc.querySelector('.discover-spotlight-title');
  const localizedTitle = () => body.querySelector('.trakt-helper-discover-localized-title');
  for (let i = 0; i < 40 && (!localizedTitle() || localizedTitle().textContent !== '流人'); i++) {
    await wait(50);
  }

  assert.strictEqual(localizedTitle().textContent, '流人');
  assert.strictEqual(title.textContent, 'Slow Horses');

  // Svelte 第一步：复用节点，只把链接切到下一部作品。
  const oldLocalizedNode = localizedTitle();
  title.setAttribute('href', '/shows/dark-matter-2024');
  await wait(120);
  assert.notStrictEqual(
    localizedTitle(),
    oldLocalizedNode,
    'the previous localized node is removed on identity change'
  );
  if (localizedTitle()) {
    assert.strictEqual(localizedTitle().textContent, '暗物质');
  }
  assert.strictEqual(title.textContent, 'Slow Horses', 'the extension does not invent the next title');

  // Svelte 第二步：更新同一节点的文本。扩展随后插入新作品的独立译名节点。
  title.textContent = 'Dark Matter';
  for (let i = 0; i < 40 && (!localizedTitle() || localizedTitle().textContent !== '暗物质'); i++) {
    await wait(50);
  }

  assert.strictEqual(localizedTitle().textContent, '暗物质');
  assert.strictEqual(title.textContent, 'Dark Matter', 'Svelte still owns the original title text');
  assert.strictEqual(body.querySelectorAll('.trakt-helper-discover-localized-title').length, 1);
  assert.strictEqual(body.querySelectorAll('.trakt-helper-original-title').length, 0);
  assert.notStrictEqual(
    localizedTitle(),
    oldLocalizedNode,
    'the previous localized node is replaced when the media changes'
  );
}

// Upcoming 和首页侧栏都复用 article.media-row；一次扫描要同时更新剧名和单集名。
async function runTvTimeUpcomingTest() {
  const dom = new JSDOM(`<!doctype html><html lang=zh-CN><body>
    <section class="upcoming-week">
      <article class="media-row">
        <a class="media-row-thumb-link" href="/shows/the-simpsons/seasons/38/episodes/4" aria-label="Treehouse of Horror XXXVII">
          <img src="https://media.trakt.tv/images/shows/000/000/455/posters/thumb/a.jpg.webp" alt="The Simpsons">
        </a>
        <div class="media-row-body">
          <a class="media-row-title" href="/shows/the-simpsons" aria-label="The Simpsons">The Simpsons</a>
          <div class="media-row-meta"><span>S38 E04</span></div>
          <a class="media-row-subtitle" href="/shows/the-simpsons/seasons/38/episodes/4" aria-label="Treehouse of Horror XXXVII">Treehouse of Horror XXXVII</a>
        </div>
      </article>
      <article class="media-row">
        <a class="media-row-thumb-link" href="/shows/bleach/seasons/2/episodes/50" aria-label="Episode 50">
          <img src="https://media.trakt.tv/images/shows/000/030/850/posters/thumb/a.jpg.webp" alt="Bleach">
        </a>
        <div class="media-row-body">
          <a class="media-row-title" href="/shows/bleach" aria-label="Bleach">Bleach</a>
          <div class="media-row-meta"><span>S02 E50</span></div>
          <a class="media-row-subtitle" href="/shows/bleach/seasons/2/episodes/50" aria-label="Episode 50">Episode 50</a>
        </div>
      </article>
    </section>
  </body></html>`, {
    url: 'https://tvtime.trakt.tv/shows/upcoming',
    runScripts: 'outside-only',
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const path = String(url);
    let body;
    if (path.includes('/episodes/4/translations/')) {
      body = [{ title: '恐怖树屋特辑XXXVII', language: 'zh', country: 'cn' }];
    } else if (path.includes('/episodes/50/translations/')) {
      body = [];
    } else if (path.includes('/shows/the-simpsons/translations/')) {
      body = [{ title: '辛普森一家', language: 'zh', country: 'cn' }];
    } else {
      body = [{ title: '死神', language: 'zh', country: 'cn' }];
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);

  const doc = dom.window.document;
  const rows = doc.querySelectorAll('article.media-row');
  const simpsonsTitle = rows[0].querySelector('.media-row-title');
  const simpsonsEpisode = rows[0].querySelector('.media-row-subtitle');
  const bleachTitle = rows[1].querySelector('.media-row-title');
  const bleachEpisode = rows[1].querySelector('.media-row-subtitle');
  for (let i = 0; i < 40 && (
    simpsonsTitle.textContent !== '辛普森一家'
    || simpsonsEpisode.textContent !== '恐怖树屋特辑XXXVII'
    || bleachTitle.textContent !== '死神'
  ); i++) {
    await wait(50);
  }

  assert.strictEqual(simpsonsTitle.textContent, '辛普森一家');
  assert.strictEqual(simpsonsEpisode.textContent, '恐怖树屋特辑XXXVII');
  assert.strictEqual(bleachTitle.textContent, '死神');
  assert.strictEqual(
    bleachEpisode.textContent,
    'Episode 50',
    'an unavailable episode translation leaves the original episode title intact'
  );
  assert.ok(calls.some((u) => u.includes('/shows/the-simpsons/translations/zh')));
  assert.ok(calls.some((u) => u.includes('/seasons/38/episodes/4/translations/zh')));
  assert.strictEqual(
    doc.querySelectorAll('article.media-row .trakt-helper-original-title').length,
    2,
    'each upcoming row has one original show title line'
  );
}


// ---------------------------------------------------------------------------
// og.trakt.tv（OG Redux）
// ---------------------------------------------------------------------------
async function runOgTrendingTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <section class="chart-hero">
      <h2 class="name"><a href="/shows/mobland"><img class="trimmed-logo" src="logo1.webp" alt="MobLand"></a></h2>
      <p class="overview">Two mob families clash in a war that threatens to topple empires and lives.</p>
    </section>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3 class="title-logo"><a class="titles-link" href="/shows/tulsa-king"><img class="trimmed-logo" src="logo2.webp" alt="Tulsa King"></a></h3>
      </div>
    </article>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/visionquest">VisionQuest</a><span class="year">2026</span></h3>
      </div>
    </article>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/law-and-order">Law &amp; Order</a><span class="year">1990</span></h3>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const target = String(url);
    let body = [];
    if (target.includes('/shows/mobland/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: null, overview: '两大黑帮家族的权力争斗将伦敦地下世界卷入战争。' }];
    } else if (target.includes('/shows/tulsa-king/translations/zh')) {
      body = [
        { language: 'zh', country: 'tw', title: '塔爾薩之王', overview: '繁體簡介' },
        { language: 'zh', country: 'cn', title: '塔尔萨之王', overview: '简体简介' },
      ];
    } else if (target.includes('/shows/visionquest/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '幻视任务' }];
    } else if (target.includes('/shows/law-and-order/translations/zh')) {
      // 只有繁体条目时不能拿来补位（简繁是不同书写系统）。
      body = [{ language: 'zh', country: 'tw', title: '法網遊龍' }];
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);
  await wait(1500);

  const doc = dom.window.document;
  const cards = doc.querySelectorAll('article.fanart-card');

  // logo 卡：隐藏英文 logo，写入中文；原名进 tooltip。
  const tulsa = cards[0].querySelector('h3');
  assert.strictEqual(tulsa.textContent.trim(), '塔尔萨之王', 'logo card is replaced by the simplified title');
  assert(tulsa.querySelector('img.trimmed-logo').classList.contains('trakt-helper-og-logo-hidden'), 'the English logo is hidden');
  assert.ok(tulsa.getAttribute('title').includes('Tulsa King'), 'the English original is kept in the tooltip');
  assert.ok(!tulsa.getAttribute('title').includes('塔爾薩'), 'traditional Chinese is never used');

  // 文本卡：只改标题链接的文本，年份 span 保留。
  const vision = cards[1].querySelector('h3');
  assert.strictEqual(vision.querySelector('a.titles-link').textContent, '幻视任务');
  assert.strictEqual(vision.querySelector('.year').textContent, '2026');

  // 只有繁体译名：保持英文，不隐藏任何 logo/文本。
  const law = cards[2].querySelector('h3');
  assert.strictEqual(law.querySelector('a.titles-link').textContent, 'Law & Order');

  // 焦点位：MobLand 没有简体标题，logo 保留，但简介要翻译。
  const hero = doc.querySelector('section.chart-hero');
  const heroImage = hero.querySelector('img.trimmed-logo');
  assert(!heroImage.classList.contains('trakt-helper-og-logo-hidden'), 'no simplified title keeps the English logo');
  assert.strictEqual(hero.querySelector('h2.name .trakt-helper-og-title'), null);
  assert.strictEqual(
    hero.querySelector('p.overview').textContent,
    '两大黑帮家族的权力争斗将伦敦地下世界卷入战争。'
  );
  assert.strictEqual(hero.querySelector('.trakt-helper-og-original'), null, 'no original line without a translation');

  assert.ok(calls.some((u) => u.includes('/shows/tulsa-king/translations/zh')));

  // 重复扫描不能叠加译名节点。
  await wait(300);
  assert.strictEqual(tulsa.querySelectorAll('.trakt-helper-og-title').length, 1);
  assert.strictEqual(tulsa.querySelectorAll('img.trakt-helper-og-logo-hidden').length, 1);
}

async function runOgDetailTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <section class="summary-frame">
      <div class="container"><div class="columns"><div class="info" id="overview">
        <div class="top"><div class="details">
          <p class="tagline">Welcome to the real world.</p>
          <div class="overview collapsed">A computer hacker learns from mysterious rebels about the true nature of his reality.</div>
        </div></div>
      </div></div></div>
    </section>
    <section class="fanart-header">
      <div class="summary"><div class="summary-title">
        <h1>The Matrix <span class="year">1999</span> <span class="certification">R</span></h1>
      </div></div>
    </section>
  </body></html>`, {
    url: 'https://og.trakt.tv/movies/the-matrix-1999',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{
        language: 'zh',
        country: 'cn',
        title: '黑客帝国',
        tagline: '欢迎来到现实世界',
        overview: '不久的将来，网络黑客尼奥对这个看似正常的现实世界产生了怀疑。',
      }]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);
  await wait(1500);

  const doc = dom.window.document;
  const h1 = doc.querySelector('.summary-title h1');
  assert.strictEqual(h1.firstChild.nodeValue.trim(), '黑客帝国', 'movie title is localized');
  assert.strictEqual(h1.querySelector('.year').textContent, '1999', 'year stays');
  assert.strictEqual(h1.querySelector('.certification').textContent, 'R', 'certification stays');

  const original = doc.querySelector('.trakt-helper-og-original');
  assert(original, 'original title line is added');
  assert.strictEqual(original.textContent, 'The Matrix', 'original line contains the title only, not the year');
  assert.strictEqual(original.previousElementSibling, h1);

  assert.strictEqual(
    doc.querySelector('.summary-frame .details > .overview').textContent,
    '不久的将来，网络黑客尼奥对这个看似正常的现实世界产生了怀疑。'
  );
  assert.strictEqual(doc.querySelector('.tagline').textContent, '欢迎来到现实世界');

  // 重复扫描不叠行。
  await wait(300);
  assert.strictEqual(doc.querySelectorAll('.trakt-helper-og-original').length, 1);
  assert.ok(calls.some((u) => u.includes('/movies/the-matrix-1999/translations/zh')));
}

async function runOgEpisodeTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <section class="summary-frame">
      <div class="container"><div class="columns"><div class="info" id="overview">
        <div class="top"><div class="details">
          <div class="overview collapsed"><div class="read-more">Mark is promoted to lead a team who've had their memories surgically divided.</div></div>
        </div></div>
      </div></div></div>
    </section>
    <section class="fanart-header">
      <div class="summary"><div class="episode-title">
        <h1><strong>1x01</strong> Good News About Hell <span class="year">2022</span></h1>
      </div></div>
    </section>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/severance/seasons/1/episodes/1',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{
        language: 'zh',
        country: 'cn',
        title: '有关地狱的好消息',
        overview: '马克升职成为部门主管。',
      }]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);
  await wait(1500);

  const doc = dom.window.document;
  const h1 = doc.querySelector('.episode-title h1');
  assert.strictEqual(h1.querySelector('strong').textContent, '1x01', 'episode number is untouched');
  assert.ok(h1.textContent.includes('有关地狱的好消息'), 'episode title is localized');
  assert.strictEqual(doc.querySelector('.trakt-helper-og-original').textContent, 'Good News About Hell');
  assert.strictEqual(
    doc.querySelector('.summary-frame .details > .overview').textContent,
    '马克升职成为部门主管。',
    'overview nested in .read-more is localized'
  );
  assert.ok(calls.some((u) => u.includes('/shows/severance/seasons/1/episodes/1/translations/zh')));
}

async function runOgSeasonRowsTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <section class="fanart-header">
      <div class="summary"><div class="summary-title">
        <h1>Season 1 <span class="year">2022</span></h1>
      </div></div>
    </section>
    <section class="summary-frame">
      <div class="container"><div class="columns"><div class="info" id="overview">
        <div class="top"><div class="details">
          <div class="overview collapsed">At Lumon Industries, employees undergo severance.</div>
        </div></div>
        <section class="episodes">
          <article class="row">
            <div class="info">
              <div class="titles">
                <h3 id="episode-4648809">
                  <a href="/shows/severance/seasons/1/episodes/1"><span class="number">1x01</span></a>
                  <a href="/shows/severance/seasons/1/episodes/1">Good News About Hell</a>
                </h3>
              </div>
              <div class="overview">Mark is promoted to lead a team.</div>
            </div>
          </article>
          <article class="row">
            <div class="info">
              <div class="titles">
                <h3 id="episode-4648810">
                  <a href="/shows/severance/seasons/1/episodes/2"><span class="number">1x02</span></a>
                  <a href="/shows/severance/seasons/1/episodes/2">Half Loop</a>
                </h3>
              </div>
              <div class="overview">The team train new hire Helly.</div>
            </div>
          </article>
        </section>
      </div></div></div>
    </section>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/severance/seasons/1',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const target = String(url);
    let body;
    if (target.includes('/seasons/1/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', overview: '员工们接受了记忆切割手术。' }];
    } else if (target.includes('/episodes/2/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '半环', overview: '团队对新员工进行培训。' }];
    } else {
      body = [{ language: 'zh', country: 'cn', title: '有关地狱的好消息', overview: '马克升职成为部门主管。' }];
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);
  await wait(1500);

  const doc = dom.window.document;
  const rows = doc.querySelectorAll('article.row h3');
  const rowText = (row) => row.textContent.replace(/\s+/g, ' ').trim();
  assert.strictEqual(rowText(rows[0]), '1x01 有关地狱的好消息');
  assert.strictEqual(rowText(rows[1]), '1x02 半环');
  assert.strictEqual(
    doc.querySelector('article.row .overview').textContent,
    '马克升职成为部门主管。'
  );
  assert.strictEqual(
    doc.querySelector('.summary-frame .details > .overview').textContent,
    '员工们接受了记忆切割手术。',
    'season overview is localized'
  );
  assert.ok(calls.some((u) => u.includes('/shows/severance/seasons/1/translations/zh')));
  assert.ok(calls.some((u) => u.includes('/seasons/1/episodes/2/translations/zh')));
}


// Dashboard 的 Upcoming Schedule：周视图用 a.show，焦点卡片用 h4 > a，
// 单集名在 .episodes 里（<b>集号</b> + 文本），都不在 h3 里。
async function runOgUpcomingScheduleTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <section class="panel">
      <div class="schedule">
        <div class="spotlight">
          <h3>Today <span class="date">Nov <b>14</b></span></h3>
          <div class="cards">
            <article class="card">
              <img class="poster" src="poster.webp" alt="">
              <div class="text">
                <h4><a href="/shows/severance">Severance</a></h4>
                <div class="episodes">
                  <div class="line"><a href="/shows/severance/seasons/2/episodes/1"><b>2x01</b> Hello, Ms. Cobel</a></div>
                </div>
              </div>
            </article>
            <article class="card movie-card">
              <img class="poster" src="poster3.webp" alt="">
              <div class="text">
                <h4><a href="/movies/dune-part-two-2024">Dune: Part Two</a></h4>
                <div class="episodes"><div class="line tagline">Long live the fighters.</div></div>
              </div>
            </article>
          </div>
        </div>
        <div class="week">
          <div class="day">
            <h3>Tomorrow <span class="date">Nov <b>15</b></span></h3>
            <ul>
              <li class="row">
                <img class="poster" src="poster2.webp" alt="">
                <span class="text">
                  <a class="show" href="/shows/tulsa-king">Tulsa King</a>
                  <div class="episodes">
                    <div class="line"><a href="/shows/tulsa-king/seasons/3/episodes/1"><b>3x01</b> The Beginning</a></div>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </body></html>`, {
    url: 'https://og.trakt.tv/dashboard',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const target = String(url);
    let body;
    if (target.includes('/shows/severance/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '人生切割术' }];
    } else if (target.includes('/shows/severance/seasons/2/episodes/1/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '你好，科贝尔女士' }];
    } else if (target.includes('/shows/tulsa-king/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '塔尔萨之王' }];
    } else if (target.includes('/shows/tulsa-king/seasons/3/episodes/1/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '开端' }];
    } else if (target.includes('/movies/dune-part-two-2024/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '沙丘2', tagline: '战斗万岁。' }];
    } else {
      body = [];
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);
  await wait(1600);

  const doc = dom.window.document;
  const card = doc.querySelector('.schedule article.card');
  const cardTitle = card.querySelector('h4 a');
  assert.strictEqual(cardTitle.textContent, '人生切割术', 'spotlight card show title is localized');
  assert.ok(cardTitle.getAttribute('title').includes('Severance'));

  const cardEpisode = card.querySelector('.episodes a');
  assert.strictEqual(cardEpisode.querySelector('b').textContent, '2x01', 'episode number stays in <b>');
  assert.strictEqual(
    cardEpisode.textContent.replace(/\s+/g, ' ').trim(),
    '2x01 你好，科贝尔女士',
    'schedule episode title is localized without touching the number'
  );

  const movieCard = doc.querySelector('.schedule article.movie-card');
  assert.strictEqual(movieCard.querySelector('h4 a').textContent, '沙丘2', 'schedule movie title is localized');
  assert.strictEqual(
    movieCard.querySelector('.tagline').textContent,
    '战斗万岁。',
    'schedule movie tagline is localized'
  );

  const rowShow = doc.querySelector('.schedule li.row a.show');
  assert.strictEqual(rowShow.textContent, '塔尔萨之王', 'week row show title is localized');
  const rowEpisode = doc.querySelector('.schedule li.row .episodes a');
  assert.strictEqual(rowEpisode.querySelector('b').textContent, '3x01');
  assert.strictEqual(rowEpisode.textContent.replace(/\s+/g, ' ').trim(), '3x01 开端');

  // 日期标题是界面文案，不能动。
  assert.ok(doc.querySelector('.schedule .spotlight > h3').textContent.startsWith('Today'));

  assert.ok(calls.some((u) => u.includes('/shows/tulsa-king/translations/zh')));
  assert.ok(calls.some((u) => u.includes('/shows/tulsa-king/seasons/3/episodes/1/translations/zh')));
}


// Dashboard 的 Up Next：OnDeckCard 走 PosterCard，把「集号 + 集名」放在同一个文本节点
// （h3 里没有 .number span），替换时必须保留 "3x03" / "3x03 (669)" / "Special 2" 前缀。
async function runOgUpNextTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <article class="poster-card">
      <div class="titles">
        <a class="titles-link" href="/shows/severance/seasons/2/episodes/1"><h3>2x01 Hello, Ms. Cobel</h3></a>
        <div class="show-line"><a class="show-link" href="/shows/severance">Severance</a></div>
      </div>
    </article>
    <article class="poster-card">
      <div class="titles">
        <a class="titles-link" href="/shows/bleach/seasons/2/episodes/50"><h3>2x50 (50) Episode 50</h3></a>
      </div>
    </article>
    <article class="poster-card">
      <div class="titles">
        <a class="titles-link" href="/shows/some-anime/seasons/0/episodes/2"><h3>Special 2 Bonus Episode</h3></a>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/dashboard',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url) => {
    calls.push(String(url));
    const target = String(url);
    let body;
    if (target.includes('/shows/severance/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '人生切割术' }];
    } else if (target.includes('/shows/severance/seasons/2/episodes/1/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '你好，科贝尔女士' }];
    } else if (target.includes('/shows/bleach/seasons/2/episodes/50/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '第50集' }];
    } else if (target.includes('/shows/some-anime/seasons/0/episodes/2/translations/zh')) {
      body = [{ language: 'zh', country: 'cn', title: '特别篇' }];
    } else {
      body = [];
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), clone() { return this; } });
  };

  evalSourceWithApiKey(dom);
  await wait(1600);

  const doc = dom.window.document;
  const cards = doc.querySelectorAll('article.poster-card h3');
  assert.strictEqual(
    cards[0].textContent.replace(/\s+/g, ' ').trim(),
    '2x01 你好，科贝尔女士',
    'episode number stays in front of the localized title'
  );
  assert.strictEqual(
    cards[1].textContent.replace(/\s+/g, ' ').trim(),
    '2x50 (50) 第50集',
    'anime absolute episode numbers are preserved'
  );
  assert.strictEqual(
    cards[2].textContent.replace(/\s+/g, ' ').trim(),
    'Special 2 特别篇',
    'special episode numbers are preserved'
  );

  const showLine = doc.querySelector('a.show-link');
  assert.strictEqual(showLine.textContent, '人生切割术', 'the show line under the episode is localized');

  assert.ok(calls.some((u) => u.includes('/shows/severance/seasons/2/episodes/1/translations/zh')));

  // 重复扫描不能把集号吃掉或叠出第二份。
  await wait(300);
  assert.strictEqual(cards[0].textContent.replace(/\s+/g, ' ').trim(), '2x01 你好，科贝尔女士');
}


// 页面自己的请求头里带着 trakt-api-key：源码不内置 key，等捕获后再发翻译请求。
async function runApiKeyCaptureTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/visionquest">VisionQuest</a></h3>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const calls = [];
  dom.window.fetch = (url, options = {}) => {
    const headers = options.headers || {};
    const key = typeof headers.get === 'function'
      ? headers.get('trakt-api-key')
      : headers['trakt-api-key'];
    calls.push({ url: String(url), key });
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ language: 'zh', country: 'cn', title: '幻视任务' }]),
      clone() { return this; },
    });
  };

  // 不注入配置 key：先等页面自己的请求；封面上没有脚本，扫不到 key，只能靠捕获。
  dom.window.eval(source);
  await wait(300);

  dom.window.fetch('https://apiz.trakt.tv/v3/intl/bulk?language=zh&country=CN', {
    headers: { 'trakt-api-key': 'captured-from-page' },
  });

  const doc = dom.window.document;
  const title = doc.querySelector('article.fanart-card h3');
  for (let i = 0; i < 80 && !/幻视/.test(title.textContent); i++) await wait(50);

  assert.strictEqual(title.textContent.trim(), '幻视任务', 'translation runs once the page key is captured');
  const translationCall = calls.find((call) => call.url.includes('/shows/visionquest/translations/zh'));
  assert(translationCall, 'a translation request is made after capture');
  assert.strictEqual(translationCall.key, 'captured-from-page', 'the captured key is forwarded');
}

// 已登录用户：请求带上 Bearer token，走 AUTHED 限流桶。
async function runApiTokenForwardTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/tulsa-king">Tulsa King</a></h3>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  dom.window.localStorage.setItem('oidc.user:https://auth.trakt.tv:trakt', JSON.stringify({
    access_token: 'user-access-token',
  }));

  const calls = [];
  dom.window.fetch = (url, options = {}) => {
    const headers = options.headers || {};
    const read = (name) => (typeof headers.get === 'function'
      ? headers.get(name)
      : headers[name]);
    calls.push({ url: String(url), key: read('trakt-api-key'), auth: read('authorization') });
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ language: 'zh', country: 'cn', title: '塔尔萨之王' }]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);
  const doc = dom.window.document;
  const title = doc.querySelector('article.fanart-card h3');
  for (let i = 0; i < 80 && !/塔尔萨/.test(title.textContent); i++) await wait(50);

  assert.strictEqual(title.textContent.trim(), '塔尔萨之王');
  const translationCall = calls.find((call) => call.url.includes('/shows/tulsa-king/translations/zh'));
  assert(translationCall, 'translation request is made');
  assert.strictEqual(translationCall.key, 'test-client-id');
  assert.strictEqual(
    translationCall.auth,
    'Bearer user-access-token',
    'the signed-in user token is forwarded so the request uses the authed bucket'
  );
}

// 429 按 Retry-After 退避后重试，不把「限流」当成「没有译名」。
async function runRateLimitBackoffTest() {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/severance">Severance</a></h3>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  let translationAttempts = 0;
  dom.window.fetch = (url) => {
    const target = String(url);
    if (target.includes('/shows/severance/translations/zh')) {
      translationAttempts += 1;
      if (translationAttempts === 1) {
        return Promise.resolve({
          ok: false,
          status: 429,
          headers: { get: (name) => (String(name).toLowerCase() === 'retry-after' ? '0' : null) },
          json: () => Promise.resolve(null),
          clone() { return this; },
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ language: 'zh', country: 'cn', title: '人生切割术' }]),
        clone() { return this; },
      });
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
      clone() { return this; },
    });
  };

  evalSourceWithApiKey(dom);
  const title = dom.window.document.querySelector('article.fanart-card h3');
  for (let i = 0; i < 120 && !/人生切割/.test(title.textContent); i++) await wait(50);

  assert.strictEqual(title.textContent.trim(), '人生切割术');
  assert.ok(translationAttempts >= 2, 'the request is retried after a 429');
}


// 首屏没有带 key 的客户端请求时（服务端渲染页面），从页面已加载的 JS 里读出站点自己的 Client ID。
async function runApiKeyScrapeTest() {
  const dom = new JSDOM(`<!doctype html><html><head>
    <link rel="modulepreload" href="/_app/chunk.js">
  </head><body>
    <article class="fanart-card">
      <div class="title-wrapper">
        <h3><a class="titles-link" href="/shows/visionquest">VisionQuest</a></h3>
      </div>
    </article>
  </body></html>`, {
    url: 'https://og.trakt.tv/shows/trending',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const scrapedKey = 'scraped-key-0123456789abcdefghijklmnopqrstuvwxyz';
  const calls = [];
  dom.window.fetch = (url, options = {}) => {
    const target = String(url);
    if (target.includes('/_app/chunk.js')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('o.set(`trakt-api-key`,`' + scrapedKey + '`)'),
        json: () => Promise.reject(new Error('not json')),
        clone() { return this; },
      });
    }
    const headers = options.headers || {};
    const key = typeof headers.get === 'function' ? headers.get('trakt-api-key') : headers['trakt-api-key'];
    calls.push({ url: target, key });
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ language: 'zh', country: 'cn', title: '幻视任务' }]),
      text: () => Promise.resolve(''),
      clone() { return this; },
    });
  };

  // 不注入配置 key，也不触发页面请求，只能从 JS 里扫。
  dom.window.eval(source);
  const title = dom.window.document.querySelector('article.fanart-card h3');
  for (let i = 0; i < 120 && !/幻视/.test(title.textContent); i++) await wait(50);

  assert.strictEqual(title.textContent.trim(), '幻视任务');
  const translationCall = calls.find((call) => call.url.includes('/shows/visionquest/translations/zh'));
  assert(translationCall, 'translation request is made after scraping the key');
  assert.strictEqual(translationCall.key, scrapedKey, 'the scraped client id is used');
}

(async () => {
  await runSearchTest();
  await runSmartListTest();
  await runSmartListOverviewPosterTest();
  await runLiveResolveTest();
  await runLivePosterResolveTest();
  await runDiscoverTitleTest();
  await runDiscoverTranslationFetchTest();
  await runDiscoverEpisodeCardTest();
  await runNowPlayingTest();
  await runNowPlayingEpisodeTest();
  await runNowPlayingEpisodeTitleTest();
  await runNowPlayingSwitchToMovieTest();
  await runTvTimeMediaRowTest();
  await runTvTimeIsolationTest();
  await runTvTimeBackgroundRelayTest();
  await runTvTimeJapaneseLocaleTest();
  await runTvTimeBridgeFailureDoesNotFallbackTest();
  await runTvTimeRegionalFallbackTest();
  await runTvTimeNoFalseTranslationTest();
  await runTvTimePosterCardTest();
  await runTvTimeDiscoverSpotlightSwitchTest();
  await runTvTimeUpcomingTest();
  await runOgTrendingTest();
  await runOgDetailTest();
  await runOgEpisodeTest();
  await runOgSeasonRowsTest();
  await runOgUpcomingScheduleTest();
  await runOgUpNextTest();
  await runApiKeyCaptureTest();
  await runApiKeyScrapeTest();
  await runApiTokenForwardTest();
  await runRateLimitBackoffTest();
  console.log(`[${process.env.TARGET || 'extension'}] RESULT: ALL PASS`);
  process.exit(0);
})();
