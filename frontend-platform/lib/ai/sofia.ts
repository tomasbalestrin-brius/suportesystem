import { generateText } from "ai"
import { SOFIA_SYSTEM_PROMPT } from "./prompts"
import { sofiaTools } from "./tools"
import { createClient } from "@/lib/supabase/server"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatContext {
  sessionId: string
  messageHistory: Message[]
  customerData?: {
    name?: string
    email?: string
    cpf?: string
  }
}

export async function processMessage(context: ChatContext, userMessage: string): Promise<string> {
  const supabase = await createClient()

  // Save user message to database
  const { data: chatData } = await supabase
    .from("public_chats")
    .select("id")
    .eq("session_id", context.sessionId)
    .single()

  if (chatData) {
    await supabase.from("public_chat_messages").insert({
      chat_id: chatData.id,
      role: "user",
      content: userMessage,
    })
  }

  // Prepare messages for AI
  const messages = [
    { role: "system" as const, content: SOFIA_SYSTEM_PROMPT },
    ...context.messageHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ]

  try {
    const result = await generateText({
      model: "openai/gpt-4o",
      messages,
      tools: sofiaTools,
      maxSteps: 5, // Allow multiple tool calls
      onStepFinish: async (step) => {
        // Log tool calls for debugging
        if (step.toolCalls && step.toolCalls.length > 0) {
          console.log("[v0] Sofia tool calls:", JSON.stringify(step.toolCalls, null, 2))
        }
      },
    })

    // Save assistant response to database
    if (chatData) {
      await supabase.from("public_chat_messages").insert({
        chat_id: chatData.id,
        role: "assistant",
        content: result.text,
        metadata: {
          toolCalls: result.steps?.flatMap((step) => step.toolCalls || []),
        },
      })
    }

    return result.text
  } catch (error) {
    console.error("[v0] Sofia AI error:", error)
    return "Desculpe, tive um problema técnico. Pode tentar novamente em alguns instantes?"
  }
}

// Tool implementations
export async function executeToolCall(toolName: string, args: any): Promise<any> {
  console.log(`[v0] Executing tool: ${toolName}`, args)

  switch (toolName) {
    case "search_knowledge_base":
      return await searchKnowledgeBase(args.keywords, args.category)

    case "check_customer_exists":
      return await checkCustomerExists(args.email)

    case "verify_purchase":
      return await verifyPurchase(args.email, args.product)

    case "check_member_access":
      return await checkMemberAccess(args.email)

    case "create_ticket":
      return await createTicket(args)

    case "escalate_to_human":
      return await escalateToHuman(args)

    case "extract_customer_data":
      return await extractCustomerData(args.message)

    default:
      return { error: "Tool not found" }
  }
}

async function searchKnowledgeBase(keywords: string[], category?: string) {
  const supabase = await createClient()

  let query = supabase.from("knowledge_base").select("*").eq("is_active", true)

  if (category) {
    query = query.eq("category", category)
  }

  // Search by keywords
  if (keywords.length > 0) {
    query = query.overlaps("keywords", keywords)
  }

  const { data, error } = await query.limit(5)

  if (error) {
    console.error("[v0] Knowledge base search error:", error)
    return { found: false, results: [] }
  }

  return { found: data.length > 0, results: data }
}

async function checkCustomerExists(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("customers").select("*").eq("email", email).single()

  if (error || !data) {
    return { exists: false }
  }

  return {
    exists: true,
    customer: {
      name: data.name,
      email: data.email,
      purchase_status: data.purchase_status,
      access_status: data.access_status,
    },
  }
}

async function verifyPurchase(email: string, product?: string) {
  // TODO: Integração com plataforma de compras
  // Por enquanto, retorna placeholder
  return {
    hasPurchase: false,
    message: "Integração com plataforma de compras em desenvolvimento",
  }
}

async function checkMemberAccess(email: string) {
  // TODO: Integração com área de membros
  // Por enquanto, retorna placeholder
  return {
    hasAccess: false,
    message: "Integração com área de membros em desenvolvimento",
  }
}

async function createTicket(args: any) {
  const supabase = await createClient()

  // Generate ticket number
  const { data: ticketNumberData } = await supabase.rpc("generate_ticket_number")

  const ticketData = {
    ticket_number: ticketNumberData,
    customer_email: args.customer_email,
    customer_name: args.customer_name,
    customer_cpf: args.customer_cpf || null,
    subject: args.subject,
    category: args.category,
    priority: args.priority,
    status: args.resolved ? "resolvido_ia" : "aguardando_humano",
    requires_human: !args.resolved,
    ai_resolution: {
      summary: args.resolution_summary,
      timestamp: new Date().toISOString(),
    },
  }

  const { data, error } = await supabase.from("tickets").insert(ticketData).select().single()

  if (error) {
    console.error("[v0] Create ticket error:", error)
    return { success: false, error: error.message }
  }

  // If requires human, create notification
  if (!args.resolved) {
    await supabase.from("admin_notifications").insert({
      ticket_id: data.id,
      type: "novo_ticket",
      title: `Novo ticket: ${args.subject}`,
      message: `Cliente ${args.customer_name} precisa de atendimento humano`,
    })
  }

  return { success: true, ticket_number: ticketNumberData }
}

async function escalateToHuman(args: any) {
  // This will be called before create_ticket with requires_human=true
  return {
    escalated: true,
    message: "Atendimento será transferido para equipe humana",
    urgency: args.urgency,
  }
}

async function extractCustomerData(message: string) {
  // Simple extraction logic
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  const cpfRegex = /(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/

  const emailMatch = message.match(emailRegex)
  const cpfMatch = message.match(cpfRegex)

  return {
    email: emailMatch ? emailMatch[0] : null,
    cpf: cpfMatch ? cpfMatch[0] : null,
    // Nome precisa ser extraído de forma mais inteligente
    extracted: !!(emailMatch || cpfMatch),
  }
}
