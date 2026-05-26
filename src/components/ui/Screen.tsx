import theme from '@/constants/theme';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}>;

export default function Screen({
  children,
  scroll = false,
  padded = true,
  style,
}: ScreenProps) {
  const content = (
    <View style={[padded && styles.padded, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  padded: {
    flex: 1,
    padding: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
});
