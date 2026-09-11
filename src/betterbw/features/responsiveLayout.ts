import { debounce } from '../utils/debounce';
import { organizePanels } from '../utils/organizePanels';

const CHAT_WIDTH_KEY = 'config.chatWidth';

/**
 * Re-fits the cams when the window or the chat is resized, and remembers the chat width.
 */
export function setupResponsiveLayout() {
  const reorganize = debounce(() => organizePanels(), 100);
  window.addEventListener('resize', reorganize);

  const chat = document.getElementById('tabsAndFooter');
  if (!chat) return;

  const savedWidth = GM_getValue<string>(CHAT_WIDTH_KEY, '');
  if (savedWidth) chat.style.width = savedWidth;

  const saveWidth = debounce(() => {
    // Only the resize handle sets an inline width; window resizes don't
    if (chat.style.width) GM.setValue(CHAT_WIDTH_KEY, chat.style.width);
  }, 300);

  new ResizeObserver(() => {
    saveWidth();
    reorganize();
  }).observe(chat);
}
