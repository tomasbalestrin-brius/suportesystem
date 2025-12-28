import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { updateTicketSchema } from "@/lib/validations/schemas"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult
  const { id } = await params

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(`
      *,
      ticket_messages (
        id,
        sender_type,
        sender_name,
        content,
        attachments,
        created_at
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!ticket) {
    return NextResponse.json({ error: "Ticket não encontrado" }, { status: 404 })
  }

  return NextResponse.json({ ticket })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase, session } = authResult
  const { id } = await params

  const body = await request.json()
  const validation = updateTicketSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ error: "Dados inválidos", details: validation.error.errors }, { status: 400 })
  }

  const { data: ticket, error } = await supabase
    .from("tickets")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ticket })
}
