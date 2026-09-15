// ==UserScript==
// @name        Better bateworld.com
// @namespace   Circlejerk Scripts
// @version     1.8.0
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
"./src/betterbw/styles/camsMoveAway.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
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
___CSS_LOADER_EXPORT___.push([module.id, `.jsPanel {
  translate: var(--bbw-peek-x, 0px) var(--bbw-peek-y, 0px);
}

.jsPanel:is(.ui-draggable-dragging, .bbw-dragging) {
  translate: none;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/dragToSwap.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
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
___CSS_LOADER_EXPORT___.push([module.id, `.bbw-swap-highlight {
  z-index: 100000;
  box-sizing: border-box;
  pointer-events: none;
  background: #288cff59;
  border: 2px solid #288cffe6;
  border-radius: 4px;
  position: fixed;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
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

.jsPanel.watchingMe {
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
"./src/betterbw/styles/settings.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
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
___CSS_LOADER_EXPORT___.push([module.id, `.bbw-settings-panel {
  z-index: 100000;
  box-sizing: border-box;
  color: #eee;
  white-space: normal;
  text-align: left;
  background: #141414f5;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
  position: fixed;
  box-shadow: 0 4px 16px #0006;

  & h4 {
    margin: 0 0 8px;
    font-size: 13px;
  }

  & fieldset {
    border: none;
    margin: 8px 0 0;
    padding: 0;
  }

  & legend {
    width: auto;
    color: inherit;
    opacity: .6;
    text-transform: uppercase;
    border: none;
    margin: 0 0 2px;
    padding: 0;
    font-size: 11px;
  }

  & label {
    color: inherit;
    align-items: center;
    gap: 6px;
    margin: 2px 0;
    font-weight: normal;
    display: flex;
  }

  & .bbw-stacked {
    flex-direction: column;
    align-items: stretch;
  }

  & select, & input[type="number"] {
    color: #111;
  }

  & input[type="number"] {
    width: 4em;
  }

  & .bbw-muted {
    opacity: .6;
    margin: 8px 0 0;
    font-size: 11px;
  }

  & .bbw-explain {
    opacity: .85;
    margin-top: 2px;
    font-size: 11px;
    display: block;
  }

  & .bbw-settings-columns {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0 20px;
    display: grid;
  }

  & .bbw-layout-picker {
    display: flex;

    & a {
      color: #7fc8ff;
      text-decoration: underline;
    }
  }

  & .bbw-layout-row {
    border-radius: 4px;
    align-items: center;
    gap: 6px;
    display: flex;

    & select {
      flex: 1;
      min-width: 0;
    }
  }

  & .bbw-dirty .bbw-layout-row {
    outline: 1px solid #50c180;
    padding: 3px;
  }

  & .bbw-apply-layout {
    color: #111;
    white-space: nowrap;
    cursor: pointer;
    background: #50c180;
    border: none;
    border-radius: 4px;
    padding: 2px 10px;
    font-weight: 600;
  }
}

.bbw-discovery {
  z-index: 100000;
  color: #eee;
  white-space: nowrap;
  cursor: pointer;
  background: #141414f5;
  border-radius: 6px;
  margin-top: 8px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.4;
  position: absolute;
  top: 100%;
  left: 0;
  box-shadow: 0 4px 16px #0006;

  &:before {
    content: "";
    border: 6px solid #0000;
    border-bottom-color: #141414f5;
    position: absolute;
    bottom: 100%;
    left: 16px;
  }

  & button {
    color: #111;
    cursor: pointer;
    background: #50c180;
    border: none;
    border-radius: 4px;
    margin-left: 8px;
    padding: 2px 8px;
  }
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

.panel-action, .panel-cooldown {
  z-index: 1;
  opacity: 0;
  background: #00000080;
  border-radius: 4px;
  transition: opacity .2s ease-out;
  display: flex;
  position: absolute;
  overflow: hidden;

  & .panel-action-btn {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    color: #fff;
    text-align: center;
    opacity: .85;
    padding: 0 6px;
    font-size: 12px;
    line-height: 20px;
    transition: opacity .2s ease-out;

    &:hover {
      opacity: 1;
    }
  }
}

.panel-action {
  top: 24px;
  left: 4px;
}

.panel-cooldown {
  top: 24px;
  right: 2px;
}

.jsPanel-hdr {
  container-type: inline-size;
}

@container (width <= 240px) {
  :is(.panel-action, .panel-cooldown) .panel-action-btn {
    padding: 0 3px;
    font-size: 11px;
  }
}

.jsPanel[data-grid-index][data-actions-attached]:not(.ui-draggable-dragging, .bbw-dragging) {
  transition: top .15s linear, right .15s linear, bottom .15s linear, left .15s linear, translate .15s linear;
}

.jsPanel:hover :is(.panel-action, .panel-cooldown) {
  opacity: 1;
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
    height: 50px;
    top: 50px;
    left: 31px;
  }

  & > ul.nav.nav-pills > li > a {
    padding: .2rem;
    height: auto !important;
  }
}

#myWebcamContainer {
  & > .btn-group {
    padding-block: 0;
  }

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

#myAvatar {
  padding-inline: 0;

  & .myUsername {
    display: none;
  }
}

#bbw_header_controls {
  white-space: nowrap;
  align-items: center;
  margin-left: 6px;
  display: flex;
  position: relative;

  & button, & input {
    margin: 0;
    padding-inline: .5rem;
    line-height: 1.275;
  }

  & input[type="number"] {
    padding-inline: 0;
  }

  & label {
    margin: 0;
  }
}

#header {
  height: 30px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;

  & .status {
    top: -8px;
    left: -6px;
  }
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
"./src/betterbw/styles/videoControls.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
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
___CSS_LOADER_EXPORT___.push([module.id, `.bbw-controls {
  z-index: 2;
  box-sizing: border-box;
  color: #fff;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(#0000, #000000b3);
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 20px 0 8px;
  font-size: 12px;
  transition: opacity .2s ease-out;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  & button {
    all: unset;
    text-align: center;
    cursor: pointer;
    opacity: .85;
    width: 20px;
    line-height: 30px;

    &:hover {
      opacity: 1;
    }

    &:disabled {
      opacity: .3;
      cursor: default;
    }

    &[hidden] {
      display: none;
    }
  }

  & .bbw-floating-controls {
    align-items: flex-end;
    gap: 4px;
    margin-bottom: 2px;
    display: flex;
    position: absolute;
    bottom: 100%;
    right: 2px;
  }

  & .bbw-zoom-controls, & .bbw-rotate {
    background: #00000080;
    border-radius: 4px;
    flex-direction: column;
    display: flex;

    & button {
      font-size: 11px;
      line-height: 22px;
    }
  }

  & input[type="range"] {
    accent-color: #fff;
    cursor: pointer;
    width: 70px;
    height: 12px;
    margin: 0;
  }

  & .bbw-spacer {
    flex: 1;
  }
}

.webcamSwfContainer:fullscreen {
  background: #000;
  align-items: center;
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
___CSS_LOADER_EXPORT___.push([module.id, `#bbw_watch_stats {
  flex-basis: 100%;
  display: block;
}

.users-info {
  padding-block: 0 !important;
}

.watchingMeContainer:has(#bbw_watch_stats) {
  flex-wrap: wrap;
  line-height: 1;

  & label[for="whoWatchesMeCheckbox"] {
    margin-bottom: 0;
  }
}

.bbw-watch-stats {
  white-space: nowrap;
  cursor: help;
}

.bbw-watch-summary {
  opacity: .7;
  font-size: .85em;
}

#tabs .bbw-watch-notice {
  color: #daa520;
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

;// file://./src/betterbw/features/settings.ts
const DEFAULTS = {
  watchNotifications: "off",
  defaultVolume: 0.08,
  scrollToVolume: true,
  pinchToZoom: true,
  preferredAlgo: "top",
  layout: "adaptable",
  classicWidth: 365,
  adaptableRows: 3,
  camsMoveAway: true,
};
const getSetting = key => GM_getValue(`settings.${key}`, DEFAULTS[key]);
const setSetting = (key, value) => GM.setValue(`settings.${key}`, value);
const SITE_OPTIONS = [
  {
    group: "Sidebar",
    key: "displayConnectedSince",
    label: "For how long buddies are online",
  },
  {
    group: "Chat",
    key: "groupMessages",
    label: "Group messages in a row from the same buddy",
  },
  {
    group: "Chat",
    key: "showMessageServer",
    label: "Enter, leave and kick notices",
  },
  {
    group: "Chat",
    key: "hideMessageServerAfterNseconds",
    label: "Hide those notices after",
    type: "number",
    unit: "s (0: never)",
  },
  { group: "Cams", key: "soundMutedAtStart", label: "Start cams muted" },
];
const FORCED_SITE_OPTIONS = { openMostPopularCamAutomatically: "0" };
const siteOptionKey = key => `settings.site.${key}`;
function applySiteOptions() {
  Object.assign(chatHTML5.config, FORCED_SITE_OPTIONS);
  for (const { key } of SITE_OPTIONS) {
    const value = GM_getValue(siteOptionKey(key), null);
    if (null !== value) chatHTML5.config[key] = value;
  }
}
function setSiteOption(key, value) {
  chatHTML5.config[key] = value;
  GM.setValue(siteOptionKey(key), value);
}

;// file://./src/betterbw/utils/organizePanels.ts

const LAYOUT_LABELS = {
  classic: "Classic grid (3 rows)",
  adaptable: "Adaptable grid (N rows)",
};
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
const MAX_ROWS = 8;
function classicLayout() {
  const width = getSetting("classicWidth");
  return { width, height: width * panelRatio, cols: 3, rows: 3 };
}
function adaptableLayout() {
  const areaWidth =
    innerWidth
    - (document.getElementById("tabsAndFooter")?.getBoundingClientRect().right
      ?? 0)
    - gridconf.MARGIN_RIGHT;
  const areaHeight = innerHeight - gridconf.MARGIN_TOP;
  const rows = clamp(1, getSetting("adaptableRows"), 8);
  const fitHeight = (areaHeight - (rows - 1) * gridconf.GAP_Y) / rows;
  const width = Math.floor(
    Math.max(120, Math.min(gridconf.WIDTH, areaWidth, fitHeight / panelRatio)),
  );
  const cols = Math.max(
    1,
    Math.floor((areaWidth + gridconf.GAP_X) / (width + gridconf.GAP_X)),
  );
  return { width, height: width * panelRatio, cols, rows };
}
const computeLayout = () =>
  "classic" === getSetting("layout") ? classicLayout() : adaptableLayout();
function camsWidth() {
  return (
    3
      * (("classic" === getSetting("layout")
        ? getSetting("classicWidth")
        : gridconf.WIDTH)
        + gridconf.GAP_X)
    - gridconf.GAP_X
    + gridconf.MARGIN_RIGHT
  );
}
function* gridPositions({ width, height, cols, rows }) {
  const place = (c, r) => ({
    ...organizePanels_base,
    offsetX: -(gridconf.MARGIN_RIGHT + c * (width + gridconf.GAP_X)),
    offsetY: gridconf.MARGIN_TOP + r * (height + gridconf.GAP_Y),
  });
  for (let band = 0; band < rows; band += 2)
    for (let c = 0; c < cols; c++)
      for (let r = band; r < Math.min(band + 2, rows); r++) yield place(c, r);
  for (let c = cols; ; c++) for (let r = 0; r < rows; r++) yield place(c, r);
}
function placeInSlot(panel, index) {
  const layout = computeLayout();
  const positions = gridPositions(layout);
  for (let i = 0; i < index; i++) positions.next();
  const position = positions.next().value;
  if (position)
    jsPanel.activePanels
      .getPanel(panel.id)
      ?.resize({ width: layout.width, height: layout.height })
      .reposition(position);
}
function organizePanels() {
  document.documentElement.style.setProperty(
    "--bbw-cams-width",
    `${camsWidth()}px`,
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
  const newlyPlaced = new Set();
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0) grid.push(panel);
    else grid[nextAvailableSlot] = panel;
    newlyPlaced.add(panel);
  }
  const positions = gridPositions(layout);
  const poppedIn = [];
  grid.forEach((place, index) => {
    const position = positions.next().value;
    if (!place || !position) return;
    const isNew = newlyPlaced.has(place);
    if (isNew) {
      place.style.transition = "none";
      poppedIn.push(place);
    }
    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel)
      panel
        .resize({ width: layout.width, height: layout.height })
        .reposition(position);
    if (isNew) place.dataset.gridIndex = index.toString();
  });
  if (poppedIn.length) {
    poppedIn[0].offsetHeight;
    requestAnimationFrame(() => {
      for (const panel of poppedIn) panel.style.transition = "";
    });
  }
}

;// file://./src/betterbw/utils/scrappers.ts
function getUserId(panel) {
  return panel.id.split("_")[2] || $("[data-id]", panel)[0]?.dataset.id;
}
function scrappers_getUsername(panel) {
  const id = getUserId(panel);
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

;// file://./src/betterbw/utils/sortFunctions.ts
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

;// file://./src/betterbw/algo.ts
let algo_algo = "";
const getAlgo = () => algo_algo;
const setAlgo = val => {
  document.body.dataset.algo = algo_algo = val;
};

;// file://./src/betterbw/utils/openPanel.ts

let openPanel_roomSelected = false;
const setRoomSelected = () => (openPanel_roomSelected = true);
const PANEL_SELECTOR = ".jsPanel.jsPanel-theme-default";
const queryPanels = () => document.querySelectorAll(PANEL_SELECTOR);
const queryPanel = (target = document) =>
  target.querySelector(PANEL_SELECTOR);
function clickWebcamButton(button) {
  const menuWasOpen = $("#userMenu").is(":visible");
  button.trigger("click");
  if (!menuWasOpen) $("#userMenu").hide();
}
function tryToOpenPanel(candidate) {
  clickWebcamButton($(".webcamBtn", candidate.item));
}
const hasPanel = username =>
  Array.from(document.querySelectorAll(PANEL_SELECTOR)).some(
    panel => scrappers_getUsername(panel) === username,
  );
function verifyOpened(candidate, fallbacks) {
  setTimeout(() => {
    if (hasPanel(candidate.username)) return;
    const full_username = candidate.item.dataset.username;
    if (full_username) {
      sessionCooldown.add(full_username);
      setTimeout(() => sessionCooldown["delete"](full_username), 1800000);
    }
    if (
      "" === getAlgo()
      || !(() => {
        const max = +chatHTML5.roles.user.webcamMax;
        return (
          document.querySelectorAll(PANEL_SELECTOR).length < max
          && chatHTML5.getWebcamNumber() < max
        );
      })()
    )
      return;
    let next = fallbacks.shift();
    while (next && hasPanel(next.username)) next = fallbacks.shift();
    if (!next) return;
    console.warn(
      `[BBW] Cam for ${candidate.username} didn't open; trying ${next.username} instead`,
    );
    tryToOpenPanel(next);
    verifyOpened(next, fallbacks);
  }, 6000);
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
      onlineSince:
        (item.dataset.id && getUserById(item.dataset.id)?.obj.date) || 0,
    };
  });
  return await Promise.all(promises).then(list =>
    list.filter(isDefined).sort(compareFn),
  );
};
function openCandidates(candidates) {
  if (!openPanel_roomSelected) return;
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
    verifyOpened(c, candidates);
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
const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = text =>
  text.replace(/[&<>"']/g, char => HTML_ESCAPES[char]);

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

;// file://./src/betterbw/features/sessionZoom.ts
const sessionZoom = new Map();

;// file://./src/betterbw/utils/wheel.ts
const LINE_PX = 100 / 3;
const IS_MAC = /Mac/.test(navigator.userAgent);
function unitPx(mode) {
  return mode === WheelEvent.DOM_DELTA_LINE
    ? LINE_PX
    : mode === WheelEvent.DOM_DELTA_PAGE
      ? 800
      : 1;
}
function deltaPx(event) {
  return event.deltaY * unitPx(event.deltaMode);
}
function upwardPx(event) {
  return (event.webkitDirectionInvertedFromDevice ?? IS_MAC)
    ? deltaPx(event)
    : -deltaPx(event);
}

// EXTERNAL MODULE: ./src/betterbw/styles/videoControls.css?inline
var videoControlsinline = __webpack_require__("./src/betterbw/styles/videoControls.css?inline");
;// file://./src/betterbw/features/videoControls.ts

let styleAdded = false;
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
    const upward = upwardPx(event);
    if (video.muted && upward > 0) video.muted = false;
    const idle = null === target;
    target = clamp(
      0,
      (target ?? video.volume ** 0.3333333333333333) + upward / 6000,
      1,
    );
    if (idle) requestAnimationFrame(step);
  };
}
function makeButton(title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.title = title;
  button.addEventListener("click", event => {
    event.stopPropagation();
    onClick();
  });
  return button;
}
function setIcon(button, name) {
  if (button.dataset.icon === name) return;
  button.dataset.icon = name;
  button.innerHTML = `<i class="fa fa-${name}"></i>`;
}
function autoHide(container, bar, video) {
  let timer;
  let overBar = false;
  const hide = () => {
    if (!overBar && !video.paused) bar.classList.remove("visible");
  };
  const show = () => {
    bar.classList.add("visible");
    clearTimeout(timer);
    timer = setTimeout(hide, 2000);
  };
  container.addEventListener("pointermove", show);
  container.addEventListener("pointerleave", () => {
    clearTimeout(timer);
    overBar = false;
    hide();
  });
  bar.addEventListener("pointerenter", () => {
    overBar = true;
  });
  bar.addEventListener("pointerleave", () => {
    overBar = false;
    show();
  });
  video.addEventListener("play", show);
  video.addEventListener("pause", show);
  if (video.paused) bar.classList.add("visible");
}
function makeZoomButtons(zoom) {
  const zoomIn = makeButton("Zoom in", zoom.zoomIn);
  const zoomOut = makeButton("Zoom out", zoom.zoomOut);
  setIcon(zoomIn, "plus");
  setIcon(zoomOut, "minus");
  const sync = () => {
    zoomIn.disabled = !zoom.canZoomIn();
    zoomOut.disabled = !zoom.isZoomed();
  };
  zoom.onChange(sync);
  sync();
  const buttons = document.createElement("div");
  buttons.className = "bbw-zoom-controls";
  buttons.append(zoomIn, zoomOut);
  return buttons;
}
function makeRotateButton(onRotate) {
  const rotate = makeButton("Rotate", onRotate);
  rotate.textContent = "⟳";
  const group = document.createElement("div");
  group.className = "bbw-rotate";
  group.append(rotate);
  return group;
}
function attachVideoControls(video, zoom, onRotate) {
  if (!styleAdded) {
    GM.addStyle(videoControlsinline["default"]);
    styleAdded = true;
  }
  video.controls = false;
  new MutationObserver(() => {
    if (video.controls) video.controls = false;
  }).observe(video, { attributes: true, attributeFilter: ["controls"] });
  const container = video.parentElement;
  if ("static" === getComputedStyle(container).position)
    container.style.position = "relative";
  const bar = document.createElement("div");
  bar.className = "bbw-controls";
  const play = makeButton("Play / pause", () =>
    video.paused ? video.play() : video.pause(),
  );
  const mute = makeButton("Mute", () => {
    video.muted = !video.muted;
  });
  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = "0";
  volume.max = "1";
  volume.step = "0.01";
  volume.title = "Volume\nScroll over the controls to adjust it";
  volume.addEventListener("input", () => {
    video.muted = false;
    video.volume = Number(volume.value) ** 3;
  });
  const spacer = document.createElement("span");
  spacer.className = "bbw-spacer";
  const toggleFullscreen = () =>
    document.fullscreenElement === container
      ? document.exitFullscreen()
      : container.requestFullscreen();
  const fullscreen = makeButton(
    "Full screen\nor double-click the cam",
    toggleFullscreen,
  );
  video.addEventListener("dblclick", toggleFullscreen);
  const floating = document.createElement("div");
  floating.className = "bbw-floating-controls";
  floating.append(makeRotateButton(onRotate), makeZoomButtons(zoom));
  bar.append(play, spacer, mute, volume, fullscreen, floating);
  container.appendChild(bar);
  const sync = () => {
    setIcon(play, video.paused ? "play" : "pause");
    setIcon(
      mute,
      video.muted || 0 === video.volume ? "volume-off" : "volume-up",
    );
    setIcon(
      fullscreen,
      document.fullscreenElement === container ? "compress" : "expand",
    );
    volume.value = String(video.muted ? 0 : video.volume ** 0.3333333333333333);
  };
  for (const type of ["play", "pause", "volumechange"])
    video.addEventListener(type, sync);
  container.addEventListener("fullscreenchange", sync);
  sync();
  autoHide(container, bar, video);
  const onVolumeWheel = volumeOnScroll(video);
  bar.addEventListener(
    "wheel",
    event => {
      event.preventDefault();
      if (getSetting("scrollToVolume")) onVolumeWheel(event);
    },
    { passive: false },
  );
}

;// file://./src/betterbw/features/videoGestures.ts

function isWheelNotch(event) {
  const delta = Math.abs(event.deltaY);
  return (
    event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL
    || delta % 4.000244140625 === 0
    || (Number.isInteger(delta) && delta >= 50)
  );
}
function zoomAndPan(video, initial) {
  let scale = initial?.scale ?? 1;
  let x = initial?.x ?? 0;
  let y = initial?.y ?? 0;
  let drag = null;
  const clip = video.closest(".jsPanel-content") ?? video.parentElement;
  const listeners = new Set();
  const render = () => {
    const zoomed = scale > 1;
    video.style.scale = zoomed ? `${scale}` : "";
    video.style.translate = zoomed ? `${x}px ${y}px` : "";
    video.style.cursor = drag?.moved ? "grabbing" : zoomed ? "grab" : "";
    if (clip) clip.style.overflow = zoomed ? "hidden" : "";
    listeners.forEach(listener => listener());
  };
  const moveTo = (rect, nextX, nextY, nextScale = scale) => {
    const maxX = ((nextScale - 1) * rect.width) / scale / 2;
    const maxY = ((nextScale - 1) * rect.height) / scale / 2;
    x = clamp(-maxX, nextX, maxX);
    y = clamp(-maxY, nextY, maxY);
    scale = nextScale;
    render();
  };
  const zoomAt = (rect, cx, cy, factor) => {
    const next = clamp(1, scale * factor, 4);
    moveTo(
      rect,
      cx - (next / scale) * (cx - x),
      cy - (next / scale) * (cy - y),
      next,
    );
  };
  video.addEventListener("pointerdown", event => {
    if (1 === scale || 0 !== event.button) return;
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
  const endDrag = event => {
    if (drag?.pointerId !== event.pointerId) return;
    drag = null;
    render();
  };
  video.addEventListener("pointerup", endDrag);
  video.addEventListener("pointercancel", endDrag);
  if (scale > 1) render();
  return {
    onPinchWheel: event => {
      const rect = video.getBoundingClientRect();
      const cx = event.clientX - (rect.left + rect.width / 2 - x);
      const cy = event.clientY - (rect.top + rect.height / 2 - y);
      zoomAt(rect, cx, cy, Math.exp(-clamp(-25, deltaPx(event), 25) / 100));
    },
    onPanWheel: event => {
      moveTo(
        video.getBoundingClientRect(),
        x - event.deltaX * unitPx(event.deltaMode),
        y - deltaPx(event),
      );
    },
    zoomIn: () => zoomAt(video.getBoundingClientRect(), 0, 0, 1.25),
    zoomOut: () => zoomAt(video.getBoundingClientRect(), 0, 0, 0.8),
    isZoomed: () => scale > 1,
    canZoomIn: () => scale < 4,
    onChange: listener => listeners.add(listener),
    getState: () => ({ scale, x, y }),
  };
}
function attachVideoGestures(video, onRotate, initial) {
  const zoom = zoomAndPan(video, initial);
  attachVideoControls(video, zoom, onRotate);
  video.addEventListener(
    "wheel",
    event => {
      if (event.ctrlKey && isWheelNotch(event)) return;
      event.preventDefault();
      if (event.ctrlKey) {
        if (getSetting("pinchToZoom")) zoom.onPinchWheel(event);
      } else if (zoom.isZoomed()) zoom.onPanWheel(event);
    },
    { passive: false },
  );
  return zoom;
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
      (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
        class: "panel-action",
        children: [
          (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus2, { ...props }),
          (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus1, { ...props }),
          (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus1, { ...props }),
          (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus2, { ...props }),
        ],
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)("div", {
        class: "panel-cooldown",
        children: (0,external_jsxRuntime_namespaceObject.jsx)(BtnCooldown, { ...props }),
      }),
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
    if (!panel.isConnected) return;
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
  header.appendChild(actions);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(PanelActions, { username: username, panel: panel }), actions);
  panel.dataset.rotation = await GM.getValue(`${username}_rotation`, "0");
  $(".jsPanel-btn.jsPanel-btn-close", panel)
    .attr("title", "Close\n\nShift + click: also reduce the # of cams")
    .on("click", event => {
      if (event.shiftKey)
        chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber();
      cooldownIt({ username: username, minutes: 1 });
    });
  $(header)
    .attr(
      "title",
      "Middle click or Ctrl + click: close and reduce the # of cams",
    )
    .on("mousedown", event => {
      if (1 === event.button) event.preventDefault();
    })
    .on("auxclick click", event => {
      if ("auxclick" === event.type ? 1 !== event.button : !event.ctrlKey)
        return;
      event.preventDefault();
      chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber();
      cooldownIt({ username, minutes: 1, panel });
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
    video.volume = await GM.getValue(
      `${username}_volume`,
      getSetting("defaultVolume"),
    );
    const zoom = attachVideoGestures(
      video,
      () => rotateCam({ id: username, panel }),
      sessionZoom.get(username),
    );
    zoom.onChange(
      debounce(() => {
        sessionZoom.set(username, zoom.getState());
      }),
    );
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
  const selectorsWatchingPrivateCams = usernames
    .map(
      id =>
        `body:has(#userList .userItem:where(${dataUsername(id)}) .webcamBtn.visible i.lock.fa-lock) .jsPanel[data-username="${id}"] .jsPanel-title>span:before`,
    )
    .join(",");
  dynamicOpenedStyle.innerHTML = openPanelsinline["default"].replace(
    /(\.watching_private_cam|\[data-username="I_am_watching"\])/g,
    arg => {
      switch (arg) {
        case ".watching_private_cam":
          return selectorsWatchingPrivateCams;
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
;// file://./src/betterbw/features/globalActions.tsx

const ALGO_DESCRIPTIONS = {
  top: { label: "Top", description: "Prioritize users you liked more" },
  new: {
    label: "New",
    description: "Prioritize users you haven't liked/disliked before",
  },
};
async function runAlgo(preferredAlgo) {
  setAlgo(preferredAlgo);
  openCandidates(
    await getCandidates(
      topRandom,
      "new" === preferredAlgo ? { undefined: 9, "+": 8 } : {},
    ),
  );
}
const clickOnCurrentAlgoButton = debounce(() => {
  const algo = getAlgo();
  if ("new" === algo || "top" === algo) runAlgo(algo);
  else organizePanels();
});
const ResetLayoutButton = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title: "Reset the cams' grid layout",
    onClick: organizePanels,
    children: "▦",
  });
const PlayPauseButton = () => {
  const [playing, setPlaying] = (0,external_preactHooks_namespaceObject.useState)(true);
  return (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title: playing
      ? "Stop opening cams automatically"
      : "Start opening cams automatically",
    onClick: async () => {
      if (playing) {
        setAlgo("");
        organizePanels();
        setPlaying(false);
      } else {
        await runAlgo(getSetting("preferredAlgo"));
        setPlaying(true);
      }
    },
    children: playing ? "⏸" : "▶",
  });
};
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
  return (0,external_jsxRuntime_namespaceObject.jsx)("label", {
    children: (0,external_jsxRuntime_namespaceObject.jsx)("input", {
      title: "# of open cams",
      type: "number",
      className: "numberOfCams",
      value: value,
      onChange: e => {
        chatHTML5.roles.user.webcamMax = +e.currentTarget.value;
      },
    }),
  });
};

;// file://./src/betterbw/features/watchingMe.ts

function markPanelsWatchingMe() {
  for (const panel of queryPanels()) {
    const id = getUserId(panel);
    panel.classList.toggle(
      "watchingMe",
      Boolean(id && id in chatHTML5.watchingAtMe),
    );
  }
}
async function notifyWatching(user) {
  const mode = getSetting("watchNotifications");
  if ("off" === mode) return;
  const username = user.username.split("_")[0];
  const status = await GM.getValue(`${username}_status`);
  if ("--" === status) return;
  if ("plusplus" === mode && "++" !== status) return;
  if ("liked" === mode && "+" !== status && "++" !== status) return;
  const label = `<span class="userLabelBBW" data-username="${escapeHtml(username)}">${escapeHtml(username)}</span>`;
  chatHTML5.serverMessageCurrentTab(
    `👁 ${label} started watching you`,
    "bbw-watch-notice",
  );
}
function setupWatchingMe() {
  const notified = new Set();
  markPanelsWatchingMe();
  chatHTML5.socket.on("watched", (user, watching) => {
    markPanelsWatchingMe();
    const id = String(user.id);
    if (watching) {
      if (id !== String(chatHTML5.myUser.id) && !notified.has(id)) {
        notified.add(id);
        notifyWatching(user);
      }
    } else notified.delete(id);
  });
}

;// file://./src/betterbw/features/camCleanup.ts

const recentlyStopped = new Set();
function markStopped(id) {
  recentlyStopped.add(id);
  setTimeout(() => recentlyStopped.delete(id), 2000);
}
function detach(media) {
  media.pause();
  media.srcObject = null;
}
const camCleanup_hasPanel = id =>
  Array.from(queryPanels()).some(panel => getUserId(panel) === id);
function stopWatching(id, why) {
  if (recentlyStopped.has(id)) return;
  chatHTML5.socket.emit("watch", chatHTML5.myUser.id, id, false);
  try {
    chatHTML5.removeWebcam(id, "bbw-cleanup");
  } catch (error) {
    console.warn("[BBW] Could not stop the stream of", id, error);
  }
  console.info(
    `[BBW] Stopped the stream of ${chatHTML5.users[id]?.username ?? id} (${why})`,
  );
}
function getMediaUserId(media) {
  const [, prefix, id] = media.id.match(/^(video_|remotevideo)(\d+)$/) ?? [];
  if (!id || "video_" === prefix) return id;
  const user = Object.values(chatHTML5.users).find(
    user => String(user.streamid ?? user.id) === id,
  );
  return user ? String(user.id) : id;
}
function setupCamCleanup() {
  const { removeWebcam } = chatHTML5;
  chatHTML5.removeWebcam = (id, reason) => {
    markStopped(String(id));
    return removeWebcam(id, reason);
  };
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (this.isConnected || !this.srcObject) return play.call(this);
    const id = getMediaUserId(this);
    if (id && camCleanup_hasPanel(id)) return play.call(this);
    detach(this);
    if (id) stopWatching(id, "it connected after its panel closed");
    return Promise.resolve();
  };
}
function cleanupClosedCam(panel) {
  panel.querySelectorAll("video, audio").forEach(detach);
  const id = getUserId(panel);
  if (id && !camCleanup_hasPanel(id)) stopWatching(id, "its panel closed");
}

// EXTERNAL MODULE: ./src/betterbw/styles/camsMoveAway.css?inline
var camsMoveAwayinline = __webpack_require__("./src/betterbw/styles/camsMoveAway.css?inline");
;// file://./src/betterbw/features/camsMoveAway.ts

const rectOf = (left, top, right, bottom) =>
  new DOMRect(left, top, right - left, bottom - top);
const contains = (rect, x, y) =>
  x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
const panelRects = () =>
  Array.from(queryPanels(), panel => [panel, panel.getBoundingClientRect()]);
function endPeek(peek, instant) {
  if (!peek) return null;
  for (const panel of peek.panels) {
    if (instant) panel.style.transition = "none";
    panel.style.removeProperty(peek.property);
  }
  if (instant && peek.panels[0]) {
    peek.panels[0].offsetHeight;
    for (const panel of peek.panels) panel.style.transition = "";
  }
  return null;
}
const sides = [
  {
    zone: function tabsZone() {
      const chat = document
        .getElementById("tabsAndFooter")
        ?.getBoundingClientRect();
      if (!chat?.width) return null;
      const tabs = document
        .querySelector("#tabs .nav-tabs:not(.nav-tabs-clone)")
        ?.getBoundingClientRect();
      return rectOf(chat.left, 0, chat.right, tabs?.bottom || 65);
    },
    start: function startTabsPeek(zone) {
      const columns = panelRects().filter(
        ([, rect]) => rect.left < zone.right && rect.right > zone.left,
      );
      const covering = columns.filter(([, rect]) => rect.top < zone.bottom);
      if (!covering.length) return null;
      const shift =
        Math.max(...covering.map(([, rect]) => zone.bottom - rect.top)) + 4;
      for (const [panel] of columns)
        panel.style.setProperty("--bbw-peek-y", `${shift}px`);
      const left = Math.min(zone.left, ...columns.map(([, rect]) => rect.left));
      const right = Math.max(
        zone.right,
        ...columns.map(([, rect]) => rect.right),
      );
      return {
        panels: columns.map(([panel]) => panel),
        property: "--bbw-peek-y",
        hold: rectOf(left, zone.top, right, zone.bottom + shift),
      };
    },
    peek: null,
    timer: null,
  },
  {
    zone: function sidebarZone() {
      const sidebar = document
        .getElementById("usersContainer")
        ?.getBoundingClientRect();
      return sidebar?.width ? sidebar : null;
    },
    start: function startSidebarPeek(zone) {
      const covering = panelRects().filter(
        ([, rect]) =>
          rect.left < zone.right
          && rect.right > zone.left
          && rect.top < zone.bottom
          && rect.bottom > zone.top,
      );
      if (!covering.length) return null;
      const hugsRight = zone.left > innerWidth - zone.right;
      const needed = Math.max(
        ...covering.map(([, rect]) =>
          hugsRight ? rect.right - zone.left : zone.right - rect.left,
        ),
      );
      const shift = (hugsRight ? -1 : 1) * (needed + 4);
      for (const [panel] of covering)
        panel.style.setProperty("--bbw-peek-x", `${shift}px`);
      const top = Math.min(zone.top, ...covering.map(([, rect]) => rect.top));
      const bottom = Math.max(
        zone.bottom,
        ...covering.map(([, rect]) => rect.bottom),
      );
      return {
        panels: covering.map(([panel]) => panel),
        property: "--bbw-peek-x",
        hold: rectOf(
          Math.min(zone.left, zone.left + shift),
          top,
          Math.max(zone.right, zone.right + shift),
          bottom,
        ),
      };
    },
    peek: null,
    timer: null,
  },
];
let enabled = true;
let pointerX = -1;
let pointerY = -1;
let onPanel = null;
let camsMoveAway_frame = 0;
function cancelDwell(side) {
  if (side.timer) clearTimeout(side.timer);
  side.timer = null;
}
function endPeeks(instant = false) {
  for (const side of sides) {
    cancelDwell(side);
    side.peek = endPeek(side.peek, instant);
  }
}
const readyIn = zone => !onPanel && contains(zone, pointerX, pointerY);
function camsMoveAway_step(side) {
  if (side.peek) {
    let peek;
    if (
      !(
        contains((peek = side.peek).hold, pointerX, pointerY)
        || (!!onPanel && peek.panels.includes(onPanel))
      )
    )
      side.peek = endPeek(side.peek, false);
    return;
  }
  const zone = side.zone();
  if (!zone || !readyIn(zone)) return cancelDwell(side);
  if (side.timer) return;
  side.timer = setTimeout(() => {
    side.timer = null;
    const zone = side.zone();
    if (zone && readyIn(zone)) side.peek = side.start(zone);
  }, 250);
}
function update() {
  camsMoveAway_frame = 0;
  if (enabled) for (const side of sides) camsMoveAway_step(side);
}
function onMouseMove(event) {
  if (event.buttons) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  onPanel =
    event.target instanceof Element
      ? event.target.closest(PANEL_SELECTOR)
      : null;
  if (!camsMoveAway_frame) camsMoveAway_frame = requestAnimationFrame(update);
}
function onPointerDown(event) {
  for (const side of sides) cancelDwell(side);
  if (event.target instanceof Element && event.target.closest(PANEL_SELECTOR))
    endPeeks(true);
}
function refreshCamsMoveAway() {
  enabled = getSetting("camsMoveAway");
  if (!enabled) endPeeks();
}
function setupCamsMoveAway() {
  GM.addStyle(camsMoveAwayinline["default"]);
  refreshCamsMoveAway();
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("mousemove", onMouseMove, {
    capture: true,
    passive: true,
  });
  document.documentElement.addEventListener("mouseleave", () => endPeeks());
  addEventListener("blur", () => endPeeks());
  addEventListener("resize", () => endPeeks());
}

;// file://./src/betterbw/features/observeOpenPanels.ts

let observeOpenPanels_nextUser = null;
const setNextCam = val => (observeOpenPanels_nextUser = val);
let clickRequested = false;
function observePanels() {
  return observeIt({
    target: document.body,
    selector: PANEL_SELECTOR,
    forEachAddedNode: attachPanelActions,
    forEachRemovedNode: cleanupClosedCam,
    cleanup: ({ nodesAdded, nodesRemoved }) => {
      if (!nodesAdded && !nodesRemoved) return;
      endPeeks();
      organizePanels();
      if (nodesRemoved) {
        if (observeOpenPanels_nextUser) {
          clickWebcamButton($(".webcamBtn.visible", observeOpenPanels_nextUser));
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
      markPanelsWatchingMe();
    },
  });
}

;// file://./src/betterbw/features/discovery.tsx

const SEEN_KEY = "discovery.headerControlsMoved";
function HeaderControlsDiscovery() {
  const [seen, setSeen] = (0,external_preactHooks_namespaceObject.useState)(() => GM_getValue(SEEN_KEY, false));
  if (seen) return null;
  const dismiss = () => {
    GM.setValue(SEEN_KEY, true);
    setSeen(true);
  };
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    class: "bbw-discovery",
    onClick: dismiss,
    children: [
      "Better BW's controls moved here",
      (0,external_jsxRuntime_namespaceObject.jsx)("button", { onClick: dismiss, children: "Got it" }),
    ],
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
  watchTime: {},
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
let watchStats_dirty = false;
let watchStats_paused = false;
let lastTickAt = Date.now();
let savedAt = Date.now();
const watchStats_listeners = new Set();
function subscribeWatchStats(listener) {
  watchStats_listeners.add(listener);
  return () => {
    watchStats_listeners.delete(listener);
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
function takeSnapshot() {
  const me = String(chatHTML5.myUser.id);
  const userById = id => chatHTML5.users[id] ?? chatHTML5.watchingAtMe[id];
  const watcherIds = Object.keys(chatHTML5.watchingAtMe).filter(
    id => id !== me,
  );
  const watchers = watcherIds.length;
  const names = [
    ...new Set(
      watcherIds
        .map(id => userById(id)?.username?.split("_")[0])
        .filter(isDefined),
    ),
  ];
  const onCam = watcherIds.filter(id => userById(id)?.webcam).length;
  const watching = new Set(Array.from(queryPanels(), getUserId));
  const mutual = watcherIds.filter(id => watching.has(id)).length;
  const othersOnline =
    (Number(document.querySelector("#onlineCounter")?.textContent?.trim())
      || 0
      || document.querySelectorAll("#userList .userItem").length) - 1;
  const othersOnCam = Object.values(chatHTML5.users).filter(
    user => user.webcam && String(user.id) !== me,
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
      watchStats_dirty = true;
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
    for (const name of watchStats_now.names)
      for (const watchTime of [watchStats_ever.watchTime, unsaved.watchTime])
        watchTime[name] = (watchTime[name] ?? 0) + (at - lastTickAt);
    watchStats_dirty = true;
  }
  lastTickAt = at;
  watchStats_paused = !isMainTabActive();
  if (!watchStats_paused) record(at);
  if (watchStats_dirty && at - savedAt > 15000) save();
  watchStats_listeners.forEach(listener => listener());
}
async function load() {
  const stored = await GM.getValue(STORAGE_KEY);
  const empty = emptyEver();
  return { ...empty, ...stored, peaks: { ...empty.peaks, ...stored?.peaks } };
}
function addCounts(base, pending) {
  const sum = { ...base };
  for (const [name, count] of Object.entries(pending))
    sum[name] = (sum[name] ?? 0) + count;
  return sum;
}
function merge(base, pending, peaks) {
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
    regulars: addCounts(base.regulars, pending.regulars),
    watchTime: addCounts(base.watchTime, pending.watchTime),
  };
}
async function save() {
  watchStats_dirty = false;
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
  chatHTML5.socket.on("watched", () => tick());
  window.addEventListener("pagehide", () => {
    if (watchStats_dirty) save();
  });
}

;// file://./src/betterbw/features/fastUserList.ts
let batching = false;
let listedRoomId = null;
const isSelected = id =>
  document.getElementById(id)?.classList.contains("selected") ?? false;
function sortUserList() {
  if (isSelected("sortWatchersBtn")) return chatHTML5.sortWatchersNumber();
  const byRole = isSelected("sortRoleBtn");
  const byWebcam = isSelected("sortWebcamtBtn");
  const byName = isSelected("sortBtn");
  const list = document.getElementById("userList");
  if (!list || (!byRole && !byWebcam && !byName)) return;
  const flag = (item, key) => Number("true" === item.dataset[key]);
  const items = Array.from(list.children);
  items.sort(
    (a, b) =>
      flag(b, "showtop") - flag(a, "showtop")
      || (byRole ? Number(b.dataset.power) - Number(a.dataset.power) : 0)
      || (byWebcam ? flag(b, "webcam") - flag(a, "webcam") : 0)
      || (byName
        ? (a.dataset.username ?? "").localeCompare(
            b.dataset.username ?? "",
            void 0,
            { sensitivity: "base" },
          )
        : 0),
  );
  list.append(...items);
}
function batchUserListRebuilds() {
  const { getUserPositionInList, searchUsers } = chatHTML5;
  chatHTML5.getUserPositionInList = user => {
    if (!batching) return getUserPositionInList(user);
    return chatHTML5.showOnTopofUserList(user) ? 0 : -1;
  };
  chatHTML5.searchUsers = () => {
    if (!batching) searchUsers();
  };
  document.addEventListener("roomChanged", () => {
    batching = true;
    setTimeout(() => {
      batching = false;
      sortUserList();
      searchUsers();
      chatHTML5.updateNumberUsersDisplay();
    });
  });
}
function skipRedundantUserListRefresh() {
  const { socket } = chatHTML5;
  const tab = chatHTML5.getCurrentTab();
  if (tab.room) listedRoomId = String(tab.roomid);
  socket.on("getUsers", (_users, roomid) => {
    listedRoomId = String(roomid);
  });
  $(document).on("tabChanged", (_event, changedTab) => {
    if (changedTab?.room === false && "1" === chatHTML5.config.multiRoomEnter)
      listedRoomId = null;
  });
  const emit = socket.emit;
  socket.emit = function (event, ...args) {
    if ("getUsers" === event && String(args[0]) === listedRoomId) return this;
    return emit.call(this, event, ...args);
  };
}

;// file://./src/betterbw/features/watchStatsDisplay.tsx

const watchStatsDisplay_int = n => Math.round(n).toLocaleString();
const pct = n => `${Math.round(100 * n)}%`;
const average = ({ watchedMs, watcherMs }) =>
  watchedMs ? (watcherMs / watchedMs).toFixed(1) : "–";
const watchStatsDisplay_date = at =>
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
  const regulars = Object.entries(ever.watchTime)
    .filter(([, ms]) => ms >= 60000)
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
            watchStatsDisplay_date(ever.peaks.watchers.at),
          ],
        }),
      regulars.length > 0
        && (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
          children: [
            "Regulars: ",
            regulars
              .map(
                ([name, ms]) =>
                  `${name} (${duration(ms)}, ${watchStatsDisplay_int(ever.regulars[name] ?? 1)}×)`,
              )
              .join(", "),
          ],
        }),
      (0,external_jsxRuntime_namespaceObject.jsxs)("p", {
        class: "bbw-muted",
        children: [
          "Watched in ",
          watchStatsDisplay_int(ever.sessions),
          " sessions since ",
          watchStatsDisplay_date(ever.since),
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

;// file://./src/betterbw/features/settingsMenu.tsx

const NOTIFICATIONS = [
  ["off", "Off"],
  ["plusplus", "Only ++"],
  ["liked", "Buddies you liked (+, ++)"],
  ["all", "Everyone (except --)"],
];
const GROUPS = [...new Set(SITE_OPTIONS.map(option => option.group))];
const START_MUTED_OPTION = SITE_OPTIONS.find(
  option => "soundMutedAtStart" === option.key,
);
function SiteOptionInput({ option, onChange }) {
  const value = String(chatHTML5.config[option.key] ?? "");
  if ("number" === option.type)
    return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
      children: [
        option.label,
        (0,external_jsxRuntime_namespaceObject.jsx)("input", {
          type: "number",
          min: "0",
          value: value || "0",
          onChange: e => {
            setSiteOption(
              option.key,
              String(Math.max(0, parseInt(e.currentTarget.value) || 0)),
            );
            onChange();
          },
        }),
        option.unit,
      ],
    });
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        type: "checkbox",
        checked: "1" === value,
        onChange: e => {
          setSiteOption(option.key, e.currentTarget.checked ? "1" : "0");
          onChange();
        },
      }),
      option.label,
    ],
  });
}
function VolumePercentInput() {
  const [percent, setPercent] = (0,external_preactHooks_namespaceObject.useState)(() =>
    Math.round(100 * getSetting("defaultVolume")),
  );
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      "Default volume for new cams",
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        type: "number",
        min: "0",
        max: "100",
        value: percent,
        onChange: e => {
          const value = Math.min(
            100,
            Math.max(0, parseInt(e.currentTarget.value) || 0),
          );
          setPercent(value);
          setSetting("defaultVolume", value / 100);
        },
      }),
      "%",
    ],
  });
}
function ToggleSetting({ setting, label, explain, onChange }) {
  const [checked, setChecked] = (0,external_preactHooks_namespaceObject.useState)(() => getSetting(setting));
  return (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
        children: [
          (0,external_jsxRuntime_namespaceObject.jsx)("input", {
            type: "checkbox",
            checked: checked,
            onChange: async e => {
              const value = e.currentTarget.checked;
              setChecked(value);
              await setSetting(setting, value);
              onChange?.();
            },
          }),
          label,
        ],
      }),
      explain && (0,external_jsxRuntime_namespaceObject.jsx)("span", { class: "bbw-explain", children: explain }),
    ],
  });
}
function MemoInput({
  storageKey,
  prefix,
  suffix,
  defaultValue,
  onChangeEffect,
  ...props
}) {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() =>
    GM_getValue(storageKey, defaultValue),
  );
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
          onChangeEffect(value);
        },
      }),
      suffix,
    ],
  });
}
function PanelSizeInput() {
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    class: "bbw-stacked",
    children: [
      "Max size of the panel",
      (0,external_jsxRuntime_namespaceObject.jsx)(MemoInput, {
        storageKey: "config.webcamWidth",
        type: "number",
        className: "numberOfCams",
        suffix: "px",
        min: "150",
        step: "5",
        defaultValue: gridconf.WIDTH,
        onChangeEffect: value => {
          gridconf.WIDTH = +value;
          gridconf.HEIGHT = value * panelRatio;
          clickOnCurrentAlgoButton();
        },
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)("span", {
        class: "bbw-explain",
        children: "Shrinks automatically when the cams don't fit the screen",
      }),
    ],
  });
}
function AlgoSelect() {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() => getSetting("preferredAlgo"));
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    class: "bbw-stacked",
    children: [
      "Which cams to prioritize",
      (0,external_jsxRuntime_namespaceObject.jsx)("select", {
        value: value,
        onChange: e => {
          const next = e.currentTarget.value;
          setValue(next);
          setSetting("preferredAlgo", next);
          if ("" !== getAlgo()) runAlgo(next);
        },
        children: Object.keys(ALGO_DESCRIPTIONS).map(key =>
          (0,external_jsxRuntime_namespaceObject.jsx)(
            "option",
            { value: key, children: ALGO_DESCRIPTIONS[key].label },
            key,
          ),
        ),
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)("span", {
        class: "bbw-explain",
        children: ALGO_DESCRIPTIONS[value].description,
      }),
    ],
  });
}
function ClassicWidthInput() {
  const [width, setWidth] = (0,external_preactHooks_namespaceObject.useState)(() => getSetting("classicWidth"));
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    class: "bbw-stacked",
    children: [
      "Exact size of the panel",
      (0,external_jsxRuntime_namespaceObject.jsxs)("span", {
        children: [
          (0,external_jsxRuntime_namespaceObject.jsx)("input", {
            type: "number",
            min: "150",
            step: "5",
            value: width,
            onChange: async e => {
              const value = Math.max(150, parseInt(e.currentTarget.value) || 0);
              setWidth(value);
              await setSetting("classicWidth", value);
              organizePanels();
            },
          }),
          " ",
          "px",
        ],
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)("span", {
        class: "bbw-explain",
        children:
          "Every cam is exactly this wide, whatever the size of the window",
      }),
    ],
  });
}
function RowsSelect() {
  const [rows, setRows] = (0,external_preactHooks_namespaceObject.useState)(() => getSetting("adaptableRows"));
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    class: "bbw-stacked",
    children: [
      "Rows",
      (0,external_jsxRuntime_namespaceObject.jsx)("select", {
        value: rows,
        onChange: async e => {
          const value = +e.currentTarget.value;
          setRows(value);
          await setSetting("adaptableRows", value);
          organizePanels();
        },
        children: Array.from({ length: MAX_ROWS }, (_, i) => i + 1).map(n =>
          (0,external_jsxRuntime_namespaceObject.jsx)("option", { value: n, children: n }, n),
        ),
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)("span", {
        class: "bbw-explain",
        children:
          "The cams grow or shrink so this many rows fill the window's height",
      }),
    ],
  });
}
function LayoutOptions({ layout }) {
  if ("classic" === layout) return (0,external_jsxRuntime_namespaceObject.jsx)(ClassicWidthInput, {});
  return (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [(0,external_jsxRuntime_namespaceObject.jsx)(RowsSelect, {}), (0,external_jsxRuntime_namespaceObject.jsx)(PanelSizeInput, {})],
  });
}
function LayoutSettings() {
  const [applied, setApplied] = (0,external_preactHooks_namespaceObject.useState)(() => getSetting("layout"));
  const [selected, setSelected] = (0,external_preactHooks_namespaceObject.useState)(applied);
  const dirty = selected !== applied;
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
        class: `bbw-stacked bbw-layout-picker${dirty ? " bbw-dirty" : ""}`,
        children: [
          (0,external_jsxRuntime_namespaceObject.jsxs)("span", {
            children: [
              "Layout",
              dirty
                && (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
                  children: [
                    " (current: ",
                    (0,external_jsxRuntime_namespaceObject.jsx)("a", {
                      href: "#",
                      title: "Go back to the current layout",
                      onClick: e => {
                        e.preventDefault();
                        setSelected(applied);
                      },
                      children: LAYOUT_LABELS[applied],
                    }),
                    ")",
                  ],
                }),
            ],
          }),
          (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
            class: "bbw-layout-row",
            children: [
              (0,external_jsxRuntime_namespaceObject.jsx)("select", {
                "aria-label": "Layout",
                value: selected,
                onChange: e => setSelected(e.currentTarget.value),
                children: Object.keys(LAYOUT_LABELS).map(name =>
                  (0,external_jsxRuntime_namespaceObject.jsx)(
                    "option",
                    { value: name, children: LAYOUT_LABELS[name] },
                    name,
                  ),
                ),
              }),
              dirty
                && (0,external_jsxRuntime_namespaceObject.jsx)("button", {
                  type: "button",
                  class: "bbw-apply-layout",
                  onClick: async () => {
                    await setSetting("layout", selected);
                    setApplied(selected);
                    organizePanels();
                  },
                  children: "Apply layout",
                }),
            ],
          }),
          dirty
            && (0,external_jsxRuntime_namespaceObject.jsx)("span", {
              class: "bbw-explain",
              children:
                "Switching layouts rearranges every cam, so it waits for this button. Everything else here saves and applies on its own.",
            }),
        ],
      }),
      (0,external_jsxRuntime_namespaceObject.jsx)(ToggleSetting, {
        setting: "camsMoveAway",
        label: "Cams move away",
        explain:
          "Rest the pointer on the chat's tabs, or on the buddy list, and the cams in front of them slide out of the way",
        onChange: refreshCamsMoveAway,
      }),
      (0,external_jsxRuntime_namespaceObject.jsxs)("fieldset", {
        children: [
          (0,external_jsxRuntime_namespaceObject.jsx)("legend", { children: LAYOUT_LABELS[selected] }),
          (0,external_jsxRuntime_namespaceObject.jsx)(LayoutOptions, { layout: selected }, selected),
          dirty
            && (0,external_jsxRuntime_namespaceObject.jsx)("p", {
              class: "bbw-muted",
              children: "Saved already; used once you apply this layout.",
            }),
        ],
      }),
    ],
  });
}
function SettingsPanel({ anchor }) {
  const [notifications, setNotifications] = (0,external_preactHooks_namespaceObject.useState)(() =>
    getSetting("watchNotifications"),
  );
  const [, setVersion] = (0,external_preactHooks_namespaceObject.useState)(0);
  const rerender = () => setVersion(v => v + 1);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    class: "bbw-settings-panel",
    style: {
      width: "640px",
      maxWidth: "calc(100vw - 16px)",
      maxHeight: `calc(100vh - ${anchor.bottom + 12}px)`,
      overflowY: "auto",
      top: `${anchor.bottom + 4}px`,
      left: `max(8px, min(${anchor.left}px, calc(100vw - 648px)))`,
    },
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)("h4", { children: "Better BW" }),
      (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
        class: "bbw-settings-columns",
        children: [
          (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
            children: [
              (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
                class: "bbw-stacked",
                children: [
                  "Tell me when someone starts watching me",
                  (0,external_jsxRuntime_namespaceObject.jsx)("select", {
                    value: notifications,
                    onChange: e => {
                      const value = e.currentTarget.value;
                      setNotifications(value);
                      setSetting("watchNotifications", value);
                    },
                    children: NOTIFICATIONS.map(([value, label]) =>
                      (0,external_jsxRuntime_namespaceObject.jsx)("option", { value: value, children: label }, value),
                    ),
                  }),
                ],
              }),
              GROUPS.map(group =>
                (0,external_jsxRuntime_namespaceObject.jsxs)(
                  "fieldset",
                  {
                    children: [
                      (0,external_jsxRuntime_namespaceObject.jsx)("legend", { children: group }),
                      SITE_OPTIONS.filter(
                        option =>
                          option.group === group
                          && option !== START_MUTED_OPTION,
                      ).map(option =>
                        (0,external_jsxRuntime_namespaceObject.jsx)(
                          SiteOptionInput,
                          { option: option, onChange: rerender },
                          option.key,
                        ),
                      ),
                      "Cams" === group
                        && (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
                          children: [
                            (0,external_jsxRuntime_namespaceObject.jsx)(AlgoSelect, {}),
                            (0,external_jsxRuntime_namespaceObject.jsx)(VolumePercentInput, {}),
                            (0,external_jsxRuntime_namespaceObject.jsx)(SiteOptionInput, {
                              option: START_MUTED_OPTION,
                              onChange: rerender,
                            }),
                            (0,external_jsxRuntime_namespaceObject.jsx)(ToggleSetting, {
                              setting: "scrollToVolume",
                              label: "Scroll wheel changes the volume",
                            }),
                            (0,external_jsxRuntime_namespaceObject.jsx)(ToggleSetting, {
                              setting: "pinchToZoom",
                              label:
                                "Pinch (or Ctrl + scroll) zooms into the cam",
                            }),
                          ],
                        }),
                    ],
                  },
                  group,
                ),
              ),
              (0,external_jsxRuntime_namespaceObject.jsx)("p", {
                class: "bbw-muted",
                children:
                  "The chat's options apply to new messages, buddies and cams.",
              }),
            ],
          }),
          (0,external_jsxRuntime_namespaceObject.jsx)(LayoutSettings, {}),
        ],
      }),
    ],
  });
}
function SettingsMenu() {
  const [anchor, setAnchor] = (0,external_preactHooks_namespaceObject.useState)(null);
  const [pinned, setPinned] = (0,external_preactHooks_namespaceObject.useState)(false);
  const root = (0,external_preactHooks_namespaceObject.useRef)(null);
  const closeTimer = (0,external_preactHooks_namespaceObject.useRef)();
  const open = () => {
    clearTimeout(closeTimer.current);
    if (root.current) setAnchor(root.current.getBoundingClientRect());
  };
  const close = () => {
    clearTimeout(closeTimer.current);
    setAnchor(null);
    setPinned(false);
  };
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    if (!anchor) return;
    const closeOnEscape = event => {
      if ("Escape" === event.key) close();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [anchor]);
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    if (!pinned) return;
    const closeOnOutsideClick = event => {
      if (!root.current?.contains(event.target)) close();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [pinned]);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("span", {
    class: "bbw-settings",
    ref: root,
    onMouseEnter: open,
    onMouseLeave: () => {
      if (pinned) return;
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setAnchor(null), 200);
    },
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)("button", {
        title: "Better BW settings",
        onClick: () => {
          if (pinned) close();
          else {
            open();
            setPinned(true);
          }
        },
        children: "⚙",
      }),
      anchor && (0,external_jsxRuntime_namespaceObject.jsx)(SettingsPanel, { anchor: anchor }),
    ],
  });
}

