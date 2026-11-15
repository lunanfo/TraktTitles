# Trakt 网页卡片剧名补全

## 需求

Trakt 网页（app.trakt.tv）中：
1. 部分位置只显示海报、不显示剧名，例如推荐、日历、列表、搜索等卡片。
2. 智能列表视图（`/lists/smart/view/...`）等页面只显示英文名，未调用批量本地化接口。
3. 搜索页（`/search`）等部分页面海报后台文本也为英文。
4. 发现页（`/discover/trending`、`/discover/anticipated`、`/discover/popular`）官方自己会用 `intl/bulk` 覆盖剧名，但覆盖失败后会退回英文，同一页面上「有的有双语、有的没有」，且过一会儿中文会消失。

目标：
- 找出缺少剧名的位置并补充剧名。
- 在智能列表视图（`/lists/smart/view`）与搜索页（`/search`）中，通过 Trakt 官方批量接口（`intl/bulk`）获取中文译名，并呈现与待看列表（Watchlist）一致的双语显示（主标题中文名，副标题附带英文原名）。
- 发现页保持官方的「中文 + (English)」两行排版：官方渲染出中文时一律不动，官方退回英文时立刻补回官方中文名。
- **极简请求与性能优先**：已经在 HTML 后台（`aria-label` / `alt`）提供中文名的页面和卡片继续直接取用 DOM，不发起额外 API 请求，避免页面加载卡顿。
- 全局使用 `sessionStorage` 缓存 ID 与中文字态，确保不发起重复查询。
- 优先复用 Trakt 现有组件与样式类名，保持原生 UI 视觉规范。

## 现有实现

`extension/content.js` + `extension/styles.css`（Tampermonkey 版本由 `tools/build-userscript.js` 自动构建到 `userscript/TraktTitles.user.js`）：

