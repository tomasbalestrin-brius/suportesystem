"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface TicketActionsProps {
  ticketId: string
  currentStatus: string
}

export function TicketActions({ ticketId, currentStatus }: TicketActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusUpdate = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.from("tickets").update({ status }).eq("id", ticketId)

      router.refresh()
    } catch (error) {
      console.error("[v0] Failed to update ticket status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
        <CardDescription>Gerencie o status do ticket</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status do Ticket</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="em_analise">Em Análise</SelectItem>
              <SelectItem value="aguardando_humano">Aguardando Humano</SelectItem>
              <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
              <SelectItem value="resolvido_ia">Resolvido (IA)</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStatusUpdate} disabled={loading || status === currentStatus} className="w-full">
          {loading ? "Atualizando..." : "Atualizar Status"}
        </Button>
      </CardContent>
    </Card>
  )
}
