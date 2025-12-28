export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface ChatSession {
  sessionId: string
  messages: Message[]
  visitorName?: string
  visitorEmail?: string
  visitorCpf?: string
}

export interface QuickReply {
  label: string
  value: string
}
