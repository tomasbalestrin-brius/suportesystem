import { z } from "zod"

// Chat schemas
export const chatMessageSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(5000),
})

export const initChatSchema = z.object({
  visitorName: z.string().optional(),
  visitorEmail: z.string().email().optional(),
})

// Ticket schemas
export const createTicketSchema = z.object({
  customer_email: z.string().email(),
  customer_name: z.string().min(1),
  subject: z.string().min(1),
  category: z.enum(["acesso", "compra", "tecnico", "outros"]),
  priority: z.enum(["baixa", "media", "alta", "urgente"]),
  requires_human: z.boolean().default(false),
})

export const updateTicketSchema = z.object({
  status: z.enum(["novo", "em_analise", "resolvido", "aguardando_humano", "fechado"]).optional(),
  priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
})

export const ticketMessageSchema = z.object({
  content: z.string().min(1),
  sender_type: z.enum(["customer", "ai", "admin"]),
  sender_name: z.string(),
})

// Webhook schemas
export const emailWebhookSchema = z.object({
  from: z.string().email(),
  subject: z.string(),
  body: z.string(),
  timestamp: z.string().datetime(),
})

export const paymentWebhookSchema = z.object({
  customer_email: z.string().email(),
  product_id: z.string(),
  transaction_id: z.string(),
  status: z.enum(["pending", "approved", "rejected", "refunded"]),
  amount: z.number().positive(),
})

export const memberWebhookSchema = z.object({
  customer_email: z.string().email(),
  access_level: z.string(),
  courses: z.array(z.string()),
  expiration_date: z.string().datetime().nullable(),
})

// Knowledge base schemas
export const knowledgeBaseSchema = z.object({
  category: z.string(),
  title: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  keywords: z.array(z.string()),
})
