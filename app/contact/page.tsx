// "use client";

// import type React from "react";
// import { useState } from "react";
// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import { assign } from "nodemailer/lib/shared";

// export default function ContactPage() {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   company: "",
//   //   message: "",
//   // })
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     subject: "",
//     message: "",
//     priority: "medium", // default
//     source: "website", // auto-filled
//     status: "new", // backend required, default set here
//     assignedTo: "", // optional
//     notes: [], // optional, array of strings
//   });

//   const handleInputChange = (field: string, value: string | string[]) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast({
//           title: "Message Sent Successfully",
//           description:
//             "Thank you for contacting us. We'll get back to you within 24 hours.",
//         });

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           company: "",
//           message: "",
//           subject: "",
//           priority: "",
//           source: "",
//           status: "",
//           assignedTo: "",
//           notes: [],

//         });
//       } else {
//         throw new Error("Failed to send message");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           "Failed to send message. Please try again or contact us directly.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       {/* Hero Section */}
//       <section className="bg-primary text-primary-foreground py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
//           <p className="text-xl max-w-3xl mx-auto">
//             Get in touch with our team to discuss your distribution needs and
//             discover how we can help your business grow.
//           </p>
//         </div>
//       </section>

//       {/* Contact Form & Info */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Contact Form */}
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Send us a Message</CardTitle>
//                   <CardDescription>
//                     Fill out the form below and our team will get back to you
//                     within 24 hours.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name & Email */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="name">Full Name *</Label>
//                         <Input
//                           id="name"
//                           value={formData.name}
//                           onChange={(e) =>
//                             handleInputChange("name", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="email">Email Address *</Label>
//                         <Input
//                           id="email"
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) =>
//                             handleInputChange("email", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     </div>

//                     {/* Phone & Company */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="phone">Phone Number *</Label>
//                         <Input
//                           id="phone"
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) =>
//                             handleInputChange("phone", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="company">Company Name</Label>
//                         <Input
//                           id="company"
//                           value={formData.company}
//                           onChange={(e) =>
//                             handleInputChange("company", e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* Subject */}
//                     <div>
//                       <Label htmlFor="subject">Subject</Label>
//                       <Input
//                         id="subject"
//                         value={formData.subject}
//                         onChange={(e) =>
//                           handleInputChange("subject", e.target.value)
//                         }
//                       />
//                     </div>

//                     {/* Message */}
//                     <div>
//                       <Label htmlFor="message">Message *</Label>
//                       <Textarea
//                         id="message"
//                         placeholder="Please describe your inquiry, requirements, or how we can help you..."
//                         value={formData.message}
//                         onChange={(e) =>
//                           handleInputChange("message", e.target.value)
//                         }
//                         rows={5}
//                         required
//                       />
//                     </div>

//                     {/* Source, Priority, Status */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <Label htmlFor="source">Source *</Label>
//                         <select
//                           id="source"
//                           value={formData.source}
//                           onChange={(e) =>
//                             handleInputChange("source", e.target.value)
//                           }
//                           required
//                           className="w-full border rounded-md p-2"
//                         >
//                           <option value="">Select Source</option>
//                           <option value="website">Website</option>
//                           <option value="phone">Phone</option>
//                           <option value="email">Email</option>
//                           <option value="referral">Referral</option>
//                         </select>
//                       </div>
//                       <div>
//                         <Label htmlFor="priority">Priority *</Label>
//                         <select
//                           id="priority"
//                           value={formData.priority}
//                           onChange={(e) =>
//                             handleInputChange("priority", e.target.value)
//                           }
//                           required
//                           className="w-full border rounded-md p-2"
//                         >
//                           <option value="">Select Priority</option>
//                           <option value="low">Low</option>
//                           <option value="medium">Medium</option>
//                           <option value="high">High</option>
//                         </select>
//                       </div>
//                       <div>
//                         <Label htmlFor="status">Status *</Label>
//                         <select
//                           id="status"
//                           value={formData.status}
//                           onChange={(e) =>
//                             handleInputChange("status", e.target.value)
//                           }
//                           required
//                           className="w-full border rounded-md p-2"
//                         >
//                           <option value="">Select Status</option>
//                           <option value="new">New</option>
//                           <option value="contacted">Contacted</option>
//                           <option value="in_progress">In Progress</option>
//                           <option value="resolved">Resolved</option>
//                           <option value="closed">Closed</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* Assigned To */}
//                     <div>
//                       <Label htmlFor="assignedTo">Assigned To</Label>
//                       <Input
//                         id="assignedTo"
//                         value={formData.assignedTo}
//                         onChange={(e) =>
//                           handleInputChange("assignedTo", e.target.value)
//                         }
//                       />
//                     </div>

