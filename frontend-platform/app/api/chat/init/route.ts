import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getWelcomeMessage } from "@/lib/ai/prompts"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    console.log("[v0] Init chat request with sessionId:", sessionId)

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    console.log("[v0] Testing Supabase connection...")
    const { data: testData, error: testError } = await supabase.from("public_chats").select("count").limit(1)

    if (testError) {
      console.error("[v0] Supabase connection test failed:", testError)
      // Return welcome message without DB if tables don't exist yet
      return NextResponse.json({
        welcomeMessage: getWelcomeMessage(),
        warning: "Database tables not ready. Please ensure SQL script was executed.",
      })
    }

    console.log("[v0] Supabase connection successful")

    // Check if chat already exists
    const { data: existingChat } = await supabase.from("public_chats").select("*").eq("session_id", sessionId).single()

    if (existingChat) {
      console.log("[v0] Found existing chat:", existingChat.id)
      const { data: messages } = await supabase
        .from("public_chat_messages")
        .select("*")
        .eq("chat_id", existingChat.id)
        .order("created_at", { ascending: true })
        .limit(1)

      return NextResponse.json({
        welcomeMessage: messages?.[0]?.content || getWelcomeMessage(),
      })
    }

    console.log("[v0] Creating new chat for session:", sessionId)
    const { data: newChat, error } = await supabase
      .from("public_chats")
      .insert({
        session_id: sessionId,
        status: "ativo",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Create chat error:", error)
      return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
    }

    console.log("[v0] Chat created successfully:", newChat.id)

    // Add welcome message
    const welcomeMsg = getWelcomeMessage()

    await supabase.from("public_chat_messages").insert({
      chat_id: newChat.id,
      role: "assistant",
      content: welcomeMsg,
    })

    console.log("[v0] Welcome message added")

    return NextResponse.json({ welcomeMessage: welcomeMsg })
  } catch (error) {
    console.error("[v0] Chat init error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
