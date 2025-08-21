"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const countRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (heroRef.current) {
      // Staggered fade-in animation for headings, paragraph, and button
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      })
    }

    // Count-up animation
    if (countRef.current) {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: 172,
        duration: 2,
        ease: "power1.out",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = `${Math.floor(obj.value)}k+`
        },
      })
    }
  }, [])

  return (
    <section
      className="relative h-screen flex items-center"
      style={{ backgroundColor: "#FDFAF6" }}
    >
      {/* Background Image - overlay remains */}
      <div className="absolute inset-0 -top-32">
        <Image
          src="/placeholder.svg?height=1200&width=1920&text=Professional+in+Server+Room"
          alt="Professional in server room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div
        ref={heroRef}
        className="relative z-10 w-full px-4 md:px-8 lg:px-16 pt-32"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1
              className="text-6xl md:text-7xl font-bold mb-8 leading-tight"
              style={{ color: "#000000" }}
            >
              Future-Proof
              <br />
              Your Business.
            </h1>

            <p
              className="text-xl mb-12 leading-relaxed"
              style={{ color: "#000000" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,
              pulvinar.
            </p>

            <div className="flex items-center gap-8">
              <button
                className="px-8 py-4 rounded-full text-lg font-medium transition-colors"
                style={{
                  backgroundColor: "#B8001F",
                  color: "#FDFAF6",
                }}
              >
                Contact Us
              </button>

              <div>
                <div
                  ref={countRef}
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#000000" }}
                >
                  0k+
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "#B8001F" }}
                >
                  Projects Completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
