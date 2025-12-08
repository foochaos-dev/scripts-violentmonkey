import { observeIt } from '../utils/observeIt';
import { getUserById } from '../utils/scrappers';
import { clickOnCurrentAlgoButton } from './globalActions';

// CASE: User opened their webcam
// <div class="serverMessage serverText webcamOpened"><span data-id="1764631831752" class="watchCam">User Ozbro69 has opened his webcam</span></div>
function handleWebcamOpened(message: HTMLElement) {
  const span = $('[data-id]', message)[0];
  if (!span) return;

  const user = getUserById(span.dataset.id!);
  if (!user) return;
  message.dataset.username = user.username;

  const privateCam = Boolean(!user.obj.webcamPublic);
  message.dataset.privateCam = privateCam.toString();

  span.innerHTML = span.innerHTML.replace(
    /(User )(.*?)( has opened his webcam)/gi,
    `$1<span class="userLabelBBW" data-username=${JSON.stringify(user.username)}>$2</span>$3`
  );

  if (!privateCam) clickOnCurrentAlgoButton();
}

// CASE: Regular message (not whisper)
// <div class="message flex-property msg-box  " data-messageid="2147483647" data-userid="1764717541227" style="">
// <img src="https://cloudcdn.bateworld.com/uploads_user/523000/522053/1938602.jpeg" alt="BrickellBro" class="userItem" style="">
//   <div class="flex-property message-info user">
// 	<div class="flex-property flex-center name-time">
// 		<div class="userItem" style="color:#000000" title="BrickellBro" data-id="1764717541227" data-username="BrickellBro" data-ip="undefined">BrickellBro </div>
// 		<div class="timeStamp" data-date="1764717579881">2 minutes ago</div>
// 	</div>
// 	<div class="content   " style="color:#000000">
// 	  <div class="arrow-chat" style="display:none"></div>
// 	  Where my flex bros at
// 	  </div>

//   <div>
// </div></div></div>
function handleRegularMessage(message: HTMLElement) {
  const msgHeader = $('[data-ip]', message)[0];
  if (!msgHeader) return;
  msgHeader.classList.add('userLabelBBW', 'sender');
}

// CASE: Whisper
// <div class="message flex-property addPrivateMessage " data-messageid="1764715287831" style="">					<img src="/images/nophoto.png" alt="NewHere73" class="userItem" style="">						<div class="flex-property flex-center name-time" data-username="NewHere73" data-id="1764712616067">							<div class="userItem" style="color:#000000" title="NewHere73" data-id="1764712616067" data-username="NewHere73" data-ip="undefined">NewHere73 <span class="mention">@</span> Ben9</div>							<div class="timeStamp" data-date="1764715287831">Now</div>							<div class="content   " style="color:#000000"> <b>Thansk</b></div>													</div>					</div>
function handleWhisperOrPrivateMessage(message: HTMLElement) {
  const msgHeader = $('[data-ip]', message)[0];
  if (!msgHeader || !msgHeader.childNodes.length) return;

  {
    const firstChild = msgHeader.childNodes[0]!;
    const span = document.createElement('span');
    span.dataset.username = msgHeader.dataset.username!;
    span.classList.add('userLabelBBW', 'sender');
    msgHeader.insertBefore(span, firstChild);
    span.appendChild(firstChild);
  }
  {
    const thirdChild = msgHeader.childNodes[2]!;
    const span = document.createElement('span');
    span.dataset.username = thirdChild.textContent?.trim();
    span.classList.add('userLabelBBW', 'receiver');
    msgHeader.insertBefore(span, thirdChild);
    span.appendChild(thirdChild);
  }
}

// CASE: User has invited you to watch his cam
// <div class="serverMessage privateRequested">					<i class="fa fa-comment"></i> njbriefsguy has invited you to watch his cam 					<div>						<button data-id="1764456714634" data-username="njbriefsguy" class="acceptWatchHisWebcam btn btn-success">							<i class="fa fa-comment"></i> Accept						</button>						<button data-id="1764456714634" data-username="njbriefsguy" class="denyWatchHisWebcamBtn btn btn-warning">							<i class="fa fa-times"></i> Deny						</button>						<button data-id="1764456714634" data-username="njbriefsguy" class="muteBtn btn btn-danger">							<i class="fa fa-microphone-slash"></i> Mute						</button>					</div></div>
function handlePrivateRequested(message: HTMLElement) {
  const textNode = Array.from(message.childNodes).find((n) => n.nodeType === 3 && n.textContent?.trim());
  if (!textNode || !textNode.textContent) return;
  const textContent = textNode.textContent;

  // Extract username (ignore leading whitespace)
  const match = textContent.match(/\s*(\S+?)\s+has invited you to watch his cam/);
  if (!match) return;

  const username = match[1];
  if (!username) return;

  // Create span with username
  const span = document.createElement('span');
  span.className = 'userLabelBBW';
  span.dataset.username = username;
  span.textContent = username;
  // Insert span before the text node
  message.insertBefore(span, textNode);

  // Remove the username from the remaining text
  textNode.textContent = textContent.replace(/(^\s*\S+?)(\s+.*$)/, '$2');
}

// CASE: I requested someone's cam
// <div class="serverMessage webcamRequest"><i class="fa fa-video-camera"></i> You requested webcam of  Popper0Bator</div>
function handleWebcamRequest(message: HTMLElement) {}

function handleChatMessage(message: HTMLElement) {
  if (message.matches('.serverMessage.webcamOpened')) handleWebcamOpened(message);
  else if (message.matches('.message.msg-box:not(.whisper)')) handleRegularMessage(message);
  else if (message.matches('.message.addPrivateMessage,.message.msg-box.whisper')) handleWhisperOrPrivateMessage(message);
  else if (message.matches('.serverMessage.privateRequested')) handlePrivateRequested(message);
  else if (message.matches('.serverMessage.webcamRequest')) handleWebcamRequest(message);
}

function observeChat(room: HTMLElement) {
  return observeIt({
    target: room,
    selector: '.message,.serverMessage',
    forEachAddedNode: handleChatMessage,
    forEachRemovedNode: (message) => {
      console.log('Chat message removed in', room.id, message);
    },
  });
}

export function observeChatNav() {
  const tabs: Record<string, { teardown?: () => void }> = {};

  return observeIt({
    target: $('#tabs .tab-content')[0]!,
    selector: '.tab-pane',
    forEachAddedNode: (room) => {
      tabs[room.id] = observeChat(room);
    },
    forEachRemovedNode: (room) => {
      if (room.id in tabs) {
        tabs[room.id]?.teardown?.();
        delete tabs[room.id];
      }
    },
    // cleanup: ({ nodesAdded, nodesRemoved }) => {},
  });
}
