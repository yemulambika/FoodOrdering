import Button from '@/components/Button';
import Card from '@/components/ui/Card';
import Screen from '@/components/ui/Screen';
import theme from '@/constants/theme';
import { normalizeGroup } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function AdminProfileScreen() {
  const { email, profile, refreshProfile } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in');
  };

  const demoteToUserDev = async () => {
    if (!profile?.id) return;
    await supabase.from('profiles').update({ group: 'user' }).eq('id', profile.id);
    await refreshProfile();
    router.replace('/(user)/home');
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="shield" size={36} color={theme.colors.primary} />
        </View>
        <Text style={styles.name}>Admin</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{normalizeGroup(profile?.group)}</Text>
        </View>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Admin access</Text>
        <Text style={styles.cardBody}>
          Role is read from profiles.group in Supabase. Admins are routed to
          /(admin)/dashboard on login.
        </Text>
      </Card>

      <Button
        text="Back to dashboard"
        onPress={() => router.push('/(admin)/dashboard')}
      />

      {__DEV__ ? (
        <Button
          text="[DEV] Switch to user role"
          variant="outline"
          onPress={demoteToUserDev}
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
  roleText: { color: theme.colors.primary, fontWeight: '700' },
  cardTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  cardBody: { color: theme.colors.textMuted, lineHeight: 22 },
});
