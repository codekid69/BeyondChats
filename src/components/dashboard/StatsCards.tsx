import { Mail, MessageSquare, Paperclip, RefreshCw } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useEmails'
import { cn } from '@/lib/utils'

const stats = [
  {
    key: 'total_emails',
    label: 'Total Emails',
    icon: Mail,
    gradient: 'from-indigo-500/20 to-indigo-600/5',
    iconColor: 'text-indigo-400',
  },
  {
    key: 'threads',
    label: 'Threads',
    icon: MessageSquare,
    gradient: 'from-violet-500/20 to-violet-600/5',
    iconColor: 'text-violet-400',
  },
  {
    key: 'attachments',
    label: 'Attachments',
    icon: Paperclip,
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
  },
  {
    key: 'synced',
    label: 'Synced',
    icon: RefreshCw,
    gradient: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-400',
  },
] as const

export default function StatsCards() {
  const { data, isLoading } = useDashboardStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          className={cn(
            'relative overflow-hidden rounded-xl bg-card border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-up',
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-50',
              stat.gradient
            )}
          />
          <div className="relative">
            <div
              className={cn(
                'w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center mb-4',
                stat.iconColor
              )}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            {isLoading ? (
              <>
                <div className="h-8 w-20 skeleton mb-1" />
                <div className="h-4 w-16 skeleton" />
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {data?.[stat.key]?.toLocaleString() ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
