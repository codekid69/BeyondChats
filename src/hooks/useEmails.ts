import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { emailApi, statsApi } from '@/services/api'

export function useEmails() {
  return useQuery({
    queryKey: ['emails'],
    queryFn: emailApi.getEmails,
    refetchInterval: 30000,
  })
}

export function useEmailThread(threadId: string | null) {
  return useQuery({
    queryKey: ['emailThread', threadId],
    queryFn: () => emailApi.getEmailThread(threadId!),
    enabled: !!threadId,
  })
}

export function useSyncEmails() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (days: number) => emailApi.syncEmails(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useSyncStatus(enabled: boolean = false) {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: emailApi.getSyncStatus,
    refetchInterval: enabled ? 3000 : false,
    enabled,
  })
}

export function useReplyEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ threadId, body }: { threadId: string; body: string }) =>
      emailApi.replyEmail(threadId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emailThread', variables.threadId] })
      queryClient.invalidateQueries({ queryKey: ['emails'] })
    },
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: statsApi.getStats,
    refetchInterval: 30000,
  })
}
