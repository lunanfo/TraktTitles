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
// @grant        none
// @run-at       document-start
// ==/UserScript==`;

const escapedCss = styles.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const output = `${header}
(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = \`${escapedCss}\`;
  (document.head || document.documentElement).appendChild(style);

${content}
})();
`;

fs.writeFileSync(target, output);
console.log(`wrote ${path.relative(ROOT, target)} (${output.length} bytes, v${version})`);
