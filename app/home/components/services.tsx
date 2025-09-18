"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Monitor, Cloud, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for heading + content
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // when ServicesSection starts entering
          toggleActions: "play none none reverse",
        },
      });

      // Animate heading + text
      tl.from(sectionRef.current?.querySelectorAll(".section-heading"), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Animate cards
      tl.from(
        cardsRef.current,
        {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.3,
        },
        "-=0.3"
      ); // overlap slightly with heading animation
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="flex-1 section-heading">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-primary"></div>
              <span className="text-primary text-2xl font-medium">
          Our Services
              </span>
              <div className="w-1 h-6 bg-primary"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-8 leading-tight">
              Future-Ready
              <br />
              IT Solutions.
            </h1>
          </div>

          <div className="flex-1 max-w-md section-heading mt-0 md:mt-12">
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed text-justify">
              Fortune Info Solutions delivers end-to-end IT
              infrastructure—hardware, software, networking, and security—to
              future-proof your business.
            </p>
            <Link href="/services">
              <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full">
          More Services
              </button>
            </Link>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-8">Service Offerings</h1>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Custom Development */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            className="bg-card p-8 rounded-2xl shadow-lg text-justify"
          >
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Custom Development
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We deliver tailored IT solutions, combining the right hardware and software to optimize performance and drive business growth.
            </p>
            <button className="text-primary font-medium flex items-center gap-2 hover:text-primary/80">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cloud Solutions */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            className="bg-card p-8 rounded-2xl relative overflow-hidden shadow-lg text-justify"
          >
            <div className="absolute inset-0">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Server room background"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-background/80"></div>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Cloud Solutions
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Accelerate digital transformation with cloud-ready infrastructure, servers, storage, and licensed software integrated with AWS, Azure, and VMware.
              </p>
              <button className="text-primary font-medium flex items-center gap-2 hover:text-primary/80">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cybersecurity Protection */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            className="bg-card p-8 rounded-2xl shadow-lg text-justify"
          >
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-primary">
              <Shield className="w-8 h-8 text-white " />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Cybersecurity Protection
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Protect your business with advanced surveillance, firewalls, antivirus, and access control—ensuring security and compliance.
            </p>
            <button className="text-primary font-medium flex items-center gap-2 hover:text-primary/80">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
