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
