"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Star, Medal } from "lucide-react"
import AwardsHeroSection from "@/components/awards-hero-section"

gsap.registerPlugin(ScrollTrigger)

export default function AwardsPage() {
  const awardsRef = useRef<HTMLDivElement>(null)
  const certsRef = useRef<HTMLDivElement>(null)

  const awards = [
    {
      title: "Best Distribution Company 2023",
      organization: "Global Trade Excellence Awards",
      year: "2023",
      description: "Recognized for outstanding performance in international distribution and customer satisfaction.",
      icon: Trophy,
    },
    {
      title: "Innovation in Logistics Award",
      organization: "Supply Chain Management Institute",
      year: "2022",
      description: "Awarded for implementing cutting-edge technology solutions in supply chain management.",
      icon: Star,
    },
    {
      title: "Customer Service Excellence",
      organization: "Business Excellence Foundation",
      year: "2022",
      description: "Honored for maintaining the highest standards of customer service and support.",
      icon: Award,
    },
    {
      title: "Sustainable Business Practices",
      organization: "Green Business Council",
      year: "2021",
      description: "Recognized for commitment to environmental sustainability and responsible business practices.",
      icon: Medal,
    },
    {
      title: "Top Employer Award",
      organization: "HR Excellence Institute",
      year: "2021",
      description: "Acknowledged for creating an exceptional workplace culture and employee development programs.",
      icon: Trophy,
    },
    {
      title: "Digital Transformation Leader",
      organization: "Technology Innovation Awards",
      year: "2020",
      description: "Celebrated for successful digital transformation initiatives and technology adoption.",
      icon: Star,
    },
  ]

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "Quality Management Systems",
      validUntil: "2025",
    },
    {
      title: "ISO 14001:2015",
      description: "Environmental Management Systems",
      validUntil: "2025",
    },
    {
      title: "ISO 45001:2018",
      description: "Occupational Health and Safety Management",
      validUntil: "2024",
    },
    {
      title: "OHSAS 18001",
      description: "Occupational Health and Safety Assessment",
      validUntil: "2024",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Titles & subtitles
      gsap.utils.toArray([awardsRef.current, certsRef.current]).forEach((section) => {
        if (section instanceof Element) {
          gsap.from(section.querySelectorAll("h2, p"), {
            y: 50,
            opacity: 0,
            duration: 2,
            stagger: 0.2,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          })
        }
      })

      // Randomized card animations
      const directions = [
        { x: -100, y: 0 }, // from left
        { x: 100, y: 0 }, // from right
        { x: 0, y: -100 }, // from top
        { x: 0, y: 100 }, // from bottom
        { scale: 0.8 }, // zoom in
      ]

      const animateCards = (cards: NodeListOf<Element>, trigger: HTMLElement | null) => {
        cards.forEach((card, i) => {
          const dir = directions[Math.floor(Math.random() * directions.length)]
          gsap.from(card, {
            ...dir,
            opacity: 0,
            duration: 2,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trigger,
              start: "top 75%",
            },
          })
        })
      }

      if (awardsRef.current) {
        animateCards(awardsRef.current.querySelectorAll(".card"), awardsRef.current)
      }
      if (certsRef.current) {
        animateCards(certsRef.current.querySelectorAll(".card"), certsRef.current)
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <AwardsHeroSection />

      {/* Awards Section */}
      <section ref={awardsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry Awards</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our achievements reflect our dedication to providing exceptional service and maintaining the highest
              industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => {
              const IconComponent = award.icon
              return (
                <Card key={index} className="h-full card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{award.year}</Badge>
                    </div>
                    <CardTitle className="text-xl">{award.title}</CardTitle>
                    <CardDescription className="font-medium text-primary text-justify">{award.organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-justify">{award.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section ref={certsRef} className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our certifications demonstrate our commitment to quality, safety, and environmental responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center card">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Valid until {cert.validUntil}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
