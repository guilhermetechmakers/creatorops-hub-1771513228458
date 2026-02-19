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
    }
  }
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
