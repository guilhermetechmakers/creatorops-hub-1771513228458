-- OpenClaw API: AI Research & Generation Endpoint
-- Tables for jobs, sources, usage accounting, and embedded agent config

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- openclaw_embedded_agent: agent configuration per user
CREATE TABLE IF NOT EXISTS openclaw_embedded_agent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- openclaw_job: research and generation jobs
CREATE TABLE IF NOT EXISTS openclaw_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('research', 'generate')),
  query TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rate_limited')),
  output JSONB,
  confidence_score NUMERIC(3,2),
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- openclaw_source: provenance/source links for jobs
CREATE TABLE IF NOT EXISTS openclaw_source (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES openclaw_job(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  snippet TEXT,
  snapshot_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- openclaw_usage: quota and usage accounting per user
CREATE TABLE IF NOT EXISTS openclaw_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES openclaw_job(id) ON DELETE SET NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('research', 'generate')),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_openclaw_embedded_agent_user_id ON openclaw_embedded_agent(user_id);
CREATE INDEX IF NOT EXISTS idx_openclaw_job_user_id ON openclaw_job(user_id);
CREATE INDEX IF NOT EXISTS idx_openclaw_job_status ON openclaw_job(status);
CREATE INDEX IF NOT EXISTS idx_openclaw_job_created_at ON openclaw_job(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_openclaw_source_job_id ON openclaw_source(job_id);
CREATE INDEX IF NOT EXISTS idx_openclaw_usage_user_id ON openclaw_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_openclaw_usage_created_at ON openclaw_usage(created_at DESC);

-- Enable RLS
ALTER TABLE openclaw_embedded_agent ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_source ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_usage ENABLE ROW LEVEL SECURITY;

-- openclaw_embedded_agent policies
CREATE POLICY "openclaw_embedded_agent_read_own" ON openclaw_embedded_agent
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "openclaw_embedded_agent_insert_own" ON openclaw_embedded_agent
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "openclaw_embedded_agent_update_own" ON openclaw_embedded_agent
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "openclaw_embedded_agent_delete_own" ON openclaw_embedded_agent
  FOR DELETE USING (auth.uid() = user_id);

-- openclaw_job policies
CREATE POLICY "openclaw_job_read_own" ON openclaw_job
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "openclaw_job_insert_own" ON openclaw_job
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "openclaw_job_update_own" ON openclaw_job
  FOR UPDATE USING (auth.uid() = user_id);

-- openclaw_source: users can read sources for their jobs
CREATE POLICY "openclaw_source_read" ON openclaw_source
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM openclaw_job j WHERE j.id = job_id AND j.user_id = auth.uid())
  );

CREATE POLICY "openclaw_source_insert" ON openclaw_source
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM openclaw_job j WHERE j.id = job_id AND j.user_id = auth.uid())
  );

-- openclaw_usage: users can read their own usage
CREATE POLICY "openclaw_usage_read_own" ON openclaw_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "openclaw_usage_insert" ON openclaw_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger for openclaw_embedded_agent
CREATE OR REPLACE FUNCTION update_openclaw_embedded_agent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_openclaw_embedded_agent_updated_at ON openclaw_embedded_agent;
CREATE TRIGGER update_openclaw_embedded_agent_updated_at
  BEFORE UPDATE ON openclaw_embedded_agent
  FOR EACH ROW
  EXECUTE FUNCTION update_openclaw_embedded_agent_updated_at();

-- Updated_at trigger for openclaw_job
CREATE OR REPLACE FUNCTION update_openclaw_job_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_openclaw_job_updated_at ON openclaw_job;
CREATE TRIGGER update_openclaw_job_updated_at
  BEFORE UPDATE ON openclaw_job
  FOR EACH ROW
  EXECUTE FUNCTION update_openclaw_job_updated_at();
