// ==UserScript==
// @name        Better bateworld.com
// @namespace   Circlejerk Scripts
// @version     1.7.0
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
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @require     https://unpkg.com/preact@10.28.0/dist/preact.min.js#sha512-iMvQ2nmrBGovAh+dbYrh8gttIQ4Xa/aYwXhrgYdlhNHDXdyQA4tM0JyI81xJEm+laaTWnIhWGgawYgpEihg7AQ==
// @require     https://unpkg.com/preact@10.28.0/hooks/dist/hooks.umd.js#sha512-lLsbsdkj5qskElcWFvsifiWNJH4y8GeUtEdI3a1KZoVF+TCDvk/UGCyf/2mKpJtwI1XKJh89hVCVI2J3rEytQQ==
// @require     https://unpkg.com/preact@10.28.0/jsx-runtime/dist/jsxRuntime.umd.js#sha512-IRTpXYSw0jUJELE+zE319bPSVme0v6QV3LVh/SD5jljvKW4hb+LL6TRpMfkTEQvccsC5N7+6YusE6ol3yFuhLw==
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// ==/UserScript==

var __webpack_modules__ = ({
"./src/betterbw/styles/openPanels.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `[data-username="I_am_watching"] {
  #userList &.userItem .webcamBtn {
    background: #50ce85 !important;
  }

  #tabs &.userItem:before, #tabs & .watchCam:before {
    content: "";
    border: 1px solid #b2b2b2;
    border-top-width: 3px;
    border-radius: 2px;
    width: 12px;
    height: 11px;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%)translateX(-130%);
  }
}

.watchingMe, .user_watching_me {
  --gridGap: 4px;
  box-shadow: gold 0px 0px 1px var(--gridGap) !important;

  & .jsPanel-headerbar {
    background: linear-gradient(gold 0%, #0000 30% 70%, gold 85%);
  }

  & .jsPanel-title:before {
    content: "👁️";
    content: "";
    color: gold;
    z-index: 1;
    text-shadow: 1px 1px #daa520;
    font-family: "Font Awesome 5 Free";
    font-size: 14px;
    font-weight: 400;
    position: absolute;
    top: -5px;
    left: -2px;
  }
}

.watching_private_cam {
  color: red;
  content: " ";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  display: block;
  position: absolute;
  top: 1px;
  left: 45px;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/static.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body > div:first-child {
  height: calc(100% - 4px);
}

body:not([data-algo]) button[data-sort-order=""], body[data-algo=""] button[data-sort-order=""], body[data-algo="new"] button[data-sort-order="new"], body[data-algo="top"] button[data-sort-order="top"] {
  color: #fff;
  background-color: #50c180;
}

input.numberOfCams {
  width: 4em;
}

.panel-action {
  position: absolute;
  left: 3px;
}

.panel-action-btn {
  cursor: pointer;
  color: inherit;
  float: right;
  opacity: 1;
  background: #fffc;
  border: 1px solid #ddd;
  height: 15px;
  margin-left: 8px;
  font-size: 14px;
  line-height: 0;
  transition: opacity .2s ease-out;
  position: relative;
  top: 2px;
}

.panel-action-btn:where([data-status-value="--"], [data-status-value="-"], [data-status-value="+"], [data-status-value="++"]) {
  margin-left: 0;
}

.jsPanel-hdr {
  container-type: inline-size;
}

@container (width <= 240px) {
  .panel-action-btn {
    margin-left: 2px;
    padding-inline: 2px;
    font-size: 11px;
  }
}

.jsPanel[data-grid-index][data-actions-attached]:not(.ui-draggable-dragging) {
  transition: top .15s linear, right .15s linear, bottom .15s linear, left .15s linear;
}

.jsPanel:not(:hover) .panel-action-btn {
  opacity: 0;
}

.jsPanel .speaks {
  width: 3px;
  top: 0;
  bottom: 0;
  left: 0;
  rotate: 180deg;

  & .volume {
    background: #ff0;
    box-shadow: 1px 1px 1px #000, 2px 2px 1px #fff;
  }
}

.jsPanel .jsPanel-content {
  background: #111;
}

:where(#userMenu, .jsPanel)[data-status="--"] [data-status-value="--"] {
  color: #fff;
  background: #cd0000;
}

:where(#userMenu, .jsPanel)[data-status="-"] [data-status-value="-"] {
  color: #fff;
  background: #ed9200;
}

:where(#userMenu, .jsPanel)[data-status="+"] [data-status-value="+"] {
  color: #fff;
  background: #00a7e4;
}

:where(#userMenu, .jsPanel)[data-status="++"] [data-status-value="++"] {
  color: #fff;
  background: #9532ff;
}

:where(#userMenu, .jsPanel)[data-is-cooldown="true"] [data-status-value="⏱"] {
  color: #fff;
  background: #323232;
}

#userMenu .menuUserItem[data-action="whisper"] {
  display: block !important;
}

#userMenu[data-private-cam="true"] [data-action="viewWebcam"] {
  color: red;

  & .fa.fa-video-camera:after {
    color: red;
    content: " ";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
  }
}

#tabs .tab-pane.tab-pane {
  padding: 10px 10px 10px 20px !important;
}

#tabs .addPrivateMessage {
  & .mention, & .userLabelBBW.receiver {
    pointer-events: none;
  }

  & .name-time {
    flex-wrap: wrap;

    & .content {
      flex-basis: 100%;
    }
  }
}

#tabs .serverMessage, #tabs .addPrivateMessage, #tabs .message {
  &.whisper:after {
    right: unset;
    width: initial;
    height: min-content;
    padding: 1px;
    font-size: 9px;
    line-height: 1;
    top: -1px;
    left: -10px;
  }
}

#tabs .serverMessage[data-private-cam="true"]:after, #userMenu[data-private-cam="true"] [data-action="viewWebcam"].fa:after {
  content: " ";
  color: red;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

#tabs .serverMessage[data-private-cam="true"]:after {
  margin-left: 20px;
}

#tabs .webcamOpened .watchCam {
  position: relative;
}

.jsPanel .userAvatar {
  --avatarSize: 22px;
  cursor: pointer;
  border-radius: var(--avatarSize);
  height: var(--avatarSize);
  width: var(--avatarSize);
  object-fit: cover;
  margin-top: -1px;
  padding: 0;
}

.jsPanel-btn-close {
  line-height: 1;
}

.headerPrivateBtn {
  display: none;
}

.jsPanel[data-status="undefined"] .jsPanel-title {
  text-decoration: underline 2px orange;
}

.jsPanel[data-status="undefined"] button:where([data-status-value="++"]), .jsPanel[data-status="--"] button:where([data-status-value="++"]), .jsPanel[data-status="-"] button:where([data-status-value="++"]), .jsPanel[data-status="+"] button:where([data-status-value="--"]), .jsPanel[data-status="++"] button:where([data-status-value="--"]) {
  display: none;
}

.jsPanel:where([data-rotation=""], [data-rotation="0"]) video {
  rotate: none;
}

.jsPanel[data-rotation="90"] video {
  rotate: 90deg;
}

.jsPanel[data-rotation="180"] video {
  rotate: 180deg;
}

.jsPanel[data-rotation="270"] video {
  rotate: 270deg;
}

.jsPanel[data-rotation="90"] video, .jsPanel[data-rotation="270"] video {
  margin-left: 7.5%;
  width: 85% !important;
}

.slide_block {
  width: 14px;
}

#usersContainer {
  width: 240px;

  &.leftLayout #slide_block {
    z-index: 101;
    height: 37px;
    top: 50px;
    left: 31px;
  }
}

#myWebcamContainer {
  & .btn {
    text-wrap: inherit;
    line-height: 1 !important;
  }

  & #myAudioVideoCheckBoxContainer {
    text-wrap: nowrap;
    position: absolute;
    top: 0;
    right: 0;
  }

  & #myAudioVideoCheckBoxContainer .btn {
    min-height: 1rem;
  }

  & #myWebcamDiv > button {
    transition: transform .2s ease-out;
    transform: translateY(-15px)scaleY(.25);
  }

  & #myWebcamDiv > div {
    transition: transform .2s ease-out;
    transform: translateY(-7px)scaleY(.25);
  }

  &:hover #myWebcamDiv > button, &:hover #myWebcamDiv > div {
    transform: initial;
  }
}

