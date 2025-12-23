import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/middleware/auth"
import { knowledgeBaseSchema } from "@/lib/validations/schemas"

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let query = supabase.from("knowledge_base").select("*").order("usage_count", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  const { data: articles, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ articles })
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult

  const body = await request.json()
  const validation = knowledgeBaseSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ error: "Dados inválidos", details: validation.error.errors }, { status: 400 })
  }

  const { data: article, error } = await supabase.from("knowledge_base").insert(validation.data).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article })
}
