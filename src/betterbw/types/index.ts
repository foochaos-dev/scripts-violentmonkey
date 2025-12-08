import type { ChatHTML5Type } from './ChatHTML5';
import type { JSPanelType } from './JSPanel';

declare global {
  interface Window {
    jsPanel: JSPanelType;
    chatHTML5: ChatHTML5Type;
  }

  const jsPanel: Window['jsPanel'];
  const chatHTML5: Window['chatHTML5'];

  const GM_getValues: <TValue>(name: string[]) => TValue[];
}
