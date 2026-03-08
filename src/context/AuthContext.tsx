import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useAuthStatus } from '@/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import type { UserProfile } from '@/types'

// ── Synchronously persist user_id from the OAuth redirect URL ──────────────
// This MUST run before any React hooks so that the axios interceptor (which
// reads localStorage) can attach the X-User-Id header on the very first
// /auth-status request.  Doing this inside a useEffect() was too late —
// the fetch would fire before the effect ran, returning is_connected: false.
{
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('user_id')
  if (userId) {
    localStorage.setItem('gmail_user_id', userId)
    // Remove user_id from the URL without a page reload
    params.delete('user_id')
    window.history.replaceState({}, document.title,
      params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
    )
  }
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isConnected: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data: user, isLoading, error } = useAuthStatus()

  // After a Google OAuth redirect, refetch auth-status once the component
  // mounts so the UI reflects the newly-stored user_id immediately.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['auth-status'] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
