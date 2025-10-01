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
import type { OrderDetails } from "@/types"
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`

    // Create order details
    const orderDetails: OrderDetails = {
      orderNumber,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      deliveryType: data.deliveryType,
      customerInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.deliveryType === "delivery" ? `${data.address}, ${data.city}, ${data.zipCode}` : undefined,
      },
      estimatedTime: data.deliveryTime === "asap" ? "30-45 minutes" : "Scheduled",
      status: "preparing",
    }

    // Store order details in sessionStorage
    sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails))

    // Clear cart
    clearCart()

    toast({
      title: "Order placed successfully!",
      description: `Your order #${orderNumber} has been confirmed.`,
    })

    setIsLoading(false)

    // Redirect to confirmation page
    router.push(`/order-confirmation/${orderNumber}`)
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