#userList .userItem {
  border-bottom: none;
  margin-left: 1px;
}

#userList .userLabel {
  border-top-left-radius: 9px;
  border-bottom-left-radius: 9px;
  margin-left: 2px;
  padding-left: 8px;
  top: 0;

  & .userSince {
    left: unset;
  }
}

.webcamBtn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin: 0;
  padding-inline: 1rem;
}

.webcamBtn i.lock {
  &.fa-unlock {
    display: none;
  }

  &.fa-lock {
    text-shadow: -2px 2px #fff;
    top: 1px;
    right: -25px;
  }

  font-size: 16px;
  position: absolute;
  top: 5px;
  left: -11px;
}

.webcamBtn i.fa-volume-down {
  padding-inline: 4px;
}

.eye-icon .fa-eye.isWatching {
  text-shadow: -1px -1px 1px #daa520;
  position: absolute;
  bottom: 5px;
  right: 42px;
  color: gold !important;
}

#userList .userItem:has(.webcamBtn.visible i.lock.fa-lock) {
  --lock-color: #cd000054;
  --v-padding: 0px;

  & .userLabel {
    box-shadow: inset 3px 0 1px 2px var(--lock-color);
  }

  & .webcamBtn.visible {
    box-shadow: inset -3px 0 1px 2px var(--lock-color);
    border: none;
  }
}

.jsPanel {
  box-shadow: none;
  border-color: #888 !important;
}

#roomsBtn {
  margin-right: 0 !important;
  padding-left: 6px !important;
  padding-right: 3px !important;
  line-height: 1 !important;
}

.header-btn-wrap {
  margin: 0 3px;
  padding-right: 0;
}

.header-custom-btns span {
  padding-right: 10px;
}

#header {
  height: 30px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

#tabsAndFooter, #footer {
  width: max(280px, min(50%, calc(100% - var(--bbw-cams-width, 1107px))));
}

#tabsAndFooter {
  resize: horizontal;
  min-width: 200px;
  max-width: 80%;
  overflow: hidden;
}

#footer {
  width: 100%;
  position: relative;
}

video.mobile.mobile {
  max-width: 100% !important;
  max-height: 100% !important;
}

.jsPanel-headerbar {
  min-height: 18px;
}

.jsPanel-titlebar {
  min-height: 16px;
}

.jsPanel-titlebar h3 {
  margin-block: 1px;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/tiers.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#userList .userItem:where(.group_minus_minus) {
  opacity: .3 !important;
}

#tabs .userLabelBBW:where(.group_minus_minus) {
  text-decoration: line-through 1.8rem #cd000026;
}

#tabs .userLabelBBW:where(.group_minus) {
  text-decoration: line-through 1.8rem #ed920033;
}

#userList .userItem:where(.group_minus) .userLabel {
  background: #ed920033;
}

#tabs .userLabelBBW:where(.group_plus) {
  text-decoration: line-through 1.8rem #0064ff33;
}

#userList .userItem:where(.group_plus) .userLabel {
  background: #0064ff33;
}

#tabs .userLabelBBW:where(.group_plus_plus) {
  text-decoration: line-through 1.8rem #9532ff33;
}

#userList .userItem:where(.group_plus_plus) .userLabel {
  background: #9532ff33;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/topLevel.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `iframe {
  display: block;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/watchStats.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.bbw-watch-stats {
  white-space: nowrap;
  cursor: help;
  margin-left: 4px;
}

.bbw-watch-summary {
  opacity: .7;
  font-size: .85em;
}

.bbw-watch-card {
  z-index: 100000;
  box-sizing: border-box;
  color: #eee;
  white-space: normal;
  text-align: left;
  pointer-events: none;
  background: #141414f2;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.4;
  position: fixed;
  box-shadow: 0 4px 16px #0006;

  & table {
    border-collapse: collapse;
    width: 100%;
  }

  & th, & td {
    border: none;
    padding: 1px 0;
    font-weight: normal;
  }

  & tbody th {
    opacity: .8;
  }

  & thead th, & td {
    text-align: right;
    font-variant-numeric: tabular-nums;
    padding-left: 10px;
  }

  & thead th {
    font-weight: 600;
  }

  & .bbw-separator > * {
    border-top: 1px solid #ffffff26;
    padding-top: 4px;
  }

  & p {
    margin: 6px 0 0;
  }

  & .bbw-muted {
    opacity: .6;
    font-size: 11px;
  }
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./node_modules/@rsbuild/core/compiled/css-loader/api.js": (function (module) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

}),
"./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js": (function (module) {

module.exports = function (i) {
  return i[1];
};

}),

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
id: moduleId,
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
var __webpack_exports__ = {};

;// file://./src/betterbw/utils/sortFunctions.ts
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

// EXTERNAL MODULE: ./src/betterbw/styles/static.css?inline
var staticinline = __webpack_require__("./src/betterbw/styles/static.css?inline");
// EXTERNAL MODULE: ./src/betterbw/styles/topLevel.css?inline
var topLevelinline = __webpack_require__("./src/betterbw/styles/topLevel.css?inline");
;// file://./src/betterbw/features/cooldown.ts
function cooldownIt({ username, minutes = 15, panel }) {
  if (!username) return;
  const expiry = Date.now() + 60000 * minutes;
  GM.setValue(`${username}_cooldown`, expiry);
  console.log(
    `User ${username} put on cooldown until`,
    new Date(expiry).toISOString(),
  );
  if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}
async function isOnCooldown(id) {
  const val = await GM.getValue(`${id}_cooldown`);
  if (!val) return null;
  if (Date.now() < Number(val)) return true;
  GM.deleteValue(`${id}_cooldown`);
  return false;
}
async function sweepExpiredCooldowns() {
  const keys = (await GM.listValues()).filter(key => key.endsWith("_cooldown"));
  const now = Date.now();
  for (const key of keys)
    if (now >= Number(await GM.getValue(key))) await GM.deleteValue(key);
}
const sessionCooldown = new Set();

;// file://./src/betterbw/utils/filters.ts
const isDefined = v => null != v;

;// file://./src/betterbw/utils/math.ts
const clamp = (min, mid, max) => Math.max(min, Math.min(mid, max));

;// file://./src/betterbw/utils/organizePanels.ts

