import theme from './theme';

const tintColorLight = theme.colors.primary;

export default {
  light: {
    text: theme.colors.text,
    background: theme.colors.background,
    tint: tintColorLight,
    tabIconDefault: theme.colors.textMuted,
    tabIconSelected: tintColorLight,
    card: theme.colors.card,
    primary: theme.colors.primary,
    muted: theme.colors.textMuted,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    card: '#1c1c1c',
    primary: theme.colors.primary,
    muted: '#aaa',
  },
};
