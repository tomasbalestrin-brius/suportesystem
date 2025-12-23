import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow login page to be accessed without authentication
  if (!user && !children.toString().includes("login")) {
    redirect("/login")
  }

  return <>{children}</>
}
