import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design reference width is 390 (the approved HTML design)
export const scale = (size: number) => (SCREEN_WIDTH / 390) * size;
export const vScale = (size: number) => (SCREEN_HEIGHT / 844) * size;
export const mScale = (size: number, f = 0.5) => size + (scale(size) - size) * f;

export const COLORS = {
  bg: '#FDF3E3',
  card: 'rgba(255,255,255,0.78)',
  border: 'rgba(180,120,40,0.25)',
  gold: '#C8903A',
  goldBright: '#F0A830',
  maroon: '#8B3A00',
  maroonDark: '#5A1E00',
  textMuted: '#a3672c',
  green: '#2f9e44',
};

export const MALA = {
  ringSize: Math.min(SCREEN_WIDTH * 0.64, 250),
  beadCount: 27,
  charanSize: Math.min(SCREEN_WIDTH * 0.41, 160),
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
