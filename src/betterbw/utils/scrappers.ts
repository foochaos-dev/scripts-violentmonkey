import type { StringNumber } from '../types/utils';

/** The user id of a cam panel */
export function getUserId(panel: HTMLDivElement) {
  return panel.id.split('_')[2] || $('[data-id]', panel)[0]?.dataset.id;
}

export function getUsername(panel: HTMLDivElement) {
  const id = getUserId(panel);
  return id && getUserById(id)?.username?.split('_')?.[0];
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