const organizePanels_base = { my: "right-top", at: "right-top" };
const panelRatio = 314 / 365;
const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  WIDTH: +GM_getValue("config.webcamWidth", 365),
  HEIGHT: GM_getValue("config.webcamWidth", 365) * panelRatio,
};
function computeLayout() {
  const areaWidth =
    innerWidth
    - (document.getElementById("tabsAndFooter")?.getBoundingClientRect().right
      ?? 0)
    - gridconf.MARGIN_RIGHT;
  const areaHeight = innerHeight - gridconf.MARGIN_TOP;
  const cams = clamp(1, +chatHTML5.roles.user.webcamMax || 1, 9);
  const candidates = Array.from({ length: cams }, (_, i) => {
    const cols = i + 1;
    const rows = Math.ceil(cams / cols);
    const fitWidth = (areaWidth - (cols - 1) * gridconf.GAP_X) / cols;
    const fitHeight = (areaHeight - (rows - 1) * gridconf.GAP_Y) / rows;
    const width = Math.floor(
      Math.max(120, Math.min(gridconf.WIDTH, fitWidth, fitHeight / panelRatio)),
    );
    return { width, height: width * panelRatio, cols, rows };
  });
  candidates.sort(
    (a, b) =>
      b.width - a.width
      || a.cols * a.rows - b.cols * b.rows
      || Math.abs(a.cols - a.rows) - Math.abs(b.cols - b.rows)
      || b.cols - a.cols,
  );
  return candidates[0];
}
const overflowOffset = 65 - gridconf.MARGIN_TOP;
function* gridPositions({ width, height, cols, rows }) {
  const place = (c, r, offset = 0) => ({
    ...organizePanels_base,
    offsetX: -(gridconf.MARGIN_RIGHT + c * (width + gridconf.GAP_X)),
    offsetY: gridconf.MARGIN_TOP + r * (height + gridconf.GAP_Y) + offset,
  });
  for (let band = 0; band < rows; band += 2)
    for (let c = 0; c < cols; c++)
      for (let r = band; r < Math.min(band + 2, rows); r++) yield place(c, r);
  for (let c = cols; ; c++)
    for (let r = 0; r < rows; r++) yield place(c, r, overflowOffset);
}
function organizePanels() {
  const camsWidth =
    3 * (gridconf.WIDTH + gridconf.GAP_X)
    - gridconf.GAP_X
    + gridconf.MARGIN_RIGHT;
  document.documentElement.style.setProperty(
    "--bbw-cams-width",
    `${camsWidth}px`,
  );
  const opened = queryPanels();
  if (!opened.length) return;
  const layout = computeLayout();
  const baseCells = layout.cols * layout.rows;
  let lastIndex = 0;
  const groups = { prePositioned: [], newlyCreated: [] };
  for (const panel of opened) {
    const gridIndex = panel.dataset.gridIndex;
    if (gridIndex) {
      groups.prePositioned.push(panel);
      const gridIndexNumber = +gridIndex;
      if (gridIndexNumber > lastIndex) lastIndex = gridIndexNumber;
    } else groups.newlyCreated.push(panel);
  }
  const grid = Array(
    Math.max(+chatHTML5.roles.user.webcamMax, opened.length, lastIndex),
  ).fill(null);
  for (const panel of groups.prePositioned)
    if (null != panel.dataset.gridIndex && "" !== panel.dataset.gridIndex)
      if (grid[+panel.dataset.gridIndex]) {
        panel.dataset.gridIndex = "";
        groups.newlyCreated.unshift(panel);
      } else grid[+panel.dataset.gridIndex] = panel;
  for (let i = grid.length - 1; i >= baseCells; i--) {
    if (!grid[i]) continue;
    const nextAvailableSlot = grid.indexOf(null);
    if (!(nextAvailableSlot < 0) && !(nextAvailableSlot >= i)) {
      grid[i].dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = grid[i];
      grid[i] = null;
    }
  }
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0) {
      panel.dataset.gridIndex = grid.length.toString();
      grid.push(panel);
    } else {
      panel.dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = panel;
    }
  }
  const positions = gridPositions(layout);
  for (const place of grid) {
    const position = positions.next().value;
    if (!place || !position) continue;
    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel)
      panel
        .resize({ width: layout.width, height: layout.height })
        .reposition(position);
  }
}

;// file://./src/betterbw/utils/scrappers.ts
function scrappers_getUsername(panel) {
  const id = panel.id.split("_")[2] || $("[data-id]", panel)[0]?.dataset.id;
  return id && getUserById(id)?.username?.split("_")?.[0];
}
function getUserObjectById(userId) {
  return chatHTML5.users[userId];
}
function getUserById(userId) {
  const user = getUserObjectById(userId);
  if (!user) return;
  return { obj: user, username: user.username.split("_")[0] };
}

;// file://./src/betterbw/utils/openPanel.ts

const PANEL_SELECTOR = ".jsPanel.jsPanel-theme-default";
const queryPanels = () => document.querySelectorAll(PANEL_SELECTOR);
const queryPanel = (target = document) =>
  target.querySelector(PANEL_SELECTOR);
function tryToOpenPanel(candidate) {
  $(".webcamBtn", candidate.item).trigger("click");
}
const getCandidates = async (compareFn = topRandom, _biases = {}) => {
  const biases = { "-": 1, undefined: 2, "+": 3, "++": 4, ..._biases };
  const promises = Array.from(
    document
      .querySelectorAll(
        '#userList [data-status="online"][data-webcam="true"]:not(:has(:is(.fa.fa-lock, .fa.fa-eye-slash)))',
      )
      .values(),
  ).map(async item => {
    const full_username = item.dataset.username;
    const username = full_username?.split("_")[0];
    if (!username) return;
    if (sessionCooldown.has(full_username)) return;
    const status = await GM.getValue(`${username}_status`);
    if ("--" === status) return;
    if (await isOnCooldown(username)) return;
    return {
      item,
      username,
      status,
      bias: biases[status],
      onlineSince: parseInt(
        item.querySelector(".userLabel [data-date]")?.dataset.date || "0",
      ),
    };
  });
  return await Promise.all(promises).then(list =>
    list.filter(isDefined).sort(compareFn),
  );
};
function openCandidates(candidates) {
  const opened = document.querySelectorAll(PANEL_SELECTOR);
  let openedLength = opened.length || 0;
  const maxToOpen = +chatHTML5.roles.user.webcamMax;
  if (openedLength >= maxToOpen) {
    organizePanels();
    return console.log(`Max number of panels (${maxToOpen}) already open`);
  }
  const openedIds = new Set(
    Array.from(opened).map(panel => scrappers_getUsername(panel)),
  );
  while (openedLength < maxToOpen && candidates.length > 0) {
    const c = candidates.shift();
    if (openedIds.has(c.username)) continue;
    tryToOpenPanel(c);
    openedLength++;
  }
  organizePanels();
}

;// file://./src/betterbw/utils/waitToBe.ts
function waitToBe(
  selector,
  attributeFilter = ["aria-hidden"],
  predicate = el => "false" !== el.getAttribute("aria-hidden"),
) {
  return new Promise(resolve => {
    let attrObserver = null;
    let domObserver = null;
    function cleanup() {
      if (attrObserver) {
        attrObserver.disconnect();
        attrObserver = null;
      }
      if (domObserver) {
        domObserver.disconnect();
        domObserver = null;
      }
    }
    function attachAttrObserver(el) {
      if (!el) return false;
      if (predicate(el)) {
        cleanup();
        resolve(el);
        return true;
      }
      (attrObserver = new MutationObserver(muts => {
        for (const m of muts)
          if (
            "attributes" === m.type
            && m.attributeName
            && attributeFilter.includes(m.attributeName)
          ) {
            if (predicate(el)) {
              cleanup();
              resolve(el);
              return;
            }
          }
      })).observe(el, { attributes: true, attributeFilter });
      return false;
    }
    const existing = document.querySelector(selector);
    if (attachAttrObserver(existing)) return;
    (domObserver = new MutationObserver(muts => {
      for (const m of muts)
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const found = node.matches(selector)
            ? node
            : node.querySelector(selector);
          if (found) {
            if (attachAttrObserver(found)) {
              if (domObserver) {
                domObserver.disconnect();
                domObserver = null;
              }
              return;
            }
          }
        }
    })).observe(document.body, { childList: true, subtree: true });
  });
}

;// CONCATENATED MODULE: external "jsxRuntime"
const external_jsxRuntime_namespaceObject = window.jsxRuntime;
;// CONCATENATED MODULE: external "preact"
const external_preact_namespaceObject = window.preact;
;// file://./src/betterbw/utils/formatters.ts
const dataUsername = id =>
  `[data-username="${id}"],[data-username^="${id}_"]`;

// EXTERNAL MODULE: ./src/betterbw/styles/tiers.css?inline
var tiersinline = __webpack_require__("./src/betterbw/styles/tiers.css?inline");
;// file://./src/betterbw/utils/debounce.ts
function debounce(func, wait = 200) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
function enqueueAsync(func) {
  let isRunning = false;
  let runAgain = false;
  return async () => {
    if (isRunning) {
      runAgain = true;
      return;
    }
    isRunning = true;
    try {
      do {
        runAgain = false;
        await func();
      } while (runAgain);
    } finally {
      isRunning = false;
    }
  };
}

;// file://./src/betterbw/dynamicStyle.ts

const dataUserItems = group => group.map(dataUsername).join(",");
async function getCSS() {
  const keys = (await GM.listValues()).filter(key => key.endsWith("_status"));
  const valuesEntries = await Promise.all(
    keys.map(async key => [key, await GM.getValue(key)]),
  );
  const groups = { "--": [], "-": [], "+": [], "++": [] };
  for (const [key, value] of valuesEntries) {
    const id = key.split("_")[0];
    groups[value]?.push(id);
  }
  const selectors = {
    group_minus_minus: dataUserItems(groups["--"]),
    group_minus: dataUserItems(groups["-"]),
    group_plus: dataUserItems(groups["+"]),
    group_plus_plus: dataUserItems(groups["++"]),
  };
  return tiersinline["default"].replace(
    /\.(group_\w+)/gm,
    (_match, key, openStyle) => selectors[key] + openStyle,
  );
}
const dynamicStyle = GM_addStyle("");
const refreshDynamicStyle = enqueueAsync(async () => {
  dynamicStyle.innerHTML = await getCSS();
});
refreshDynamicStyle();

