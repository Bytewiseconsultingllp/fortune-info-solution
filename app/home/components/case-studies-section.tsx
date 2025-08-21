"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface CaseStudy {
  id: number
  title: string
  company: string
  metric: string
  problem: string
  image: string
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Enhancing Supply Chain Efficiency",
    company: "LogiChain Partners",
    metric: "Improved delivery accuracy",
    problem:
      "Inefficient inventory tracking and delayed shipments were causing client dissatisfaction and revenue loss.",
    image: "/placeholder.svg?height=400&width=400&text=Supply+Chain+Worker",
  },
  {
    id: 2,
    title: "Transforming Online Retail With AI",
    company: "ShopSphere Inc",
    metric: "Increased sales",
    problem:
      "Low customer engagement and declining sales due to outdated systems and lack of personalized recommendations.",
    image: "/placeholder.svg?height=400&width=400&text=Retail+Worker",
  },
  {
    id: 3,
    title: "Securing Healthcare Systems",
    company: "HealthPro Systems",
    metric: "Reduce Operational Cost",
    problem:
      "Outdated IT infrastructure and non-compliance with data security regulations hindered operational efficiency.",
    image: "/placeholder.svg?height=400&width=400&text=Healthcare+Professionals",
  },
]

export function CaseStudiesSection() {
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
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 heading">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-1 h-6 bg-brand-red"></div>
            <span className="text-sm font-medium brand-red">Case Studies</span>
            <div className="w-1 h-6 bg-brand-red"></div>
          </div>

          <h2 className="text-5xl font-bold mb-8 leading-tight text-secondary">
            Real Solutions, Real Impact.
          </h2>

          <p className="text-lg max-w-4xl mx-auto leading-relaxed text-secondary">
            Mauris hendrerit urna sit amet sem sagittis, eu consequat nisl fermentum.
            Fusce dui ligula, rutrum ac felis sit amet, sollicitudin accumsan justo. Suspendisse potenti.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="rounded-2xl overflow-hidden border border-brand-red/30 shadow-lg bg-brand-red/5 transition-shadow duration-300 hover:shadow-brand-red/30"
            >
              <div className="relative h-64">
                <Image
                  src={study.image || "/placeholder.svg"}
                  alt={study.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary">{study.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                  <span className="text-sm font-medium brand-red">{study.company}</span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                  <span className="text-sm font-medium brand-red">{study.metric}</span>
                </div>
                <p className="mb-6 leading-relaxed text-secondary">{study.problem}</p>
                <button className="flex items-center gap-2 font-medium text-brand-red hover:text-brand-red/80 transition-colors duration-300">
                  Read More <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
