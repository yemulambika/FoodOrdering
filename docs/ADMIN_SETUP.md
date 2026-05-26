# Admin role setup

## Where admin is checked

| File | Purpose |
|------|---------|
| `src/lib/roles.ts` | `isAdmin(profile)` — compares `profile.group` (case-insensitive) to `admin` |
| `src/providers/AuthProvider.tsx` | Loads profile, exposes `isAdmin` on context |
| `app/index.tsx` | Root redirect: admin → `/(admin)/dashboard`, user → `/(user)/home` |
| `app/(admin)/_layout.tsx` | Blocks non-admins from admin tabs |
| `app/(user)/_layout.tsx` | Redirects admins away from user tabs |

## Make a user admin (Supabase SQL)

Replace the UUID with your user id from **Authentication → Users** in Supabase:

```sql
UPDATE public.profiles
SET "group" = 'admin'
WHERE id = 'YOUR-USER-UUID-HERE';
```

Verify:

```sql
SELECT id, "group", full_name FROM public.profiles;
```

## Dev shortcut

On the **user Profile** screen in development builds, tap **[DEV] Make me admin** to update your profile without SQL.

## Create database tables (required)

Your Supabase project must have tables. If you see **404** / `Could not find the table 'public.profiles'`:

1. Open [Supabase SQL Editor](https://supabase.com/dashboard)
2. Open `supabase/setup_database.sql` in this repo
3. Paste the full file and click **Run**

Or with CLI:

```bash
supabase db push
```

Default new users: `group = 'user'` (see `20250526120000_profile_group_and_rls.sql`).
