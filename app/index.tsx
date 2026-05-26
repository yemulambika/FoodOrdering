import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import theme from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Root role router:
 * - no session → sign-in
 * - profile.group admin → admin dashboard
 * - else → user home tabs
 */
export default function Index() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (isAdmin) {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(user)/home" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
