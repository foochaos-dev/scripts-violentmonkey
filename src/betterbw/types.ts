export type JSPanel = {
  id: string;
  close: () => JSPanel;
  resize: (options: any) => JSPanel;
  reposition: (options: any) => JSPanel;
};

export type JSPanelType = {
  activePanels: {
    getPanel: (id: string) => JSPanel | undefined;
  };
};

export type ChatHTML5Type = {
  myUser: {
    id: string;
  };
  config: {};
};

declare global {
  interface Window {
    jsPanel: JSPanelType;
    chatHTML5: ChatHTML5Type;
  }

  const jsPanel: Window['jsPanel'];
  const chatHTML5: Window['chatHTML5'];

  const GM_getValues: <TValue>(name: string[]) => TValue[];
}
