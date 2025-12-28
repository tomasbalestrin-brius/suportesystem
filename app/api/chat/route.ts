import { NextResponse } from "next/server"
import { processMessage } from "@/lib/ai/sofia"

export async function POST(request: Request) {
  try {
    const { sessionId, message, messageHistory } = await request.json()

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Session ID and message required" }, { status: 400 })
    }

    const response = await processMessage(
      {
        sessionId,
        messageHistory: messageHistory || [],
      },
      message,
    )

    return NextResponse.json({ response })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
