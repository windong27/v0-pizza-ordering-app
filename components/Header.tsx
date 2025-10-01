"use client"

import Link from "next/link"
import { Pizza, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "@/components/CartSheet"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Pizza className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">PizzaHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Menu
          </Link>
          <Link href="#deals" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Deals
          </Link>
          <Link href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Cart Button */}
        <div className="flex items-center gap-2">
          <CartSheet />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Menu
                </Link>
                <Link
                  href="#deals"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link
                  href="#about"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
