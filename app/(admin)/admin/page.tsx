import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketList } from "@/components/admin/ticket-list"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true })

  const { count: pendingTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["novo", "aguardando_humano", "em_atendimento"])

  const { count: resolvedTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["resolvido_ia", "fechado"])

  const { count: unreadNotifications } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  // Get recent tickets
  const { data: recentTickets } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Suporte</h1>
          <p className="text-muted-foreground">Visão geral dos tickets e atendimentos</p>
        </div>

        <DashboardStats
          totalTickets={totalTickets || 0}
          pendingTickets={pendingTickets || 0}
          resolvedTickets={resolvedTickets || 0}
        />

        <Card>
          <CardHeader>
            <CardTitle>Tickets Recentes</CardTitle>
            <CardDescription>Últimos 10 tickets criados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketList tickets={recentTickets || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
