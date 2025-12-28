export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      public_chats: {
        Row: {
          id: string
          session_id: string
          visitor_name: string | null
          visitor_email: string | null
          visitor_cpf: string | null
          status: "ativo" | "finalizado"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id?: string
          visitor_name?: string | null
          visitor_email?: string | null
          visitor_cpf?: string | null
          status?: "ativo" | "finalizado"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          visitor_name?: string | null
          visitor_email?: string | null
          visitor_cpf?: string | null
          status?: "ativo" | "finalizado"
          created_at?: string
          updated_at?: string
        }
      }
      public_chat_messages: {
        Row: {
          id: string
          chat_id: string
          role: "user" | "assistant" | "system"
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: "user" | "assistant" | "system"
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          role?: "user" | "assistant" | "system"
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_number: string
          chat_id: string | null
          customer_id: string | null
          customer_email: string
          customer_name: string
          customer_cpf: string | null
          subject: string
          category: "acesso" | "compra" | "tecnico" | "financeiro" | "outros"
          priority: "baixa" | "media" | "alta" | "urgente"
          status: "novo" | "em_analise" | "resolvido_ia" | "aguardando_humano" | "em_atendimento" | "fechado"
          ai_analysis: Json
          ai_resolution: Json
          requires_human: boolean
          assigned_to: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number: string
          chat_id?: string | null
          customer_id?: string | null
          customer_email: string
          customer_name: string
          customer_cpf?: string | null
          subject: string
          category: "acesso" | "compra" | "tecnico" | "financeiro" | "outros"
          priority?: "baixa" | "media" | "alta" | "urgente"
          status?: "novo" | "em_analise" | "resolvido_ia" | "aguardando_humano" | "em_atendimento" | "fechado"
          ai_analysis?: Json
          ai_resolution?: Json
          requires_human?: boolean
          assigned_to?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          chat_id?: string | null
          customer_id?: string | null
          customer_email?: string
          customer_name?: string
          customer_cpf?: string | null
          subject?: string
          category?: "acesso" | "compra" | "tecnico" | "financeiro" | "outros"
          priority?: "baixa" | "media" | "alta" | "urgente"
          status?: "novo" | "em_analise" | "resolvido_ia" | "aguardando_humano" | "em_atendimento" | "fechado"
          ai_analysis?: Json
          ai_resolution?: Json
          requires_human?: boolean
          assigned_to?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          category: string
          title: string
          question: string
          answer: string
          keywords: string[]
          usage_count: number
          effectiveness_score: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          question: string
          answer: string
          keywords?: string[]
          usage_count?: number
          effectiveness_score?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          question?: string
          answer?: string
          keywords?: string[]
          usage_count?: number
          effectiveness_score?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
