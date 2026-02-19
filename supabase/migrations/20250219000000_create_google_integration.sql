-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- google_integration_gmail_calendar table
CREATE TABLE IF NOT EXISTS google_integration_gmail_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE google_integration_gmail_calendar ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "google_integration_gmail_calendar_read_own" ON google_integration_gmail_calendar
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "google_integration_gmail_calendar_insert_own" ON google_integration_gmail_calendar
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "google_integration_gmail_calendar_update_own" ON google_integration_gmail_calendar
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "google_integration_gmail_calendar_delete_own" ON google_integration_gmail_calendar
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_google_integration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_google_integration_gmail_calendar_updated_at ON google_integration_gmail_calendar;
CREATE TRIGGER update_google_integration_gmail_calendar_updated_at
  BEFORE UPDATE ON google_integration_gmail_calendar
  FOR EACH ROW
  EXECUTE FUNCTION update_google_integration_updated_at();