;// file://./src/betterbw/features/rotateCam.tsx
function getRotation(element) {
  if (!element || !element.dataset.rotation) return 0;
  return parseInt(element.dataset.rotation, 10) || 0;
}
async function rotateCam({ id, panel }) {
  const newRotation = (getRotation(panel) + 90) % 360;
  panel.dataset.rotation = newRotation;
  return GM.setValue(`${id}_rotation`, newRotation);
}

;// file://./src/betterbw/features/audioMuted.ts
const sessionAudioMuted = new Map();

;// file://./src/betterbw/features/videoGestures.ts

const LINE_PX = 100 / 3;
const IS_MAC = /Mac/.test(navigator.userAgent);
function deltaPx(event) {
  const unit =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? LINE_PX
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? 800
        : 1;
  return event.deltaY * unit;
}
function upwardPx(event) {
  return (event.webkitDirectionInvertedFromDevice ?? IS_MAC)
    ? deltaPx(event)
    : -deltaPx(event);
}
function isOverControls(video, event) {
  if (!video.controls) return false;
  const rect = video.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const angle =
    ((parseFloat(getComputedStyle(video).rotate) || 0) * Math.PI) / 180;
  return (
    (-dx * Math.sin(angle) + dy * Math.cos(angle))
      / (parseFloat(video.style.scale) || 1)
    > video.offsetHeight / 2 - 48
  );
}
function volumeOnScroll(video) {
  let target = null;
  const step = () => {
    if (null === target) return;
    const current = video.volume ** 0.3333333333333333;
    const next = current + (target - current) * 0.3;
    const arrived = Math.abs(target - next) < 0.001;
    video.volume = (arrived ? target : next) ** 3;
    if (arrived) target = null;
    else requestAnimationFrame(step);
  };
  return event => {
    const idle = null === target;
    target = clamp(
      0,
      (target ?? video.volume ** 0.3333333333333333) + upwardPx(event) / 6000,
      1,
    );
    if (idle) requestAnimationFrame(step);
  };
}
function zoomAndPan(video) {
  let scale = 1;
  let x = 0;
  let y = 0;
  let drag = null;
  const clip = video.closest(".jsPanel-content") ?? video.parentElement;
  const render = () => {
    const zoomed = scale > 1;
    video.style.scale = zoomed ? `${scale}` : "";
    video.style.translate = zoomed ? `${x}px ${y}px` : "";
    video.style.cursor = drag?.moved ? "grabbing" : zoomed ? "grab" : "";
    if (clip) clip.style.overflow = zoomed ? "hidden" : "";
  };
  const moveTo = (rect, nextX, nextY, nextScale = scale) => {
    const maxX = ((nextScale - 1) * rect.width) / scale / 2;
    const maxY = ((nextScale - 1) * rect.height) / scale / 2;
    x = clamp(-maxX, nextX, maxX);
    y = clamp(-maxY, nextY, maxY);
    scale = nextScale;
    render();
  };
  video.addEventListener("dblclick", event => {
    if (1 === scale || isOverControls(video, event)) return;
    event.preventDefault();
    scale = 1;
    x = y = 0;
    render();
  });
  video.addEventListener("pointerdown", event => {
    if (1 === scale || 0 !== event.button || isOverControls(video, event))
      return;
    event.preventDefault();
    video.setPointerCapture(event.pointerId);
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      fromX: x,
      fromY: y,
      moved: false,
    };
  });
  video.addEventListener("pointermove", event => {
    if (drag?.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 3) return;
    drag.moved = true;
    moveTo(video.getBoundingClientRect(), drag.fromX + dx, drag.fromY + dy);
  });
  let dragEndedAt = 0;
  const endDrag = event => {
    if (drag?.pointerId !== event.pointerId) return;
    if (drag.moved) dragEndedAt = event.timeStamp;
    drag = null;
    render();
  };
  video.addEventListener("pointerup", endDrag);
  video.addEventListener("pointercancel", endDrag);
  return {
    onWheel: event => {
      const rect = video.getBoundingClientRect();
      const cx = event.clientX - (rect.left + rect.width / 2 - x);
      const cy = event.clientY - (rect.top + rect.height / 2 - y);
      const delta = clamp(-25, deltaPx(event), 25);
      const next = clamp(1, scale * Math.exp(-delta / 100), 4);
      moveTo(
        rect,
        cx - (next / scale) * (cx - x),
        cy - (next / scale) * (cy - y),
        next,
      );
    },
    endsDrag: event => event.timeStamp - dragEndedAt < 100,
  };
}
function attachVideoGestures(video) {
  const onVolumeWheel = volumeOnScroll(video);
  const zoom = zoomAndPan(video);
  video.addEventListener(
    "wheel",
    event => {
      event.preventDefault();
      if (event.ctrlKey) zoom.onWheel(event);
      else if (Math.abs(event.deltaY) >= Math.abs(event.deltaX))
        onVolumeWheel(event);
    },
    { passive: false },
  );
  video.addEventListener("click", event => {
    if (zoom.endsDrag(event) || !isOverControls(video, event))
      event.preventDefault();
  });
}

;// file://./src/betterbw/features/panelActions.tsx

const BtnClassify = ({ getUsername, panel, value, title, onClick }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-status-value": value,
    title: title,
    className: "panel-action-btn",
    onClick: e => {
      const username = getUsername();
      if (username)
        GM.setValue(`${username}_status`, value).then(() =>
          refreshDynamicStyle(),
        );
      if (panel) panel.dataset.status = value;
      onClick?.(e);
    },
    children: value,
  });
const BtnMinus2 = ({ getUsername, panel }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    getUsername: getUsername,
    panel: panel,
    value: "--",
    title: "Nope\nDo not suggest this person.",
    onClick: () => {
      if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
    },
  });
const BtnMinus1 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "-",
    title: "So so\nIt depends on the day, on the mood...",
    ...props,
  });
const BtnPlus1 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "+",
    title: "Yeah\nI liked you, buddy",
    ...props,
  });
const BtnPlus2 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "++",
    title: "Ohhh Yeah!\nI liked you a lot, buddy!",
    ...props,
  });
const BtnRotate = ({ panel, getUsername }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title: "Rotate",
    className: "panel-action-btn",
    onClick: () => {
      if (panel) rotateCam({ id: getUsername(), panel });
    },
    children: "⟳",
  });
const BtnCooldown = ({ panel, getUsername }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title:
      "Cooldown 15m\nDo not suggest this person for the next 15 minutes\n\nShift + click: Cooldown 2h",
    className: "panel-action-btn",
    onClick: event => {
      event?.shiftKey
        ? cooldownIt({ username: getUsername(), panel, minutes: 120 })
        : cooldownIt({ username: getUsername(), panel });
    },
    children: "⏱",
  });
