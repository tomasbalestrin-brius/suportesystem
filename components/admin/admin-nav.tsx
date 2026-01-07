"use client"

import { Button } from "@/components/ui/button"
import { Bell, Home, Ticket, BookOpen, Settings, LogOut, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface AdminNavProps {
  unreadCount: number
}

export function AdminNav({ unreadCount }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const handleNavClick = (href: string) => {
    router.push(href)
    setMobileMenuOpen(false)
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-8 w-24 sm:w-32 flex-shrink-0">
              <Image
                src="/bethel-logo-professional-tech.jpg"
                alt="Bethel"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
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
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative flex-shrink-0">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>

            {/* Logout - Hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hidden sm:flex flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => handleNavClick(item.href)}
                        className="justify-start gap-3 w-full h-12"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    )
                  })}
                  <div className="border-t my-4" />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start gap-3 w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
