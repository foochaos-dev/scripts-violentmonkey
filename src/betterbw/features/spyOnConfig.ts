import type { ChatHTML5Type } from '../types/ChatHTML5';
import { spyOn, type Watchers } from '../utils/spyOn';

export function spyOnConfig(watchers: Watchers<ChatHTML5Type['config']> = {}) {
  const { proxy, revoke } = spyOn(chatHTML5.config, watchers);
  chatHTML5.config = proxy;
  return { proxy, revoke, watchers };
}
