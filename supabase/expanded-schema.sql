-- VanaTour HQ — Expanded Schema
-- Run this in Supabase SQL Editor to add new tables
-- Existing tables (profiles, tours, day_sheets, documents, guest_list_requests, tour_invitations) are unchanged

-- Add status column to tours if not exists
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed'));

-- ===== EXPENSES =====
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'other',
  description text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  receipt_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own tour expenses" ON public.expenses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can create own expenses" ON public.expenses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own expenses" ON public.expenses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users can delete own expenses" ON public.expenses
FOR DELETE USING (auth.uid() = user_id);

-- ===== BUDGET =====
CREATE TABLE IF NOT EXISTS public.budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  category text NOT NULL,
  limit_amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tour_id, category)
);

ALTER TABLE public.budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own tour budget" ON public.budget
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = budget.tour_id AND tours.user_id = auth.uid())
);

CREATE POLICY "users can manage own tour budget" ON public.budget
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = budget.tour_id AND tours.user_id = auth.uid())
);

-- ===== MERCH INVENTORY =====
CREATE TABLE IF NOT EXISTS public.merch_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  unit_cost numeric(10,2) NOT NULL DEFAULT 0,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  initial_stock integer NOT NULL DEFAULT 0,
  current_stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.merch_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour merch" ON public.merch_inventory
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = merch_inventory.tour_id AND tours.user_id = auth.uid())
);

-- ===== MERCH SALES =====
CREATE TABLE IF NOT EXISTS public.merch_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.merch_inventory(id) ON DELETE CASCADE,
  day_sheet_id uuid REFERENCES public.day_sheets(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  venue_cut_pct numeric(5,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.merch_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour merch sales" ON public.merch_sales
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = merch_sales.tour_id AND tours.user_id = auth.uid())
);

-- ===== SETTLEMENTS =====
CREATE TABLE IF NOT EXISTS public.settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  day_sheet_id uuid REFERENCES public.day_sheets(id) ON DELETE SET NULL,
  venue_name text NOT NULL,
  show_date date NOT NULL,
  guarantee numeric(10,2) NOT NULL DEFAULT 0,
  door_sales numeric(10,2) NOT NULL DEFAULT 0,
  expenses_deducted numeric(10,2) NOT NULL DEFAULT 0,
  net_payment numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  paid boolean NOT NULL DEFAULT false,
  paid_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour settlements" ON public.settlements
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = settlements.tour_id AND tours.user_id = auth.uid())
);

-- ===== CREW =====
CREATE TABLE IF NOT EXISTS public.crew (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'crew',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crew ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour crew" ON public.crew
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = crew.tour_id AND tours.user_id = auth.uid())
);

-- ===== ADVANCES =====
CREATE TABLE IF NOT EXISTS public.advances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  day_sheet_id uuid REFERENCES public.day_sheets(id) ON DELETE SET NULL,
  venue_name text NOT NULL,
  show_date date NOT NULL,
  status text NOT NULL DEFAULT 'not_sent' CHECK (status IN ('not_sent', 'sent', 'received', 'confirmed')),
  promoter_name text,
  promoter_email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour advances" ON public.advances
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = advances.tour_id AND tours.user_id = auth.uid())
);

-- ===== ROUTING =====
CREATE TABLE IF NOT EXISTS public.routing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  city text NOT NULL,
  venue_name text,
  date date NOT NULL,
  distance_miles numeric(8,1),
  drive_time_hours numeric(5,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.routing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own tour routing" ON public.routing
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = routing.tour_id AND tours.user_id = auth.uid())
);

-- ===== UPDATED AT TRIGGERS =====
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['expenses', 'budget', 'merch_inventory', 'settlements', 'crew', 'advances', 'routing']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_set_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at()', t, t);
  END LOOP;
END $$;

-- ===== USEFUL VIEWS FOR COMMAND CENTER =====

-- Tour financial summary
CREATE OR REPLACE VIEW public.tour_financials AS
SELECT
  t.id AS tour_id,
  t.name AS tour_name,
  COALESCE(s.guarantee_total, 0) AS total_guarantees,
  COALESCE(s.door_total, 0) AS total_door_sales,
  COALESCE(e.expense_total, 0) AS total_expenses,
  COALESCE(m.merch_revenue, 0) AS total_merch_revenue,
  COALESCE(s.net_total, 0) AS total_net_payments
FROM public.tours t
LEFT JOIN (
  SELECT tour_id,
    SUM(guarantee) AS guarantee_total,
    SUM(door_sales) AS door_total,
    SUM(net_payment) AS net_total
  FROM public.settlements GROUP BY tour_id
) s ON s.tour_id = t.id
LEFT JOIN (
  SELECT tour_id, SUM(amount) AS expense_total
  FROM public.expenses GROUP BY tour_id
) e ON e.tour_id = t.id
LEFT JOIN (
  SELECT tour_id, SUM(total) AS merch_revenue
  FROM public.merch_sales GROUP BY tour_id
) m ON m.tour_id = t.id;

-- Tour progress
CREATE OR REPLACE VIEW public.tour_progress AS
SELECT
  t.id AS tour_id,
  t.name AS tour_name,
  t.start_date,
  t.end_date,
  COUNT(ds.id) FILTER (WHERE ds.is_show = true) AS total_shows,
  COUNT(ds.id) FILTER (WHERE ds.is_show = true AND ds.day_date < CURRENT_DATE) AS completed_shows,
  COUNT(ds.id) FILTER (WHERE ds.is_show = true AND ds.day_date >= CURRENT_DATE) AS upcoming_shows,
  COUNT(ds.id) AS total_days
FROM public.tours t
LEFT JOIN public.day_sheets ds ON ds.tour_id = t.id
GROUP BY t.id, t.name, t.start_date, t.end_date;
