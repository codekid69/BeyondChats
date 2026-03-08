import { useNavigate } from 'react-router'
import { MessageSquare, Mail } from 'lucide-react'
import { useEmails } from '@/hooks/useEmails'
import { useAuth } from '@/context/AuthContext'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function RecentThreads() {
  const navigate = useNavigate()
  const { isConnected } = useAuth()
  const { data: threads, isLoading } = useEmails()

  const recentThreads = threads?.slice(0, 5) ?? []

  const handleThreadClick = (threadId: string) => {
    navigate(`/chats?thread=${threadId}`)
  }

  if (!isConnected) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-fade-up">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Recent Conversations
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No conversations yet</p>
          <p className="text-sm text-muted-foreground">
            Connect Gmail to start syncing
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-up">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Recent Conversations
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-4 w-32 skeleton mb-2" />
                <div className="h-3 w-48 skeleton" />
              </div>
              <div className="h-3 w-12 skeleton" />
            </div>
          ))}
        </div>
      ) : recentThreads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No conversations yet</p>
          <p className="text-sm text-muted-foreground">
            Your synced emails will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentThreads.map((thread, index) => (
            <button
              key={thread.thread_id}
              onClick={() => handleThreadClick(thread.thread_id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-secondary/50 animate-slide-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0',
                  getAvatarColor(thread.sender)
                )}
              >
                {getInitials(thread.sender)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {thread.sender.split('<')[0].trim()}
                  </p>
                  {thread.has_attachment && (
                    <span className="text-xs text-muted-foreground">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground truncate">{thread.subject}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {thread.snippet}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {dayjs(thread.date).fromNow()}
                </span>
                {thread.message_count > 1 && (
                  <span className="text-xs px-1.5 py-0.5 bg-secondary rounded-full text-muted-foreground">
                    {thread.message_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
