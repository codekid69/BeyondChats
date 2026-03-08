import { useNavigate } from 'react-router'
import { Plug, RefreshCw, MessageSquare, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useConnectGmail } from '@/hooks/useAuth'
import { useSyncEmails } from '@/hooks/useEmails'
import { toast } from 'sonner'

export default function QuickActions() {
  const navigate = useNavigate()
  const { isConnected } = useAuth()
  const connectGmail = useConnectGmail()
  const syncEmails = useSyncEmails()

  const handleSync = () => {
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

  const actions = [
    {
      icon: Plug,
      title: 'Connect Workspace',
      description: 'Link your Gmail account to start syncing',
      action: () => connectGmail.mutate(),
      disabled: isConnected || connectGmail.isPending,
      buttonText: isConnected ? 'Connected' : 'Connect',
      variant: 'primary' as const,
    },
    {
      icon: RefreshCw,
      title: 'Force Sync',
      description: 'Manually sync your latest emails',
      action: handleSync,
      disabled: !isConnected || syncEmails.isPending,
      buttonText: syncEmails.isPending ? 'Syncing...' : 'Sync Now',
      variant: 'secondary' as const,
    },
    {
      icon: MessageSquare,
      title: 'View Chats',
      description: 'Browse and manage your conversations',
      action: () => navigate('/chats'),
      disabled: false,
      buttonText: 'Open Chats',
      variant: 'secondary' as const,
    },
  ]

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        Quick Actions
      </h3>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={action.title}
            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 transition-all duration-200 hover:bg-secondary/50 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary flex-shrink-0">
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <button
              onClick={action.action}
              disabled={action.disabled}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-shrink-0 ${
                action.variant === 'primary'
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-50'
              }`}
            >
              {action.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
