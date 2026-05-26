import Button from '@/components/Button';
import theme from '@/constants/theme';
import { setDevRole } from '@/lib/devRole';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInAsAdmin, setSignInAsAdmin] = useState(false);
  const router = useRouter();
  const { refreshProfile } = useAuth();

  async function signInWithEmail() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }

    setLoading(true);

    await setDevRole(signInAsAdmin ? 'admin' : 'user');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }

    await refreshProfile();

    if (signInAsAdmin) {
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, group: 'admin' })
          .select();

        if (profileError && __DEV__) {
          console.warn(
            '[Auth] Could not save admin to profiles (table may be missing). Using dev role.',
            profileError.message
          );
        }
      }
      router.replace('/(admin)/dashboard');
    } else {
      router.replace('/(user)/home');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Welcome back', headerShown: true }} />

      <View style={styles.hero}>
        <Text style={styles.logo}>🍕 FoodOrder</Text>
        <Text style={styles.tagline}>Order from the best restaurants near you</Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        secureTextEntry
        autoComplete="password"
      />

      <Pressable
        style={[styles.roleToggle, signInAsAdmin && styles.roleToggleActive]}
        onPress={() => setSignInAsAdmin((v) => !v)}
      >
        <Text
          style={[
            styles.roleToggleText,
            signInAsAdmin && styles.roleToggleTextActive,
          ]}
        >
          {signInAsAdmin ? '✓ Sign in as Admin' : 'Sign in as Admin'}
        </Text>
        <Text style={styles.roleHint}>
          {signInAsAdmin
            ? 'You will open the admin dashboard after login'
            : 'Tap to enable admin access (for testing)'}
        </Text>
      </Pressable>

      <Button
        onPress={signInWithEmail}
        disabled={loading || !email || !password}
        loading={loading}
        text={signInAsAdmin ? 'Sign in as Admin' : 'Sign in'}
      />

      <Link href="/sign-up" style={styles.link}>
        <Text style={styles.linkText}>Create an account</Text>
      </Link>

      <Text style={styles.setupNote}>
        Seeing 404 errors? Run supabase/setup_database.sql in your Supabase SQL
        Editor.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  hero: { marginBottom: theme.spacing.lg },
  logo: { fontSize: 32, fontWeight: '800', color: theme.colors.text },
  tagline: { color: theme.colors.textMuted, marginTop: 8, fontSize: 15 },
  label: { color: theme.colors.textMuted, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    fontSize: 16,
  },
  roleToggle: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  roleToggleActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF3E8',
  },
  roleToggleText: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.colors.text,
  },
  roleToggleTextActive: {
    color: theme.colors.primary,
  },
  roleHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  link: { alignSelf: 'center', marginTop: theme.spacing.md },
  linkText: { color: theme.colors.primary, fontWeight: '700' },
  setupNote: {
    marginTop: theme.spacing.lg,
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
