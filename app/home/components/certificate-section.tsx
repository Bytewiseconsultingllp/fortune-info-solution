"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Certification {
  id: number
  name: string
  description: string
  logo: string
  image: string // ✅ replaced pdf with image
}

const certifications: Certification[] = [
  {
    id: 1,
    name: "FSAI Certificate",
    description: "",
    logo: "FSAI",
    image: "/certificate/fsai.jpg",
  },
  {
    id: 2,
    name: "MSME Certified",
    description: "",
    logo: "MSME",
    image: "/certificate/udyam.jpg",
  },
  {
    id: 3,
    name: "Honeywell Security Partner",
    description: "",
    logo: "HW",
    image: "/certificate/fir1.jpg",
  },
  {
    id: 4,
    name: "Honeywell Fire Partner",
    description: "",
    logo: "GeM",
    image: "/certificate/fire2.jpg",
  },
]

export function CertificationsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".heading"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      )
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
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
        <div className="text-center mb-12 heading">
          <h2 className="text-3xl font-bold mb-2 text-secondary">
            Our Certifications
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            We partner with world-class organizations to ensure the highest standards.
          </p>
        </div>

        {/* ✅ 2 columns grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {certifications.map((cert, index) => {
            const isLandscape = index >= 2 // items 3 & 4
            return (
              <div
                key={cert.id}
                ref={(el) => el && (cardsRef.current[index] = el)}
                className="flex flex-col gap-4 p-4 rounded-lg border shadow-sm hover:shadow-brand-red/30 transition-shadow duration-300"
                style={{ borderColor: "rgba(184,0,31,0.3)", backgroundColor: "#FFFFFF" }}
              >
                <div>
                  <h4 className="text-lg font-bold mb-1 text-brand-red">{cert.name}</h4>
                  <p className="text-secondary text-sm leading-relaxed">{cert.description}</p>
                </div>

                {/* ✅ Image Preview instead of PDF */}
                <div
                  className={`border rounded-md overflow-hidden w-full flex items-center justify-center bg-gray-50 ${
                    isLandscape ? "h-80" : "h-140"
                  }`}
                >
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    width={500}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
