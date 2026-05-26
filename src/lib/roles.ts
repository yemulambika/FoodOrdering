import { Profile } from '@/types';

/** Normalize DB values like `USER`, `user`, `admin`, `ADMIN`. */
export function normalizeGroup(group: string | null | undefined): string {
  return (group ?? '').trim().toLowerCase();
}

export function isAdmin(profile: Pick<Profile, 'group'> | null | undefined): boolean {
  return normalizeGroup(profile?.group) === 'admin';
}

export function isUser(profile: Pick<Profile, 'group'> | null | undefined): boolean {
  const g = normalizeGroup(profile?.group);
  return g === 'user' || g === '';
}