const PanelActions = ({ panel, username }) => {
  const props = { panel, getUsername: () => username };
  return (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnCooldown, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnRotate, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus2, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus2, { ...props }),
    ],
  });
};
const MenuActions = () => {
  const props = { getUsername: getLatestUser };
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnCooldown, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus2, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus2, { ...props }),
    ],
  });
};
function getLatestUser() {
  const selected = getUserById(chatHTML5.myUser.selectedUserid);
  if (selected) return selected.username;
  const muteItem = $('#userMenu [data-action="mute"]')[0];
  return muteItem?.textContent.split(" ").at(-1)?.split("_").at(0);
}
function resizePanel(panelJS) {
  const { width, height } = computeLayout();
  panelJS.resize({ width, height });
}
function monitorVideoReadiness(video, panel, panelJS) {
  let timeoutId;
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return;
  const cleanup = () => {
    clearTimeout(timeoutId);
    video.removeEventListener("loadeddata", onVideoReady);
  };
  const onVideoReady = () => {
    cleanup();
  };
  const originalClose = panelJS.close.bind(panelJS);
  panelJS.close = function () {
    cleanup();
    return originalClose();
  };
  timeoutId = setTimeout(() => {
    cooldownIt({ username: scrappers_getUsername(panel), minutes: 5 });
    panelJS.close();
  }, 25000);
  video.addEventListener("loadeddata", onVideoReady);
}
async function attachPanelActions(panel) {
  if ("1" === panel.dataset.actionsAttached) return;
  panel.dataset.actionsAttached = "1";
  const panelJS = jsPanel.activePanels.getPanel(panel.id);
  if (!panelJS) return console.warn("Panel not found for", panel.id);
  resizePanel(panelJS);
  const header = $(".jsPanel-hdr .jsPanel-title", panel)[0];
  if (!header) return;
  const username = scrappers_getUsername(panel);
  if (!username) return;
  panel.dataset.username = username;
  panel.dataset.status = await GM.getValue(`${username}_status`);
  const actions = document.createElement("div");
  actions.className = "panel-action";
  header.appendChild(actions);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(PanelActions, { username: username, panel: panel }), actions);
  panel.dataset.rotation = await GM.getValue(`${username}_rotation`);
  $(".jsPanel-btn.jsPanel-btn-close", panel)
    .attr("title", "Close\n\nShift + click: also reduce the # of cams")
    .on("click", event => {
      if (event.shiftKey)
        chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber();
      cooldownIt({ username: username, minutes: 1 });
    });
  $(".userAvatar", panel).on("click", event => {
    event.stopPropagation();
    if (!("pageX" in event && "pageY" in event)) return;
    if ($("#userMenu").is(":visible")) return void $("#userMenu").hide();
    $(
      `#userList .userItem[data-id=${JSON.stringify(panel.id.split("_")[2])}]`,
    ).trigger(
      new jQuery.Event("click", { pageX: event.pageX + 3, pageY: event.pageY }),
    );
  });
  const video = panel.querySelector("video");
  if (video) {
    if (sessionAudioMuted.get(username)) video.muted = true;
    video.volume = await GM.getValue(`${username}_volume`, 0.08);
    attachVideoGestures(video);
    persistVolumeChange(video, username);
    monitorVideoReadiness(video, panel, panelJS);
  }
}
function persistVolumeChange(video, username) {
  video.addEventListener(
    "volumechange",
    debounce(async () => {
      sessionAudioMuted.set(username, video.muted);
      await GM.setValue(`${username}_volume`, video.volume);
    }),
  );
}

;// file://./src/betterbw/utils/spyOn.ts
function spyOn(obj, watchers) {
  return Proxy.revocable(obj, {
    set(target, prop, value) {
      if (prop in watchers && target[prop] !== value) watchers[prop](value);
      target[prop] = value;
      return true;
    },
  });
}

// EXTERNAL MODULE: ./src/betterbw/styles/openPanels.css?inline
var openPanelsinline = __webpack_require__("./src/betterbw/styles/openPanels.css?inline");
;// file://./src/betterbw/dynamicOpenedStyle.ts

const dynamicOpenedStyle = GM_addStyle("");
function updateCssForOpenedPanels() {
  const opened = queryPanels();
  if (!opened?.length) return;
  const usernames = Array.from(opened)
    .map(panel => scrappers_getUsername(panel))
    .filter(isDefined);
  const selectorsIamWatching = usernames.map(dataUsername).join(",");
  const selectorsWatchingMe = usernames
    .map(
      id =>
        `body:has(#userList .userItem:where(${dataUsername(id)}) .eye-icon .isWatching) .jsPanel[data-username="${id}"]`,
    )
    .join(", ");
  const selectorsWatchingPrivateCams = usernames
    .map(
      id =>
        `body:has(#userList .userItem:where(${dataUsername(id)}) .webcamBtn.visible i.lock.fa-lock) .jsPanel[data-username="${id}"] .jsPanel-title>span:before`,
    )
    .join(",");
  dynamicOpenedStyle.innerHTML = openPanelsinline["default"].replace(
    /(\.watching_private_cam|\.user_watching_me|\[data-username="I_am_watching"\])/g,
    arg => {
      switch (arg) {
        case ".watching_private_cam":
          return selectorsWatchingPrivateCams;
        case ".user_watching_me":
          return selectorsWatchingMe;
        case '[data-username="I_am_watching"]':
          return selectorsIamWatching;
        default:
          return arg;
      }
    },
  );
}

;// file://./src/betterbw/features/tabFocus.ts
const tabFocused = () => "visible" === document.visibilityState;
const whenTabFocused = callback => {
  document.addEventListener(
    "visibilitychange",
    () => {
      "visible" === document.visibilityState && callback();
    },
    { once: true, passive: true },
  );
};

;// file://./src/betterbw/utils/observeIt.ts
function iterate(nodes, selector, fn) {
  let found = false;
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    const panels = node.matches(selector)
      ? [node]
      : node.querySelectorAll(selector);
    if (panels.length) {
      if (fn) panels.forEach(fn);
      found = true;
    }
  }
  return found;
}
function observeIt({
  target,
  selector,
  forEachAddedNode,
  forEachRemovedNode,
  cleanup,
}) {
  const observerPanels = new MutationObserver(mutations => {
    let nodesAdded = false;
    let nodesRemoved = false;
    for (const mutation of mutations) {
      if (iterate(mutation.addedNodes, selector, forEachAddedNode))
        nodesAdded = true;
      if (iterate(mutation.removedNodes, selector, forEachRemovedNode))
        nodesRemoved = true;
    }
    cleanup?.({ nodesAdded, nodesRemoved });
  });
  observerPanels.observe(target, { childList: true, subtree: false });
  return {
    teardown: () => {
      observerPanels.disconnect();
    },
  };
}

;// CONCATENATED MODULE: external "preactHooks"
const external_preactHooks_namespaceObject = window.preactHooks;
;// file://./src/betterbw/algo.ts
let algo_algo = "";
const getAlgo = () => algo_algo;
const setAlgo = val => {
  document.body.dataset.algo = algo_algo = val;
};

;// file://./src/betterbw/features/globalActions.tsx

const btnDisableClick = () => {
  organizePanels();
  setAlgo("");
};
const BtnDisable = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "",
    title: "Organize open panels and stop the algorithm",
    onClick: btnDisableClick,
    children: "\xf8",
  });
const btnNewClick = async () => {
  setAlgo("new");
  openCandidates(await getCandidates(topRandom, { undefined: 9, "+": 8 }));
};
const BtnNew = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "new",
    title: "Prioritize users you haven't liked/disliked before",
    onClick: btnNewClick,
    children: "New",
  });
const btnTopClick = async () => {
  setAlgo("top");
  openCandidates(await getCandidates(topRandom));
};
const BtnTop = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "top",
    title: "Prioritize users you liked more",
    onClick: btnTopClick,
    children: "Top",
  });
const clickOnCurrentAlgoButton = debounce(() => {
  const algo = getAlgo();
  if ("new" === algo) btnNewClick();
  else if ("top" === algo) btnTopClick();
  else if ("" === algo) organizePanels();
});
const NumberOfCams = () => {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() => GM_getValue("user.webcamMax", 10));
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    const maxWebcamreached = chatHTML5.maxWebcamreached;
    chatHTML5.maxWebcamreached = function () {
      if (!maxWebcamreached()) return false;
      chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber() + 1;
      return maxWebcamreached();
    };
    const { proxy, revoke } = spyOn(chatHTML5.roles.user, {
      webcamMax: n => {
        setValue(n);
        GM.setValue("user.webcamMax", n);
      },
    });
    chatHTML5.roles.user = proxy;
    return () => {
      chatHTML5.maxWebcamreached = maxWebcamreached;
      revoke();
    };
  }, []);
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    clickOnCurrentAlgoButton();
  }, [value]);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        title: "# of open cams",
        type: "number",
        className: "numberOfCams",
        value: value,
        onChange: e => {
          chatHTML5.roles.user.webcamMax = +e.currentTarget.value;
        },
      }),
      " cams",
    ],
  });
};
const globalActions_onChangeEffect = value => {
  gridconf.WIDTH = +value;
  gridconf.HEIGHT = value * panelRatio;
  clickOnCurrentAlgoButton();
};
const PanelSizeInput = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)(MemoInput, {
    storageKey: "config.webcamWidth",
    title:
      "Size of the panel\nShrinks automatically when the cams don't fit the screen",
    type: "number",
    className: "numberOfCams",
    suffix: "px",
    min: "150",
    step: "5",
    defaultValue: gridconf.WIDTH,
    onChangeEffect: globalActions_onChangeEffect,
  });
