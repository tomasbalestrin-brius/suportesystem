import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { supabase } = authResult
  const { id } = await params

  const { data: notification, error } = await supabase
    .from("admin_notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ notification })
}
