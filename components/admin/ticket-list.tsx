"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface Ticket {
  id: string
  ticket_number: string
  customer_name: string
  customer_email: string
  subject: string
  category: string
  priority: string
  status: string
  created_at: string
  requires_human: boolean
}

interface TicketListProps {
  tickets: Ticket[]
}

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

const priorityColors: Record<string, string> = {
  baixa: "bg-gray-100 text-gray-600",
  media: "bg-blue-100 text-blue-600",
  alta: "bg-orange-100 text-orange-600",
  urgente: "bg-red-100 text-red-600",
}

export function TicketList({ tickets }: TicketListProps) {
  const router = useRouter()

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum ticket encontrado</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Assunto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className={ticket.requires_human ? "bg-orange-50" : ""}>
            <TableCell className="font-mono text-xs">{ticket.ticket_number}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{ticket.customer_name}</p>
                <p className="text-xs text-muted-foreground">{ticket.customer_email}</p>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {ticket.category}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(ticket.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
