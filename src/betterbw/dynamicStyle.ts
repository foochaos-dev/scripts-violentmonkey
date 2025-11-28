import { dataUsername } from './utils/formatters';

const userItems = (group: string[]) => `.userItem:where(${group.map(dataUsername).join(',')})`;

function getCSS() {
  const arrayOfKeys = GM_listValues().filter(key => key.match(/\.*?_status/));
  const values = GM_getValues<string>(arrayOfKeys);

  const groups = { '--': [], '-': [], '+': [], '++': [] };
  for (const [key, value] of Object.entries(values)) {
    const id = key.split('_')[0];
    groups[value].push(id);
  }

  const css = `
#tabs .userItem,
#userList .userItem {
  --text-decoration: line-through solid 1.8rem;
  --decoration-opacity: 0.2;
}

${userItems(groups['--'])} {
  #userList & {
    opacity: 0.3 !important;
  }
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(205, 0, 0, 0.15);
  }
}

${userItems(groups['-'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(237, 146, 0, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(237, 146, 0, var(--decoration-opacity));
  }
}

${userItems(groups['+'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(0, 100, 255, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(0, 100, 255, var(--decoration-opacity));
  }
}

${userItems(groups['++'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(149, 50, 255, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(149, 50, 255, var(--decoration-opacity));
  }
}
`;

  return css;
}

export const dynamicStyle = GM_addStyle(getCSS());
export const refreshDynamicStyle = async () => dynamicStyle.innerHTML = getCSS();
