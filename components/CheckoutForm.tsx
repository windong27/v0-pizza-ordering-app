"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Store, CreditCard, Wallet, Banknote } from "lucide-react"

const checkoutSchema = z.object({
  deliveryType: z.enum(["delivery", "pickup"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  deliveryTime: z.string(),
  paymentMethod: z.enum(["card", "cash", "digital"]),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void
  isLoading?: boolean
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "delivery",
      deliveryTime: "asap",
      paymentMethod: "card",
    },
  })

  const handleDeliveryTypeChange = (value: "delivery" | "pickup") => {
    setDeliveryType(value)
    setValue("deliveryType", value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Delivery Type */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Method</CardTitle>
          <CardDescription>Choose how you'd like to receive your order</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={deliveryType} onValueChange={handleDeliveryTypeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery
              </TabsTrigger>
              <TabsTrigger value="pickup" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Pickup
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>We'll use this to contact you about your order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address (only for delivery) */}
      {deliveryType === "delivery" && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
            <CardDescription>Where should we deliver your order?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input id="address" placeholder="123 Main Street, Apt 4B" {...register("address")} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input id="city" placeholder="New York" {...register("city")} />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  ZIP Code <span className="text-destructive">*</span>
                </Label>
                <Input id="zipCode" placeholder="10001" {...register("zipCode")} />
                {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Time */}
      <Card>
        <CardHeader>
          <CardTitle>{deliveryType === "delivery" ? "Delivery" : "Pickup"} Time</CardTitle>
          <CardDescription>When would you like to receive your order?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="asap" onValueChange={(value) => setValue("deliveryTime", value)}>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="asap" id="asap" />
              <Label htmlFor="asap" className="flex-1 cursor-pointer">
                ASAP (30-45 minutes)
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                Schedule for later
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>How would you like to pay?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="card" onValueChange={(value) => setValue("paymentMethod", value as any)}>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="card" id="card" />
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="digital" id="digital" />
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="digital" className="flex-1 cursor-pointer">
                Digital Wallet (Apple Pay, Google Pay)
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="cash" id="cash" />
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                Cash on {deliveryType === "delivery" ? "Delivery" : "Pickup"}
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
    </form>
  )
}
