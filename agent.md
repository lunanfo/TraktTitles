# Trakt 网页卡片剧名补全

## 需求

Trakt 网页（app.trakt.tv）中：
1. 部分位置只显示海报、不显示剧名，例如推荐、日历、列表、搜索等卡片。
2. 智能列表视图（`/lists/smart/view/...`）等页面只显示英文名，未调用批量本地化接口。
3. 搜索页（`/search`）等部分页面海报后台文本也为英文。

目标：
- 找出缺少剧名的位置并补充剧名。
- 在智能列表视图（`/lists/smart/view`）与搜索页（`/search`）中，通过 Trakt 官方批量接口（`intl/bulk`）获取中文译名，并呈现与待看列表（Watchlist）一致的双语显示（主标题中文名，副标题附带英文原名）。
- **极简请求与性能优先**：已经在 HTML 后台（`aria-label` / `alt`）提供中文名的页面和卡片继续直接取用 DOM，不发起额外 API 请求，避免页面加载卡顿。
- 全局使用 `sessionStorage` 缓存 ID 与中文字态，确保不发起重复查询。
- 优先复用 Trakt 现有组件与样式类名，保持原生 UI 视觉规范。

## 现有实现

`extension/content.js` + `extension/styles.css`（Tampermonkey 版本由 `tools/build-userscript.js` 自动构建到 `userscript/TraktTitles.user.js`）：

1. **DOM 抓取快速补名** —— 从海报链接的 `aria-label` / `img[alt]` / 文本提取中文剧名并清理干扰字样，无需额外网络请求。
2. **官方 bulk 接口批量汉化 & 双语展示** —— 针对智能列表和搜索页未本地化的英文卡片，收集当前视图内的 ID，通过官方 `intl/bulk` 批量请求中文译名，主标题呈现中文名，副标题呈现 `(Original Title)`。
3. **徽标对齐** —— 自动识别海报底部的居中浮层徽标（如“新”），微调垂直偏移保持卡片标题视觉基线对齐。
