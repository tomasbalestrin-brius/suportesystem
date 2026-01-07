"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface TicketActionsProps {
  ticketId: string
  currentStatus: string
}

export function TicketActions({ ticketId, currentStatus }: TicketActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Reset status when currentStatus changes (page refresh)
  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const handleStatusUpdate = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("tickets")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", ticketId)

      if (updateError) throw updateError

      setSuccess(true)

      // Wait a bit to show success message
      setTimeout(() => {
        router.refresh()
        setSuccess(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to update ticket status:", error)
      setError("Erro ao atualizar status. Tente novamente.")
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
          <Select value={status} onValueChange={setStatus} disabled={loading}>
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

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            <span>Status atualizado com sucesso!</span>
          </div>
        )}

        <Button
          onClick={handleStatusUpdate}
          disabled={loading || status === currentStatus}
          className="w-full"
        >
          {loading ? "Atualizando..." : "Atualizar Status"}
        </Button>
      </CardContent>
    </Card>
  )
}