//                     {/* Notes */}
//                     <div>
//                       <Label htmlFor="notes">Notes</Label>
//                       <Textarea
//                         id="notes"
//                         placeholder="Add any internal notes (one per line)"
//                         value={formData.notes?.join("\n") || ""}
//                         onChange={(e) =>
//                           handleInputChange("notes", e.target.value.split("\n"))
//                         }
//                         rows={3}
//                       />
//                     </div>

//                     {/* Submit */}
//                     <Button
//                       type="submit"
//                       className="w-full"
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Sending..." : "Send Message"}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Contact Information */}
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Get in Touch</CardTitle>
//                   <CardDescription>
//                     Reach out to us through any of these channels
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold">Address</h4>
//                       <p className="text-sm text-muted-foreground">
//                         123 Business District
//                         <br />
//                         Corporate City, CC 12345
//                         <br />
//                         United States
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold">Phone</h4>
//                       <p className="text-sm text-muted-foreground">
//                         +1 (555) 123-4567
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         +1 (555) 123-4568 (Sales)
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold">Email</h4>
//                       <p className="text-sm text-muted-foreground">
//                         info@fortuneinfosolutions.com
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         sales@fortuneinfosolutions.com
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold">Business Hours</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Monday - Friday: 9:00 AM - 6:00 PM EST
//                         <br />
//                         Saturday: 10:00 AM - 4:00 PM EST
//                         <br />
//                         Sunday: Closed
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Quick Response</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     We typically respond to all inquiries within 24 hours during
//                     business days. For urgent matters, please call us directly.
//                   </p>
//                   <div className="space-y-2 text-sm">
//                     <p>
//                       <strong>General Inquiries:</strong> 24 hours
//                     </p>
//                     <p>
//                       <strong>Sales Inquiries:</strong> 4-6 hours
//                     </p>
//                     <p>
//                       <strong>Technical Support:</strong> 2-4 hours
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

  // GSAP refs
  const heroRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        y: 50,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 2,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 2,
        delay: 0.5,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully",
          description:
            "Thank you for contacting us. We'll get back to you within 24 hours.",
        });

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
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="bg-primary text-primary-foreground py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team to discuss your distribution needs and
            discover how we can help your business grow.
          </p>
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
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* form stays unchanged */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry..."
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        rows={5}
                        required
                      />
                    </div>

                    {/* Source, Priority, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="source">Source *</Label>
                        <select
                          id="source"
                          value={formData.source}
                          onChange={(e) =>
                            handleInputChange("source", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("priority", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
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
                    </div>

                    {/* Assigned To */}
                    <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={(e) =>
                          handleInputChange("assignedTo", e.target.value)
                        }
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any internal notes (one per line)"
                        value={formData.notes?.join("\n") || ""}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value.split("\n"))
                        }
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-6">
              {/* cards unchanged */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Business District
                        <br />
                        Corporate City, CC 12345
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-sm text-muted-foreground">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +1 (555) 123-4568 (Sales)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-sm text-muted-foreground">
                        info@fortuneinfosolutions.com
                      </p>
                      <p className="text-sm text-muted-foreground">
                        sales@fortuneinfosolutions.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                        <br />
                        Saturday: 10:00 AM - 4:00 PM EST
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    We typically respond to all inquiries within 24 hours during
                    business days. For urgent matters, please call us directly.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>General Inquiries:</strong> 24 hours
                    </p>
                    <p>
                      <strong>Sales Inquiries:</strong> 4-6 hours
                    </p>
                    <p>
                      <strong>Technical Support:</strong> 2-4 hours
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
  );
}
