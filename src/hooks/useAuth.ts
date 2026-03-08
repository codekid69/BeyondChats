import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/services/api'

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: authApi.getAuthStatus,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export function useConnectGmail() {
  return useMutation({
    mutationFn: authApi.connectGmail,
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })
}

export function useDisconnectGmail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.disconnectGmail,
    onSuccess: () => {
      localStorage.removeItem('gmail_user_id')
      queryClient.invalidateQueries({ queryKey: ['auth-status'] })
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
