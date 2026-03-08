import { useEffect, useRef } from 'react'
import { ArrowLeft, Paperclip, Download } from 'lucide-react'
import { useEmailThread } from '@/hooks/useEmails'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import AISummary from './AISummary'
import ReplyBox from './ReplyBox'
import DOMPurify from 'dompurify'
import dayjs from 'dayjs'

interface ConversationPanelProps {
  threadId: string
  subject: string
  onBack: () => void
}

export default function ConversationPanel({ threadId, subject, onBack }: ConversationPanelProps) {
  const { data: emails, isLoading } = useEmailThread(threadId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to newest message
  useEffect(() => {
    if (emails && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [emails])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary/50 lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="h-5 w-48 skeleton mb-1" />
            <div className="h-3 w-32 skeleton" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-4 w-32 skeleton mb-2" />
                <div className="h-32 skeleton rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 sm:ml-0 rounded-lg hover:bg-secondary/50 transition-colors md:hidden"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground truncate">{subject}</h2>
          <p className="text-sm text-muted-foreground">
            {emails?.length ?? 0} message{(emails?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* AI Summary */}
      {emails && <AISummary emails={emails} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-3 sm:p-4 space-y-6">
          {emails?.map((email, index) => {
            const senderName = email.sender.split('<')[0].trim()
            const senderEmail = email.sender.match(/<(.+)>/)?.[1] || email.sender

            return (
              <div
                key={email.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Message header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0',
                      getAvatarColor(email.sender)
                    )}
                  >
                    {getInitials(senderName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 truncate">
                        <span className="font-medium text-foreground">{senderName}</span>
                        <span className="text-sm text-muted-foreground ml-2">{senderEmail}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {dayjs(email.date).format('MMM D, YYYY h:mm A')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      to {email.receiver.split('<')[0].trim()}
                    </p>
                  </div>
                </div>

                {/* Message body */}
                <div className="pl-0 sm:pl-[52px]">
                  <div className="overflow-x-auto max-w-full">
                    <div
                      className="prose prose-sm prose-invert max-w-none text-foreground [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline break-words [&_table]:max-w-full [&_table]:text-xs [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(email.body_html || email.body_text, {
                          USE_PROFILES: { html: true },
                        }),
                      }}
                    />
                  </div>

                  {/* Attachments */}
                  {email.has_attachment && email.attachments?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {email.attachments.length} attachment
                        {email.attachments.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {email.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{attachment.file_name}</span>
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                {index < (emails?.length ?? 0) - 1 && (
                  <div className="mt-6 border-t border-border" />
                )}
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply box */}
      <ReplyBox threadId={threadId} />
    </div>
  )
}
