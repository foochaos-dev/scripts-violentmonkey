import { dataUsername } from './utils/formatters';
import tiersCss from './styles/tiers.css?inline';

const dataUserItems = (group: string[]) => group.map(dataUsername).join(',');

async function getCSS() {
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
    group_minus_minus: dataUserItems(groups['--']),
    group_minus: dataUserItems(groups['-']),
    group_plus: dataUserItems(groups['+']),
    group_plus_plus: dataUserItems(groups['++']),
  };

  return tiersCss.replace(/\.(group_\w+)/gm, (_match, key, openStyle) => {
    return selectors[key] + openStyle;
  });
}

export const dynamicStyle = GM_addStyle('');
export const refreshDynamicStyle = async () => requestAnimationFrame(async () => (dynamicStyle.innerHTML = await getCSS()));
refreshDynamicStyle();
