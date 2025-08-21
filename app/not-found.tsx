"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you
              entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
              <div className="space-y-2">
                <Link href="/products" className="block text-primary hover:text-primary/80 transition-colors">
                  Products & Brands
                </Link>
                <Link href="/services" className="block text-primary hover:text-primary/80 transition-colors">
                  Our Services
                </Link>
                <Link href="/about" className="block text-primary hover:text-primary/80 transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="block text-primary hover:text-primary/80 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
