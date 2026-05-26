import theme from '@/constants/theme';
import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
    </Stack>
  );
}
