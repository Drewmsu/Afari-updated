import { DarkTheme } from 'react-native-paper';
import { pallete } from './pallete';

export const colors = {
  ...pallete
};

export const fonts = {
  sizes: {
    h0: 32,
    h1: 26,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 15,
    p1: 16,
    p2: 15,
    p3: 15,
    p4: 13,
    s1: 15,
    s2: 14,
    s3: 13,
    s4: 12,
    s5: 11,
    s6: 10,
    s7: 9
  }
};

export const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.white,
    background: colors.darkPrimary
  }
};
