import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { PaymentWebhookPayload } from "@/lib/integrations/types"

export async function POST(request: Request) {
  try {
    const payload: PaymentWebhookPayload = await request.json()

    console.log("[v0] Payment webhook received:", payload)

    const supabase = await createClient()

    // Save webhook payload
    const { data: webhookRecord, error: webhookError } = await supabase
      .from("platform_webhooks")
      .insert({
        platform_type: "payment",
        payload: payload as any,
        processed: false,
      })
      .select()
      .single()

    if (webhookError) {
      console.error("[v0] Failed to save webhook:", webhookError)
      return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 })
    }

    // Check if customer exists
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", payload.customer.email)
      .single()

    if (existingCustomer) {
      // Update customer
      await supabase
        .from("customers")
        .update({
          name: payload.customer.name,
          cpf: payload.customer.cpf,
          purchase_status: payload.event === "purchase.approved" ? "approved" : "refunded",
          purchase_platform_id: payload.transaction.id,
          last_sync_at: new Date().toISOString(),
        })
        .eq("id", existingCustomer.id)

      customerId = existingCustomer.id
    } else {
      // Create customer
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          email: payload.customer.email,
          name: payload.customer.name,
          cpf: payload.customer.cpf,
          purchase_status: payload.event === "purchase.approved" ? "approved" : "refunded",
          purchase_platform_id: payload.transaction.id,
          last_sync_at: new Date().toISOString(),
        })
        .select()
        .single()

      customerId = newCustomer?.id || null
    }

    // Log integration event
    await supabase.from("integration_logs").insert({
      platform_type: "payment",
      action: payload.event,
      request: payload as any,
      response: { customer_id: customerId } as any,
      success: true,
    })

    // Mark webhook as processed
    await supabase.from("platform_webhooks").update({ processed: true }).eq("id", webhookRecord.id)

    return NextResponse.json({
      success: true,
      customer_id: customerId,
    })
  } catch (error) {
    console.error("[v0] Payment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
