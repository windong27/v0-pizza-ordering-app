"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if item with same configuration exists
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.pizza.id === item.pizza.id &&
              i.size === item.size &&
              i.crust === item.crust &&
              i.sauce === item.sauce &&
              i.cheese === item.cheese &&
              JSON.stringify(i.toppings) === JSON.stringify(item.toppings),
          )

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += item.quantity
            return { items: newItems }
          }

          // Add new item
          return { items: [...state.items, item] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
      },

      getItemCount: () => {
        const items = get().items
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "pizza-cart-storage",
    },
  ),
)
