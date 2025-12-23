"use client"

import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { ChatInput } from "./chat-input"
import { QuickReplies } from "./quick-replies"
import type { Message, QuickReply } from "@/lib/types/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare } from "lucide-react"

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => Promise<void>
  isTyping?: boolean
  quickReplies?: QuickReply[]
}

export function ChatInterface({ messages, onSendMessage, isTyping, quickReplies = [] }: ChatInterfaceProps) {
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (message: string) => {
    setIsSending(true)
    try {
      await onSendMessage(message)
    } finally {
      setIsSending(false)
    }
  }

  const handleQuickReply = (value: string) => {
    handleSend(value)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 sm:px-6 py-6" ref={scrollRef}>
        {messages.length === 0 && !isTyping ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in fade-in duration-700">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center mb-4 shadow-lg">
              <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Olá! Como posso ajudar?</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Envie uma mensagem para começar nossa conversa. Estou aqui para responder suas dúvidas!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>

      {/* Quick Replies */}
      {quickReplies.length > 0 && !isTyping && (
        <div className="px-4 sm:px-6 pb-3">
          <QuickReplies replies={quickReplies} onSelect={handleQuickReply} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
        <ChatInput onSend={handleSend} disabled={isSending || isTyping} />
      </div>
    </div>
  )
}
