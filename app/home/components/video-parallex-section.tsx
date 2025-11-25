"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, X } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function VideoParallaxSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const sectionRef = useRef(null)
  const router = useRouter()

  const openVideo = () => setIsVideoOpen(true)
  const closeVideo = () => setIsVideoOpen(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading, text and button
      gsap.from(".video-heading", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".video-text", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".video-btn", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 0.5,
        ease: "elastic.out(1,0.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="relative h-full overflow-hidden py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?cs=srgb&dl=pexels-thatguycraig000-1563356.jpg&fm=jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex items-center justify-end px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full flex justify-end">
            <div className="max-w-2xl text-left">
              {/* Play Button with Ripple */}
              <div className="flex items-center justify-start mb-8">
                <button
                  onClick={openVideo}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                >
                  {/* Ripple Effect */}
                  <span className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></span>
                  <Play className="w-10 h-10 text-white ml-1 relative z-10" />
                </button>
              </div>

              {/* Heading */}
              <h2 className="video-heading text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
                Transform IT,
                <br />
                Save 30%!
              </h2>

              {/* Text */}
              <p className="video-text text-gray-300 text-lg mb-3 leading-relaxed">
                Add Your Heading Text Here
              </p>

              {/* Contact Us Button */}
              <div className="flex justify-start">
                <button
                  onClick={() => router.push("/contact")}
                  className="video-btn bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg shadow-blue-500/30"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Transform IT Solutions"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
