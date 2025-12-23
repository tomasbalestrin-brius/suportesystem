"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip } from "lucide-react"
import { useState, type KeyboardEvent } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = "Digite sua mensagem..." }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative">
      <div
        className={`flex gap-2 items-end p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-lg shadow-purple-100 dark:shadow-purple-900/20"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        }`}
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base px-0"
          rows={1}
        />
        <div className="flex gap-1.5 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 mt-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
        {message.length > 0 && (
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{message.length} caracteres</span>
        )}
      </div>
    </div>
  )
}
