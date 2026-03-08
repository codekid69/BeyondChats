import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useAuthStatus } from '@/hooks/useAuth'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isConnected: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error } = useAuthStatus()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('user_id')
    if (userId) {
      localStorage.setItem('gmail_user_id', userId)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isConnected: user?.is_connected ?? false,
    error: error as Error | null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