const MemoInput = ({
  storageKey,
  prefix,
  suffix,
  defaultValue,
  onChangeEffect,
  ...props
}) => {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() =>
    GM_getValue(storageKey, defaultValue),
  );
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    onChangeEffect(value);
  }, [value]);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      prefix,
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        ...props,
        value: value,
        onChange: e => {
          const value = e.currentTarget.value;
          setValue(value);
          GM.setValue(storageKey, value);
        },
      }),
      suffix,
    ],
  });
};
const AlgoControls = () =>
  (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnTop, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnNew, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnDisable, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(NumberOfCams, {}),
      " @ ",
      (0,external_jsxRuntime_namespaceObject.jsx)(PanelSizeInput, {}),
    ],
  });

;// file://./src/betterbw/features/observeOpenPanels.ts

let observeOpenPanels_nextUser = null;
const setNextCam = val => (observeOpenPanels_nextUser = val);
let clickRequested = false;
function observePanels() {
  return observeIt({
    target: document.body,
    selector: PANEL_SELECTOR,
    forEachAddedNode: attachPanelActions,
    cleanup: ({ nodesAdded, nodesRemoved }) => {
      if (!nodesAdded && !nodesRemoved) return;
      organizePanels();
      if (nodesRemoved) {
        if (observeOpenPanels_nextUser) {
          $(".webcamBtn.visible", observeOpenPanels_nextUser).trigger("click");
          observeOpenPanels_nextUser = null;
        } else if (tabFocused()) clickOnCurrentAlgoButton();
        else if (!clickRequested) {
          clickRequested = true;
          whenTabFocused(() => {
            clickRequested = false;
            clickOnCurrentAlgoButton();
          });
        }
      }
      updateCssForOpenedPanels();
    },
  });
}

;// file://./src/betterbw/features/spyOnConfig.ts

function spyOnConfig(watchers = {}) {
  const { proxy, revoke } = spyOn(chatHTML5.config, watchers);
  chatHTML5.config = proxy;
  return { proxy, revoke, watchers };
}

;// file://./src/betterbw/features/watchStats.ts

const STORAGE_KEY = "stats.watchingMe";
const PEAK_KEYS = ["watchers", "onCam", "mutual", "roomShare", "camsShare"];
const emptyPeaks = () =>
  Object.fromEntries(PEAK_KEYS.map(key => [key, { value: 0, at: 0 }]));
