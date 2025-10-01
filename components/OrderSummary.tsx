"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/store/cart-store"
import { calculateOrderTotal } from "@/lib/utils/price-calculator"
import { ChevronDown, ChevronUp, Tag } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function OrderSummary() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.getTotal())
  const [showItems, setShowItems] = useState(true)
  const [promoCode, setPromoCode] = useState("")

  const { tax, deliveryFee, total } = calculateOrderTotal(subtotal)

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Summary</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowItems(!showItems)}>
            {showItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items (Collapsible) */}
        {showItems && (
          <div className="space-y-3 pb-4 border-b">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={item.pizza.image || "/placeholder.svg"}
                    alt={item.pizza.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.pizza.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.size} • {item.crust}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      x{item.quantity}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold mt-1">${(item.totalPrice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Apply</Button>
          </div>
        </div>

        {/* Price Breakdown */}
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
          {subtotal < 30 && subtotal > 0 && (
            <div className="bg-secondary/20 border border-secondary rounded-md p-2">
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
      </CardContent>
    </Card>
  )
}