// EXTERNAL MODULE: ./src/betterbw/styles/watchStats.css?inline
var watchStatsinline = __webpack_require__("./src/betterbw/styles/watchStats.css?inline");
// EXTERNAL MODULE: ./src/betterbw/styles/settings.css?inline
var settingsinline = __webpack_require__("./src/betterbw/styles/settings.css?inline");
;// file://./src/betterbw/setupTools.tsx

async function setupHeader() {
  const avatar = document.getElementById("myAvatar");
  if (!avatar) return;
  const controls = document.createElement("div");
  controls.id = "bbw_header_controls";
  avatar.after(controls);
  GM.addStyle(settingsinline["default"]);
  (0,external_preact_namespaceObject.render)(
    (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
      children: [
        (0,external_jsxRuntime_namespaceObject.jsx)(SettingsMenu, {}),
        (0,external_jsxRuntime_namespaceObject.jsx)(ResetLayoutButton, {}),
        (0,external_jsxRuntime_namespaceObject.jsx)(NumberOfCams, {}),
        (0,external_jsxRuntime_namespaceObject.jsx)(PlayPauseButton, {}),
        (0,external_jsxRuntime_namespaceObject.jsx)(HeaderControlsDiscovery, {}),
      ],
    }),
    controls,
  );
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
    if (event.shiftKey || !event.originalEvent?.isTrusted) return;
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
  const optionA = $(`${PANEL_SELECTOR}:not(.watchingMe)[data-status="--"]`)[0];
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
  applySiteOptions();
  const { revoke } = spyOnConfig(ConfigWatchers);
  chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();
  await Promise.all([
    setupHeader(),
    setupUserMenu(),
    setupSidebar(),
    setupWatchStats(),
  ]);
  skipRedundantUserListRefresh();
  setupWatchingMe();
  if (!$("#sortWebcamtBtn").hasClass("selected"))
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

