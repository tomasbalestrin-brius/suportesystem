"use client"

import { Button } from "@/components/ui/button"
import { Bell, Home, Ticket, BookOpen, Settings, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface AdminNavProps {
  unreadCount: number
}

export function AdminNav({ unreadCount }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/tickets", icon: Ticket, label: "Tickets" },
    { href: "/admin/knowledge-base", icon: BookOpen, label: "Base de Conhecimento" },
    { href: "/admin/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative h-8 w-32">
              <Image src="/bethel-logo-professional-tech.jpg" alt="Bethel" fill className="object-contain" />
            </div>

            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.push(item.href)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
