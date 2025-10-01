"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Pizza } from "@/types"
import { Flame } from "lucide-react"

interface PizzaCardProps {
  pizza: Pizza
  onCustomize: (pizza: Pizza) => void
}

export function PizzaCard({ pizza, onCustomize }: PizzaCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={pizza.image || "/placeholder.svg"}
          alt={pizza.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {pizza.popular && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            <Flame className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-balance">{pizza.name}</CardTitle>
        <CardDescription className="text-pretty">{pizza.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">
          ${pizza.basePrice.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground ml-1">starting</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onCustomize(pizza)} className="w-full" size="lg">
          Customize & Order
        </Button>
      </CardFooter>
    </Card>
  )
}
