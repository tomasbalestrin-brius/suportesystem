import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketList } from "@/components/admin/ticket-list"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default async function TicketsPage() {
  const supabase = await createClient()

  const { count: unreadNotifications } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  const { data: tickets } = await supabase.from("tickets").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tickets de Suporte</h1>
            <p className="text-muted-foreground">Gerencie todos os tickets de atendimento</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Tickets</CardTitle>
            <CardDescription>Lista completa de tickets ordenados por data de criação</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketList tickets={tickets || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
