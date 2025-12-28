"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Ticket } from "@/lib/supabase/types"

export function useRealtimeTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Busca inicial
    const fetchTickets = async () => {
      const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false })

      if (data) {
        setTickets(data as Ticket[])
      }
      setLoading(false)
    }

    fetchTickets()

    // Inscrição em tempo real
    const channel = supabase
      .channel("tickets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTickets((current) => [payload.new as Ticket, ...current])
          } else if (payload.eventType === "UPDATE") {
            setTickets((current) =>
              current.map((ticket) => (ticket.id === payload.new.id ? (payload.new as Ticket) : ticket)),
            )
          } else if (payload.eventType === "DELETE") {
            setTickets((current) => current.filter((ticket) => ticket.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { tickets, loading }
}