1. **DOM 抓取快速补名** —— 从海报链接的 `aria-label` / `img[alt]` / 文本提取中文剧名并清理干扰字样，无需额外网络请求。
2. **官方 bulk 接口批量汉化 & 双语展示** —— 针对智能列表和搜索页未本地化的英文卡片，收集当前视图内的 ID，通过官方 `intl/bulk`（每次最多 100 个 id/类型，超出自动分批）批量请求中文译名，主标题呈现中文名，副标题呈现 `(Original Title)`。
3. **Discover 页中文兜底** —— 官方网页自己也会请求 `intl/bulk` 覆盖剧名（`title` = 中文名、`original_title` = 英文原名，卡片渲染成两行），但那层只要请求失败、被取消、id 超过 100 上限或地区回落成英文就会退回英文；而且 Svelte 改标题是直接改文本节点，只触发 `characterData`。扩展因此：① 顺手把官方自己的 `intl/bulk` 响应收进缓存（同时记住它用的语言/地区）；② 在仍是英文的卡片上补回官方中文名并照抄官方的 `(English)` 行（`p.secondary.ellipsis`），官方已经渲染出中文时完全不动；③ 用 `characterData` 观察器盯住标题文本，官方写回英文就立刻补回中文；④ 批量接口给不出中文（无 token／请求失败／回落到英文）时，用公开的 `/{movies|shows}/{id}/translations/zh` 逐 id 兜底，**只取 `country=cn` 且 title 非空的简体条目**——没有简体名就保持英文原名，不用繁体（tw/hk/sg）补位。
4. **徽标对齐** —— 自动识别海报底部的居中浮层徽标（如“新”），微调垂直偏移保持卡片标题视觉基线对齐。
5. **tvtime.trakt.tv 剧名 / 单集名按 Trakt 设置语言本地化** —— 新站是另一套 DOM：`article.media-row`，标题 `a.media-row-title`，单集名 `a.media-row-subtitle`。看它的 Svelte 源码（`chunks/BPArmwY0.js`）可确认 `aria-label = entry.title`，也就是**原始名称**，所以 DOM 里没有本地化名称可抓，必须走接口：
   - 从 `document.documentElement.lang` 读取 Trakt 当前语言（如 `zh-CN`、`ja-JP`、`fr-CA`）；页面刚切换语言、`html[lang]` 尚未刷新时，用 `PARAGLIDE_LOCALE` cookie 补充。解析为 language / country，并把两者一起放进缓存 key。
   - 用公开 API：`api.trakt.tv/{shows|movies}/{slug}/translations/{language}`、`api.trakt.tv/shows/{slug}/seasons/{s}/episodes/{e}/translations/{language}`，不需要用户 token。
   - **请求必须走扩展后台（`background.js`）代发**：content script 是 `world: MAIN`，等于在页面里跑，`api.trakt.tv` 不返回 `Access-Control-Allow-Origin`，页面身份直接 fetch 必被 CORS 拦（`ERR_FAILED`）。扩展有 `host_permissions`，在 service worker 里请求不受页面同源限制，因此 content.js 通过隔离世界的 `bridge.js` 用 `postMessage` 转发请求，再由 bridge 调 `chrome.runtime.sendMessage`（`trakt-titles:fetch-translations`）交给后台取数据。油猴版由 `tools/build-userscript.js` 注入 `__gmBridge`，用 `GM_xmlhttpRequest` + `@connect api.trakt.tv` 走同样的通道。
   - **绝对不要用新站前端那个 `apiz.trakt.tv/.../translations?language=zh`**：它只对 trakt.tv 自有页面放开，从 tvtime.trakt.tv 以页面身份请求会 **403 Forbidden**，而且未登录时偶尔放行——很容易被误判成“能用”（本项目就在这里踩过一次坑）。判断方法：在已登录的真实环境里请求，看是否 403。
   - 返回是同一语言的多个地区变体。选择顺序：精确匹配当前地区 → 无地区的通用条目 → 同语言的其他条目。中文是例外：简体与繁体是不同的书写系统，`zh-CN` 不拿 tw/hk 补位，`zh-TW`/`zh-HK` 只在两者之间回退。没有译名或译名与原名相同时保持单行，不制造重复副标题。
   - 媒体标识统一用 URL 里的 slug（不是海报里的 id），季集号要从 `media-row-subtitle` 自己的 href 解析——标题链接只到剧集层级。
   - 取到译名后写入标题节点，并把原名插成 `.trakt-helper-original-title` 副行（紧跟标题、meta 之前），结果按 `` `${localeKey}|${type}:${slug}` `` / `` `${localeKey}|${slug}:${s}:${e}` `` 缓存，重复扫描不会叠行，切换语言也不会复用旧语言结果。
