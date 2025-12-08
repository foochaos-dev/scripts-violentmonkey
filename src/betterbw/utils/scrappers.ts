import type { StringNumber } from '../types/utils';

export function getUsername(panel: HTMLDivElement) {
  const id = panel.id.split('_')[2] || $('[data-id]', panel)[0]?.dataset.id;
  return id && getUserById(id)?.username;
}

function getUserObjectById(userId: string | StringNumber) {
  return chatHTML5.users[userId as StringNumber];
}

export function getUserById(userId: string | StringNumber) {
  const user = getUserObjectById(userId);
  if (!user) return;

  return {
    obj: user,
    username: user.username.split('_')[0]!,
  };
}
