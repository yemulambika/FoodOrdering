import theme from '@/constants/theme';
import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type CardProps = PropsWithChildren<{ style?: ViewStyle }>;

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
});
