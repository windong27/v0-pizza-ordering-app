import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Get user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase.rpc("generate_order_number")

    if (orderNumberError) {
      throw new Error("Failed to generate order number")
    }

    // Calculate totals
    const subtotal = body.subtotal
    const deliveryFee = body.orderType === "delivery" ? (subtotal >= 30 ? 0 : 4.99) : 0
    const discount = body.discount || 0

    const { data: totalsData, error: totalsError } = await supabase.rpc("calculate_order_total", {
      p_subtotal: subtotal,
      p_delivery_fee: deliveryFee,
      p_discount: discount,
    })

    if (totalsError || !totalsData || totalsData.length === 0) {
      throw new Error("Failed to calculate order total")
    }

    const { tax, total } = totalsData[0]

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        order_number: orderNumberData,
        status: "pending",
        order_type: body.orderType,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        delivery_address: body.deliveryAddress || null,
        delivery_instructions: body.deliveryInstructions || null,
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        discount,
        total,
        payment_method: body.paymentMethod,
        estimated_delivery_time: body.deliveryTime || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Order creation error:", orderError)
      throw orderError
    }

    // Create order items
    for (const item of body.items) {
      const { data: orderItem, error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          pizza_id: item.pizzaId,
          pizza_name: item.name,
          size: item.size,
          crust: item.crust,
          sauce: item.sauce,
          cheese: item.cheese,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          special_instructions: item.specialInstructions || null,
        })
        .select()
        .single()

      if (itemError) {
        console.error("[v0] Order item creation error:", itemError)
        throw itemError
      }

      // Create order item toppings
      if (item.toppings && item.toppings.length > 0) {
        const toppings = item.toppings.map((topping: { name: string; price: number }) => ({
          order_item_id: orderItem.id,
          topping_name: topping.name,
          topping_price: topping.price,
        }))

        const { error: toppingsError } = await supabase.from("order_item_toppings").insert(toppings)

        if (toppingsError) {
          console.error("[v0] Order item toppings creation error:", toppingsError)
          throw toppingsError
        }
      }
    }

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.order_number })
  } catch (error) {
    console.error("[v0] Order API error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          order_item_toppings (*)
        )
      `,
      )
      .eq("id", orderId)
      .single()

    if (orderError) {
      console.error("[v0] Order fetch error:", orderError)
      throw orderError
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] Order fetch API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
