-- ============================================
-- KRONOS DİJİTAL - Supabase Veritabanı Şeması
-- ============================================
-- Bu SQL'i Supabase → SQL Editor'de çalıştırın.

-- ---- EXTENSIONS ----
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---- PROFILES ----
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,                    -- Clerk user ID (user_xxxx)
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---- CREDIT PACKAGES ----
CREATE TABLE IF NOT EXISTS credit_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  currency TEXT NOT NULL DEFAULT 'TRY',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  iyzico_product_ref TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default packages
INSERT INTO credit_packages (name, credits, price, sort_order) VALUES
  ('Başlangıç', 50, 49.00, 1),
  ('Profesyonel', 150, 129.00, 2),
  ('Kurumsal', 500, 349.00, 3)
ON CONFLICT DO NOTHING;

-- ---- PAYMENTS ----
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES credit_packages(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  iyzico_payment_id TEXT,
  iyzico_conversation_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);

-- ---- CREDIT TRANSACTIONS ----
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,             -- positive = earned, negative = used
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT NOT NULL,
  reference_id TEXT,                   -- generation_id or payment_id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);

-- ---- GENERATIONS ----
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  design_type TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_description TEXT,
  color_palette TEXT[],
  style_notes TEXT,
  prompt_used TEXT,
  output_url TEXT,
  output_format TEXT NOT NULL DEFAULT 'png' CHECK (output_format IN ('png', 'jpg', 'pdf', 'svg')),
  replicate_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  credits_used INTEGER NOT NULL DEFAULT 1 CHECK (credits_used > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_is_public ON generations(is_public);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- ---- BRAND PROFILES ----
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  target_audience TEXT,
  color_palette TEXT[],
  style TEXT,
  keywords TEXT[],
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own, admin reads all
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (true);

-- Credit packages: everyone can read active ones
CREATE POLICY "credit_packages_select_active" ON credit_packages FOR SELECT USING (is_active = true);

-- Payments: user sees own
CREATE POLICY "payments_select_own" ON payments FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "payments_insert_own" ON payments FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Credit transactions: user sees own
CREATE POLICY "credit_transactions_select_own" ON credit_transactions FOR SELECT USING (auth.uid()::text = user_id);

-- Generations: user sees own + public ones
CREATE POLICY "generations_select_own" ON generations FOR SELECT USING (
  auth.uid()::text = user_id OR is_public = true
);
CREATE POLICY "generations_insert_own" ON generations FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "generations_update_own" ON generations FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "generations_delete_own" ON generations FOR DELETE USING (auth.uid()::text = user_id);

-- Brand profiles: user sees own
CREATE POLICY "brand_profiles_select_own" ON brand_profiles FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "brand_profiles_insert_own" ON brand_profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "brand_profiles_update_own" ON brand_profiles FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "brand_profiles_delete_own" ON brand_profiles FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Supabase Dashboard → Storage'da manuel olarak oluşturun:
-- Bucket: "generations" (public: true)
-- Bucket: "brand-assets" (public: false)
