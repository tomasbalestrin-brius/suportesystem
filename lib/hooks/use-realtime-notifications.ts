"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { AdminNotification } from "@/lib/supabase/types"

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Busca inicial
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("admin_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setNotifications(data as AdminNotification[])
        setUnreadCount(data.filter((n) => !n.is_read).length)
      }
    }

    fetchNotifications()

    // Inscrição em tempo real
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((current) => [payload.new as AdminNotification, ...current])
            setUnreadCount((count) => count + 1)
          } else if (payload.eventType === "UPDATE") {
            setNotifications((current) =>
              current.map((notif) => (notif.id === payload.new.id ? (payload.new as AdminNotification) : notif)),
            )
            if ((payload.new as AdminNotification).is_read) {
              setUnreadCount((count) => Math.max(0, count - 1))
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
  }

  return { notifications, unreadCount, markAsRead }
}
