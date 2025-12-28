import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function requireAuth(request: NextRequest) {
  const supabase = await createServerClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  return { session, supabase }
}

export async function withAuth(handler: (request: NextRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any) => {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    return handler(request, { ...context, ...authResult })
  }
}
