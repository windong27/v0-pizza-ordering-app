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

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Profile fetch error:", profileError)
      throw profileError
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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

    // Update profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: body.fullName,
        phone: body.phone,
      })
      .eq("id", user.id)
      .select()
      .single()

    if (profileError) {
      console.error("[v0] Profile update error:", profileError)
      throw profileError
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("[v0] Profile update API error:", error)
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
