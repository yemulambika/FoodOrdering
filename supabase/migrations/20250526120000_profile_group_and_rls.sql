-- Normalize profile group on signup and tighten order access.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_group text;
BEGIN
  meta_group := lower(trim(coalesce(new.raw_user_meta_data->>'group', 'user')));

  IF meta_group NOT IN ('admin', 'user') THEN
    meta_group := 'user';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, "group")
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    meta_group
  );

  RETURN new;
END;
$$;

-- Existing rows may still use legacy `USER` / `ADMIN` values.
UPDATE public.profiles
SET "group" = lower(trim("group"))
WHERE "group" IS NOT NULL
  AND "group" <> lower(trim("group"));

UPDATE public.profiles
SET "group" = 'user'
WHERE lower(trim("group")) IN ('user', '');

UPDATE public.profiles
SET "group" = 'admin'
WHERE lower(trim("group")) = 'admin';

ALTER TABLE public.profiles
  ALTER COLUMN "group" SET DEFAULT 'user';

-- Orders: users see/update own orders; admins manage all orders.
DROP POLICY IF EXISTS "All authenticated users All operations" ON public.orders;

CREATE POLICY "Users read own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND lower(profiles."group") = 'admin'
    )
  );

CREATE POLICY "Users insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND lower(profiles."group") = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND lower(profiles."group") = 'admin'
    )
  );

-- Order items: tied to accessible orders.
DROP POLICY IF EXISTS "Allow authenticated users ALL operations" ON public.order_items;

CREATE POLICY "Order items for accessible orders"
  ON public.order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (
          o.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
              AND lower(p."group") = 'admin'
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (
          o.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
              AND lower(p."group") = 'admin'
          )
        )
    )
  );

-- Products: everyone reads; only admins write.
DROP POLICY IF EXISTS "Allow authenticated users ALL operations" ON public.products;

CREATE POLICY "Anyone authenticated can read products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND lower(profiles."group") = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND lower(profiles."group") = 'admin'
    )
  );
