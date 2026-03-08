import { Sparkles } from 'lucide-react'
import type { Email } from '@/types'

interface AISummaryProps {
  emails: Email[]
}

export default function AISummary({ emails }: AISummaryProps) {
  if (emails.length === 0) return null

  const firstEmail = emails[0]
  const senderName = firstEmail.sender.split('<')[0].trim()
  const subject = firstEmail.subject

  // Generate a simple AI summary based on email content
  const generateSummary = () => {
    const emailCount = emails.length
    const hasAttachments = emails.some((e) => e.has_attachment)

    let summary = `Conversation between ${senderName} and you`

    if (subject.toLowerCase().includes('meeting') || subject.toLowerCase().includes('schedule')) {
      summary += ' regarding scheduling and meetings.'
    } else if (subject.toLowerCase().includes('project') || subject.toLowerCase().includes('update')) {
      summary += ' regarding project deliverables.'
    } else if (subject.toLowerCase().includes('question') || subject.toLowerCase().includes('help')) {
      summary += ' regarding questions and assistance.'
    } else {
      summary += ` regarding "${subject}".`
    }

    if (emailCount > 1) {
      summary += ` Contains ${emailCount} messages.`
    }

    if (hasAttachments) {
      summary += ' Includes attachments.'
    }

    return summary
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-accent/5 border border-accent/20">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground">AI Summary</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium uppercase tracking-wide">
              Beta
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            {generateSummary()}
          </p>
        </div>
      </div>
    </div>
  )
}
