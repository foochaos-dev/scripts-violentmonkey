import { refreshDynamicStyle } from '../dynamicStyle';
import { rotateCam } from './rotateCam';
import { cooldownIt } from './cooldown';
import { getUserById, getUsername } from '../utils/scrappers';
import { render, type MouseEventHandler } from 'preact';
import type { JSPanel } from '../types/JSPanel';
import { computeLayout } from '../utils/organizePanels';
import { debounce } from '../utils/debounce';
import { sessionAudioMuted } from './audioMuted';
import { sessionZoom } from './sessionZoom';
import { attachVideoGestures } from './videoGestures';
import { getSetting } from './settings';

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

// Two separate groups: ratings (top left) and cooldown (top right, aligned with the ratings and with the
// video's zoom controls) - see .panel-action/.panel-cooldown in static.css. Rotate lives in the video's own
// controls bar instead (videoControls.tsx), next to the zoom controls it needs to align with.
export const PanelActions = ({ panel, username }: Pick<BtnProps, 'panel'> & { username: string }) => {
  const props = { panel, getUsername: () => username };
  return (
    <>
      <div class="panel-action">
        <BtnMinus2 {...props} />
        <BtnMinus1 {...props} />
        <BtnPlus1 {...props} />
        <BtnPlus2 {...props} />
      </div>
      <div class="panel-cooldown">
        <BtnCooldown {...props} />
      </div>
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
  // `myUser` is the logged-in user; the user the menu was opened for is `selectedUserid`
  const selected = getUserById(chatHTML5.myUser.selectedUserid);
  if (selected) return selected.username;

  const muteItem = $('#userMenu [data-action="mute"]')[0];
  return muteItem?.textContent.split(' ').at(-1)?.split('_').at(0);
}

function resizePanel(panelJS: JSPanel) {
  const { width, height } = computeLayout();
  panelJS.resize({ width, height });
}

function monitorVideoReadiness(video: HTMLVideoElement, panel: HTMLDivElement, panelJS: JSPanel) {
  // `loadeddata` won't fire again if it already fired while we awaited GM.getValue
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return;

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
    if (!panel.isConnected) return; // Closed some other way (e.g. the buddy left)
    cooldownIt({ username: getUsername(panel), minutes: 5 });
    panelJS.close();
  }, 25000);

  video.addEventListener('loadeddata', onVideoReady);
}

// Attach control buttons for each declared action
export async function attachPanelActions(panel: HTMLDivElement) {
  if (panel.dataset.actionsAttached === '1') return;
  panel.dataset.actionsAttached = '1'; // Before any await, so a concurrent call can't attach twice

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
  header.appendChild(actions);
  render(<PanelActions username={username} panel={panel} />, actions);

  panel.dataset.rotation = await GM.getValue(`${username}_rotation`, '0');

  $('.jsPanel-btn.jsPanel-btn-close', panel)
    .attr('title', 'Close\n\nShift + click: also reduce the # of cams')
    .on('click', (event) => {
      if (event.shiftKey) {
        chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber(); // getWebcamNumber() is already updated
      }

      cooldownIt({ username: username, minutes: 1 });
    });

  $(header)
    .attr('title', 'Middle click or Ctrl + click: close and reduce the # of cams')
    .on('mousedown', (event) => {
      if (event.button === 1) event.preventDefault(); // Stop the middle-click autoscroll cursor
    })
    .on('auxclick click', (event) => {
      if (event.type === 'auxclick' ? event.button !== 1 : !event.ctrlKey) return;
      event.preventDefault();

      chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber(); // getWebcamNumber() is already updated
      cooldownIt({ username, minutes: 1, panel });
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
    if (sessionAudioMuted.get(username)) video.muted = true;
    video.volume = await GM.getValue(`${username}_volume`, getSetting('defaultVolume'));

    const zoom = attachVideoGestures(video, () => rotateCam({ id: username, panel }), sessionZoom.get(username));
    zoom.onChange(
      debounce(() => {
        sessionZoom.set(username, zoom.getState());
      })
    );
    persistVolumeChange(video, username);
    monitorVideoReadiness(video, panel, panelJS);
  }
}

function persistVolumeChange(video: HTMLVideoElement, username: string) {
  video.addEventListener(
    'volumechange',
    debounce(async () => {
      sessionAudioMuted.set(username, video.muted);
      await GM.setValue(`${username}_volume`, video.volume);
    })
  );
}
