"use client"

import { useState, useEffect } from "react"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Service } from "@/lib/models"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services")
        if (response.ok) {
          const data = await response.json()
          console.log("Fetched services:", data.services)
          setServices(data.services || [])
        } else {
          console.error("Failed to fetch services:", response.statusText)
          setServices([])
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary  text-primary-foreground py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-56">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto ">
            Comprehensive distribution and logistics solutions designed to help your business reach new heights and
            expand into global markets.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Distribution Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From sourcing to delivery, we provide end-to-end services that streamline your operations and accelerate
              your growth.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full">
                  <div className="aspect-video bg-muted animate-pulse rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-3 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={service._id} className="h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={service.image || "/placeholder-image.png"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="flex-1">
                    {/* <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.price && <Badge variant="outline">{service.price}</Badge>}
                    </div> */}
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                    {service.duration && <p className="text-sm text-muted-foreground">Duration: {service.duration}</p>}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full" asChild>
                      <Link
                        href={`/contact`}
                      >
                        Contact Us  <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our team to discuss your specific requirements and learn how our services can help your business
            grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/channel-partner">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
