import AuthProvider from '@/providers/AuthProvider';
import CartProvider from '@/providers/CartProvider';
import NotificationProvider from '@/providers/NotificationProvider';
import QueryProvider from '@/providers/QueryProvider';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="cart" options={{ headerShown: true }} />
              </Stack>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
