# Food Ordering App — Manual Test Plan

Apply migrations first:

```bash
supabase db push
```

Set an admin user:

```sql
UPDATE profiles SET "group" = 'admin' WHERE id = '<your-user-uuid>';
```

Start the app:

```bash
npx expo start
```

## 1. Authentication

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Open app signed out | Redirect to sign-in |
| 1.2 | Sign up with email/password | Account created; redirect to home |
| 1.3 | Sign out from Profile tab | Back to sign-in |
| 1.4 | Sign in again | Redirect to home (user) or admin menu (admin) |

## 2. User flow

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Home tab | Lists restaurants + featured food |
| 2.2 | Tap a restaurant | Restaurant detail + menu grid |
| 2.3 | Tap a menu item | Product detail, size picker, Add to cart |
| 2.4 | Add to cart → checkout | Stripe sheet (if configured); order created |
| 2.5 | Orders tab | Your orders listed |
| 2.6 | Tap an order | Order detail with items |

## 3. Admin flow

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | Sign in as admin | Admin Menu tab (not user home) |
| 3.2 | Create product | Product appears in DB / menu list |
| 3.3 | Orders tab | Active orders list |
| 3.4 | Open order → change status | Status updates; user sees change (realtime) |

## 4. Role guards

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | User opens `/(admin)/menu` manually | Redirect to user home |
| 4.2 | Admin opens `/(user)/home` manually | Redirect to admin menu |

## 5. Legacy URLs

| URL | Expected |
|-----|----------|
| `/menu` | Redirect to home |
| `/menu/:id` | Redirect to `/restaurant/:restaurantId/:productId` |
| `/product/:id` | Same as above |
