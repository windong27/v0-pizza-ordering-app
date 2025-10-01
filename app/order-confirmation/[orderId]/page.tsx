"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { OrderDetails } from "@/types"
import { CheckCircle2, Clock, ChefHat, Truck, Package, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [currentStatus, setCurrentStatus] = useState<OrderDetails["status"]>("preparing")

  useEffect(() => {
    // Retrieve order from sessionStorage
    const orderData = sessionStorage.getItem("lastOrder")
    if (orderData) {
      const parsedOrder = JSON.parse(orderData) as OrderDetails
      setOrder(parsedOrder)
      setCurrentStatus(parsedOrder.status)

      // Simulate order status progression
      const statusProgression: OrderDetails["status"][] = [
        "preparing",
        "baking",
        parsedOrder.deliveryType === "delivery" ? "out-for-delivery" : "ready-for-pickup",
        parsedOrder.deliveryType === "delivery" ? "delivered" : "ready-for-pickup",
      ]

      let currentIndex = 0
      const interval = setInterval(() => {
        currentIndex++
        if (currentIndex < statusProgression.length) {
          setCurrentStatus(statusProgression[currentIndex])
        } else {
          clearInterval(interval)
        }
      }, 5000) // Update every 5 seconds for demo

      return () => clearInterval(interval)
    } else {
      // No order found, redirect to home
      router.push("/")
    }
  }, [router])

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const statusSteps = [
    { status: "preparing", label: "Preparing", icon: Package, description: "Getting your order ready" },
    { status: "baking", label: "Baking", icon: ChefHat, description: "Pizza in the oven" },
    {
      status: order.deliveryType === "delivery" ? "out-for-delivery" : "ready-for-pickup",
      label: order.deliveryType === "delivery" ? "Out for Delivery" : "Ready for Pickup",
      icon: order.deliveryType === "delivery" ? Truck : CheckCircle2,
      description: order.deliveryType === "delivery" ? "On the way to you" : "Ready to collect",
    },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.status === currentStatus)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll have it ready in {order.estimatedTime}.
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Order #{order.orderNumber}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Status
                </CardTitle>
                <CardDescription>Track your order in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex

                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                              isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-border text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-12 mt-2 transition-colors ${
                                isCompleted ? "bg-primary" : "bg-border"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isCurrent ? "text-primary" : ""}`}>{step.label}</h3>
                            {isCurrent && (
                              <Badge variant="secondary" className="text-xs">
                                In Progress
                              </Badge>
                            )}
                            {isCompleted && !isCurrent && (
                              <Badge variant="outline" className="text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.pizza.image || "/placeholder.svg"}
                          alt={item.pizza.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold">{item.pizza.name}</h4>
                          <Badge variant="secondary">x{item.quantity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.size} • {item.crust} crust
                        </p>
                        {item.toppings.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            +{item.toppings.map((t) => t.name).join(", ")}
                          </p>
                        )}
                        <p className="text-sm font-semibold mt-2">${(item.totalPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{order.deliveryFee === 0 ? "FREE" : `$${order.deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery/Pickup Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {order.deliveryType === "delivery" ? "Delivery" : "Pickup"} Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold mb-1">{order.customerInfo.name}</p>
                  <p className="text-muted-foreground">{order.customerInfo.email}</p>
                  <p className="text-muted-foreground">{order.customerInfo.phone}</p>
                </div>
                {order.deliveryType === "delivery" && order.customerInfo.address && (
                  <div>
                    <p className="font-semibold mb-1">Delivery Address</p>
                    <p className="text-muted-foreground">{order.customerInfo.address}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold mb-1">Estimated Time</p>
                  <p className="text-muted-foreground">{order.estimatedTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@pizzahub.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>123 Pizza Street</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Order Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Back to Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
