import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Phone, Calendar, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { TicketMessages } from "@/components/admin/ticket-messages"
import { TicketActions } from "@/components/admin/ticket-actions"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { count: unreadNotifications } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single()

  if (!ticket) {
    return <div>Ticket não encontrado</div>
  }

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true })

  const statusLabels: Record<string, string> = {
    novo: "Novo",
    em_analise: "Em Análise",
    resolvido_ia: "Resolvido (IA)",
    aguardando_humano: "Aguardando Humano",
    em_atendimento: "Em Atendimento",
    fechado: "Fechado",
  }

  const statusColors: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    em_analise: "bg-yellow-100 text-yellow-700",
    resolvido_ia: "bg-green-100 text-green-700",
    aguardando_humano: "bg-orange-100 text-orange-700",
    em_atendimento: "bg-purple-100 text-purple-700",
    fechado: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="/admin/tickets">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Ticket {ticket.ticket_number}</h1>
            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">{ticket.subject}</p>
          </div>
          <Badge className={cn("flex-shrink-0", statusColors[ticket.status])}>{statusLabels[ticket.status]}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-[1fr_400px]">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Conversas</CardTitle>
                <CardDescription>Timeline completa do atendimento</CardDescription>
              </CardHeader>
              <CardContent>
                <TicketMessages messages={messages || []} />
              </CardContent>
            </Card>

            {ticket.ai_analysis && Object.keys(ticket.ai_analysis).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Análise da IA</CardTitle>
                  <CardDescription>Informações processadas pela Sofia</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                    {JSON.stringify(ticket.ai_analysis, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{ticket.customer_name}</p>
                    <p className="text-xs text-muted-foreground">Nome</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{ticket.customer_email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                {ticket.customer_cpf && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{ticket.customer_cpf}</p>
                      <p className="text-xs text-muted-foreground">CPF</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(ticket.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">Criado</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium capitalize">{ticket.category}</p>
                    <p className="text-xs text-muted-foreground">Categoria</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium capitalize">{ticket.priority}</p>
                    <p className="text-xs text-muted-foreground">Prioridade</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TicketActions ticketId={ticket.id} currentStatus={ticket.status} />
          </div>
        </div>
      </main>
    </div>
  )
}
