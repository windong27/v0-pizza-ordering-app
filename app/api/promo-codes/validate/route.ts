import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { code, orderTotal } = body

    if (!code) {
      return NextResponse.json({ valid: false, error: "Promo code is required" }, { status: 400 })
    }

    // Fetch promo code
    const { data: promoCode, error: promoError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("active", true)
      .single()

    if (promoError || !promoCode) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" })
    }

    // Check validity period
    const now = new Date()
    const validFrom = new Date(promoCode.valid_from)
    const validUntil = new Date(promoCode.valid_until)

    if (now < validFrom || now > validUntil) {
      return NextResponse.json({ valid: false, error: "Promo code has expired" })
    }

    // Check usage limit
    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) {
      return NextResponse.json({ valid: false, error: "Promo code usage limit reached" })
    }

    // Check minimum order amount
    if (promoCode.min_order_amount && orderTotal < promoCode.min_order_amount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of $${promoCode.min_order_amount} required`,
      })
    }

    // Calculate discount
    let discount = 0
    if (promoCode.discount_type === "percentage") {
      discount = (orderTotal * promoCode.discount_value) / 100
      if (promoCode.max_discount && discount > promoCode.max_discount) {
        discount = promoCode.max_discount
      }
    } else {
      discount = promoCode.discount_value
    }

    return NextResponse.json({
      valid: true,
      discount: Number(discount.toFixed(2)),
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discount_type,
        discountValue: promoCode.discount_value,
      },
    })
  } catch (error) {
    console.error("[v0] Promo code validation error:", error)
    return NextResponse.json({ valid: false, error: "Failed to validate promo code" }, { status: 500 })
  }
}
