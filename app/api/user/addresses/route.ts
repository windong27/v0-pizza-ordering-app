import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's addresses
    const { data: addresses, error: addressesError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (addressesError) {
      console.error("[v0] Addresses fetch error:", addressesError)
      throw addressesError
    }

    return NextResponse.json({ success: true, addresses })
  } catch (error) {
    console.error("[v0] Addresses API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    }

    // Create address
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: body.label,
        street_address: body.streetAddress,
        apartment: body.apartment || null,
        city: body.city,
        state: body.state,
        zip_code: body.zipCode,
        is_default: body.isDefault || false,
      })
      .select()
      .single()

    if (addressError) {
      console.error("[v0] Address creation error:", addressError)
      throw addressError
    }

    return NextResponse.json({ success: true, address })
  } catch (error) {
    console.error("[v0] Address creation API error:", error)
    return NextResponse.json({ success: false, error: "Failed to create address" }, { status: 500 })
  }
}
