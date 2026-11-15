#!/usr/bin/env node
/** Build the Tampermonkey script from the extension title injector. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const target = path.join(ROOT, 'userscript/TraktTitles.user.js');
const content = read('extension/content.js');
const styles = read('extension/styles.css');
const version = JSON.parse(read('extension/manifest.json')).version;

// Repository hosting the built script. Tampermonkey uses these to offer
// one-click install/update, so they must point at the public repo.
const REPO = 'https://github.com/lunanfo/TraktTitles';
const RAW = 'https://raw.githubusercontent.com/lunanfo/TraktTitles/main/userscript/TraktTitles.user.js';

// Tampermonkey shows the script icon in its dashboard; without @icon the entry
// stays blank. A base64 data URI works offline and needs no hosting. If your
// manager refuses data URIs, swap the line for a hosted PNG, e.g.
//   // @icon      https://raw.githubusercontent.com/lunanfo/TraktTitles/main/extension/icons/trakt-circlemark-128.png
const icon = fs
  .readFileSync(path.join(ROOT, 'extension/icons/trakt-circlemark-48.png'))
  .toString('base64');

const header = `// ==UserScript==
// @name         Trakt Titles
// @namespace    trakt-titles
// @version      ${version}
// @description  Restores missing titles on Trakt poster-only cards.
// @author       lunanfo
// @homepageURL  ${REPO}
// @supportURL   ${REPO}/issues
// @updateURL    ${RAW}
// @downloadURL  ${RAW}
// @icon         data:image/png;base64,${icon}
// @match        https://trakt.tv/*
// @match        https://app.trakt.tv/*
// @match        https://tvtime.trakt.tv/*
// @match        https://og.trakt.tv/*
// @grant        GM_xmlhttpRequest
// @connect      api.trakt.tv
// @run-at       document-start
// ==/UserScript==`;

// 油猴脚本没有扩展后台，用 GM_xmlhttpRequest 走油猴自己的跨域通道，
// 垫一层和 chrome.runtime.sendMessage 等价的接口，content.js 不必区分两种宿主。
const bridge = `  // 油猴跨域桥接：模拟 chrome.runtime.sendMessage 的语义
  var __gmBridge = (function () {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) return null;
    if (typeof GM_xmlhttpRequest !== 'function') return null;
    return function (message, callback) {
      if (!message || message.type !== 'trakt-titles:fetch-translations') return false;
      if (!/^\\/(?:shows|movies)\\/[^/]+\\/(?:translations\\/[a-z]{2,3}|seasons\\/\\d+\\/(?:episodes\\/\\d+\\/)?translations\\/[a-z]{2,3})$/.test(message.path)) {
        callback({ ok: false, error: 'bad path' });
        return false;
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.trakt.tv' + message.path,
        headers: {
          'trakt-api-key': message.apiKey,
          'trakt-api-version': '2',
          'accept': 'application/json'
        },
        onload: function (res) {
          try {
            var list = JSON.parse(res.responseText);
            callback({ ok: true, translations: Array.isArray(list) ? list : [] });
          } catch (e) {
            callback({ ok: false });
          }
        },
        onerror: function () { callback({ ok: false }); }
      });
      return true;
    };
  })();`;

const escapedCss = styles.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const output = `${header}
(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = \`${escapedCss}\`;
  (document.head || document.documentElement).appendChild(style);

${bridge}
${content}
})();
`;

fs.writeFileSync(target, output);
console.log(`wrote ${path.relative(ROOT, target)} (${output.length} bytes, v${version})`);
