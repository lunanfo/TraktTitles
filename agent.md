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
