-- Allow users to delete their own OpenClaw jobs
CREATE POLICY "openclaw_job_delete_own" ON openclaw_job
  FOR DELETE USING (auth.uid() = user_id);
