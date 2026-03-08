import axios from 'axios'
import type { UserProfile, DashboardStats, EmailThread, Email, SyncResponse } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'https://gobeyond.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('gmail_user_id')
  if (userId) {
    config.headers['X-User-Id'] = userId
  }
  return config
})

export const authApi = {
  connectGmail: async (): Promise<{ url: string }> => {
    const { data } = await api.post('/connect-gmail')
    return data
  },
  disconnectGmail: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/disconnect-gmail')
    return data
  },
  getAuthStatus: async (): Promise<UserProfile> => {
    const { data } = await api.get('/auth-status')
    return data
  },
}

export const emailApi = {
  syncEmails: async (days: number): Promise<SyncResponse> => {
    const { data } = await api.post('/sync-emails', { days })
    return data
  },
  getSyncStatus: async (): Promise<SyncResponse> => {
    const { data } = await api.get('/sync-status')
    return data
  },
  getEmails: async (): Promise<EmailThread[]> => {
    const { data } = await api.get('/emails')
    return data
  },
  getEmailThread: async (threadId: string): Promise<Email[]> => {
    const { data } = await api.get(`/email-thread/${threadId}`)
    return data
  },
  replyEmail: async (threadId: string, body: string): Promise<void> => {
    await api.post('/reply-email', { thread_id: threadId, body })
  },
}

export const statsApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/stats')
    return data
  },
}

export default api
