"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { PizzaCard } from "@/components/PizzaCard"
import { PizzaCustomizer } from "@/components/PizzaCustomizer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { pizzas } from "@/lib/pizzaData"
import type { Pizza, PizzaCategory } from "@/types"
import { Search } from "lucide-react"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<PizzaCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [customizerOpen, setCustomizerOpen] = useState(false)

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesCategory = selectedCategory === "all" || pizza.category === selectedCategory
    const matchesSearch =
      pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCustomize = (pizza: Pizza) => {
    setSelectedPizza(pizza)
    setCustomizerOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
              Fresh, Hot Pizza <span className="text-primary">Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Handcrafted pizzas made with premium ingredients. Customize your perfect pizza and get it delivered in 30
              minutes or less.
            </p>
            <Button size="lg" className="text-lg px-8">
              Order Now
            </Button>
          </div>
        </section>

        {/* Menu Section */}
        <section className="container mx-auto px-4 py-12">
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pizzas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as PizzaCategory | "all")}
            >
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All Pizzas</TabsTrigger>
                <TabsTrigger value="classic">Classic</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
                <TabsTrigger value="specialty">Specialty</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pizza Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} onCustomize={handleCustomize} />
            ))}
          </div>

          {filteredPizzas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No pizzas found. Try a different search or category.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <PizzaCustomizer pizza={selectedPizza} open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </div>
  )
}
