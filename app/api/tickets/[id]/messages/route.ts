import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { ticketMessageSchema } from "@/lib/validations/schemas"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase, session } = authResult
  const { id: ticketId } = await params

  const body = await request.json()
  const validation = ticketMessageSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ error: "Dados inválidos", details: validation.error.errors }, { status: 400 })
  }

  const { data: message, error } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      ...validation.data,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Atualiza o timestamp do ticket
  await supabase.from("tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticketId)

  return NextResponse.json({ message })
}
