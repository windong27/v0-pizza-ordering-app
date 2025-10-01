"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store/cart-store"
import { calculateOrderTotal } from "@/lib/utils/price-calculator"
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function CartSheet() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const itemCount = useCartStore((state) => state.getItemCount())
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add some delicious pizzas to get started!</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border rounded-lg p-3">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.pizza.image || "/placeholder.svg"}
                        alt={item.pizza.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{item.pizza.name}</h4>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p className="capitalize">
                          {item.size} • {item.crust} crust
                        </p>
                        {item.toppings.length > 0 && (
                          <p className="truncate">+{item.toppings.map((t) => t.name).join(", ")}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">${(item.totalPrice * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id, item.pizza.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2 text-sm">
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
                {subtotal < 30 && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(30 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