6. **og.trakt.tv（OG Redux）剧名 / 简介汉化** —— 这是 `trakt-web` 的 fork，用经典 Trakt 界面重做，整站英文。DOM 规律：
   - 详情页（剧 / 电影）：`section.fanart-header .summary-title h1` 是标题（h1 里还有 `.year`、`.certification`，只能改 h1 自己的文本节点，别用 `textContent`）；分集页标题在 `.episode-title h1`，结构是 `<strong>1x01</strong> 集名`，所以只改后面的文本节点，集号保留。
   - 简介：`section.summary-frame .details > .overview`；宣传语：`.summary-frame .details > .tagline`。分集行 / Spotlight 卡片的 `.overview` 里可能再包一层 `.read-more`，文本节点在子节点上，必须找到真正持有文本的那个元素再改。
   - 卡片标题有三种写法：① `h3` 里包着详情链接（榜单卡、搜索结果、Dashboard spotlight）；② `a.titles-link` 里包着 `h3`（Discover 竖版海报卡）；③ 英文 logo：`img.trimmed-logo[alt]`，可能出现在 ①② 任意一种里。logo 没法翻译，命中中文时加 `trakt-helper-og-logo-hidden` 隐藏它、在链接里插 `.trakt-helper-og-title` 显示中文；详情页 / 焦点位再补一行 `.trakt-helper-og-original`，卡片把原名写进 `title` 属性。
   - 集号链接有两种：`<a><span class="number">1x01</span></a>` 和 `<a class="number">1x01&nbsp;</a>`，选标题链接时两种都要跳过，否则会把集号当标题（实测踩过）。
   - 榜单 / Discover 焦点位：`section.chart-hero`、`section.hero` 里的 `h2.name`（可能是 logo）+ `p.overview`，媒体从 `h2 a[href]` 或 `a.button.primary[href]` 解析。
   - 季页分集行：`h3[id^="episode-"]` 里第二个链接是集名，`article.row .overview` 是该集简介。
   - Dashboard 的 **Up Next**（`components/media/OnDeckCard.svelte` → `PosterCard.svelte`）把「集号 + 集名」拼成**一个文本节点**（`3x03 集名`，h3 里没有 `.number` span），替换时要用正则保留 `S2E01` / `3x03` / `3x03 (669)` / `Special 2` 前缀，否则界面上只剩中文集名；卡片下面的剧名小行是 `a.show-link`（不是 `a.show`），也要翻译。
   - Dashboard 的 **Upcoming Schedule**（`components/dashboard/SchedulePanel.svelte`）不走 h3：周视图的剧名是 `a.show`，焦点卡片是 `.schedule h4 > a`，日程里的集名在 `.schedule .episodes a[href*="/episodes/"]`（结构 `<a><b>3x04</b> 集名</a>`，只改文本节点），电影那行是 `.schedule .episodes .tagline`（Trakt tagline）。日期标题 `h3`（Today / Tomorrow + 日期）是界面文案，不能动。
   - 接口和 tvtime 一样走公开 API+后台桥：`/shows|movies/{slug}/translations/zh`、`/shows/{slug}/seasons/{s}/translations/zh`、`/shows/{slug}/seasons/{s}/episodes/{e}/translations/zh`。只取 `country=cn`，没有就退回无地区条目，没有简体标题就保留英文原名，不用 tw/hk 补位。
   - 译名 / 简介按 `` `${type}:${slug}` ``、`` `${slug}:${s}` ``、`` `${slug}:${s}:${e}` `` 存 `sessionStorage`（`trakt_og_zh_cache`）；请求走 6 并发的队列，避免一页几十张卡一次性打爆接口。
7. **Client ID / token / 限流** —— 源码里**不再硬编码** Trakt Client ID（`DEFAULT_API_KEY` 已删除）：
   - 取 key 的顺序：`CONFIGURED_API_KEY` / `window.__TRAKT_TITLES_CLIENT_ID__` → 页面请求头捕获的 `trakt-api-key`（`interceptFetch` + `interceptXhrApiKey`）→ 从页面已加载的同源 JS 里扫 `trakt-api-key` 字面量（`matchApiKeyInSource`），结果按 host 存 `sessionStorage`（`trakt_titles_api_key:<host>`，6 小时）。
   - 页面发请求前会先 `waitForApiKey()`：先等捕获（页面自己的请求），同时从 JS 里扫；10 秒仍没有就放弃并跳过请求（不拿空 key 乱打）。
   - 已登录时 `activeAuthToken()`（捕获的 `Bearer` 或 localStorage 里的 OIDC token）会随请求一起传：扩展后台和油猴桥都会带上 `Authorization`；带 token 的公开 GET 走 Trakt 的 AUTHED 桶（500 次/5 分钟/用户），匿名请求走 `Client ID + 公网 IP` 桶（也是 500 次/5 分钟）。401 时自动重试一次匿名请求。
   - 429：`noteApiRateLimit(Retry-After)` 记录冷却（上限 60 秒），所有请求先等冷却；翻译主链路会重试一次，`resolveTranslationTitles` / 分集列表在 429 时不缓存 null，避免把限流误记成「没有译名」。
