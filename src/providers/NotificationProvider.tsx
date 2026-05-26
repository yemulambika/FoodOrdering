import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
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
      .update({ expo_push_token: expoPushToken })
      .eq('id', profile.id)
      .then(({ error }) => {
        if (error) {
          if (isSupabaseMissingTableError(error)) {
            console.warn('Supabase table `profiles` not found when updating push token:', error.message);
            return;
          }
          console.warn('Failed to update profile push token:', error.message);
        }
      });
  }, [expoPushToken, profile]);

  return <>{children}</>;
};

export default NotificationProvider;
