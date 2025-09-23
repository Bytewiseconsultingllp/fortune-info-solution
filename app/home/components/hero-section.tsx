"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import HeroImg from "@/app/assets/home-hero.png"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (heroRef.current) {
      // Staggered fade-in animation for headings, paragraph, and button
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      });
    }

    // Count-up animation
    if (countRef.current) {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: 1000,
        duration: 2,
        ease: "power1.out",
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = `${Math.floor(obj.value)}k+`;
        },
      });
    }
  }, []);

  return (
    <section
      className="relative min-h-[40vh] py-10  flex items-center"
      style={{ backgroundColor: "#FDFAF6" }}
    >
      {/* Background Image - overlay remains */}
<div className="absolute inset-0 -top-32">
  <Image
    src="https://i.ibb.co/QFTKRMbc/Untitled-design-1.jpg" // use the direct image link
    alt="Professional in server room"
    fill
    className="object-cover opacity-90"
    priority
  />
  <div className="absolute inset-0"></div>
</div>

      {/* Content */}
      <div
        ref={heroRef}
        className="relative z-10 w-full px-3 md:px-6 lg:px-16 vertical-center"
      >
        <div className="max-w-8xl mx-auto">
          <div className="max-w-5xl">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight"
              style={{ color: "white" }}
            >
              Future-Proof Your Business with
              <br />
              Fortune Info Solutions
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl mb-12 leading-relaxed"
              style={{ color: "white" }}
            >
              Fortune Info Solutions is your trusted partner for IT hardware,
              software, and integrated solutions. With years of collective
              industry experience, we empower businesses with reliable products,
              professional services, and scalable solutions across networking,
              security, surveillance, cloud, and enterprise IT.
            </p>

            <div className="flex items-center gap-8">
              <Link href={"/contact"}>
                <button
                  className="px-8 py-4 rounded-full text-lg font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#B8001F",
                    color: "#FDFAF6",
                  }}
                >
                  Contact Us
                </button>
              </Link>

              <div>
                <div
                  ref={countRef}
                  className="text-4xl font-bold mb-1"
                  style={{ color: "white" }}
                >
                  0k+
                </div>
                <div
                  className="text-md font-medium"
                  style={{ color: "#ffffff" }}
                >
                  Clients Served
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
