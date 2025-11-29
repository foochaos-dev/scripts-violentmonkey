import { dataUsername } from './utils/formatters';
import tiersCss from './styles/tiers.css?raw';

const userItems = (group: string[]) => `.userItem:where(${group.map(dataUsername).join(',')})`;

function getCSS() {
  const arrayOfKeys = GM_listValues().filter((key) => key.match(/\.*?_status/));
  const values = GM_getValues<string>(arrayOfKeys);

  // Group users
  const groups = { '--': [], '-': [], '+': [], '++': [] };
  for (const [key, value] of Object.entries(values)) {
    const id = key.split('_')[0];
    groups[value].push(id);
  }

  // Generate css selectors
  const selectors = {
    group_minus_minus: userItems(groups['--']),
    group_minus: userItems(groups['-']),
    group_plus: userItems(groups['+']),
    group_plus_plus: userItems(groups['++']),
  };

  return tiersCss.replace(/\.(group_.*?)( {)/g, (_match, key, openStyle) => selectors[key] + openStyle);
}

export const dynamicStyle = GM_addStyle(getCSS());
export const refreshDynamicStyle = async () => (dynamicStyle.innerHTML = getCSS());
