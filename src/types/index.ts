export interface UserProfile {
  id: number
  name: string
  email: string
  google_id: string | null
  is_connected: boolean
}

export interface DashboardStats {
  total_emails: number
  threads: number
  attachments: number
  synced: number
}

export interface EmailThread {
  thread_id: string
  subject: string
  sender: string
  snippet: string
  date: string
  message_count: number
  has_attachment: boolean
}

export interface Attachment {
  id: number
  file_name: string
  mime_type: string
  file_path: string
}

export interface Email {
  id: number
  gmail_message_id: string
  thread_id: string
  sender: string
  receiver: string
  subject: string
  body_html: string
  body_text: string
  date: string
  has_attachment: boolean
  attachments: Attachment[]
}

export interface SyncResponse {
  message: string
  job_id?: string
  status: 'syncing' | 'completed' | 'error' | 'idle'
  synced_count?: number
  total_messages?: number
  started_at?: string
  completed_at?: string
  last_sync?: string
}

export interface AISuggestion {
  text: string
  type: 'positive' | 'neutral' | 'action'
}
