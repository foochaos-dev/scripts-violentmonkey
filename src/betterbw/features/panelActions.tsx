import { refreshDynamicStyle } from '../dynamicStyle';
import { rotateCam } from './rotateCam';
import { cooldownIt } from './cooldown';
import { getUsername } from '../utils/scrappers';
import { render, type MouseEventHandler } from 'preact';
import type { JSPanel } from '../types/JSPanel';
import { gridconf } from '../utils/organizePanels';

type BtnProps = { username?: string; getUsername: () => string | undefined; panel?: HTMLDivElement | undefined };

const BtnClassify = ({
  getUsername,
  panel,
  value,
  title,
  onClick,
}: BtnProps & { value: string; title: string; onClick?: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button
      data-status-value={value}
      title={title}
      className="panel-action-btn"
      onClick={(e) => {
        const username = getUsername();
        if (username) {
          GM.setValue(`${username}_status`, value).then(() => refreshDynamicStyle());
        }

        // TODO: use a state manager and have the panel status updating itself
        if (panel) panel.dataset.status = value;

        onClick?.(e);
      }}
    >
      {value}
    </button>
  );
};

const BtnMinus2 = ({ getUsername, panel }: BtnProps) => {
  return (
    <BtnClassify
      getUsername={getUsername}
      panel={panel}
      value="--"
      title={'Nope\nDo not suggest this person.'}
      onClick={() => {
        if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
      }}
    />
  );
};

const BtnMinus1 = (props: BtnProps) => {
  return <BtnClassify value="-" title={'So so\nIt depends on the day, on the mood...'} {...props} />;
};

const BtnPlus1 = (props: BtnProps) => {
  return <BtnClassify value="+" title={'Yeah\nI liked you, buddy'} {...props} />;
};

const BtnPlus2 = (props: BtnProps) => {
  return <BtnClassify value="++" title={'Ohhh Yeah!\nI liked you a lot, buddy!'} {...props} />;
};

const BtnRotate = ({ panel, getUsername }: BtnProps) => {
  const onClick = () => {
    if (panel) rotateCam({ id: getUsername(), panel });
  };
  return (
    <button title="Rotate" className="panel-action-btn" onClick={onClick}>
      ⟳
    </button>
  );
};

const BtnCooldown = ({ panel, getUsername }: BtnProps) => {
  const onClick = (event) => {
    if (event?.shiftKey) cooldownIt({ username: getUsername(), panel, minutes: 120 });
    else cooldownIt({ username: getUsername(), panel });
  };
  return (
    <button
      title={'Cooldown 15m\nDo not suggest this person for the next 15 minutes\n\nShift + click: Cooldown 2h'}
      className="panel-action-btn"
      onClick={onClick}
    >
      ⏱
    </button>
  );
};

export const PanelActions = ({ panel, username }: Pick<BtnProps, 'panel'> & { username: string }) => {
  const props = { panel, getUsername: () => username };
  return (
    <>
      <BtnCooldown {...props} />
      <BtnRotate {...props} />
      <BtnPlus2 {...props} />
      <BtnPlus1 {...props} />
      <BtnMinus1 {...props} />
      <BtnMinus2 {...props} />
    </>
  );
};

export const MenuActions = () => {
  const props = { getUsername: getLatestUser };
  return (
    <div>
      <BtnCooldown {...props} />
      <BtnPlus2 {...props} />
      <BtnPlus1 {...props} />
      <BtnMinus1 {...props} />
      <BtnMinus2 {...props} />
    </div>
  );
};

function getLatestUser() {
  try {
    return chatHTML5.myUser.id.split('_')[0];
  } catch (e) {
    console.error('Oooops...');

    const muteItem = $('#userMenu [data-action="mute"]')[0];
    const username = muteItem?.textContent.split(' ').at(-1)?.split('_').at(0);
    return username;
  }
}

function resizePanel(panelJS: JSPanel) {
  panelJS.resize({ width: gridconf.WIDTH, height: gridconf.HEIGHT });
}

function monitorVideoReadiness(video: HTMLVideoElement, panel: HTMLDivElement, panelJS: JSPanel) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const cleanup = () => {
    clearTimeout(timeoutId);
    video.removeEventListener('loadeddata', onVideoReady);
  };

  const onVideoReady = () => {
    cleanup();
  };

  // Also cleanup if panel is closed
  const originalClose = panelJS.close.bind(panelJS);
  panelJS.close = function () {
    cleanup();
    return originalClose();
  };

  timeoutId = setTimeout(() => {
    cooldownIt({ username: getUsername(panel), minutes: 5 });
    panelJS.close();
  }, 25000);

  video.addEventListener('loadeddata', onVideoReady);
}

// Attach control buttons for each declared action
export async function attachPanelActions(panel: HTMLDivElement) {
  if (panel.dataset.actionsAttached === '1') return;

  const panelJS = jsPanel.activePanels.getPanel(panel.id);
  if (!panelJS) return console.warn('Panel not found for', panel.id);
  resizePanel(panelJS);

  const header = $('.jsPanel-hdr .jsPanel-title', panel)[0];
  if (!header) return;

  const username = getUsername(panel);
  if (!username) return;
  panel.dataset.username = username;
  panel.dataset.status = await GM.getValue(`${username}_status`);

  const actions = document.createElement('div');
  actions.className = 'panel-action';
  header.appendChild(actions);
  render(<PanelActions username={username} panel={panel} />, actions);

  panel.dataset.actionsAttached = '1';
  panel.dataset.rotation = await GM.getValue(`${username}_rotation`);

  $('.jsPanel-btn.jsPanel-btn-close', panel)
    .attr('title', 'Close\n\nHold [Shift]: also reduce the # of cams')
    .on('click', (event) => {
      if (event.shiftKey) {
        chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber(); // getWebcamNumber() is already updated
      }

      cooldownIt({ username: username, minutes: 1 });
    });

  $('.userAvatar', panel).on('click', (event) => {
    event.stopPropagation();
    if (!('pageX' in event && 'pageY' in event)) return;

    if ($('#userMenu').is(':visible')) {
      $('#userMenu').hide();
      return;
    }

    $(`#userList .userItem[data-id=${JSON.stringify(panel.id.split('_')[2])}]`).trigger(
      new jQuery.Event('click', { pageX: event.pageX + 3, pageY: event.pageY })
    );
  });

  const video = panel.querySelector('video');
  if (video) {
    video.volume = 0.08;
    monitorVideoReadiness(video, panel, panelJS);
  }
}

export function cleanupPanel(panel: HTMLDivElement) {}
