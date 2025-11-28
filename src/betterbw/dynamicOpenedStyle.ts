import { dataUsername } from './utils/formatters';
import { PANEL_SELECTOR } from './utils/openPanel';
import { getUsername } from './utils/scrappers';

const dynamicOpenedStyle = GM_addStyle('');

export function updateCssForOpenedPanels() {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  if (!openedPanels?.length) return;

  const usernames = Array.from(openedPanels).map(panel => getUsername(panel));
  dynamicOpenedStyle.innerHTML = `
.userItem:where(${usernames.map(dataUsername).join(',')}) {
  #userList & .webcamBtn {
    background: rgba(80, 206, 133, 1) !important;
  }

  #tabs &:before {
    content: '';
    display: block;
    position: absolute;
    width: 12px;
    height: 11px;
    top: 50%;
    transform: translateY(-50%) translateX(-120%);
    border-radius: 2px;
    border: rgba(178, 178, 178, 1) solid 1px;
    border-top-width: 3px;
  }
}

${usernames.map(id => `body:has(#userList .userItem:where(${dataUsername(id)}) .eye-icon .isWatching) .jsPanel[data-username="${id}"]`
    // `body:has(#userList .userItem:where(${dataUsername(id)})) .jsPanel[data-username="${id}"]`
  ).join(', ')}  {
  box-shadow: #FFD700 0px 0px 1px 5px;
  transition: box-shadow .2s ease-out;

  & .jsPanel-title::before {
    content: "👁️";
    content: "\\f06e";
    font-family: "Font Awesome 5 Free";
    font-weight: 400;

    color: gold;
    position: absolute;
    z-index: 1;
    left: -2px;
    top: -5px;
    text-shadow: 1px 1px 0 goldenrod;
    font-size: 14px;
  }
}
`;
}