const emptyUnsaved = () => ({
  watchedMs: 0,
  watcherMs: 0,
  sessions: 0,
  regulars: {},
});
const emptyEver = () => ({
  ...emptyUnsaved(),
  peaks: emptyPeaks(),
  since: Date.now(),
});
let watchStats_now = {
  watchers: 0,
  onCam: 0,
  mutual: 0,
  roomShare: 0,
  camsShare: 0,
  names: [],
};
const watchStats_session = {
  watchedMs: 0,
  watcherMs: 0,
  peaks: emptyPeaks(),
  watchers: new Set(),
};
let watchStats_ever = emptyEver();
let unsaved = emptyUnsaved();
let dirty = false;
let watchStats_paused = false;
let lastTickAt = Date.now();
let savedAt = Date.now();
const listeners = new Set();
function subscribeWatchStats(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const getWatchStats = () => ({ now: watchStats_now, session: watchStats_session, ever: watchStats_ever, paused: watchStats_paused });
const isTransmitting = () => true === chatHTML5.myUser.webcam;
function isMainTabActive() {
  const tab = document.querySelector('[data-label="Bateworld"]');
  if (!tab) return false;
  return (
    tab.matches('.active, [aria-selected="true"]')
    || Boolean(tab.parentElement?.matches("li.active"))
  );
}
const numberIn = selector =>
  Number(document.querySelector(selector)?.textContent?.trim()) || 0;
function takeSnapshot() {
  const notMe = `:not([data-id="${chatHTML5.myUser.id}"])`;
  const watcherItems = Array.from(
    document.querySelectorAll(
      `#userList .userItem${notMe}:has(.eye-icon .isWatching)`,
    ),
  );
  const names = [
    ...new Set(
      watcherItems
        .map(item => item.dataset.username?.split("_")[0])
        .filter(isDefined),
    ),
  ];
  const watchers = Math.max(numberIn("#watchAtMe"), names.length);
  const onCam = watcherItems.filter(
    item => "true" === item.dataset.webcam,
  ).length;
  const watching = new Set(Array.from(queryPanels(), scrappers_getUsername));
  const mutual = names.filter(name => watching.has(name)).length;
  const othersOnline =
    (numberIn("#onlineCounter")
      || document.querySelectorAll("#userList .userItem").length) - 1;
  const othersOnCam = document.querySelectorAll(
    `#userList .userItem${notMe}[data-webcam="true"]`,
  ).length;
  return {
    watchers,
    onCam,
    mutual,
    roomShare: othersOnline > 0 ? watchers / othersOnline : 0,
    camsShare: othersOnCam > 0 ? onCam / othersOnCam : 0,
    names,
  };
}
function record(at) {
  watchStats_now = takeSnapshot();
  if (watchStats_now.watchers > 0 && 0 === watchStats_session.peaks.watchers.value) {
    watchStats_ever.sessions++;
    unsaved.sessions++;
  }
  for (const key of PEAK_KEYS) {
    const value = watchStats_now[key];
    if (value > watchStats_session.peaks[key].value) watchStats_session.peaks[key] = { value, at };
    if (value > watchStats_ever.peaks[key].value) {
      watchStats_ever.peaks[key] = { value, at };
      dirty = true;
    }
  }
  for (const name of watchStats_now.names)
    if (!watchStats_session.watchers.has(name)) {
      watchStats_session.watchers.add(name);
      watchStats_ever.regulars[name] = (watchStats_ever.regulars[name] ?? 0) + 1;
      unsaved.regulars[name] = (unsaved.regulars[name] ?? 0) + 1;
    }
}
function tick() {
  const at = Date.now();
  if (!watchStats_paused && watchStats_now.watchers > 0) {
    for (const totals of [watchStats_session, watchStats_ever, unsaved]) {
      totals.watchedMs += at - lastTickAt;
      totals.watcherMs += watchStats_now.watchers * (at - lastTickAt);
    }
    dirty = true;
  }
  lastTickAt = at;
  watchStats_paused = !isMainTabActive();
  if (!watchStats_paused) record(at);
  if (dirty && at - savedAt > 15000) save();
  listeners.forEach(listener => listener());
}
async function load() {
  const stored = await GM.getValue(STORAGE_KEY);
  const empty = emptyEver();
  return { ...empty, ...stored, peaks: { ...empty.peaks, ...stored?.peaks } };
}
function merge(base, pending, peaks) {
  const regulars = { ...base.regulars };
  for (const [name, count] of Object.entries(pending.regulars))
    regulars[name] = (regulars[name] ?? 0) + count;
  return {
    since: base.since,
    peaks: Object.fromEntries(
      PEAK_KEYS.map(key => [
        key,
        peaks[key].value > base.peaks[key].value ? peaks[key] : base.peaks[key],
      ]),
    ),
    watchedMs: base.watchedMs + pending.watchedMs,
    watcherMs: base.watcherMs + pending.watcherMs,
    sessions: base.sessions + pending.sessions,
    regulars,
  };
}
async function save() {
  dirty = false;
  savedAt = Date.now();
  const pending = unsaved;
  unsaved = emptyUnsaved();
  const saved = merge(await load(), pending, watchStats_ever.peaks);
  await GM.setValue(STORAGE_KEY, saved);
  watchStats_ever = merge(saved, unsaved, watchStats_ever.peaks);
}
async function trackWatchStats() {
  watchStats_ever = await load();
  lastTickAt = Date.now();
  tick();
  setInterval(tick, 2000);
  const counter = document.getElementById("watchAtMe");
  if (counter)
    new MutationObserver(tick).observe(counter, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  window.addEventListener("pagehide", () => {
    if (dirty) save();
  });
}

;// file://./src/betterbw/features/watchStatsDisplay.tsx

const watchStatsDisplay_int = n => Math.round(n).toLocaleString();
const pct = n => `${Math.round(100 * n)}%`;
const average = ({ watchedMs, watcherMs }) =>
  watchedMs ? (watcherMs / watchedMs).toFixed(1) : "–";
const date = at =>
  new Date(at).toLocaleString(void 0, {
    dateStyle: "medium",
    timeStyle: "short",
  });
function duration(ms) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return `${Math.floor(ms / 1000)}s`;
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
const PEAK_ROWS = [
  ["watchers", "Watching you", watchStatsDisplay_int],
  ["onCam", "…with their cam on", watchStatsDisplay_int],
  ["mutual", "…whose cam you watch", watchStatsDisplay_int],
  ["roomShare", "Share of the room", pct],
  ["camsShare", "Share of the cams", pct],
];
function StatsCard({ anchor }) {
  const { now, session, ever, paused } = getWatchStats();
  const below = anchor.bottom + 340 < innerHeight;
  const style = {
    width: "330px",
    left: `max(8px, min(${anchor.left}px, calc(100vw - 338px)))`,
    top: `${below ? anchor.bottom + 6 : anchor.top - 6}px`,
    transform: below ? "" : "translateY(-100%)",
  };
  const regulars = Object.entries(ever.regulars)
    .filter(([, sessions]) => sessions > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    class: "bbw-watch-card",
    style: style,
    children: [
      (0,external_jsxRuntime_namespaceObject.jsxs)("table", {
        children: [
          (0,external_jsxRuntime_namespaceObject.jsx)("thead", {
            children: (0,external_jsxRuntime_namespaceObject.jsxs)("tr", {
              children: [
                (0,external_jsxRuntime_namespaceObject.jsx)("th", {}),
                (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Now" }),
                (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Session" }),
                (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Ever" }),
              ],
            }),
          }),
          (0,external_jsxRuntime_namespaceObject.jsxs)("tbody", {
            children: [
              PEAK_ROWS.map(([key, label, format]) =>
                (0,external_jsxRuntime_namespaceObject.jsxs)(
                  "tr",
                  {
                    children: [
                      (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: label }),
                      (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: paused ? "–" : format(now[key]) }),
                      (0,external_jsxRuntime_namespaceObject.jsx)("td", {
                        children: format(session.peaks[key].value),
                      }),
                      (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: format(ever.peaks[key].value) }),
                    ],
                  },
                  key,
                ),
              ),
              (0,external_jsxRuntime_namespaceObject.jsxs)("tr", {
                class: "bbw-separator",
                children: [
                  (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Unique watchers" }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", {}),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: watchStatsDisplay_int(session.watchers.size) }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", {
                    children: watchStatsDisplay_int(Object.keys(ever.regulars).length),
                  }),
                ],
              }),
              (0,external_jsxRuntime_namespaceObject.jsxs)("tr", {
                children: [
                  (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Watched for" }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", {}),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: duration(session.watchedMs) }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: duration(ever.watchedMs) }),
                ],
              }),
              (0,external_jsxRuntime_namespaceObject.jsxs)("tr", {
                children: [
                  (0,external_jsxRuntime_namespaceObject.jsx)("th", { children: "Average watchers" }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", {}),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: average(session) }),
                  (0,external_jsxRuntime_namespaceObject.jsx)("td", { children: average(ever) }),
                ],
              }),
            ],
          }),
        ],
      }),
      paused
        && (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
          children: [
            (0,external_jsxRuntime_namespaceObject.jsx)("b", { children: "Paused:" }),
            " only counted while the Bateworld tab is open",
          ],
        }),
      (0,external_jsxRuntime_namespaceObject.jsx)("p", {
        class: "bbw-muted",
        children:
          "Top rows: the most at once. Averages count only the time someone was watching.",
      }),
      ever.peaks.watchers.at > 0
        && (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
          children: [
            "Record: ",
            (0,external_jsxRuntime_namespaceObject.jsx)("b", { children: watchStatsDisplay_int(ever.peaks.watchers.value) }),
            " watchers, on ",
            date(ever.peaks.watchers.at),
          ],
        }),
      regulars.length > 0
        && (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
          children: [
            "Regulars: ",
            regulars
              .map(([name, sessions]) => `${name} (${sessions})`)
              .join(", "),
          ],
        }),
      (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
        class: "bbw-muted",
        children: [
          "Watched in ",
          watchStatsDisplay_int(ever.sessions),
          " sessions since ",
          date(ever.since),
        ],
      }),
    ],
  });
}
function WatchStats() {
  const [, setVersion] = (0,external_preactHooks_namespaceObject.useState)(0);
  (0,external_preactHooks_namespaceObject.useEffect)(() => subscribeWatchStats(() => setVersion(v => v + 1)), []);
  const [anchor, setAnchor] = (0,external_preactHooks_namespaceObject.useState)(null);
  const { session, ever } = getWatchStats();
  const showSession = isTransmitting() || session.peaks.watchers.value > 0;
  return (0,external_jsxRuntime_namespaceObject.jsxs)("span", {
    class: "bbw-watch-stats",
    onMouseEnter: e => setAnchor(e.currentTarget.getBoundingClientRect()),
    onMouseLeave: () => setAnchor(null),
    children: [
      (0,external_jsxRuntime_namespaceObject.jsxs)("span", {
        class: "bbw-watch-summary",
        children: [
          "max ",
          watchStatsDisplay_int(ever.peaks.watchers.value),
          showSession && ` · session ${watchStatsDisplay_int(session.peaks.watchers.value)}`,
        ],
      }),
      anchor && (0,external_jsxRuntime_namespaceObject.jsx)(StatsCard, { anchor: anchor }),
    ],
  });
}

// EXTERNAL MODULE: ./src/betterbw/styles/watchStats.css?inline
var watchStatsinline = __webpack_require__("./src/betterbw/styles/watchStats.css?inline");
;// file://./src/betterbw/setupTools.tsx

