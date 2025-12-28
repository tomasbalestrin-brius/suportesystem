import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { MemberAccessWebhookPayload } from "@/lib/integrations/types"

export async function POST(request: Request) {
  try {
    const payload: MemberAccessWebhookPayload = await request.json()

    console.log("[v0] Members webhook received:", payload)

    const supabase = await createClient()

    // Save webhook payload
    const { data: webhookRecord, error: webhookError } = await supabase
      .from("platform_webhooks")
      .insert({
        platform_type: "members",
        payload: payload as any,
        processed: false,
      })
      .select()
      .single()

    if (webhookError) {
      console.error("[v0] Failed to save webhook:", webhookError)
      return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 })
    }

    // Update customer access status
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", payload.customer.email)
      .single()

    if (customer) {
      await supabase
        .from("customers")
        .update({
          access_status: payload.access.status,
          member_platform_id: payload.access.product_id,
          last_sync_at: new Date().toISOString(),
        })
        .eq("id", customer.id)
    }

    // Log integration event
    await supabase.from("integration_logs").insert({
      platform_type: "members",
      action: payload.event,
      request: payload as any,
      response: { customer_id: customer?.id } as any,
      success: true,
    })

    // Mark webhook as processed
    await supabase.from("platform_webhooks").update({ processed: true }).eq("id", webhookRecord.id)

    return NextResponse.json({
      success: true,
      customer_id: customer?.id,
    })
  } catch (error) {
    console.error("[v0] Members webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
