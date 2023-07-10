import type BreezSongInfo from '@/types/breezSongInfoType';
import type PlayerType from '@/types/playerType';
import type { Unsplash } from '@/types/unsplashType';
import type UserType from '@/types/userType';

export interface LoginStatus {
  snsList: string[] | [];
  isError: boolean;
  errorMessage: string | null;
}

export type CurrentYoutubeInfo = {
  title: string;
  author: string;
} | null;

export type GeoPermissionState = 'prompt' | 'granted' | 'denied';

export interface InitialState {
  lastUpdate: string;
  stateUpdateTime: () => void;
  user: UserType;
  setUserLoggedIn: (user: UserType) => void;
  setUserLoggedOut: () => void;
  loginStatus: LoginStatus;
  setLoginStatus: (loginStatus: LoginStatus) => void;
  // 서울시청 경도위도: [126.9784147, 37.5666805],
  setLocation: (currentLocation: [number, number]) => void;
  setGeoReset: () => void;
  currentLocation: [number, number] | undefined;
  isAgreedGeo: GeoPermissionState;
  setIsAgreedGeo: (geoPermissionState: GeoPermissionState) => void;
  isUserCheckedGeoModal: boolean;
  setIsUserCheckedGeoModal: (boolean: boolean) => void;
  youtubeUrls: string[];
  setYoutubeUrls: (array: string[]) => void;
  unsplashImages: Unsplash[];
  setUnsplashImages: (images: Unsplash[]) => void;
  player: PlayerType;
  setPlayer: (player: PlayerType) => void;
  currentYoutubeInfo: CurrentYoutubeInfo;
  setCurrentYoutubeInfo: (currentYoutubeInfo: CurrentYoutubeInfo) => void;
  currentBreezSongInfo: BreezSongInfo | null;
  setCurrentBreezSongInfo: (breezSongInfo: BreezSongInfo) => void;
}
