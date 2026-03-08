import { useState } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { useSyncEmails } from '@/hooks/useEmails'
import { toast } from 'sonner'

const syncOptions = [
  {
    days: 7,
    label: '7 days',
    description: 'Sync emails from the last week',
    icon: Clock,
  },
  {
    days: 15,
    label: '15 days',
    description: 'Sync emails from the last two weeks',
    icon: Calendar,
  },
  {
    days: 30,
    label: '30 days',
    description: 'Sync emails from the last month',
    icon: Calendar,
  },
]

interface SyncModalProps {
  isOpen: boolean
  onClose: () => void
  isSyncing: boolean          // derived from parent's live status polling
  synced_count?: number
  total_messages?: number
}

export default function SyncModal({ isOpen, onClose, isSyncing, synced_count = 0, total_messages = 0 }: SyncModalProps) {
  const [selectedDays, setSelectedDays] = useState(7)
  const syncEmails = useSyncEmails()

  const handleSync = () => {
    syncEmails.mutate(selectedDays, {
      onSuccess: () => {
        toast.success('Sync started', {
          description: `Syncing emails from the last ${selectedDays} days…`,
        })
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Could not start the sync. Please try again.'
        toast.error('Failed to start sync', { description: msg })
      },
    })
  }

  const progress =
    total_messages > 0 ? Math.min(100, Math.round((synced_count / total_messages) * 100)) : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — always dismissible */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — slides up from bottom on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-md bg-card border border-border sm:rounded-2xl rounded-t-2xl shadow-xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:p-6 border-b border-border">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Sync Emails</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {isSyncing ? 'Sync in progress — you can close this window' : 'Choose how far back to sync your emails'}
            </p>
          </div>
          {/* X always visible */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 sm:p-6">
          {isSyncing ? (
            <div className="space-y-5">
              {/* Animated circular progress — smaller on mobile */}
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48" cy="48" r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-secondary"
                    />
                    <circle
                      cx="48" cy="48" r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      className="text-primary transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base sm:text-lg font-bold text-foreground">{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-foreground font-medium">Syncing your emails…</p>
                <p className="text-sm text-muted-foreground">
                  {total_messages > 0
                    ? `${synced_count.toLocaleString()} of ${total_messages.toLocaleString()} emails`
                    : 'Connecting to Gmail, please wait…'}
                </p>
              </div>

              {/* Linear bar */}
              {total_messages > 0 && (
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                <p className="text-xs text-primary">
                  ✓ Sync running in the background — feel free to close this window
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {syncOptions.map((option) => (
                <button
                  key={option.days}
                  onClick={() => setSelectedDays(option.days)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedDays === option.days
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDays === option.days
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/50 text-muted-foreground'
                      }`}
                  >
                    <option.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDays === option.days ? 'border-primary' : 'border-muted-foreground/30'
                      }`}
                  >
                    {selectedDays === option.days && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSyncing && (
          <div className="flex items-center gap-3 px-5 py-4 sm:p-6 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-sm sm:text-base font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSync}
              disabled={syncEmails.isPending}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm sm:text-base font-medium transition-colors disabled:opacity-50"
            >
              {syncEmails.isPending ? 'Starting…' : `Sync ${selectedDays}d`}
            </button>
          </div>
        )}

        {isSyncing && (
          <div className="flex px-5 py-4 sm:p-6 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 sm:py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-sm sm:text-base font-medium transition-colors"
            >
              Close &amp; Continue in Background
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
