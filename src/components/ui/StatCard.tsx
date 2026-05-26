import theme from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  accent?: string;
};

export default function StatCard({ label, value, icon, accent = theme.colors.primary }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '22' }]}>
        <FontAwesome name={icon} size={22} color={accent} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
