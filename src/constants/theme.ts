/** Food-delivery app design tokens (Swiggy / Zomato inspired). */
export const theme = {
  colors: {
    primary: '#FC8019',
    primaryDark: '#E67312',
    secondary: '#1C1C1C',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B6B6B',
    border: '#EBEBEB',
    success: '#60B246',
    warning: '#FFB300',
    error: '#E23744',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.45)',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: { fontSize: 24, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
    label: { fontSize: 14, fontWeight: '600' as const },
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    button: {
      shadowColor: '#FC8019',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export default theme;
