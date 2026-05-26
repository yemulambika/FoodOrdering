import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_ROLE_KEY = '@foodordering/dev_role';

export type DevRole = 'user' | 'admin' | null;

export async function getDevRole(): Promise<DevRole> {
  try {
    const value = await AsyncStorage.getItem(DEV_ROLE_KEY);
    if (value === 'admin' || value === 'user') return value;
    return null;
  } catch {
    return null;
  }
}

export async function setDevRole(role: DevRole): Promise<void> {
  if (!role) {
    await AsyncStorage.removeItem(DEV_ROLE_KEY);
    return;
  }
  await AsyncStorage.setItem(DEV_ROLE_KEY, role);
}
