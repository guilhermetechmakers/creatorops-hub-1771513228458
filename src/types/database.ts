export interface Database {
  public: {
    Tables: {
      google_integration_gmail_calendar: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      file_library_asset: {
        Row: {
          id: string
          user_id: string
          title: string
          filename: string
          file_path: string
          file_type: string
          file_size: number
          thumbnail_path: string | null
          description: string | null
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          filename: string
          file_path: string
          file_type: string
          file_size?: number
          thumbnail_path?: string | null
          description?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          filename?: string
          file_path?: string
          file_type?: string
          file_size?: number
          thumbnail_path?: string | null
          description?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      checkout_billing: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      file_library_version: {
        Row: {
          id: string
          asset_id: string
          version_number: number
          file_path: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          version_number: number
          file_path: string
          file_size?: number
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          version_number?: number
          file_path?: string
          file_size?: number
          created_at?: string
        }
      }
      openclaw_embedded_agent: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      openclaw_job: {
        Row: {
          id: string
          user_id: string
          type: string
          query: string
          status: string
          output: unknown
          confidence_score: number | null
          metadata: unknown
          error_message: string | null
          retry_count: number
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          query: string
          status?: string
          output?: unknown
          confidence_score?: number | null
          metadata?: unknown
          error_message?: string | null
          retry_count?: number
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          query?: string
          status?: string
          output?: unknown
          confidence_score?: number | null
          metadata?: unknown
          error_message?: string | null
          retry_count?: number
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      integration_sync_log: {
        Row: {
          id: string
          user_id: string
          integration_type: string
          integration_id: string | null
          status: string
          last_sync_at: string | null
          next_refresh_at: string | null
          error_message: string | null
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          integration_type: string
          integration_id?: string | null
          status?: string
          last_sync_at?: string | null
          next_refresh_at?: string | null
          error_message?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          integration_type?: string
          integration_id?: string | null
          status?: string
          last_sync_at?: string | null
          next_refresh_at?: string | null
          error_message?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      integration_audit_log: {
        Row: {
          id: string
          user_id: string
          integration_type: string
          action: string
          status: string
          details: Record<string, unknown>
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          integration_type: string
          action: string
          status?: string
          details?: Record<string, unknown>
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          integration_type?: string
          action?: string
          status?: string
          details?: Record<string, unknown>
          ip_address?: string | null
          created_at?: string
        }
      }
      openclaw_source: {
        Row: {
          id: string
          job_id: string
          url: string
          title: string | null
          snippet: string | null
          snapshot_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          url: string
          title?: string | null
          snippet?: string | null
          snapshot_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          url?: string
          title?: string | null
          snippet?: string | null
          snapshot_path?: string | null
          created_at?: string
        }
      }
    }
  }
}

export interface CheckoutBilling {
  id: string
  user_id: string
  title: string
  description?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface GoogleIntegrationGmailCalendar {
  id: string
  user_id: string
  title: string
  description?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface FileLibraryAsset {
  id: string
  user_id: string
  title: string
  filename: string
  file_path: string
  file_type: string
  file_size: number
  thumbnail_path: string | null
  description: string | null
  tags: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface FileLibraryVersion {
  id: string
  asset_id: string
  version_number: number
  file_path: string
  file_size: number
  created_at: string
}

export interface OpenClawEmbeddedAgent {
  id: string
  user_id: string
  title: string
  description?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface OpenClawJob {
  id: string
  user_id: string
  type: 'research' | 'generate'
  query: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rate_limited'
  output?: Record<string, unknown> | null
  confidence_score?: number | null
  metadata?: Record<string, unknown> | null
  error_message?: string | null
  retry_count: number
  created_at: string
  updated_at: string
  completed_at?: string | null
  sources?: OpenClawSource[]
}

export interface OpenClawSource {
  id: string
  job_id: string
  url: string
  title?: string | null
  snippet?: string | null
  snapshot_path?: string | null
  created_at: string
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'refreshing'

export interface IntegrationSyncLog {
  id: string
  user_id: string
  integration_type: string
  integration_id: string | null
  status: string
  last_sync_at: string | null
  next_refresh_at: string | null
  error_message: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface IntegrationAuditLog {
  id: string
  user_id: string
  integration_type: string
  action: string
  status: string
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
}
