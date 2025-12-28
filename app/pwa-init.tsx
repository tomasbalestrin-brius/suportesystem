"use client"

import { useEffect } from "react"
import { registerServiceWorker, checkForUpdates } from "@/lib/utils/pwa"

export function PWAInit() {
  useEffect(() => {
    registerServiceWorker()

    const interval = setInterval(() => {
      checkForUpdates()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return null
}
