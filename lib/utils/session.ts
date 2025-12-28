import { v4 as uuidv4 } from "uuid"

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""

  const SESSION_KEY = "bethel_support_session_id"
  let sessionId = localStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}

export function clearSessionId(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("bethel_support_session_id")
}
