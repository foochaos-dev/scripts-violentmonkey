/**
 * The site rebuilds the whole user list whenever a room tab is clicked, even the one already open.
 * For each user it adds, it also re-scans the list (to find the sorted position) and re-applies the
 * search filter (forcing a style recalculation for every user). With ~250 users, that freezes the page.
 */

let batching = false;
/** Room whose users are in the list; null when it shows something else (a private chat) */
let listedRoomId: string | null = null;

const isSelected = (id: string) => document.getElementById(id)?.classList.contains('selected') ?? false;

/** Same order as the site's getUserPositionInList, applied in a single pass */
function sortUserList() {
  if (isSelected('sortWatchersBtn')) return chatHTML5.sortWatchersNumber();

  const byRole = isSelected('sortRoleBtn');
  const byWebcam = isSelected('sortWebcamtBtn');
  const byName = isSelected('sortBtn');
  const list = document.getElementById('userList');
  if (!list || (!byRole && !byWebcam && !byName)) return;

  const flag = (item: HTMLElement, key: string) => Number(item.dataset[key] === 'true');
  const items = Array.from(list.children as HTMLCollectionOf<HTMLElement>);
  items.sort(
    (a, b) =>
      flag(b, 'showtop') - flag(a, 'showtop')
      || (byRole ? Number(b.dataset.power) - Number(a.dataset.power) : 0)
      || (byWebcam ? flag(b, 'webcam') - flag(a, 'webcam') : 0)
      || (byName ? (a.dataset.username ?? '').localeCompare(b.dataset.username ?? '', undefined, { sensitivity: 'base' }) : 0)
  );
  list.append(...items);
}

/** When the site re-adds every user of a room, appends them all, then sorts and filters the list once */
export function batchUserListRebuilds() {
  const { getUserPositionInList, searchUsers } = chatHTML5;

  chatHTML5.getUserPositionInList = (user) => {
    if (!batching) return getUserPositionInList(user);
    return chatHTML5.showOnTopofUserList(user) ? 0 : -1;
  };

  chatHTML5.searchUsers = () => {
    if (!batching) searchUsers();
  };

  // Dispatched right before the site re-adds every user, synchronously
  document.addEventListener('roomChanged', () => {
    batching = true;
    setTimeout(() => {
      batching = false;
      sortUserList();
      searchUsers();
      chatHTML5.updateNumberUsersDisplay();
    });
  });
}

/** Clicking the tab of the room already in the list doesn't download and rebuild it again */
export function skipRedundantUserListRefresh() {
  const { socket } = chatHTML5;
  const tab = chatHTML5.getCurrentTab();
  if (tab.room) listedRoomId = String(tab.roomid);

  socket.on('getUsers', (_users: unknown, roomid: unknown) => {
    listedRoomId = String(roomid);
  });

  // Private chat tabs replace the list with that single user
  $(document).on('tabChanged', (_event, changedTab?: { room?: boolean }) => {
    if (changedTab?.room === false && chatHTML5.config.multiRoomEnter === '1') listedRoomId = null;
  });

  const emit = socket.emit;
  socket.emit = function (event, ...args) {
    // The list of the current room is already kept up to date, user by user
    if (event === 'getUsers' && String(args[0]) === listedRoomId) return this;
    return emit.call(this, event, ...args);
  };
}
