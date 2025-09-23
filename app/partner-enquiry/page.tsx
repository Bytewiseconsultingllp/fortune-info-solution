"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function PartnerEnquiryPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    location: "",
    message: "",
  })

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.name.trim()) {
      newErrors.push("Full name is required")
    }

    if (!formData.email.trim()) {
      newErrors.push("Email address is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address")
    }

    if (!formData.phone.trim()) {
      newErrors.push("Phone number is required")
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-$$$$]/g, ""))) {
      newErrors.push("Please enter a valid phone number")
    }

    if (!formData.company.trim()) {
      newErrors.push("Company name is required")
    }

    if (!formData.businessType) {
      newErrors.push("Business type is required")
    }

    if (!formData.location.trim()) {
      newErrors.push("Primary location is required")
    }

    if (!formData.message.trim()) {
      newErrors.push("Business description is required")
    } else if (formData.message.trim().length < 50) {
      newErrors.push("Business description must be at least 50 characters long")
    }

    return newErrors
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors.length > 0) {
      setErrors([])
    }
    if (isSuccess) {
      setIsSuccess(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const response = await fetch("/api/partner-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Partner Application Submitted",
          description:
            "Thank you for your interest. Our partnership team will review your application and contact you within 48 hours.",
        })

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          businessType: "",
          location: "",
          message: "",
        })
      } else {
        throw new Error("Failed to submit application")
      }
    } catch (error) {
      setErrors(["Failed to submit application. Please try again or contact us directly."])
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const businessTypes = [
    "Distributor",
    "Retailer",
    "Wholesaler",
    "System Integrator",
    "Value-Added Reseller",
    "E-commerce Platform",
    "Manufacturer",
    "Service Provider",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/channel-partner">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Partner Info
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Partnership Enquiry</h1>
          <p className="text-xl max-w-3xl">
            Join our global network of successful partners. Submit your application and let's explore how we can grow
            together.
          </p>
        </div>
      </section>

      {/* Partner Application Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Partnership Application</CardTitle>
                  <CardDescription>
                    Please provide detailed information about your business. Our partnership team will review your
                    application and get back to you within 48 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                      <Mail className="h-4 w-4" />
                      <AlertDescription className="font-medium">
                        <div className="font-semibold mb-1">Application Submitted Successfully!</div>
                        <div>
                          Thank you for your partnership application. Please check your email for confirmation details.
                          Our team will review your application and contact you within 48 hours.
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {errors.length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-semibold mb-2">Please fix the following errors:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={errors.some((error) => error.includes("Full name")) ? "border-red-500" : ""}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={errors.some((error) => error.includes("email")) ? "border-red-500" : ""}
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={errors.some((error) => error.includes("Phone")) ? "border-red-500" : ""}
                          required
                        />
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company">Company Name *</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className={errors.some((error) => error.includes("Company")) ? "border-red-500" : ""}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="businessType">Business Type *</Label>
                            <Select
                              value={formData.businessType}
                              onValueChange={(value) => handleInputChange("businessType", value)}
                            >
                              <SelectTrigger
                                className={
                                  errors.some((error) => error.includes("Business type")) ? "border-red-500" : ""
                                }
                              >
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="location">Primary Location *</Label>
                            <Input
                              id="location"
                              placeholder="City, State/Province, Country"
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              className={errors.some((error) => error.includes("location")) ? "border-red-500" : ""}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <Label htmlFor="message">Tell us about your business *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your business, target markets, current product lines, distribution capabilities, and why you're interested in partnering with Fortune Info Solutions... (minimum 50 characters)"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className={errors.some((error) => error.includes("description")) ? "border-red-500" : ""}
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting Application..." : "Submit Partnership Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Submit Application</h4>
                      <p className="text-sm text-foreground">
                        Complete and submit the partnership application form.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Initial Review</h4>
                      <p className="text-sm text-foreground">
                        Our team reviews your application within 48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Discussion</h4>
                      <p className="text-sm text-foreground">
                        We schedule a call to discuss partnership opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Partnership Agreement</h4>
                      <p className="text-sm text-foreground">Finalize terms and begin our partnership journey.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Competitive pricing and margins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Marketing and sales support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Training and certification programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Dedicated account management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to exclusive products</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-4">
                    Have questions about our partnership program? Our team is here to help.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-semibold w-36 flex-shrink-0">Partnership Team:</span>
                      <span className="truncate">info@fortuneinfo.in</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-36 flex-shrink-0">Phone:</span>
                      <span className="truncate">
                        9845447654 <br />
                        9686194471
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-36 flex-shrink-0">Hours:</span>
                      <span className="truncate">Mon-Fri 9:00 AM - 7:00 PM IST</span>
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
