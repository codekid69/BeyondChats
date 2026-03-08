import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { MessageSquare, Mail } from 'lucide-react'
import ThreadList from '@/components/chat/ThreadList'
import ConversationPanel from '@/components/chat/ConversationPanel'
import { useAuth } from '@/context/AuthContext'
import { useConnectGmail } from '@/hooks/useAuth'
import type { EmailThread } from '@/types'

export default function Chats() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null)
  const { isConnected, isLoading } = useAuth()
  const connectGmail = useConnectGmail()

  // Handle thread selection from URL
  const threadIdFromUrl = searchParams.get('thread')

  useEffect(() => {
    if (threadIdFromUrl && !selectedThread) {
      // Thread will be selected when data loads
    }
  }, [threadIdFromUrl, selectedThread])

  const handleSelectThread = (thread: EmailThread) => {
    setSelectedThread(thread)
    setSearchParams({ thread: thread.thread_id })
  }

  const handleBack = () => {
    setSelectedThread(null)
    setSearchParams({})
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-8rem)] min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="h-[calc(100dvh-8rem)] min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-up px-4">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Connect your Gmail</h2>
          <p className="text-muted-foreground mb-6">
            Connect your Gmail account to start managing your email conversations with AI-powered features.
          </p>
          <button
            onClick={() => connectGmail.mutate()}
            disabled={connectGmail.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {connectGmail.isPending ? 'Connecting...' : 'Connect Gmail'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100vh-8rem)] min-h-[400px] flex flex-col md:flex-row rounded-xl overflow-hidden border border-border bg-card">
      {/* Thread list - hidden on mobile when thread selected */}
      <div
        className={`w-full md:w-[320px] lg:w-[360px] flex-shrink-0 border-r border-border h-full min-h-0 ${selectedThread ? 'hidden md:flex flex-col' : 'flex flex-col'
          }`}
      >
        <ThreadList
          selectedThreadId={selectedThread?.thread_id ?? threadIdFromUrl}
          onSelectThread={handleSelectThread}
        />
      </div>

      {/* Conversation panel */}
      <div
        className={`flex-1 min-w-0 min-h-0 ${selectedThread ? 'flex flex-col' : 'hidden md:flex flex-col'}`}
      >
        {selectedThread ? (
          <ConversationPanel
            threadId={selectedThread.thread_id}
            subject={selectedThread.subject}
            onBack={handleBack}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a thread from the list to view the conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
