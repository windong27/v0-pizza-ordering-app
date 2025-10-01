"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CheckoutForm } from "@/components/CheckoutForm"
import { OrderSummary } from "@/components/OrderSummary"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { calculateOrderTotal } from "@/lib/utils/price-calculator"

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const subtotal = useCartStore((state) => state.getTotal())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const { tax, deliveryFee, total } = calculateOrderTotal(subtotal)

  const handleCheckout = async (data: any) => {
    setIsLoading(true)

    try {
      // Prepare order data
      const orderData = {
        orderType: data.deliveryType,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        deliveryAddress: data.deliveryType === "delivery" ? `${data.address}, ${data.city}, ${data.zipCode}` : null,
        deliveryInstructions: data.instructions || null,
        subtotal,
        discount: 0,
        paymentMethod: data.paymentMethod,
        deliveryTime: data.deliveryTime === "asap" ? null : data.scheduledTime,
        items: items.map((item) => ({
          pizzaId: item.pizza.id,
          name: item.pizza.name,
          size: item.size,
          crust: item.crust,
          sauce: item.sauce,
          cheese: item.cheese,
          toppings: item.toppings,
          quantity: item.quantity,
          price: item.price,
          specialInstructions: item.specialInstructions || null,
        })),
      }

      console.log("[v0] Submitting order:", orderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart
        clearCart()

        toast({
          title: "Order placed successfully!",
          description: `Your order #${result.orderNumber} has been confirmed.`,
        })

        // Redirect to confirmation page
        router.push(`/order-confirmation/${result.orderNumber}`)
      } else {
        throw new Error(result.error || "Failed to place order")
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some pizzas to your cart before checking out.</p>
          <Button asChild>
            <Link href="/">Browse Menu</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your order details below</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
