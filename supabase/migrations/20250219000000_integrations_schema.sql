-- Integrations schema: sync logs, audit logs, and extended integration support
-- Run this migration to enable full Integrations page features

-- Integration sync log: last sync, health, token refresh status
CREATE TABLE IF NOT EXISTS integration_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  integration_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_refresh_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE integration_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integration_sync_log_read_own" ON integration_sync_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "integration_sync_log_insert_own" ON integration_sync_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Integration audit log: for admin visibility (connect, disconnect, errors)
CREATE TABLE IF NOT EXISTS integration_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE integration_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integration_audit_log_read_own" ON integration_audit_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "integration_audit_log_insert_own" ON integration_audit_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policy: allow admins to read all audit logs (requires admin role check)
-- For now, users can only read their own; add admin check when roles exist

-- Add optional columns to google_integration_gmail_calendar if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'google_integration_gmail_calendar' AND column_name = 'last_sync_at'
  ) THEN
    ALTER TABLE google_integration_gmail_calendar ADD COLUMN last_sync_at TIMESTAMP WITH TIME ZONE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'google_integration_gmail_calendar' AND column_name = 'last_error'
  ) THEN
    ALTER TABLE google_integration_gmail_calendar ADD COLUMN last_error TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_integration_sync_log_user_type ON integration_sync_log(user_id, integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_audit_log_user_created ON integration_audit_log(user_id, created_at DESC);
