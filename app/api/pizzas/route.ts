import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all pizzas
    const { data: pizzas, error: pizzasError } = await supabase
      .from("pizzas")
      .select("*")
      .eq("available", true)
      .order("popular", { ascending: false })
      .order("name")

    if (pizzasError) {
      console.error("[v0] Pizzas fetch error:", pizzasError)
      throw pizzasError
    }

    // Fetch pizza options
    const [
      { data: sizes, error: sizesError },
      { data: crusts, error: crustsError },
      { data: sauces, error: saucesError },
      { data: toppings, error: toppingsError },
    ] = await Promise.all([
      supabase.from("pizza_sizes").select("*").order("price_multiplier"),
      supabase.from("crusts").select("*").order("price"),
      supabase.from("sauces").select("*").order("price"),
      supabase.from("toppings").select("*").eq("available", true).order("category").order("display_name"),
    ])

    if (sizesError || crustsError || saucesError || toppingsError) {
      console.error("[v0] Pizza options fetch error:", {
        sizesError,
        crustsError,
        saucesError,
        toppingsError,
      })
      throw new Error("Failed to fetch pizza options")
    }

    return NextResponse.json({
      success: true,
      pizzas,
      options: {
        sizes,
        crusts,
        sauces,
        toppings,
      },
    })
  } catch (error) {
    console.error("[v0] Pizzas API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pizzas" }, { status: 500 })
  }
}
