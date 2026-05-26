import theme from '@/constants/theme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  text: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontSize: 15,
  },
});
