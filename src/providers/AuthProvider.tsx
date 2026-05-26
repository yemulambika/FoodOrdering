import { getDevRole } from '@/lib/devRole';
import { isAdmin as checkIsAdmin } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
import { Profile } from '@/types';
import { Session } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const AUTH_DEBUG = __DEV__;
let profilesTableMissing = false;

function logAuth(...args: unknown[]) {
  if (AUTH_DEBUG) console.log('[Auth]', ...args);
}

function profileFromSession(session: Session, group: string): Profile {
  return {
    id: session.user.id,
    group,
    email: session.user.email ?? null,
    full_name:
      session.user.user_metadata?.full_name ??
      session.user.user_metadata?.name ??
      null,
  };
}

async function resolveGroup(
  session: Session,
  dbGroup?: string | null
): Promise<string> {
  const devRole = await getDevRole();
  if (devRole) {
    logAuth('using dev role override:', devRole);
    return devRole;
  }

  if (dbGroup) {
    return dbGroup;
  }

  const metaGroup = session.user.user_metadata?.group as string | undefined;
  if (metaGroup) {
    return metaGroup;
  }

  return 'user';
}

async function loadProfile(session: Session): Promise<Profile> {
  const userId = session.user.id;

  if (profilesTableMissing) {
    const group = await resolveGroup(session, null);
    return profileFromSession(session, group);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, "group", full_name, username')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      profilesTableMissing = true;
      logAuth(
        'profiles table not in Supabase — using session/dev role. Run supabase/setup_database.sql'
      );
      const group = await resolveGroup(session, null);
      return profileFromSession(session, group);
    }
    console.warn('[Auth] profile fetch:', error.message);
  }

  if (data) {
    const group = await resolveGroup(session, data.group);
    return { ...data, group, email: session.user.email ?? null } as Profile;
  }

  if (profilesTableMissing) {
    const group = await resolveGroup(session, null);
    return profileFromSession(session, group);
  }

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      group: 'user',
      full_name: session.user.user_metadata?.full_name ?? null,
    })
    .select('id, "group", full_name, username')
    .single();

  if (insertError) {
    if (isSupabaseMissingTableError(insertError)) {
      profilesTableMissing = true;
      const group = await resolveGroup(session, null);
      return profileFromSession(session, group);
    }
    console.warn('[Auth] profile create:', insertError.message);
    return profileFromSession(session, 'user');
  }

  const group = await resolveGroup(session, created.group);
  return { ...created, group, email: session.user.email ?? null } as Profile;
}

type AuthData = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  email: string | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  databaseReady: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  email: null,
  isAdmin: false,
  refreshProfile: async () => {},
  databaseReady: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [databaseReady, setDatabaseReady] = useState(true);
  const bootstrapped = useRef(false);

  const applySession = useCallback(async (next: Session | null) => {
    setSession(next);

    if (!next?.user?.id) {
      setProfile(null);
      return;
    }

    const nextProfile = await loadProfile(next);
    setProfile(nextProfile);
    setDatabaseReady(!profilesTableMissing);

    logAuth('user:', next.user.id);
    logAuth('email:', next.user.email);
    logAuth('group:', nextProfile.group);
    logAuth('isAdmin:', checkIsAdmin(nextProfile));
    logAuth('databaseReady:', !profilesTableMissing);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session) return;
    await applySession(session);
  }, [session, applySession]);

  useEffect(() => {
    if (bootstrapped.current) return;

    const bootstrap = async () => {
      try {
        const {
          data: { session: initial },
        } = await supabase.auth.getSession();
        await applySession(initial);
      } finally {
        setLoading(false);
        bootstrapped.current = true;
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      await applySession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [applySession]);

  const email = profile?.email ?? session?.user?.email ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        email,
        isAdmin: checkIsAdmin(profile),
        refreshProfile,
        databaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
