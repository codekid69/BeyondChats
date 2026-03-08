import { useState, useEffect, useRef } from 'react'
import { Check, Settings, Unlink, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useConnectGmail, useDisconnectGmail } from '@/hooks/useAuth'
import { useSyncStatus } from '@/hooks/useEmails'
import { useQueryClient } from '@tanstack/react-query'
import SyncModal from '@/components/ui/SyncModal'
import { toast } from 'sonner'

export default function Integrations() {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const { user, isConnected, isLoading } = useAuth()
  const connectGmail = useConnectGmail()
  const disconnectGmail = useDisconnectGmail()
  const queryClient = useQueryClient()

  // Always poll sync status when connected (every 3 s).
  const { data: syncStatus } = useSyncStatus(isConnected)
  const isSyncing = syncStatus?.status === 'syncing'

  // Fire completion / error toasts from the page level so they survive modal dismissal.
  const prevStatus = useRef<string | undefined>(undefined)
  useEffect(() => {
    const status = syncStatus?.status
    if (!status || status === prevStatus.current) return
    prevStatus.current = status

    if (status === 'completed') {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Sync complete!', {
        description: syncStatus?.message || `Successfully synced ${syncStatus?.synced_count ?? 0} emails.`,
      })
      setIsSyncModalOpen(false)
    } else if (status === 'error') {
      toast.error('Sync failed', {
        description: syncStatus?.message ?? 'An error occurred. Please try again.',
      })
    }
  }, [syncStatus?.status, syncStatus?.synced_count, syncStatus?.message, queryClient])

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your Gmail account?')) {
      disconnectGmail.mutate(undefined, {
        onSuccess: () =>
          toast.success('Disconnected', { description: 'Your Gmail account has been disconnected.' }),
        onError: () =>
          toast.error('Failed to disconnect', { description: 'Please try again.' }),
      })
    }
  }

  const syncedCount = syncStatus?.synced_count ?? 0
  const totalMessages = syncStatus?.total_messages ?? 0
  const syncProgress = totalMessages > 0 ? Math.min(100, Math.round((syncedCount / totalMessages) * 100)) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Gmail Integration Card */}
      <div className="rounded-xl bg-card border border-border overflow-hidden animate-fade-up">

        {/* Card body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">

            {/* Google logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                  Google Workspace
                </h3>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full whitespace-nowrap">
                    <Check className="h-3 w-3" />
                    Connected
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                Connect your Gmail account to sync and manage your email conversations
              </p>

              {isConnected && user && (
                <p className="mt-2 text-xs sm:text-sm text-foreground">
                  Connected as{' '}
                  <span className="font-semibold break-all">{user.email}</span>
                </p>
              )}

            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 sm:px-6 sm:py-4 bg-secondary/20 border-t border-border">
          {isLoading ? (
            <>
              <div className="h-9 w-full sm:w-32 skeleton rounded-xl" />
              <div className="h-9 w-full sm:w-28 skeleton rounded-xl" />
            </>
          ) : isConnected ? (
            <>
              <button
                onClick={() => setIsSyncModalOpen(true)}
                disabled={isSyncing}
                title={isSyncing ? 'A sync is already in progress' : undefined}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSyncing
                  ? <RefreshCw className="h-4 w-4 animate-spin flex-shrink-0" />
                  : <Settings className="h-4 w-4 flex-shrink-0" />}
                <span className="whitespace-nowrap">
                  {isSyncing ? `Syncing… ${syncProgress}%` : 'Configure Sync'}
                </span>
              </button>

              <button
                onClick={handleDisconnect}
                disabled={disconnectGmail.isPending || isSyncing}
                title={isSyncing ? 'Cannot disconnect while syncing' : undefined}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Unlink className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {disconnectGmail.isPending ? 'Disconnecting…' : 'Disconnect'}
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => connectGmail.mutate()}
              disabled={connectGmail.isPending}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {connectGmail.isPending ? 'Connecting…' : 'Connect Google'}
            </button>
          )}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="rounded-xl bg-card border border-border p-5 sm:p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">More Integrations Coming Soon</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {['Outlook', 'Slack', 'Notion', 'Discord'].map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border/50"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground font-medium text-sm">
                {name[0]}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isSyncing={isSyncing}
        synced_count={syncStatus?.synced_count}
        total_messages={syncStatus?.total_messages}
      />
    </div>
  )
}
