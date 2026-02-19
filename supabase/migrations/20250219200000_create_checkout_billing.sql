-- Checkout / Billing: subscription and billing records
-- Table name uses checkout_billing (SQL identifiers cannot contain /)

CREATE TABLE IF NOT EXISTS checkout_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_billing_user_id ON checkout_billing(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_billing_created_at ON checkout_billing(created_at DESC);

ALTER TABLE checkout_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkout_billing_read_own" ON checkout_billing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "checkout_billing_insert_own" ON checkout_billing
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "checkout_billing_update_own" ON checkout_billing
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "checkout_billing_delete_own" ON checkout_billing
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_checkout_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_checkout_billing_updated_at ON checkout_billing;
CREATE TRIGGER update_checkout_billing_updated_at
  BEFORE UPDATE ON checkout_billing
  FOR EACH ROW
  EXECUTE FUNCTION update_checkout_billing_updated_at();
