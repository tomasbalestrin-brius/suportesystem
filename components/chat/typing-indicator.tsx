"use client"

import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-md animate-pulse">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-[75%]">
        <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-1.5 items-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce"></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-medium">Sofia está digitando</span>
          </div>
        </div>
      </div>
    </div>
  )
}
