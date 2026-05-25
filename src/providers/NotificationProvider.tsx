import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const { profile } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
  }, []);

  useEffect(() => {
    if (!expoPushToken || !profile?.id) {
      return;
    }

    supabase
      .from('profiles')
      .update({ expo_push_token: expoPushToken } as any)
      .eq('id', profile.id);
  }, [expoPushToken, profile]);

  return <>{children}</>;
};

export default NotificationProvider;
