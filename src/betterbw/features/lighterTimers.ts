const TIMESTAMPS = '#chatContainer .timeStamp, div.windowChat .timeStamp';

/** Same as the chat's own, but only touches the timestamps whose text changed */
function displayDateAgo() {
  const selector = chatHTML5.config.displayConnectedSince === '1' ? `${TIMESTAMPS}, #userList .userSince` : TIMESTAMPS;
  for (const element of document.querySelectorAll<HTMLElement>(selector)) {
    // Like jQuery's .data(): numeric strings are timestamps
    const date = element.dataset.date;
    const text = chatHTML5.getDateAgo(date && /^\d+$/.test(date) ? Number(date) : date);
    if (element.textContent !== text) element.textContent = text;
  }
}

/**
 * The chat rewrites every timestamp every 10s, and scans the server notices every 2s (twice).
 * Skips both while the tab is hidden, catching up when it's back.
 */
export function lightenTimers() {
  const { removeServerMessages } = chatHTML5;

  chatHTML5.removeServerMessages = () => {
    if (!document.hidden) removeServerMessages();
  };

  chatHTML5.displayDateAgo = () => {
    if (!document.hidden) displayDateAgo();
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) chatHTML5.displayDateAgo();
  });
}
