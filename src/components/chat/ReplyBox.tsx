import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { useReplyEmail } from '@/hooks/useEmails'
import { toast } from 'sonner'
import type { AISuggestion } from '@/types'

interface ReplyBoxProps {
  threadId: string
}

const suggestions: AISuggestion[] = [
  { text: 'Thanks, I will take a look', type: 'positive' },
  { text: 'Could you provide more details?', type: 'neutral' },
  { text: "Let's schedule a quick call", type: 'action' },
]

export default function ReplyBox({ threadId }: ReplyBoxProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const replyEmail = useReplyEmail()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (!message.trim() || replyEmail.isPending) return

    replyEmail.mutate(
      { threadId, body: message },
      {
        onSuccess: () => {
          setMessage('')
          toast.success('Reply sent', {
            description: 'Your message has been sent successfully.',
          })
        },
        onError: () => {
          toast.error('Failed to send', {
            description: 'Could not send your reply. Please try again.',
          })
        },
      }
    )
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (text: string) => {
    setMessage(text)
    textareaRef.current?.focus()
  }

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-3 sm:p-4">
      {/* Suggestions */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => handleSuggestionClick(suggestion.text)}
            className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {suggestion.text}
          </button>
        ))}
      </div>

      {/* Reply form */}
      <div className="flex items-end gap-2 sm:gap-3">
        <div className="flex-1 min-w-0 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply..."
            rows={1}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            className="p-2.5 sm:p-3 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || replyEmail.isPending}
            className="p-2.5 sm:p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
