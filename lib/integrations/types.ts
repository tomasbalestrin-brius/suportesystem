// Types for external platform integrations

export interface EmailWebhookPayload {
  from: string
  to: string
  subject: string
  body: string
  html?: string
  attachments?: Array<{
    filename: string
    url: string
  }>
  timestamp: string
  messageId: string
}

export interface PaymentWebhookPayload {
  event: "purchase.approved" | "purchase.refunded" | "purchase.cancelled"
  customer: {
    email: string
    name: string
    cpf?: string
  }
  product: {
    id: string
    name: string
  }
  transaction: {
    id: string
    amount: number
    currency: string
    status: string
  }
  platform: "hotmart" | "pagtrust"
  timestamp: string
}

export interface MemberAccessWebhookPayload {
  event: "access.created" | "access.updated" | "access.expired"
  customer: {
    email: string
    name: string
  }
  access: {
    product_id: string
    product_name: string
    status: "active" | "inactive" | "expired"
    expiration_date?: string
  }
  timestamp: string
}

export interface IntegrationResponse {
  success: boolean
  data?: any
  error?: string
}
