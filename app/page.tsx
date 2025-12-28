"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import type { Message } from "@/lib/types/chat"
import { getOrCreateSessionId } from "@/lib/utils/session"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Initialize session
    const id = getOrCreateSessionId()
    setSessionId(id)

    initializeChat(id)
  }, [])

  const initializeChat = async (sessionId: string) => {
    try {
      const response = await fetch("/api/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.welcomeMessage) {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.welcomeMessage,
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error)
    }
  }

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: content,
          messageHistory: messages,
        }),
      })

      const data = await response.json()

      if (data.response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const logoSrc = !mounted
    ? "/images/logo-bethel-preto.jpg"
    : resolvedTheme === "dark"
      ? "/images/logo-bethel-branco.png"
      : "/images/logo-bethel-preto.jpg"

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-purple-100/50 dark:border-purple-900/30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative h-8 sm:h-10 w-32 sm:w-40">
              <Image src={logoSrc || "/placeholder.svg"} alt="Bethel" fill className="object-contain" priority />
            </div>
            <div className="h-6 w-px bg-purple-200 dark:bg-purple-800" />
            <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Central de Suporte
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">IA Ativa</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container mx-auto max-w-5xl py-4 sm:py-8 px-3 sm:px-4 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-purple-100/50 dark:border-purple-900/30 flex flex-col h-full overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Chat Header */}
          <div className="border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-20" />
            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="relative">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl border-2 border-white/30 shadow-lg">
                  👋
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg sm:text-xl">Sofia</h2>
                <p className="text-xs sm:text-sm text-white/90 font-medium">Assistente Virtual da Bethel</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30 shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                  <span className="font-medium">Online</span>
                </div>
                <span className="text-[10px] text-white/70">Resposta instantânea</span>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          <p className="text-center">Estou aqui para ajudar! Respondo em instantes.</p>
        </div>
      </main>

      <PWAInstallPrompt />
    </div>
  )
}
