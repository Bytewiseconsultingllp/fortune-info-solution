"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import expertiseImg from "@/app/assets/expertise.jpg"

gsap.registerPlugin(ScrollTrigger);

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Replace with your image path or make it dynamic (props, CMS, etc.)
  const imagePath = "/expertise.jpg"; // set to "" or null to test placeholder

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
      className="py-16 px-4 md:px-8 lg:px-16 relative bg-white"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover bg-center opacity-10"></div>

      {/* Grid layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Image / Placeholder */}
        <div ref={imageRef} className="flex justify-center">
          {imagePath ? (
            <Image
              src="/diverse-products-still-life.png"
              alt="Our Expertise"
              width={600}
              height={500}
              className="rounded-2xl shadow-xl object-cover"
            />
          ) : (
            <div className="w-[600px] h-[500px] flex items-center justify-center bg-gray-200 text-gray-500 rounded-2xl shadow-xl">
              No Image Available
            </div>
          )}
        </div>

        {/* Right Content */}
        <div ref={textRef}>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-red-500"></div>
            <span className="text-red-600 text-sm font-medium text-animate">
              Our Expertise
            </span>
            <div className="w-1 h-6 bg-red-500"></div>
          </div>

          <h2 className="text-5xl font-bold text-red-700 mb-8 leading-tight text-animate">
            Innovating Across Every Sector.
          </h2>

          <p className="text-black text-lg mb-12 leading-relaxed text-animate">
            With decades of combined experience, Fortune Info Solutions delivers
            customized IT hardware and software solutions across industries
            including healthcare, finance, retail, manufacturing, education, and
            more.
          </p>

          <h2 className="text-3xl font-bold text-red-700 mb-8 leading-tight text-animate">
            Specializations:
          </h2>

          <div className="space-y-8">
            <div className="text-animate">
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Enterprise IT Solutions
              </h3>
              <p className="text-black leading-relaxed">
                We provide servers, storage, and workstations from global brands
                like HP, Dell, and Lenovo, ensuring high performance and
                scalability.
              </p>
            </div>

            <div className="text-animate">
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Networking & Security
              </h3>
              <p className="text-black leading-relaxed">
                From Cisco firewalls to Honeywell surveillance, we secure IT
                ecosystems with advanced networking, CCTV, and access control
                solutions.
              </p>
            </div>

            <div className="text-animate">
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Power & AV Solutions
              </h3>
              <p className="text-black mb-8 leading-relaxed">
                Our partnerships with EATON, Panasonic, and Samsung allow us to
                deliver reliable UPS, power backup, and large-format display
                solutions.
              </p>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300">
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
