"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import AwardsHeroSection from "@/components/awards-hero-section"
import { CertificationsSection } from "../home/components/certificate-section"  // ✅ import your section

gsap.registerPlugin(ScrollTrigger)

export default function AwardsPage() {
  const awardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (awardsRef.current) {
        gsap.from(awardsRef.current.querySelectorAll("h2, p"), {
          y: 50,
          opacity: 0,
          duration: 2,
          stagger: 0.2,
          scrollTrigger: {
            trigger: awardsRef.current,
            start: "top 80%",
          },
        })

        gsap.from(awardsRef.current.querySelectorAll(".card"), {
          opacity: 0,
          y: 50,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: awardsRef.current,
            start: "top 75%",
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <AwardsHeroSection />

      {/* Certifications Section */}
      <CertificationsSection />  {/* ✅ plugged in here */}

      <Footer />
    </div>
  )
}
