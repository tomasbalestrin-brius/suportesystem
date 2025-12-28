import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { EmailWebhookPayload } from "@/lib/integrations/types"
import { processMessage } from "@/lib/ai/sofia"

export async function POST(request: Request) {
  try {
    const payload: EmailWebhookPayload = await request.json()

    console.log("[v0] Email webhook received:", payload)

    const supabase = await createClient()

    // Save webhook payload for processing
    const { data: webhookRecord, error: webhookError } = await supabase
      .from("platform_webhooks")
      .insert({
        platform_type: "email",
        payload: payload as any,
        processed: false,
      })
      .select()
      .single()

    if (webhookError) {
      console.error("[v0] Failed to save webhook:", webhookError)
      return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 })
    }

    // Check if chat exists for this email
    let chatId: string | null = null
    const { data: existingChat } = await supabase
      .from("public_chats")
      .select("id, session_id")
      .eq("visitor_email", payload.from)
      .eq("status", "ativo")
      .single()

    if (existingChat) {
      chatId = existingChat.id
    } else {
      // Create new chat session for this email
      const { data: newChat } = await supabase
        .from("public_chats")
        .insert({
          visitor_email: payload.from,
          status: "ativo",
        })
        .select()
        .single()

      chatId = newChat?.id || null
    }

    // Process email with Sofia
    const messageContent = `Email recebido de ${payload.from}

Assunto: ${payload.subject}

Mensagem:
${payload.body}`

    // Save user message
    if (chatId) {
      await supabase.from("public_chat_messages").insert({
        chat_id: chatId,
        role: "user",
        content: messageContent,
      })
    }

    // Get AI response
    const aiResponse = await processMessage(
      {
        sessionId: existingChat?.session_id || "",
        messageHistory: [],
      },
      messageContent,
    )

    // Mark webhook as processed
    await supabase.from("platform_webhooks").update({ processed: true }).eq("id", webhookRecord.id)

    // Here you would send the response back via email
    // For now, we just log it
    console.log("[v0] AI Response to email:", aiResponse)

    return NextResponse.json({
      success: true,
      response: aiResponse,
    })
  } catch (error) {
    console.error("[v0] Email webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
