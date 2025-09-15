"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, Mail, Clock, User } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    priority: "medium", // default
    source: "website", // auto-filled
    status: "new", // backend required
    assignedTo: "",
    notes: [],
  })

  // GSAP refs
  const heroRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLDivElement | null>(null)
  const infoRef = useRef<HTMLDivElement | null>(null)
  const teamRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        y: 50,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      })

      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 2,
        delay: 0.3,
        ease: "power3.out",
      })

      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 2,
        delay: 0.5,
        ease: "power3.out",
      })

      gsap.from(teamRef.current, {
        y: 50,
        opacity: 0,
        duration: 2,
        delay: 0.7,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Message Sent Successfully",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        })

        setFormData({
          name: "", 
          email: "",
          phone: "",
          company: "",
          message: "",
          subject: "",
          priority: "",
          source: "",
          status: "",
          assignedTo: "",
          notes: [],
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const teamMembers = [
    {
      name: "Rajakumar",
      position: "Director",
      initials: "RK",
      image: "/placeholder-zbbr6.png",
    },
    {
      name: "Murli",
      position: "Director",
      initials: "ML",
      image: "/placeholder-zbbr6.png",
    },
    {
      name: "Pradeep",
      position: "Director",
      initials: "PD",
      image: "/placeholder-zbbr6.png",
    },
    {
      name: "Nabaratan Patra",
      position: "Director",
      initials: "NP",
      image: "https://media.licdn.com/dms/image/v2/D5603AQGumjVHvpDacA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722888955972?e=2147483647&v=beta&t=TyKDk9y8jTqc63034NwRG0MTsRm-8_Tyj94rxSRMf5E",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team to discuss your distribution needs and discover how we can help your business
            grow.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <User className="h-4 w-4" />
              Leadership Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Meet Our Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our experienced directors bring decades of expertise and visionary leadership to drive innovation and
              excellence across all business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-8 text-center">
                  <div className="relative mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={`${member.name} - ${member.position}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-xl mb-2 text-balance text-foreground group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      {member.position}
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        <span className="font-medium">Executive Leadership</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Years Combined Experience</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl font-bold text-accent mb-2">100+</div>
              <div className="text-muted-foreground">Successful Projects</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <div className="text-muted-foreground">Industry Leaders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div ref={formRef} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
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
                          required
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
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

                    {/* Subject */}
                    {/* <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                      />
                    </div> */}

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={5}
                        required
                      />
                    </div>

                    {/* Source, Priority, Status */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="source">Source *</Label>
                        <select
                          id="source"
                          value={formData.source}
                          onChange={(e) => handleInputChange("source", e.target.value)}
                          required
                          className="w-full border rounded-md p-2"
                        >
                          <option value="">Select Source</option>
                          <option value="website">Website</option>
                          <option value="phone">Phone</option>
                          <option value="email">Email</option>
                          <option value="referral">Referral</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority *</Label>
                        <select
                          id="priority"
                          value={formData.priority}
                          onChange={(e) => handleInputChange("priority", e.target.value)}
                          required
                          className="w-full border rounded-md p-2"
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status *</Label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) => handleInputChange("status", e.target.value)}
                          required
                          className="w-full border rounded-md p-2"
                        >
                          <option value="">Select Status</option>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div> */}

                    {/* Assigned To */}
                    {/* <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                      />
                    </div> */}

                    {/* Notes */}
                    {/* <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any internal notes (one per line)"
                        value={formData.notes?.join("\n") || ""}
                        onChange={(e) => handleInputChange("notes", e.target.value.split("\n"))}
                        rows={3}
                      />
                    </div> */}

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>Reach out to us through any of these channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-justify">
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        No.17/1, Old No.272, Sri Nandi, 12th Cross 8th Main Road,Wilson Garden,
                        <br />
                        Hombegowda Nagar, Bangalore - 560027
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-sm text-muted-foreground">9845447654 <br />9686194469</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-sm text-muted-foreground">info@fortuneinfo.in</p>
                      
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">9:00 am – 7:00 pm IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 text-justify">
                    We typically respond to all inquiries within 24 hours during business days. For urgent matters,
                    please call us directly.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="font-semibold text-muted-foreground">General Inquiries:</div>
                      <div>24 hours</div>
                      <div className="font-semibold text-muted-foreground">Sales Inquiries:</div>
                      <div>4-6 hours</div>
                      <div className="font-semibold text-muted-foreground">Technical Support:</div>
                      <div>2-4 hours</div>
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
