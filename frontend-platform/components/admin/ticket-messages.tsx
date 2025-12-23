import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bot, UserIcon, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender_type: "customer" | "ai" | "admin"
  sender_name: string
  content: string
  created_at: string
}

interface TicketMessagesProps {
  messages: Message[]
}

export function TicketMessages({ messages }: TicketMessagesProps) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhuma mensagem ainda</p>
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCustomer = message.sender_type === "customer"
        const isAI = message.sender_type === "ai"
        const isAdmin = message.sender_type === "admin"

        return (
          <div key={message.id} className={cn("flex gap-3", isCustomer && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                isCustomer && "bg-primary text-primary-foreground",
                isAI && "bg-purple-100 text-purple-600",
                isAdmin && "bg-green-100 text-green-600",
              )}
            >
              {isCustomer && <UserIcon className="h-4 w-4" />}
              {isAI && <Bot className="h-4 w-4" />}
              {isAdmin && <ShieldCheck className="h-4 w-4" />}
            </div>

            <div className={cn("flex flex-col gap-1 max-w-[80%]", isCustomer && "items-end")}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{message.sender_name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  isCustomer
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
