import type { StringNumber } from './utils';

export type ChatHTML5Type = {
  myUser: {
    id: string;
    selectedUserid: string;
    mutedUsers?: string;
  };
  config: {
    timeBeforeWatchingCamAgain: StringNumber;
    checkOwnStream: StringNumber;
    showCountryFlag: StringNumber;
    webcamWidth: StringNumber;
    webcamHeight: StringNumber;
    [key: string]: StringNumber;
  };
  roles: {
    user: {
      webcamMax: StringNumber;
    };
  };
  users: Record<StringNumber, User>;

  maxWebcamreached: () => boolean;
  maxWebcamreached_original: () => boolean;
  getWebcamNumber: () => number;
  getUserByUsername: (username: string) => User;
};

export interface User {
  id: number;
  /** Full username, with underscore */
  username: string;
  isGuest?: boolean;
  image: string;
  gender?: 'male';
  agent?: string;
  hasFlash?: boolean;
  hasWebcam: boolean;
  hasWebrtc?: boolean;
  room?: Room;
  webcam: boolean;
  status: Status;
  webcamPublic: boolean;
  privateOnlyOnInvitation: boolean;
  password?: string;
  role: Role;
  profile: string;
  userid: string;
  jwt?: string;
  credits?: number;
  expired?: boolean;
  free?: boolean;
  entries?: string;
  roles?: { [key: string]: string };
  country: string;
  webmasterid?: string;
  watched: number;
  fingerprint: number;
  isMobile: boolean;
  enterChatMode?: boolean;
  doNotAcceptPrivate?: boolean;
  doNotAcceptWhisper?: boolean;
  friends?: Friends;
  lastRequest?: number;
  canEnterRoomOnlyIfRolesPresent?: string;
  myFavouriteRooms?: any[];
  oldRole?: Role;
  gotBackground?: boolean;
  roomsIn?: number[];
  oldroomid?: number;
  selectedUserid?: number;
  date?: number;
  rouletteBusy?: boolean;
  socketid?: string;
  ip?: number;
  email?: string;
  invisible?: boolean;
  streamid?: number;
  webcamOld?: boolean;
  audioOld?: boolean;
  videoOld?: boolean;
  audio?: boolean;
  video?: boolean;
  isWriting?: boolean;
  lastTextNumber?: number;
  lastText?: string;
  whisperlastDate?: number;
  startRoom?: number;
  roomid?: string;
  canLockRoom?: boolean;
  paused?: boolean;
  dynamicDeleteRoomOn?: string;
}

export interface Friends {}

export enum Role {
  User = 'user',
}

export interface Room {
  id: string;
  name: string;
  maxUsers: string;
  description: string;
  users: number | string;
  welcome: string;
  image: string;
  webcam: string;
  reservedToGenderid: string;
  reservedToRoles: string;
  reservedToRoles2: string;
  ownerid: string;
  isPasswordProtected?: string;
  webmasterid: string;
  isTemporary: string;
  webcamMandatory: string;
  webradioUrl: string;
  isHidden: string;
  isAdult: string;
  urlBackground: string;
  locked: number | string;
  webcamStartsMuted: string;
  webcamStartsMutedOverwrite: string;
  webrtcServerUrl: string;
  topic: string;
  moderators?: null;
  roles?: null;
  date?: Date;
  destructionDate?: '0000-00-00 00:00:00';
  password?: string;
  default?: string;
  colorPicker?: string;
  orderRoom?: string;
  inPrivateConference?: string;
  tags?: string;
  country?: string;
  numberFavorit?: string;
  approved?: string;
  deleted?: string;
  reservedToGenderidCondition?: 'Equals';
  reservedToRolesCondition?: 'Equals';
  urlImage?: string;
  radio_url?: string;
  radio_start?: string;
  css?: string;
}

export enum Status {
  Online = 'online',
  Busy = 'busy',
}
