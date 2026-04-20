import { main, topLevelStyles } from './betterbw.user';

if (location.pathname.startsWith('/html5-chat/chatroom')) {
  topLevelStyles();
} else if (location.pathname.startsWith('//html5-chat/chat2') && typeof chatHTML5 !== 'undefined') {
  main();
}
