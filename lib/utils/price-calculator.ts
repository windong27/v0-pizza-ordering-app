import type { PizzaSize, CrustType, Topping } from "@/types"
import { sizeMultipliers, crustPrices } from "@/lib/pizzaData"

export function calculatePizzaPrice(basePrice: number, size: PizzaSize, crust: CrustType, toppings: Topping[]): number {
  const sizeMultiplier = sizeMultipliers[size]
  const crustPrice = crustPrices[crust]
  const toppingsPrice = toppings.reduce((sum, topping) => sum + topping.price, 0)

  return basePrice * sizeMultiplier + crustPrice + toppingsPrice
}

export function calculateOrderTotal(subtotal: number): {
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
} {
  const tax = subtotal * 0.08 // 8% tax
  const deliveryFee = subtotal > 30 ? 0 : 4.99 // Free delivery over $30
  const total = subtotal + tax + deliveryFee

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}
