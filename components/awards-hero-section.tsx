"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AwardsHero() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Subtext animation
      gsap.from(subTextRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      // Badges animation with stagger
      gsap.from(badgeRefs.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-r from-red-50 via-white to-red-50 py-20 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://img.freepik.com/premium-vector/abstract-modern-dark-banner-background-with-rainbow-colorful-line_105555-115.jpg" // <-- replace with your actual image path
          alt="Awards background"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-white to-red-50 "></div> */}
      </div>

      <div className="relative max-w-7xl mx-auto text-center space-y-6">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl font-extrabold text-gray-400 tracking-wide"
        >
          Our <span className="text-red-600">Awards</span> & Certificates
        </h1>

        {/* Subtext */}
        <p
          ref={subTextRef}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          A journey of excellence recognized by industry leaders and institutions.
        </p>

        {/* Badge Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 justify-items-center">
          {["🏆", "🎖️", "🥇", "📜"].map((icon, idx) => (
            <div
              key={idx}
              ref={(el) => { badgeRefs.current[idx] = el; }}
              className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-white shadow-xl border border-red-100"
            >
              <span className="text-4xl">{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
