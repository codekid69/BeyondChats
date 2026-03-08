import { Menu, RefreshCw } from 'lucide-react'
import { useSyncEmails, useDashboardStats, useSyncStatus } from '@/hooks/useEmails'
import { useAuth } from '@/context/AuthContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { toast } from 'sonner'

dayjs.extend(relativeTime)

interface HeaderProps {
  title: string
  description?: string
  onMenuClick: () => void
}

export default function Header({ title, description, onMenuClick }: HeaderProps) {
  const { isConnected } = useAuth()
  const syncEmails = useSyncEmails()
  const { data: stats } = useDashboardStats()
  const { data: syncStatus } = useSyncStatus(isConnected)

  const isSyncing = syncEmails.isPending || syncStatus?.status === 'syncing'
  const lastSyncTime = syncStatus?.last_sync || syncStatus?.completed_at

  const syncedCount = syncStatus?.synced_count ?? 0
  const totalMessages = syncStatus?.total_messages ?? 0
  const syncProgress = totalMessages > 0 ? Math.min(100, Math.round((syncedCount / totalMessages) * 100)) : 0

  const handleSync = () => {
    if (isSyncing) return

    syncEmails.mutate(7, {
      onSuccess: () => {
        toast.success('Sync started', {
          description: 'Your emails are being synced in the background.',
        })
      },
      onError: () => {
        toast.error('Sync failed', {
          description: 'Failed to start email sync. Please try again.',
        })
      },
    })
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px] lg:max-w-none">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate max-w-[200px] lg:max-w-none">{description}</p>
            )}
          </div>
        </div>

        {/* Middle: Desktop Sync Progress Banner */}
        {isConnected && isSyncing && (
          <div className="hidden md:flex flex-1 max-w-md mx-6 items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl animate-fade-down duration-300">
            <RefreshCw className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-xs text-primary font-medium truncate">Syncing emails...</span>
                <span className="text-[10px] text-primary whitespace-nowrap font-medium">
                  {totalMessages > 0 ? `${syncedCount.toLocaleString()} / ${totalMessages.toLocaleString()}` : ''}
                </span>
              </div>
              {totalMessages > 0 && (
                <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isConnected && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {stats && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-primary animate-pulse' : 'bg-success'}`} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {isSyncing
                    ? 'Syncing...'
                    : lastSyncTime
                      ? `Synced ${dayjs(lastSyncTime).fromNow()}`
                      : stats.synced > 0
                        ? 'Synced recently'
                        : 'Never synced'}
                </span>
              </div>
            )}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              title={isSyncing ? 'A sync is already in progress' : undefined}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline whitespace-nowrap">
                {isSyncing ? 'Syncing...' : 'Sync'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile/Tablet Sync Progress Banner */}
      {isConnected && isSyncing && (
        <div className="md:hidden px-4 pb-3 animate-fade-down duration-200">
          <div className="flex items-center gap-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            <RefreshCw className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-xs text-primary font-medium truncate">Syncing emails...</span>
                <span className="text-[10px] text-primary whitespace-nowrap font-medium">
                  {totalMessages > 0 ? `${syncedCount.toLocaleString()} / ${totalMessages.toLocaleString()}` : ''}
                </span>
              </div>
              {totalMessages > 0 && (
                <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
