import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult
  const { searchParams } = new URL(request.url)

  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const priority = searchParams.get("priority")

  let query = supabase.from("tickets").select("*").order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)
  if (category) query = query.eq("category", category)
  if (priority) query = query.eq("priority", priority)

  const { data: tickets, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tickets })
}
