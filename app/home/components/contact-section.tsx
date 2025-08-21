"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  })

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (sectionRef.current) {
      // Animate Left Form
      gsap.from(leftRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      // Animate Right Info
      gsap.from(rightRef.current, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

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
            <h2 className="text-4xl font-bold mb-12 text-secondary">Send Us A Message</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-secondary text-secondary placeholder-secondary py-3 focus:border-primary focus:outline-none"
                    required={field !== "phone" ? true : false}
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

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-primary bg-transparent border-2 border-secondary rounded focus:ring-primary"
                  required
                />
                <label htmlFor="agree" className="text-secondary text-sm">
                  I agree that my data is collected and stored.
                </label>
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-[#990016] text-brand-cream px-8 py-3 rounded-full font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <div ref={rightRef}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-primary"></div>
              <span className="text-primary text-sm font-medium">Contact Us</span>
              <div className="w-1 h-6 bg-primary"></div>
            </div>

            <h2 className="text-5xl font-bold mb-8 leading-tight text-secondary">
              Your IT Solution Starts Here.
            </h2>

            <p className="text-secondary text-lg mb-12 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,
              pulvinar dapibus leo.
            </p>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Get In Touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-secondary">456 Creative District Ahmad Yani</p>
                  <p className="text-secondary">Medan, North Sumatera</p>
                </div>
                <p className="font-medium text-secondary">hola@dominantsite.com</p>
                <p className="font-medium text-secondary">555-278-4364</p>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
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
  )
}
