"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface QuickRepliesProps {
  replies: Array<{ label: string; value: string }>
  onSelect: (value: string) => void
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
        <span className="text-xs font-medium text-muted-foreground">Respostas rápidas</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <Button
            key={reply.value}
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply.value)}
            className="rounded-full text-xs sm:text-sm hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-105 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {reply.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
