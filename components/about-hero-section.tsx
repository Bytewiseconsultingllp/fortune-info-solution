"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ABoutHeroSection() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Highlight text animation
      gsap.from(highlightRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });

      // Subtext animation
      gsap.from(subTextRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.7,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-primary text-white py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* <img
          src="/images/about-bg.jpg" // <-- replace with your image path
          alt="About Background"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0  bg-opacity-50 h-52" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl font-extrabold tracking-wide"
        >
          About <span ref={highlightRef}>Us</span>
        </h1>

        <p
          ref={subTextRef}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          We are driven by passion, innovation, and a commitment to excellence.  
          Learn more about our story, mission, and the values that guide us.
        </p>
      </div>
    </section>
  );
}
