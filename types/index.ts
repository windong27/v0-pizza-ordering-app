export type PizzaCategory = "classic" | "premium" | "vegetarian" | "specialty"

export type PizzaSize = "small" | "medium" | "large" | "xl"

export type CrustType = "thin" | "regular" | "thick" | "stuffed"

export type SauceType = "tomato" | "bbq" | "white" | "pesto"

export type CheeseOption = "regular" | "extra" | "light" | "none"

export interface Topping {
  id: string
  name: string
  category: "meat" | "vegetable" | "premium"
  price: number
}

export interface Pizza {
  id: string
  name: string
  description: string
  category: PizzaCategory
  basePrice: number
  image: string
  popular?: boolean
}

export interface CartItem {
  id: string
  pizza: Pizza
  size: PizzaSize
  crust: CrustType
  sauce: SauceType
  cheese: CheeseOption
  toppings: Topping[]
  quantity: number
  totalPrice: number
  specialInstructions?: string
}

export interface OrderDetails {
  orderNumber: string
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  deliveryType: "delivery" | "pickup"
  customerInfo: {
    name: string
    email: string
    phone: string
    address?: string
  }
  estimatedTime: string
  status: "preparing" | "baking" | "out-for-delivery" | "delivered" | "ready-for-pickup"
}
