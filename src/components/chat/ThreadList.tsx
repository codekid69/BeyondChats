import { useState } from 'react'
import { Search, Paperclip, Mail } from 'lucide-react'
import { useEmails } from '@/hooks/useEmails'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import type { EmailThread } from '@/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface ThreadListProps {
  selectedThreadId: string | null
  onSelectThread: (thread: EmailThread) => void
}

export default function ThreadList({ selectedThreadId, onSelectThread }: ThreadListProps) {
  const [search, setSearch] = useState('')
  const { data: threads, isLoading } = useEmails()

  const filteredThreads = threads?.filter(
    (thread) =>
      thread.subject.toLowerCase().includes(search.toLowerCase()) ||
      thread.sender.toLowerCase().includes(search.toLowerCase()) ||
      thread.snippet.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="h-10 skeleton rounded-xl" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-4 w-24 skeleton mb-2" />
                <div className="h-3 w-full skeleton mb-1" />
                <div className="h-3 w-3/4 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {search ? 'No matching conversations' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredThreads.map((thread, index) => (
              <button
                key={thread.thread_id}
                onClick={() => onSelectThread(thread)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 animate-slide-in',
                  selectedThreadId === thread.thread_id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-secondary/50 border border-transparent'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
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
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {thread.sender.split('<')[0].trim()}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {dayjs(thread.date).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm text-foreground truncate">{thread.subject}</p>
                    {thread.has_attachment && (
                      <Paperclip className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{thread.snippet}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {thread.message_count > 1 && (
                      <span className="text-xs px-1.5 py-0.5 bg-secondary rounded-full text-muted-foreground">
                        {thread.message_count} messages
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
