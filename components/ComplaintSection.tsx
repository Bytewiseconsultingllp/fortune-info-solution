"use client"

import { useState } from "react"
import { AlertCircle, Clock, Mail, MapPin, Phone } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ComplaintSection() {
  const [complaint, setComplaint] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    orderId: "",
    message: "",
  })

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [submittedComplaintNumber, setSubmittedComplaintNumber] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: any = {}
    if (!complaint.name.trim()) newErrors.name = "Name is required"
    if (!complaint.email.trim()) newErrors.email = "Email is required"
    if (!complaint.phone.trim()) newErrors.phone = "Phone is required"
    if (!complaint.message.trim()) newErrors.message = "Complaint details are required"
    if (!complaint.orderId.trim()) newErrors.orderId = "Order Number are required"


    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      setLoading(true)
      const resp = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      })

      const data = await resp.json()

      if (resp.ok && data.success) {
        setSubmittedComplaintNumber(data.complaintNumber) // save complaint number
        setComplaint({
          name: "",
          email: "",
          phone: "",
          type: "",
          orderId: "",
          message: "",
        })
        setErrors({})
      } else {
        throw new Error(data.error || "Submission failed")
      }
    } catch (error) {
      alert("We couldn’t submit your complaint. Please try again later.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <AlertCircle className="h-4 w-4" />
            Customer Complaints
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Report an Issue</h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            If you’ve experienced any issues with our distribution or services, let us know.  
            We aim to resolve every complaint within <strong>48 hours</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>File a Complaint</CardTitle>
              <CardDescription>
                Provide details of the problem so our support team can assist you quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submittedComplaintNumber && (
                <div className="bg-green-100 text-green-900 p-4 rounded mb-4">
                  Your complaint has been submitted successfully. <br />
                  Complaint Number: <strong>{submittedComplaintNumber}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaintName">Full Name *</Label>
                    <Input
                      id="complaintName"
                      placeholder="Enter your full name"
                      value={complaint.name}
                      onChange={(e) => setComplaint((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="complaintEmail">Email *</Label>
                    <Input
                      id="complaintEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={complaint.email}
                      onChange={(e) => setComplaint((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone & Complaint Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaintPhone">Phone *</Label>
                    <Input
                      id="complaintPhone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={complaint.phone}
                      onChange={(e) => setComplaint((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="complaintType">Complaint Type (optional)</Label>
                    <Input
                      id="complaintType"
                      placeholder="Delivery Delay, Damaged Item, etc."
                      value={complaint.type}
                      onChange={(e) => setComplaint((prev) => ({ ...prev, type: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Order ID */}
                <div>
                  <Label htmlFor="orderId">Order/Invoice ID *</Label>
                  <Input
                    id="orderId"
                    placeholder="Enter reference number"
                    value={complaint.orderId}
                    onChange={(e) => setComplaint((prev) => ({ ...prev, orderId: e.target.value }))}
                  />
                  {errors.orderId && <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>}

                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="complaintMsg">Complaint Details *</Label>
                  <Textarea
                    id="complaintMsg"
                    rows={5}
                    placeholder="Describe the issue you faced…"
                    value={complaint.message}
                    onChange={(e) => setComplaint((prev) => ({ ...prev, message: e.target.value }))}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Side Info */}
          <div className="space-y-6 text-foreground">
           <Card className="p-6 rounded-lg shadow-sm bg-accent-foreground space-y-4">
              <h3 className="text-2xl font-bold text-secondary">How We Handle Complaints</h3>

              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li><span className="font-medium">Acknowledgement:</span> We acknowledge receipt within <strong>2 hours</strong> of submission.</li>
                <li><span className="font-medium">Dedicated Support:</span> A support executive is assigned to your case.</li>
                <li><span className="font-medium">Timely Updates:</span> We provide a resolution or status update within <strong>48 hours</strong>.</li>
                <li><span className="font-medium">Escalation:</span> If unresolved, the issue is escalated to management automatically.</li>
              </ul>

              <p className="text-sm text-gray-800">
                <span className="font-medium">Urgent concern?</span> Call us directly at{" "}
                <span className="font-semibold text-primary">9686194471</span> or{" "}
                <span className="font-semibold text-primary">9845447654</span>
              </p>
            </Card>
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
                                <p className="text-sm text-foreground">
                                  # 17/1, Old # 272, Sri Nandi,
                                  <br />
                                  12th Cross, 8th Main Road, Wilson Garden,
                                  <br />
                                  Hombegowda Nagar, Bangalore - 560027
                                  <br />
                                </p>
                              </div>
                            </div>
          
                            <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-sm text-foreground">
                                  9686194471, 9845447654
                                  
                                </p>
                              </div>
                            </div>
          
                            <div className="flex items-start gap-3">
                              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold">Email</h4>
                                <p className="text-sm text-foreground">info@fortuneinfo.in</p>
                              </div>
                            </div>
          
                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />

                              <div>
                                <h4 className="font-semibold">Business Hours</h4>
                                <p className="text-sm text-foreground">10:00 AM – 07:00 PM</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
          </div>


        </div>
      </div>
    </section>
  )
}
