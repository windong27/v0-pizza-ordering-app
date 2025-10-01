"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store/cart-store"
import { calculateOrderTotal } from "@/lib/utils/price-calculator"
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const subtotal = useCartStore((state) => state.getTotal())
  const { toast } = useToast()

  const { tax, deliveryFee, total } = calculateOrderTotal(subtotal)

  const handleRemoveItem = (itemId: string, pizzaName: string) => {
    removeItem(itemId)
    toast({
      title: "Removed from cart",
      description: `${pizzaName} has been removed from your cart.`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious pizzas to get started!</p>
            <Button asChild size="lg">
              <Link href="/">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border rounded-lg p-4 bg-card">
                  <div className="relative h-32 w-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.pizza.image || "/placeholder.svg"}
                      alt={item.pizza.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.pizza.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.size} • {item.crust} crust • {item.sauce} sauce • {item.cheese} cheese
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id, item.pizza.name)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    {item.toppings.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Toppings:</span> {item.toppings.map((t) => t.name).join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Note:</span> {item.specialInstructions}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">${item.totalPrice.toFixed(2)} each</p>
                        <p className="text-xl font-bold text-primary">
                          ${(item.totalPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 bg-card sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 30 && (
                    <div className="bg-secondary/20 border border-secondary rounded-md p-3">
                      <p className="text-xs text-secondary-foreground">
                        Add <span className="font-bold">${(30 - subtotal).toFixed(2)}</span> more for free delivery!
                      </p>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full mt-6">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
