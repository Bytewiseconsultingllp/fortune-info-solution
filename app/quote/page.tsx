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
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

function QuoteForm() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    quantity: "",
    urgency: "",
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
    if (validationErrors.length > 0) {
      setValidationErrors([])
      setSubmitStatus("idle")
    }
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.customerName.trim()) {
      errors.push("Full name is required")
    }

    if (!formData.customerEmail.trim()) {
      errors.push("Email address is required")
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.push("Please enter a valid email address")
    }

    if (!formData.customerPhone.trim()) {
      errors.push("Phone number is required")
    }

    if (!formData.quantity) {
      errors.push("Quantity is required")
    }

    if (!formData.urgency) {
      errors.push("Urgency level is required")
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setValidationErrors([])
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")

        setFormData({
          productId: formData.productId,
          productName: formData.productName,
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          company: "",
          quantity: "",
          urgency: "",
          message: "",
        })
      } else {
        throw new Error("Failed to submit quote request")
      }
    } catch (error) {
      setValidationErrors(["Failed to submit quote request. Please try again."])
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Request Form</CardTitle>
                  <CardDescription>
                    Please fill out the form below and we'll get back to you with a detailed quote within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-800">Quote Request Submitted Successfully!</h3>
                          <p className="text-sm text-green-700 mt-1">
                            Thank you for your request. Please check your email for confirmation. We'll get back to you
                            within 24 hours with a detailed quote.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && validationErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-800">Please fix the following errors:</h3>
                          <ul className="text-sm text-red-700 mt-2 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formData.productName && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Product Information</h3>
                        <p className="text-sm text-foreground">
                          <strong>Product:</strong> {formData.productName}
                        </p>
                      </div>
                    )}

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity Required *</Label>
                        <Select
                          value={formData.quantity}
                          onValueChange={(value) => handleInputChange("quantity", value)}
                        >
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
                        <Label htmlFor="urgency">Urgency Level *</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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

            <div className="space-y-6">
              <Card className="w-full min-w-[280px]">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Competitive Pricing</h4>
                    <p className="text-sm text-foreground">
                      We offer competitive rates with transparent pricing and no hidden fees.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fast Response</h4>
                    <p className="text-sm text-foreground">
                      Get your quote within 24 hours with detailed specifications.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality Assurance</h4>
                    <p className="text-sm text-foreground">
                      All products come with quality guarantees and warranty support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full min-w-[280px]">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-4 text-justify">
                    Our sales team is here to help you find the right solution for your needs.
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div className="font-semibold text-foreground">Phone:</div>
                    <div className="text-foreground">9686194471, 9845447654</div>
                    <div className="font-semibold text-foreground">Email:</div>
                    <div className="text-foreground">info@fortuneinfo.in</div>
                    <div className="font-semibold text-foreground">Hours:</div>
                    <div className="text-foreground">
                      Mon-Fri <br />
                      10:00 AM-7:00 PM
                    </div>
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