async function setupHeader() {
  const header = $("#header .header-custom-btns")[0];
  if (!header) return;
  const controls = document.createElement("div");
  controls.id = "bbw_header_controls";
  header.prepend(controls);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(AlgoControls, {}), controls);
}
async function setupUserMenu() {
  const userMenu = $("#userMenu")[0];
  if (!userMenu) return;
  const controls = document.createElement("div");
  controls.id = "bbw_menu_controls";
  userMenu.appendChild(controls);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(MenuActions, {}), controls);
  chatHTML5.myUser = spyOn(chatHTML5.myUser, {
    selectedUserid: async selectedUserid => {
      const nuser = getUserById(selectedUserid);
      if (!nuser) return;
      userMenu.dataset.status = await GM.getValue(`${nuser.username}_status`);
      userMenu.dataset.username = nuser.username;
      userMenu.dataset.isCooldown = Boolean(
        await isOnCooldown(nuser.username),
      ).toString();
      userMenu.dataset.privateCam = Boolean(!nuser.obj.webcamPublic).toString();
    },
  }).proxy;
}
async function setupSidebar() {
  const userList = document.getElementById("userList");
  if (!userList) return;
  $(userList).on("click", ".webcamBtn", function (event) {
    if (event.shiftKey) return;
    const webcamNumber = chatHTML5.getWebcamNumber();
    const webcamMax = +chatHTML5.roles.user.webcamMax;
    if (webcamNumber < webcamMax) return;
    const nextUser = $(this).closest(".userItem")[0];
    if (!nextUser?.dataset.id) return;
    const user = getUserById(nextUser.dataset.id);
    if (!user) return;
    if (user.obj.webcamPublic) {
      event.stopPropagation();
      setNextCam(nextUser);
      const panel = getPanelToClose(webcamNumber);
      if (panel?.id) jsPanel.activePanels.getPanel(panel.id)?.close();
    }
  });
  $(userList).on("click", ".fa-eye.fa-2x", function (e) {
    if (e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}
async function setupWatchStats() {
  const counter = document.getElementById("watchAtMe");
  if (!counter) return;
  GM.addStyle(watchStatsinline["default"]);
  const stats = document.createElement("span");
  stats.id = "bbw_watch_stats";
  counter.after(stats);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(WatchStats, {}), stats);
  await trackWatchStats();
}
const ConfigWatchers = {};
function getPanelToClose(webcamNumber) {
  if (webcamNumber <= 0) return null;
  const optionA = $(
    `${PANEL_SELECTOR}:not(.user_watching_me)[data-status="--"]`,
  )[0];
  if (optionA) return optionA;
  for (let i = webcamNumber; i > 0; i--) {
    const optionB = $(`${PANEL_SELECTOR}[data-grid-index="${i}"]`)[0];
    if (optionB) return optionB;
  }
  const panels = queryPanels();
  return panels[panels.length - 1] || null;
}
async function setupTools() {
  chatHTML5.config.timeBeforeWatchingCamAgain = "1000";
  chatHTML5.config.checkOwnStream = "1";
  chatHTML5.config.showCountryFlag = "1";
  chatHTML5.roles.user.webcamMax = GM_getValue("user.webcamMax", 10);
  const { revoke } = spyOnConfig(ConfigWatchers);
  chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();
  await Promise.all([
    setupHeader(),
    setupUserMenu(),
    setupSidebar(),
    setupWatchStats(),
  ]);
  $("#sortWebcamtBtn").trigger("click");
  return revoke;
}

;// file://./src/betterbw/features/observeChat.tsx

function handleWebcamOpened(message) {
  const span = $("[data-id]", message)[0];
  if (!span) return;
  const user = getUserById(span.dataset.id);
  if (!user) return;
  message.dataset.username = user.username;
  const privateCam = Boolean(!user.obj.webcamPublic);
  message.dataset.privateCam = privateCam.toString();
  span.innerHTML = span.innerHTML.replace(
    /(User )(.*?)( has opened his webcam)/gi,
    `$1<span class="userLabelBBW" data-username=${JSON.stringify(user.username)}>$2</span>$3`,
  );
  if (!privateCam) clickOnCurrentAlgoButton();
}
function handleRegularMessage(message) {
  const msgHeader = $("[data-ip]", message)[0];
  if (!msgHeader) return;
  msgHeader.classList.add("userLabelBBW", "sender");
}
function handleWhisperOrPrivateMessage(message) {
  const msgHeader = $("[data-ip]", message)[0];
  if (!msgHeader || !msgHeader.childNodes.length) return;
  {
    const firstChild = msgHeader.childNodes[0];
    const span = document.createElement("span");
    span.dataset.username = msgHeader.dataset.username;
    span.classList.add("userLabelBBW", "sender");
    msgHeader.insertBefore(span, firstChild);
    span.appendChild(firstChild);
  }
  {
    const thirdChild = msgHeader.childNodes[2];
    const span = document.createElement("span");
    span.dataset.username = thirdChild.textContent?.trim();
    span.classList.add("userLabelBBW", "receiver");
    msgHeader.insertBefore(span, thirdChild);
    span.appendChild(thirdChild);
  }
}
function handlePrivateRequested(message) {
  const textNode = Array.from(message.childNodes).find(
    n => 3 === n.nodeType && n.textContent?.trim(),
  );
  if (!textNode || !textNode.textContent) return;
  const textContent = textNode.textContent;
  const match = textContent.match(
    /\s*(\S+?)\s+has invited you to watch his cam/,
  );
  if (!match) return;
  const full_username = match[1];
  if (!full_username) return;
  const span = document.createElement("span");
  span.className = "userLabelBBW";
  span.dataset.username = full_username;
  span.textContent = full_username;
  message.insertBefore(span, textNode);
  textNode.textContent = textContent.replace(/(^\s*\S+?)(\s+.*$)/, "$2");
}
function handleWebcamRequest(message) {
  const textNode = Array.from(message.childNodes).find(
    n => 3 === n.nodeType && n.textContent?.trim(),
  );
  if (!textNode || !textNode.textContent) return;
  const textContent = textNode.textContent;
  const match = textContent.match(/You requested webcam of\s*(\S+)/);
  if (!match) return;
  const full_username = match[1];
  if (!full_username) return;
  const user = chatHTML5.getUserByUsername(full_username);
  if (!user) return;
  textNode.textContent = textContent.replace(/(^.*? of )(\s+.*$)/, "$1");
  const span = document.createElement("span");
  span.className = "userLabelBBW";
  span.dataset.username = full_username;
  span.textContent = full_username;
  message.appendChild(span);
  if (user.webcamPublic) {
    sessionCooldown.add(full_username);
    setTimeout(() => sessionCooldown["delete"](full_username), 1800000);
    message.append(" (unexpected)");
  }
}
function handleChatMessage(message) {
  if (message.matches(".serverMessage.webcamOpened"))
    handleWebcamOpened(message);
  else if (message.matches(".message.msg-box:not(.whisper)"))
    handleRegularMessage(message);
  else if (
    message.matches(".message.addPrivateMessage,.message.msg-box.whisper")
  )
    handleWhisperOrPrivateMessage(message);
  else if (message.matches(".serverMessage.privateRequested"))
    handlePrivateRequested(message);
  else if (message.matches(".serverMessage.webcamRequest"))
    handleWebcamRequest(message);
}
function observeChat(room) {
  return observeIt({
    target: room,
    selector: ".message,.serverMessage",
    forEachAddedNode: handleChatMessage,
  });
}
function observeChatNav() {
  const tabContent = $("#tabs .tab-content")[0];
  if (!tabContent)
    return console.warn("Chat tabs not found; chat enhancements are disabled");
  const tabs = {};
  return observeIt({
    target: tabContent,
    selector: ".tab-pane",
    forEachAddedNode: room => {
      tabs[room.id] = observeChat(room);
    },
    forEachRemovedNode: room => {
      if (room.id in tabs) {
        tabs[room.id]?.teardown?.();
        delete tabs[room.id];
      }
    },
  });
}

;// file://./src/betterbw/features/responsiveLayout.ts

const CHAT_WIDTH_KEY = "config.chatWidth";
function setupResponsiveLayout() {
  const reorganize = debounce(() => organizePanels(), 100);
  window.addEventListener("resize", reorganize);
  const chat = document.getElementById("tabsAndFooter");
  if (!chat) return;
  const savedWidth = GM_getValue(CHAT_WIDTH_KEY, "");
  if (savedWidth) chat.style.width = savedWidth;
  const saveWidth = debounce(() => {
    if (chat.style.width) GM.setValue(CHAT_WIDTH_KEY, chat.style.width);
  }, 300);
  new ResizeObserver(() => {
    saveWidth();
    reorganize();
  }).observe(chat);
}

;// file://./src/betterbw/betterbw.user.ts

async function topLevelStyles() {
  GM.addStyle(topLevelinline["default"]);
}
function hacks() {
  chatHTML5.myUser.mutedUsers = chatHTML5.myUser.mutedUsers || "";
  const original_updateNumberUsersDisplay = chatHTML5.updateNumberUsersDisplay;
  chatHTML5.updateNumberUsersDisplay = debounce(
    original_updateNumberUsersDisplay,
  );
}
async function main() {
  hacks();
  GM.addStyle(staticinline["default"]);
  sweepExpiredCooldowns();
  setupResponsiveLayout();
  observeChatNav();
  observePanels();
  await waitToBe(
    "#roomsModal",
    ["aria-hidden"],
    el => "false" === el.getAttribute("aria-hidden"),
  ).then(() => waitToBe("#roomsModal"));
  await setupTools();
  openCandidates(await getCandidates(topRandom));
}

;// file://./src/betterbw/index.ts

if (location.pathname.startsWith("/html5-chat/chatroom")) topLevelStyles();
else if (
  location.pathname.startsWith("//html5-chat/chat2")
  && "undefined" != typeof chatHTML5
)
  main();

