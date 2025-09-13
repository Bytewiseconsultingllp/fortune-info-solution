"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(leftRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(rightRef.current, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

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
        toast.success("Message Sent Successfully", {
          description:
            "Thank you for contacting us. We'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Error", {
        description:
          "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16"
      style={{ backgroundColor: "#FDFAF6" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Side - Contact Form */}
          <div ref={leftRef}>
            <h2 className="text-4xl font-bold mb-12 text-secondary">
              Send Us A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {["name", "email", "phone", "company"].map((field) => (
                <div key={field}>
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-secondary text-secondary placeholder-secondary py-3 focus:border-primary focus:outline-none"
                    required={field !== "phone"}
                  />
                </div>
              ))}

              <div>
                <textarea
                  name="message"
                  placeholder="How can we help you? Feel free to get in touch."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-secondary text-secondary placeholder-secondary py-3 focus:border-primary focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-[#990016] text-brand-cream px-8 py-3 rounded-full font-medium transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <div ref={rightRef}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-primary"></div>
              <span className="text-primary text-sm font-medium">
                Contact Us
              </span>
              <div className="w-1 h-6 bg-primary"></div>
            </div>

            <h2 className="text-5xl font-bold mb-8 leading-tight text-secondary">
              Your IT Solution Starts Here.
            </h2>

            <div className="mb-12">
              <p className="text-secondary text-lg mb-4 leading-relaxed">
                We typically respond to all inquiries within 24 hours during business days.
                <br /> For urgent matters, please call us directly.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-secondary text-lg">
                <div className="font-semibold">General Inquiries:</div>
                <div>24 hours</div>
                <div className="font-semibold">Sales Inquiries:</div>
                <div>4-6 hours</div>
                <div className="font-semibold">Technical Support:</div>
                <div>2-4 hours</div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-secondary">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-primary">
                      {/* Address icon from lucide-react */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                    </span>
                    <p className="text-primary">
                      No.17/1, Old No.272, Sri Nandi, 12th Cross 8th Main Road,
                      Wilson Garden, Hombegowda Nagar, Bangalore, India - 560027
                    </p>
                  </div>
                  <p className="text-secondary"></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-primary">
                    {/* Email icon from lucide-react */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <p className="font-medium text-primary">
                    info@fortuneinfo.in
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-primary">
                    {/* Phone icon from lucide-react */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.63 19.86 19.86 0 0 1 0 2.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <p className="font-medium text-primary">
                    9845447654 <br />
                    9686194469
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="w-12 h-12 border-2 border-secondary rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Icon className="w-5 h-5 text-secondary hover:text-primary" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
