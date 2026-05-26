import Button from '@/components/Button';
import Card from '@/components/ui/Card';
import Screen from '@/components/ui/Screen';
import theme from '@/constants/theme';
import { normalizeGroup } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { email, profile, isAdmin, refreshProfile } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in');
  };

  const promoteToAdminDev = async () => {
    if (!profile?.id) return;
    const { error } = await supabase
      .from('profiles')
      .update({ group: 'admin' })
      .eq('id', profile.id);

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }
    await refreshProfile();
    Alert.alert('Admin enabled', 'Reloading admin dashboard.');
    router.replace('/(admin)/dashboard');
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.name}>
          {profile?.full_name || 'Foodie'}
        </Text>
        <Text style={styles.email}>{email ?? 'No email'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {isAdmin ? 'Admin' : normalizeGroup(profile?.group) || 'user'}
          </Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.cardRow}>ID: {profile?.id?.slice(0, 8)}…</Text>
        <Text style={styles.cardRow}>Role: {normalizeGroup(profile?.group)}</Text>
      </Card>

      {isAdmin ? (
        <Button
          text="Open admin dashboard"
          onPress={() => router.push('/(admin)/dashboard')}
        />
      ) : null}

      {__DEV__ && !isAdmin ? (
        <Button
          text="[DEV] Make me admin"
          variant="outline"
          onPress={promoteToAdminDev}
        />
      ) : null}

      <Button text="Sign out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: theme.spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  name: { ...theme.typography.title, color: theme.colors.text },
  email: { color: theme.colors.textMuted, marginTop: 4 },
  roleBadge: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '22',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  roleText: { color: theme.colors.primary, fontWeight: '700', fontSize: 13 },
  card: { marginBottom: theme.spacing.md },
  cardTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  cardRow: { color: theme.colors.textMuted, marginBottom: 4 },
});