;// file://./src/betterbw/features/lighterTimers.ts
const TIMESTAMPS = "#chatContainer .timeStamp, div.windowChat .timeStamp";
function displayDateAgo() {
  const selector =
    "1" === chatHTML5.config.displayConnectedSince
      ? `${TIMESTAMPS}, #userList .userSince`
      : TIMESTAMPS;
  for (const element of document.querySelectorAll(selector)) {
    const date = element.dataset.date;
    const text = chatHTML5.getDateAgo(
      date && /^\d+$/.test(date) ? Number(date) : date,
    );
    if (element.textContent !== text) element.textContent = text;
  }
}
function lightenTimers() {
  const { removeServerMessages } = chatHTML5;
  chatHTML5.removeServerMessages = () => {
    if (!document.hidden) removeServerMessages();
  };
  chatHTML5.displayDateAgo = () => {
    if (!document.hidden) displayDateAgo();
  };
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) chatHTML5.displayDateAgo();
  });
}

;// file://./src/betterbw/features/noCamsBeforeRoom.ts

function closeCam(panel) {
  const id = getUserId(panel);
  if (id) chatHTML5.removeWebcam(id, "bbw-before-room");
  else panel.remove();
}
function closeCamsUntil(roomSelected) {
  queryPanels().forEach(closeCam);
  const observer = new MutationObserver(mutations => {
    for (const { addedNodes } of mutations)
      for (const node of addedNodes)
        if (node instanceof HTMLDivElement && node.matches(PANEL_SELECTOR))
          closeCam(node);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  roomSelected.then(() => observer.disconnect());
}

// EXTERNAL MODULE: ./src/betterbw/styles/dragToSwap.css?inline
var dragToSwapinline = __webpack_require__("./src/betterbw/styles/dragToSwap.css?inline");
;// file://./src/betterbw/features/dragToSwap.ts

let dragToSwap_drag = null;
const distance = (a, b) => Math.hypot(a.left - b.left, a.top - b.top);
function highlight(rect) {
  const el = document.createElement("div");
  el.className = "bbw-swap-highlight";
  Object.assign(el.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
  document.body.appendChild(el);
  return el;
}
function stopHover(d) {
  d.timers.forEach(clearTimeout);
  d.timers = [];
  d.highlights.forEach(el => el.remove());
  d.highlights = [];
  d.hovered = null;
}
function startHover(d, target) {
  const slot = d.slots.get(target);
  d.hovered = target;
  d.timers = [
    setTimeout(() => {
      d.highlights = [highlight(slot), highlight(d.origin)];
    }, 250),
    setTimeout(() => {
      stopHover(d);
      d.pending = { target, index: target.dataset.gridIndex, slot };
      placeInSlot(target, +d.index);
    }, 1000),
  ];
}
function dragToSwap_update() {
  const d = dragToSwap_drag;
  if (!d) return;
  d.frame = 0;
  const rect = d.panel.getBoundingClientRect();
  if (!d.moved) {
    if (distance(rect, d.origin) < 3) return;
    d.moved = true;
    d.panel.classList.add("bbw-dragging");
  }
  if (d.pending) {
    if (distance(rect, d.pending.slot) <= 24) return;
    placeInSlot(d.pending.target, +d.pending.index);
    d.pending = null;
  }
  let hovered = null;
  for (const [other, slot] of d.slots)
    if (other.isConnected && distance(rect, slot) <= 20) {
      hovered = other;
      break;
    }
  if (hovered === d.hovered) return;
  stopHover(d);
  if (hovered) startHover(d, hovered);
}
function dragToSwap_onPointerDown(event) {
  if (0 !== event.button || !(event.target instanceof Element)) return;
  if (
    !event.target.closest(".jsPanel-hdr")
    || event.target.closest("button, input, a, .jsPanel-btn, .userAvatar")
  )
    return;
  const panel = event.target.closest(PANEL_SELECTOR);
  const index = panel?.dataset.gridIndex;
  if (!panel || !index) return;
  const slots = new Map();
  for (const other of queryPanels())
    if (other !== panel && other.dataset.gridIndex)
      slots.set(other, other.getBoundingClientRect());
  dragToSwap_drag = {
    panel,
    index,
    origin: panel.getBoundingClientRect(),
    slots,
    moved: false,
    hovered: null,
    timers: [],
    highlights: [],
    pending: null,
    frame: 0,
  };
}
function onPointerMove() {
  if (dragToSwap_drag && !dragToSwap_drag.frame) dragToSwap_drag.frame = requestAnimationFrame(dragToSwap_update);
}
function onPointerUp() {
  const d = dragToSwap_drag;
  if (!d) return;
  dragToSwap_drag = null;
  cancelAnimationFrame(d.frame);
  stopHover(d);
  if (!d.moved) return;
  setTimeout(() => {
    d.panel.classList.remove("bbw-dragging");
    const { pending } = d;
    if (!pending) return;
    if (distance(d.panel.getBoundingClientRect(), pending.slot) <= 24) {
      d.panel.dataset.gridIndex = pending.index;
      pending.target.dataset.gridIndex = d.index;
      organizePanels();
    } else placeInSlot(pending.target, +pending.index);
  });
}
function setupDragToSwap() {
  GM.addStyle(dragToSwapinline["default"]);
  document.addEventListener("pointerdown", dragToSwap_onPointerDown, true);
  document.addEventListener("pointermove", onPointerMove, {
    capture: true,
    passive: true,
  });
  document.addEventListener("pointerup", onPointerUp, true);
  document.addEventListener("pointercancel", onPointerUp, true);
}

// EXTERNAL MODULE: ./src/betterbw/styles/static.css?inline
var staticinline = __webpack_require__("./src/betterbw/styles/static.css?inline");
// EXTERNAL MODULE: ./src/betterbw/styles/topLevel.css?inline
var topLevelinline = __webpack_require__("./src/betterbw/styles/topLevel.css?inline");
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
  batchUserListRebuilds();
  setupCamCleanup();
  lightenTimers();
  applySiteOptions();
}
async function main() {
  hacks();
  GM.addStyle(staticinline["default"]);
  sweepExpiredCooldowns();
  setupResponsiveLayout();
  observeChatNav();
  const roomSelected = waitToBe(
    "#roomsModal",
    ["aria-hidden"],
    el => "false" === el.getAttribute("aria-hidden"),
  ).then(() => waitToBe("#roomsModal"));
  closeCamsUntil(roomSelected);
  observePanels();
  setupCamsMoveAway();
  setupDragToSwap();
  await roomSelected;
  setRoomSelected();
  await setupTools();
  await runAlgo(getSetting("preferredAlgo"));
}

;// file://./src/betterbw/index.ts

if (location.pathname.startsWith("/html5-chat/chatroom")) topLevelStyles();
else if (
  location.pathname.startsWith("//html5-chat/chat2")
  && "undefined" != typeof chatHTML5
)
  main();

