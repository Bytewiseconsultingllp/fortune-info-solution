"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Header from "@/app/home/components/navigation/Header";
import Footer from "@/components/footerSection";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ComplaintSection } from "@/components/ComplaintSection";
import Image from "next/image";
import { FaWhatsapp, FaGoogle, FaMicrosoft } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState<number | null>(null);
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

  // const [complaint, setComplaint] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   type: "",
  //   orderId: "",
  //   message: "",
  // })

  const heroRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);

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

      gsap.from(teamRef.current, {
        y: 50,
        opacity: 0,
        duration: 2,
        delay: 0.7,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
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
          priority: "medium",
          source: "website",
          status: "new",
          assignedTo: "",
          notes: [],
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setErrors({
        submit:
          "Failed to send message. Please try again or contact us directly.",
      });
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

  const teamMembers = [
    {
      name: "Rajakumar A",
      position: "Director",
      image: "/rajakuamr.jpg",
      email: "rajakumar@fortuneinfo.in",
      phone: 9686194476,
    },
    {
      name: "Murali K",
      position: "Director",
      image: "/maruli.jpg",
      email: "murali@fortuneinfo.in",
      phone: 9686194471,
    },
    {
      name: "Pradeep NP",
      position: "SVP Business Management",
      image: "/pradeep.jpg",
      email: "pradeepnp@fortuneinfo.in",
      phone: 9845447654,
    },
    {
      name: "HariKarthick",
      position: "Director - Fire & Security",
      initials: "",
      image: "/HariKarthick.jpeg",
      email: "Hari.Karthick@fortuneinfo.in",
      phone: 9042909567,
    },
    {
      name: "Dhananjaya M N",
      position: "Product Manager",
      initials: "Honeywell",
      image: "/dhanjay.jpg",
      email: "dhananjaya@fortuneinfo.in",
      phone: 8792090254,
    },
    {
      name: "Chandrashekar Udupa",
      position: "Product Manager",
      initials: "Dell",
      image: "/chandrashaker.jpg",
      email: "chandru@fortuneinfo.in",
      phone: 9886075110,
    },
    {
      name: "Sunil Kumar",
      position: "Product Manager",
      initials: "Lenovo",
      image: "/Sunil.jpg",
      email: "systems@fortuneinfo.in",
      phone: 9686194469,
    },
    {
      name: "Rajkiran Reddy",
      position: "Product Manager",
      initials: "Networking Products",
      image: "/Rajkiran.jpg",
      email: "rajkiran@fortuneinfo.in",
      phone: 8904502942,
    },
    {
      name: "Adithya Nair",
      position: "Support Manager",
      initials: "Lenovo",
      image: "/nair.jpg",
      email: "systems@fortuneinfo.in",
      phone: 8147900780,
    },
    {
      name: "Arjun Nair",
      position: "Operations Manager",
      initials: "Hp",
      image: "/arjun.jpg",
      email: "arjun@fortuneinfo.in",
      phone: 8073786464,
    },
  ];

  const remainder = teamMembers.length % 4;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        ref={heroRef}
        className="bg-primary text-primary-foreground py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center text-center h-56">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team to discuss your distribution needs and
            discover how we can help your business grow.
          </p>
        </div>
      </section>

      <section
        ref={teamRef}
        className="py-20 bg-gradient-to-br from-background via-muted/20 to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              <User className="h-4 w-4" />
              Leadership Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              Our experienced directors bring decades of expertise and visionary
              leadership to drive innovation and excellence across all business
              operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="h-full">
                <Card className="group relative h-full flex flex-col border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardContent className="relative py-6 px-4 text-center flex-1 flex flex-col">
                    <div className="relative mb-4">
                      <div className="relative mx-auto w-24 h-32">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={member.image || "/placeholder.svg"}
                            alt={`${member.name} - ${member.position}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                      </div>
                      
                      {member.email && (
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg -mr-2 -mt-2">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="font-extrabold text-xl mb-1 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 h-12 flex items-center justify-center">
                        {member.name}
                      </h3>
                      
                      <div className="min-h-[32px] flex items-center justify-center">
                        <div className="inline-flex items-center gap-1 bg-muted text-foreground px-3 py-1 rounded-full text-xs font-medium text-center line-clamp-2">
                          {member.position}
                          {member.initials && ` - ${member.initials}`}
                        </div>
                      </div>

                      {member.email && (
                        <div className="mt-auto">
                          <div className="flex items-center justify-center gap-2 text-sm text-foreground/80 mb-2 min-h-[24px]">
                            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">
                              {member.email.trim()}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-border/30">
                            <div className="flex items-center justify-center gap-3">
                              <DropdownMenu onOpenChange={(open) => setEmailDropdownOpen(open ? index : null)}>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    aria-label={`Email ${member.name}`}
                                    className="inline-flex items-center justify-center rounded-full p-2 text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setEmailDropdownOpen(emailDropdownOpen === index ? null : index);
                                    }}
                                  >
                                    <Mail className="h-5 w-5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="w-48">
                                  <a 
                                    href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(member.email)}&su=${encodeURIComponent(`Hello ${member.name}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                    onClick={() => setEmailDropdownOpen(null)}
                                  >
                                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                      <FaGoogle className="h-4 w-4 text-red-500" />
                                      <span>Gmail</span>
                                    </DropdownMenuItem>
                                  </a>
                                  <a 
                                    href={`https://outlook.live.com/mail/deeplink/compose?to=${encodeURIComponent(member.email)}&subject=${encodeURIComponent('Hello ' + member.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                    onClick={() => setEmailDropdownOpen(null)}
                                  >
                                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                      <FaMicrosoft className="h-4 w-4 text-blue-500" />
                                      <span>Outlook</span>
                                    </DropdownMenuItem>
                                  </a>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              {member.phone && (
                                <a
                                  href={`https://wa.me/91${member.phone.toString().replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-full p-2 text-foreground/70 hover:text-green-500 hover:bg-muted transition-colors"
                                  aria-label={`WhatsApp ${member.name}`}
                                >
                                  <FaWhatsapp className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComplaintSection />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  {isSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Message sent successfully!</strong> Please check
                        your email for confirmation. We'll get back to you
                        within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Please fix the following errors:</strong>
                        <ul className="mt-2 list-disc list-inside space-y-1">
                          {Object.entries(errors).map(([field, error]) => (
                            <li key={field} className="text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={errors.name ? "border-red-500" : ""}
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
                          className={errors.email ? "border-red-500" : ""}
                        />
                      </div>
                    </div>

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
                          className={errors.phone ? "border-red-500" : ""}
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
                        className={errors.message ? "border-red-500" : ""}
                      />
                    </div>

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

            <div ref={infoRef} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Response</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-foreground mb-4 text-justify">
                    We typically respond to all inquiries within 24 hours during
                    business days. For urgent matters, please call us directly.
                  </p>

                  <div className="grid grid-cols-[max-content_auto] text-secondary text-lg">
                    <div className="font-semibold flex items-center">
                      General Inquiries<span className="px-8">:</span>
                    </div>
                    <div className="flex items-center">24 hours</div>

                    <div className="font-semibold flex items-center">
                      Sales Inquiries<span className="px-13">:</span>
                    </div>
                    <div className="flex items-center">4–6 hours</div>

                    <div className="font-semibold flex items-center">
                      Technical Support<span className="px-5">:</span>
                    </div>
                    <div className="flex items-center">2–4 hours</div>
                  </div>

                  {/* Image Below */}
                  <div className="w-full">
                    <Image
                      src="/quick.png"
                      alt="Quick Response Illustration"
                      width={800}
                      height={400}
                      className="w-full h-auto rounded-md object-cover"
                    />
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
