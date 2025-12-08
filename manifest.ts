export const getManifest = ({ version = '1.3.4' } = {}) =>
  `// ==UserScript==
// @namespace   Circlejerk Scripts
// @name        Better bateworld.com
// @version     ${version}
// @author      Thick Bro
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_listValues
// @grant       GM_addElement
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// ==/UserScript==

window.preact = {};
`;
