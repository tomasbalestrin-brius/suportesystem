import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { knowledgeBaseSchema } from "@/lib/validations/schemas"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult
  const { id } = await params

  const body = await request.json()
  const validation = knowledgeBaseSchema.partial().safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ error: "Dados inválidos", details: validation.error.errors }, { status: 400 })
  }

  const { data: article, error } = await supabase
    .from("knowledge_base")
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

  return NextResponse.json({ article })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult
  const { id } = await params

  const { error } = await supabase.from("knowledge_base").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
