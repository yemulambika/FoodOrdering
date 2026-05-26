import theme from '@/constants/theme';
import { Stack } from 'expo-router';

export default function OrdersStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Orders' }} />
      <Stack.Screen name="[id]" options={{ title: 'Order details' }} />
    </Stack>
  );
}
