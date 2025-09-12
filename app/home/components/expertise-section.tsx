"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Image animation
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Text content animation
    const textNodes = textRef.current?.querySelectorAll(".text-animate");
    if (textNodes && textNodes.length > 0) {
      gsap.fromTo(
        textNodes,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 relative "
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover bg-center opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div ref={imageRef} className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="People looking at digital display"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-8 left-8 bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-1">11</div>
                  <div className="text-red-200 text-sm font-medium">
                    IT Standard
                    <br />
                    Certification
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-1">
                    +19
                  </div>
                  <div className="text-gray-200 text-sm font-medium">
                    Specific of
                    <br />
                    Industries
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div ref={textRef}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-red-500"></div>
              <span className="text-red-400 text-sm font-medium text-animate">
                Our Expertise
              </span>
              <div className="w-1 h-6 bg-red-500"></div>
            </div>

            <h2 className="text-5xl font-bold text-white mb-8 leading-tight text-animate">
              Innovating Across Every Sector.
            </h2>

            <p className="text-gray-300 text-lg mb-12 leading-relaxed text-animate">
              With decades of combined experience, Fortune Info Solutions
              delivers customized IT hardware and software solutions across
              industries including healthcare, finance, retail, manufacturing,
              education, and more.
            </p>

            <h2 className="text-3xl font-bold text-white mb-8 leading-tight text-animate">
              Specializations:
            </h2>

            <div className="space-y-8">
              <div className="text-animate">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Enterprise IT Solutions
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  We provide servers, storage, and workstations from global brands like HP, Dell, and Lenovo, ensuring high performance and scalability.
                </p>
              </div>

              <div className="text-animate">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Networking & Security
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  From Cisco firewalls to Honeywell surveillance, we secure IT ecosystems with advanced networking, CCTV, and access control solutions.
                </p>
              </div>

              <div className="text-animate">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Power & AV Solutions
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Our partnerships with EATON, Panasonic, and Samsung allow us to deliver reliable UPS, power backup, and large-format display solutions.
                </p>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
