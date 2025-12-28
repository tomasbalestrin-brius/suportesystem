"use client"

import { cn } from "@/lib/utils"
import { Bot, User, CheckCheck } from "lucide-react"
import { useState, useEffect } from "react"

interface MessageBubbleProps {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user"
  const isSystem = role === "system"
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isSystem) return null

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 mb-4 transition-all duration-500",
        isUser && "flex-row-reverse",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110",
          isUser
            ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
            : "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all hover:shadow-md",
            isUser
              ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-md"
              : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 text-foreground rounded-tl-md border border-gray-200 dark:border-gray-700",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>

        {timestamp && (
          <div className={cn("flex items-center gap-1.5 px-2", isUser && "flex-row-reverse")}>
            <span className="text-[11px] text-muted-foreground font-medium">
              {new Date(timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isUser && <CheckCheck className="h-3 w-3 text-purple-600 dark:text-purple-400" />}
          </div>
        )}
      </div>
    </div>
  )
}
