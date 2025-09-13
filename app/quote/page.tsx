"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function QuoteForm() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    quantity: "",
    message: "",
  })

  useEffect(() => {
    const productId = searchParams.get("product")
    const productName = searchParams.get("name")

    if (productId && productName) {
      setFormData((prev) => ({
        ...prev,
        productId,
        productName: decodeURIComponent(productName),
      }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Quote Request Submitted",
          description: "We'll get back to you within 24 hours with a detailed quote.",
        })

        // Reset form
        setFormData({
          productId: formData.productId,
          productName: formData.productName,
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          company: "",
          quantity: "",
          message: "",
        })
      } else {
        throw new Error("Failed to submit quote request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Quote</h1>
          <p className="text-xl max-w-3xl">
            Get a personalized quote for your product requirements. Our team will provide competitive pricing and
            detailed specifications.
          </p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Request Form</CardTitle>
                  <CardDescription>
                    Please fill out the form below and we'll get back to you with a detailed quote within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Information */}
                    {formData.productName && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Product Information</h3>
                        <p className="text-sm text-muted-foreground">
                          <strong>Product:</strong> {formData.productName}
                        </p>
                      </div>
                    )}

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Full Name *</Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email Address *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerPhone">Phone Number *</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      <Label htmlFor="quantity">Quantity Required *</Label>
                      <Select value={formData.quantity} onValueChange={(value) => handleInputChange("quantity", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quantity range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 units</SelectItem>
                          <SelectItem value="11-50">11-50 units</SelectItem>
                          <SelectItem value="51-100">51-100 units</SelectItem>
                          <SelectItem value="101-500">101-500 units</SelectItem>
                          <SelectItem value="500+">500+ units</SelectItem>
                          <SelectItem value="custom">Custom quantity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Requirements</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide any additional details about your requirements, timeline, or specific needs..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Competitive Pricing</h4>
                    <p className="text-sm text-muted-foreground">
                      We offer competitive rates with transparent pricing and no hidden fees.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fast Response</h4>
                    <p className="text-sm text-muted-foreground">
                      Get your quote within 24 hours with detailed specifications.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality Assurance</h4>
                    <p className="text-sm text-muted-foreground">
                      All products come with quality guarantees and warranty support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our sales team is here to help you find the right solution for your needs.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Email:</strong> sales@fortuneinfosolutions.com
                    </p>
                    <p>
                      <strong>Hours:</strong> Mon-Fri 9AM-6PM EST
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteForm />
    </Suspense>
  )
}
