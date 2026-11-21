# Trakt Titles

给 **Trakt 网页卡片补剧名并按账号语言本地化** 的 Chrome 扩展 / Tampermonkey 脚本。

Trakt 网页端（[app.trakt.tv](https://app.trakt.tv)）在部分位置（如推荐、日历、海报列表等）仅显示海报不显示剧名，且智能列表（Smart Lists）和搜索页未请求中文译名、仅显示英文。

本项目实现以下功能：

1. **补全卡片标题** —— 自动识别仅有海报的卡片，在海报下方补回规范剧名（自动清理“海报”、poster、引号等多余文字）。
2. **智能列表 / 搜索 / Discover 页双语显示** —— 针对智能列表视图（`/lists/smart/view`）、搜索页（`/search`）与发现页（`/discover/trending`、`/discover/anticipated`、`/discover/popular` 等），用 Trakt 官方接口（`intl/bulk` 批量 + `translations/zh` 单体兜底）获取中文译名，实现与待看列表（Watchlist）一致的原生双语排版：**主标题中文名 + 副标题英文原名**。只取简体条目（`country=cn`），没有简体名就保持英文原名，不用繁体补位。发现页官方自己的中文覆盖一旦失败或回落成英文，扩展会立刻补回中文。
3. **零多余请求与持久缓存** —— 其他页面中已在 HTML 后台（`aria-label` / `img[alt]`）提供中文名称的卡片直接复用 DOM，不发起任何多余 API；已请求的媒体信息与译名通过 `sessionStorage` 内存缓存，避免重复请求，保证页面极速加载。
4. **对齐徽标** —— 海报底部居中的浮层徽标（如“新”）微调上移，保持所有卡片标题落在同一条水平基线上。
5. **新版 TV Time 网页（tvtime.trakt.tv）按 Trakt 设置语言显示剧名** —— 该站横向大卡片的剧名和单集名可能仍是英文。扩展读取页面的 `html[lang]`（必要时用 `PARAGLIDE_LOCALE` cookie）作为 Trakt 当前语言，通过后台脚本请求 `api.trakt.tv/{shows|movies}/{slug}/translations/{language}` 和单集翻译接口。同一语言内优先精确地区，其次使用无地区的通用条目；没有对应译名时保留英文原名。命中译名后把本地化名称写进标题，并把英文原名缩成下面一行，与 Trakt 自身的双语排版一致。简体中文不会拿繁体条目补位，繁体中文也不会拿简体条目补位。
6. **OG Redux（og.trakt.tv）剧名与简介汉化** —— 这个站是经典 Trakt 界面的大屏重制版，整站英文。扩展复用同一套公开翻译接口，把剧名、电影名、单集名换成简体中文：标题是英文 logo 图时隐藏 logo 改用中文文本，详情页、榜单和 Discover 焦点位再补一行英文原名，普通卡片把原名放进鼠标悬停提示（tooltip）。详情页 `.overview`、分集简介和 `.tagline` 宣传语也一并翻译；Dashboard 的 **Upcoming Schedule**（焦点卡片、周视图的剧名 / 集名 / 电影 tagline）、**Up Next**（集号 + 中文集名、剧名小行）以及顶部/底部的 **Watching Now** 条（剧名 + 带引号的集名）同样覆盖。同样只取 `country=cn` 的简体条目，没有简体标题就保留英文原名，不用繁体补位；译名和简介按会话缓存，同一作品只请求一次。
7. **不内置 Client ID + 登录 token + 429 退避** —— 翻译请求的 `trakt-api-key` 不再写死在源码里：优先从页面自己的请求头捕获，抓不到就从页面已加载的 JS 里读出站点自己的 Client ID（也可填自己的应用 Client ID）。已登录时把页面里的 OAuth token 一起带上，请求走 Trakt 的「每个用户」限流桶；token 过期自动退回匿名。遇到 429 会按 `Retry-After` 暂停并重试一次。

---

## 🚀 安装使用指南 (Installation)

### 选项 1：Tampermonkey 油猴脚本（一键安装）

1. 确保你的浏览器已安装 **[Tampermonkey (篡改猴)](https://www.tampermonkey.net/)** 或 **Violentmonkey (暴力猴)** 扩展。
2. 点击下方按钮（徽章）：

   [![Install](https://img.shields.io/badge/Install-Tampermonkey-red?style=flat-square&logo=tampermonkey)](https://github.com/lunanfo/TraktTitles/raw/main/userscript/TraktTitles.user.js)

3. 在弹出的页面点击「安装」或「更新」即可，无需手动复制代码。

> [!TIP]
> 如因网络环境问题无法打开 GitHub 直链，可使用国内加速镜像：[jsDelivr CDN 直链](https://fastly.jsdelivr.net/gh/lunanfo/TraktTitles@main/userscript/TraktTitles.user.js)。

脚本自带 `@updateURL` / `@downloadURL`，之后每次本仓库发版，油猴会自动提示更新。

#### 手动导入脚本（备选方法）：

1. 确保已安装 [Tampermonkey](https://www.tampermonkey.net/) 插件；
2. 点击浏览器工具栏的油猴图标 → 选择 **「添加新脚本」**；
3. 打开本地仓库中的 [`userscript/TraktTitles.user.js`](userscript/TraktTitles.user.js)，全选复制代码并粘贴覆盖，保存即可。

---

### 选项 2：浏览器扩展程序 (Chrome / Edge / Brave / Arc)

适用于偏好独立扩展程序管理、无需安装脚本管理器的用户。

1. **获取代码**：
   下载本项目的最新 Release 压缩包并解压，或通过 Git 克隆到本地：
   ```bash
   git clone https://github.com/lunanfo/TraktTitles.git
   ```
2. **打开扩展程序管理界面**：
   - Chrome / Brave / Arc：地址栏输入 `chrome://extensions/` 并回车
   - Edge：地址栏输入 `edge://extensions/` 并回车
3. **启用开发者模式**：开启页面右上角的 **「开发者模式 (Developer mode)」** 开关。
4. **加载扩展**：
   - 点击左上角的 **「加载已解压的扩展程序 (Load unpacked)」**。
   - 选择项目根目录下的 **`extension/`** 文件夹。
5. **开始体验**：
   - 访问 [app.trakt.tv](https://app.trakt.tv)，原本只有海报、没有剧名的卡片会自动补齐剧名；智能列表和搜索页卡片将以中文 + 原名双语显示。
   - 访问 [tvtime.trakt.tv](https://tvtime.trakt.tv)，剧名和单集名会按 Trakt 账号设置的语言本地化；切换账号语言并刷新页面后即可看到对应语言。
   - 访问 [og.trakt.tv](https://og.trakt.tv)，卡片、详情页和季集列表的剧名/集名会显示简体中文，简介与宣传语同步翻译；有中文译名时详情页会保留一行英文原名。

> [!NOTE]
> 扩展和脚本功能完全一致，二选一安装即可。

---

## 开发与构建 (Development)

```bash
npm run build   # 重新打包构建 Tampermonkey 脚本
npm test        # 执行单元测试与 DOM 注入测试
```

`userscript/TraktTitles.user.js` 是由 `tools/build-userscript.js` 从 `extension/content.js` 和 `extension/styles.css` 自动编译生成的产物，请勿直接手动修改该文件。
