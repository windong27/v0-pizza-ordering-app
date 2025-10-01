"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Pizza, PizzaSize, CrustType, SauceType, CheeseOption, Topping, CartItem } from "@/types"
import { toppings } from "@/lib/pizzaData"
import { calculatePizzaPrice } from "@/lib/utils/price-calculator"
import { useCartStore } from "@/lib/store/cart-store"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, ShoppingCart } from "lucide-react"

interface PizzaCustomizerProps {
  pizza: Pizza | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PizzaCustomizer({ pizza, open, onOpenChange }: PizzaCustomizerProps) {
  const [size, setSize] = useState<PizzaSize>("medium")
  const [crust, setCrust] = useState<CrustType>("regular")
  const [sauce, setSauce] = useState<SauceType>("tomato")
  const [cheese, setCheese] = useState<CheeseOption>("regular")
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")

  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  // Reset form when pizza changes
  useEffect(() => {
    if (pizza) {
      setSize("medium")
      setCrust("regular")
      setSauce("tomato")
      setCheese("regular")
      setSelectedToppings([])
      setQuantity(1)
      setSpecialInstructions("")
    }
  }, [pizza])

  if (!pizza) return null

  const currentPrice = calculatePizzaPrice(pizza.basePrice, size, crust, selectedToppings)
  const totalPrice = currentPrice * quantity

  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id)
      if (exists) {
        return prev.filter((t) => t.id !== topping.id)
      }
      return [...prev, topping]
    })
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${pizza.id}-${Date.now()}`,
      pizza,
      size,
      crust,
      sauce,
      cheese,
      toppings: selectedToppings,
      quantity,
      totalPrice: currentPrice,
      specialInstructions: specialInstructions || undefined,
    }

    addItem(cartItem)
    toast({
      title: "Added to cart!",
      description: `${quantity} ${pizza.name} added to your cart.`,
    })
    onOpenChange(false)
  }

  const meatToppings = toppings.filter((t) => t.category === "meat")
  const vegToppings = toppings.filter((t) => t.category === "vegetable")
  const premiumToppings = toppings.filter((t) => t.category === "premium")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">{pizza.name}</DialogTitle>
              <DialogDescription>{pizza.description}</DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Image and Summary */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={pizza.image || "/placeholder.svg"}
                    alt={pizza.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">Your Selection</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      Size: <span className="text-foreground capitalize">{size}</span>
                    </p>
                    <p>
                      Crust: <span className="text-foreground capitalize">{crust}</span>
                    </p>
                    <p>
                      Sauce: <span className="text-foreground capitalize">{sauce}</span>
                    </p>
                    <p>
                      Cheese: <span className="text-foreground capitalize">{cheese}</span>
                    </p>
                    {selectedToppings.length > 0 && (
                      <p>
                        Toppings:{" "}
                        <span className="text-foreground">{selectedToppings.map((t) => t.name).join(", ")}</span>
                      </p>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Customization Options */}
              <div className="space-y-6">
                {/* Size Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Size</Label>
                  <RadioGroup value={size} onValueChange={(value) => setSize(value as PizzaSize)}>
                    <div className="grid grid-cols-2 gap-3">
                      {(["small", "medium", "large", "xl"] as PizzaSize[]).map((s) => (
                        <Label
                          key={s}
                          htmlFor={`size-${s}`}
                          className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-colors ${
                            size === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={s} id={`size-${s}`} />
                            <span className="capitalize font-medium">{s}</span>
                          </div>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Crust Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Crust</Label>
                  <RadioGroup value={crust} onValueChange={(value) => setCrust(value as CrustType)}>
                    <div className="space-y-2">
                      {(["thin", "regular", "thick", "stuffed"] as CrustType[]).map((c) => (
                        <Label
                          key={c}
                          htmlFor={`crust-${c}`}
                          className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-colors ${
                            crust === c ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={c} id={`crust-${c}`} />
                            <span className="capitalize">{c}</span>
                          </div>
                          {(c === "thick" || c === "stuffed") && (
                            <Badge variant="secondary" className="text-xs">
                              +${c === "thick" ? "1.50" : "3.00"}
                            </Badge>
                          )}
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sauce Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Sauce</Label>
                  <RadioGroup value={sauce} onValueChange={(value) => setSauce(value as SauceType)}>
                    <div className="grid grid-cols-2 gap-2">
                      {(["tomato", "bbq", "white", "pesto"] as SauceType[]).map((s) => (
                        <Label
                          key={s}
                          htmlFor={`sauce-${s}`}
                          className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                            sauce === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={s} id={`sauce-${s}`} />
                          <span className="capitalize">{s === "bbq" ? "BBQ" : s}</span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Cheese Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Cheese</Label>
                  <RadioGroup value={cheese} onValueChange={(value) => setCheese(value as CheeseOption)}>
                    <div className="grid grid-cols-2 gap-2">
                      {(["regular", "extra", "light", "none"] as CheeseOption[]).map((c) => (
                        <Label
                          key={c}
                          htmlFor={`cheese-${c}`}
                          className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                            cheese === c ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={c} id={`cheese-${c}`} />
                          <span className="capitalize">{c}</span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Toppings */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Toppings</Label>
                  <Tabs defaultValue="meat" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="meat" className="flex-1">
                        Meats
                      </TabsTrigger>
                      <TabsTrigger value="vegetable" className="flex-1">
                        Veggies
                      </TabsTrigger>
                      <TabsTrigger value="premium" className="flex-1">
                        Premium
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="meat" className="space-y-2 mt-3">
                      {meatToppings.map((topping) => (
                        <Label
                          key={topping.id}
                          htmlFor={topping.id}
                          className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={topping.id}
                              checked={selectedToppings.some((t) => t.id === topping.id)}
                              onCheckedChange={() => handleToppingToggle(topping)}
                            />
                            <span>{topping.name}</span>
                          </div>
                          <Badge variant="outline">+${topping.price.toFixed(2)}</Badge>
                        </Label>
                      ))}
                    </TabsContent>
                    <TabsContent value="vegetable" className="space-y-2 mt-3">
                      {vegToppings.map((topping) => (
                        <Label
                          key={topping.id}
                          htmlFor={topping.id}
                          className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={topping.id}
                              checked={selectedToppings.some((t) => t.id === topping.id)}
                              onCheckedChange={() => handleToppingToggle(topping)}
                            />
                            <span>{topping.name}</span>
                          </div>
                          <Badge variant="outline">+${topping.price.toFixed(2)}</Badge>
                        </Label>
                      ))}
                    </TabsContent>
                    <TabsContent value="premium" className="space-y-2 mt-3">
                      {premiumToppings.map((topping) => (
                        <Label
                          key={topping.id}
                          htmlFor={topping.id}
                          className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={topping.id}
                              checked={selectedToppings.some((t) => t.id === topping.id)}
                              onCheckedChange={() => handleToppingToggle(topping)}
                            />
                            <span>{topping.name}</span>
                          </div>
                          <Badge variant="outline">+${topping.price.toFixed(2)}</Badge>
                        </Label>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Special Instructions */}
                <div className="space-y-3">
                  <Label htmlFor="instructions" className="text-base font-semibold">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests? (e.g., extra crispy, light sauce)"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Quantity</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} size="lg" className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ${totalPrice.toFixed(2)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
