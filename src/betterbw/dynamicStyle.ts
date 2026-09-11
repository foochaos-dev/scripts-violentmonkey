import { dataUsername } from './utils/formatters';
import tiersCss from './styles/tiers.css?inline';
import { enqueueAsync } from './utils/debounce';

const dataUserItems = (group: string[]) => group.map(dataUsername).join(',');

async function getCSS() {
  const keys = (await GM.listValues()).filter((key) => key.endsWith('_status'));
  const valuesEntries = await Promise.all(keys.map(async (key) => [key, await GM.getValue<string>(key)] as const));

  // Group users
  const groups = { '--': [] as string[], '-': [] as string[], '+': [] as string[], '++': [] as string[] };
  for (const [key, value] of valuesEntries) {
    const id = key.split('_')[0]!;
    groups[value as keyof typeof groups]?.push(id); // Ignore unknown statuses instead of crashing
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

export const refreshDynamicStyle = enqueueAsync(async () => {
  dynamicStyle.innerHTML = await getCSS();
});

refreshDynamicStyle();
