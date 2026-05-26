import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function MenuStack() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors.light.tint,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Menu',
          headerRight: () => (
            <Link href="/(admin)/menu/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-square-o"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen
        name="create"
        options={{ title: 'Create Product' }}
      />

      <Stack.Screen
        name="[id]"
        options={{ title: 'Product Details' }}
      />
    </Stack>
  );
}