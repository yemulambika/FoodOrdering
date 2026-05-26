import theme from '@/constants/theme';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
