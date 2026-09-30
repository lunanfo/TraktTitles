# Trakt Titles

给 **Trakt 网页卡片补剧名**的 Chrome 扩展 / Tampermonkey 脚本。

Trakt 有些位置（推荐、日历、列表等）只显示海报、不显示剧名。脚本做两件事：

1. **补标题** —— 读取海报链接里已有的剧名，在海报下方补回标题。标题会清理掉无障碍文本中的“海报”、poster、引号等描述性文字。
2. **对齐徽标** —— 海报底部居中的浮层徽标（如“新”）会把标题挤偏，脚本把它上移一点，让有徽标和没徽标的卡片标题落在同一条基线上。

脚本不修改 Trakt API 请求，不添加翻译服务，也不改变已经显示标题的卡片；页面使用 Trakt 当前已经返回的语言标题。

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
   - 访问 [app.trakt.tv](https://app.trakt.tv) 或 [trakt.tv](https://trakt.tv)，原本只有海报、没有剧名的卡片会自动补上剧名，海报底部的浮层徽标也会微调位置，让标题对齐。

> [!NOTE]
> 扩展和脚本做的是同一件事，二选一即可，不必同时装。

---

## 开发（可选，只有重新构建和跑测试才用到 Node）

`npm` 在这里只做两件事，而且都只是 `node` 命令的包装，不影响上面的安装使用：

| 命令 | 实际执行 | 作用 |
| --- | --- | --- |
| `npm run build` | `node tools/build-userscript.js` | 把 `extension/content.js` + `styles.css` + 版本号 + 图标拼成 `userscript/TraktTitles.user.js` |
| `npm test` | 两条 `node tests/injection.test.js` | 用 jsdom 模拟 DOM，验证标题注入逻辑 |
| `npm install` | — | 只为了装测试用的 jsdom |

不用 npm 也一样跑：

```bash
node tools/build-userscript.js

TARGET=extension node tests/injection.test.js
TARGET=userscript node tests/injection.test.js
```

`userscript/TraktTitles.user.js` 是**构建产物**，不要手改：要改逻辑请改 `extension/content.js`，要改样式请改 `extension/styles.css`，然后重新构建一次，油猴里的脚本才会更新。
