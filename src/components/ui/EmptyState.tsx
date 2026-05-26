import theme from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';

type EmptyStateProps = {
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <FontAwesome name={icon} size={36} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button text={actionLabel} onPress={onAction} style={styles.btn} />
      ) : null}
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
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  btn: { marginTop: theme.spacing.lg, minWidth: 200 },
});
