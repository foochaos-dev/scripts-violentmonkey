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
