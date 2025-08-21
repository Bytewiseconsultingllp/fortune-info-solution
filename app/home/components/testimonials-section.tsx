"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  id: number
  name: string
  company: string
  rating: number
  testimonial: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lisa Gimenez",
    company: "Director of FinEdge Group",
    rating: 99,
    testimonial:
      "Their Blockchain Solution Streamlined Our Transactions And Eliminated Fraud Risks. Exceptional Expertise And Flawless Execution!",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Li-Won Xing",
    company: "Head of Tech of EcoTech Solutions",
    rating: 99,
    testimonial:
      "The IoT Monitoring System Improved Energy Efficiency By 30%. Their Dedication To Sustainable Innovation Was Unmatched.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    company: "CTO of DataFlow Inc",
    rating: 98,
    testimonial:
      "Outstanding cloud migration services that reduced our operational costs by 40%. The team's expertise in modern infrastructure is remarkable.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Michael Chen",
    company: "VP of SecureBank Corp",
    rating: 97,
    testimonial:
      "Their cybersecurity implementation protected us from multiple threats. Professional, reliable, and incredibly knowledgeable team.",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const leftBoxRef = useRef<HTMLDivElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? testimonials.length - 2 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const totalSlides = testimonials.length - 1

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate header
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Animate left rating box
    gsap.fromTo(
      leftBoxRef.current,
      { opacity: 0, x: -80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Animate testimonials carousel
    gsap.fromTo(
      carouselRef.current,
      { opacity: 0, x: 80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 relative bg-slate-950"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div ref={headerRef} className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-red-500"></div>
            <span className="text-red-400 text-sm font-medium">
              Testimonials
            </span>
            <div className="w-1 h-6 bg-red-500"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Trusted By Global Leaders.
              </h2>
            </div>
            <div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Mauris hendrerit urna sit amet sem sagittis, eu consequat nisl
                fermentum. Fusce dui ligula, rutrum ac felis sit amet,
                sollicitudin accums justo. Suspendisse potenti.
              </p>
            </div>
          </div>
        </div>

        {/* Rating + Testimonials */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Rating Box */}
          <div
            ref={leftBoxRef}
            className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 shadow-lg"
          >
            <div className="mb-8">
              <div className="text-7xl font-bold text-white mb-4">4.9</div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-red-500 text-red-500"
                  />
                ))}
              </div>
              <p className="text-gray-400 text-lg mb-8">(3,700 Reviews)</p>
            </div>

            <h3 className="text-3xl font-bold text-white mb-8">
              Client Voices,
              <br />
              Powerful Results.
            </h3>

            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md">
              More Testimonials
            </button>
          </div>

          {/* Right Testimonials Carousel */}
          <div ref={carouselRef}>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out gap-6"
                style={{ transform: `translateX(-${currentIndex * 50}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)]"
                  >
                    <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 h-full shadow-md">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-red-400 text-sm">
                            {testimonial.company}
                          </p>
                        </div>
                        <div className="text-4xl font-bold text-red-500">
                          {testimonial.rating}
                        </div>
                      </div>
                      <p className="text-white text-lg italic leading-relaxed">
                        {testimonial.testimonial}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {[...Array(totalSlides)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === index
                        ? "bg-red-500"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
