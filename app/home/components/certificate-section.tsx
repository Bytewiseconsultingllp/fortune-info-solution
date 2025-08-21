"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Certification {
  id: number
  name: string
  description: string
  logo: string
}

const certifications: Certification[] = [
  {
    id: 1,
    name: "ISO 27001 (ISMS)",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    logo: "ISO",
  },
  {
    id: 2,
    name: "ISO 9001 (QMS)",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    logo: "ISO",
  },
  {
    id: 3,
    name: "Microsoft Certified Partner",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    logo: "MS",
  },
  {
    id: 4,
    name: "AWS Certified Partner",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    logo: "AWS",
  },
]

export function CertificationsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length) {
      // Animate Section Heading
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".heading"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      )

      // Animate Cards
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 md:px-8 lg:px-16 border-t"
      style={{ borderColor: "rgba(184,0,31,0.3)", backgroundColor: "#FDFAF6" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Optional Section Heading */}
        <div className="text-center mb-12 heading">
          <h2 className="text-3xl font-bold mb-2 text-secondary">
            Our Certifications
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            We partner with world-class organizations to ensure the highest standards.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="flex items-center gap-4 p-4 rounded-lg border shadow-sm transition-shadow duration-300 hover:shadow-brand-red/30"
              style={{ borderColor: "rgba(184,0,31,0.3)", backgroundColor: "#FFFFFF" }}
            >
              <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-brand-red bg-brand-cream">
                <span className="text-brand-red font-bold text-sm">{cert.logo}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-brand-red">{cert.name}</h4>
                <p className="text-secondary text-sm leading-relaxed">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
