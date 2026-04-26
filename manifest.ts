export const getManifest = ({ version = '1.6.0' } = {}) =>
  `// ==UserScript==
// @name        Better bateworld.com
// @namespace   Circlejerk Scripts
// @version     ${version}
// @author      Thick Bro
// @match       https://bateworld.com/html5-chat/chatroom.php
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM.addStyle
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_setValues
// @grant       GM.setValues
// @grant       GM_listValues
// @grant       GM.listValues
// @require     https://unpkg.com/preact@10.28.0/dist/preact.min.js#sha512-iMvQ2nmrBGovAh+dbYrh8gttIQ4Xa/aYwXhrgYdlhNHDXdyQA4tM0JyI81xJEm+laaTWnIhWGgawYgpEihg7AQ==
// @require     https://unpkg.com/preact@10.28.0/hooks/dist/hooks.umd.js#sha512-lLsbsdkj5qskElcWFvsifiWNJH4y8GeUtEdI3a1KZoVF+TCDvk/UGCyf/2mKpJtwI1XKJh89hVCVI2J3rEytQQ==
// @require     https://unpkg.com/preact@10.28.0/jsx-runtime/dist/jsxRuntime.umd.js#sha512-IRTpXYSw0jUJELE+zE319bPSVme0v6QV3LVh/SD5jljvKW4hb+LL6TRpMfkTEQvccsC5N7+6YusE6ol3yFuhLw==
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// ==/UserScript==
`;
