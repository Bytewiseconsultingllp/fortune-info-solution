"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const companyLogos = [
  { name: "comapny", logo: "20+" },
  { name: "KNIFE", logo: "KNIFE" },
  { name: "ONE FOUND", logo: "ONE FOUND" },
  { name: "FOCUS", logo: "FOCUS" },
  { name: "DARKSIDE", logo: "DARKSIDE" },
  { name: "pro-d", logo: "pro-d" },
]

export function CompanyLogosSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const logosRef = useRef<HTMLDivElement[]>([])
  const numberRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade + scale logos
      gsap.from(logosRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.5,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      })

      // Counter animation (0 -> 1800)
      const counter = { val: 0 }
      gsap.fromTo(
        counter,
        { val: 0 },
        { 
          val: 1800, 
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          onUpdate: function () {
            if (numberRef.current) {
              numberRef.current.textContent = `${Math.floor(counter.val)}`
            }
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-96 overflow-hidden">
      {/* Fixed Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?cs=srgb&dl=pexels-thatguycraig000-1563356.jpg&fm=jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-[#1D1D1D]/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            
            {/* Company Logos */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8">
              {companyLogos.map((company, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) logosRef.current[index] = el
                  }}
                  className="text-center"
                >
                  <div className="text-white text-xl md:text-2xl font-bold tracking-wider">
                    {company.logo}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Statistics */}
            <div className="lg:col-span-2 text-center lg:text-left border-l border-[#E31E24]/60 pl-8">
              <div className="text-gray-300 mb-2">More Than</div>
              <div
                ref={numberRef}
                className="text-4xl md:text-5xl font-bold text-[#E31E24] mb-2"
              >
                0
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">
                Leading
                <br />
                Brands Trust
                <br />
                In Us.
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
