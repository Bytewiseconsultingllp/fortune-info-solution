"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, X, Globe, Headphones, Computer } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col4Ref = useRef<HTMLDivElement>(null);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: col1Ref.current,
          start: "top 80%",
        },
      });

      tl.from([col1Ref.current, col2Ref.current], {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });

      tl.from(
        col4Ref.current,
        {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=1"
      );
    }, col1Ref);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 items-stretch">
            
            {/* IT Expertise */}
            <div
              ref={col1Ref}
              className="text-center lg:text-left border-r border-border px-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                IT Expertise
              </h3>
              <p className="text-foreground leading-relaxed text-sm">
                End-to-end solutions in hardware and software, from laptops to
                enterprise servers.
              </p>
            </div>

            {/* 24/7 IT Support */}
            <div
              ref={col2Ref}
              className="text-center lg:text-left border-r border-border px-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                24/7 IT Support
              </h3>
              <p className="text-foreground leading-relaxed text-sm">
                After-sales support you can trust. Serving customers
                across the nation, anytime you need us.
              </p>
            </div>

            {/* One-Stop IT Store */}
            <div
              ref={col2Ref}
              className="text-center lg:text-left border-r border-border px-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Computer className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                One-Stop IT Store
              </h3>
              <p className="text-foreground leading-relaxed text-sm">
                Complete range of hardware, software, consumables, and accessories.
              </p>
            </div>

            {/* Explore Products */}
            <div ref={col4Ref} className="flex flex-col justify-center items-center lg:items-start px-6">
              <Link href="/products">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium">
                  Explore Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-secondary/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <div className="absolute -top-12 right-0 w-16 h-16">
              <div className="relative w-full h-full flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full bg-primary/50 opacity-75 animate-ping"></span>
                <Button
                  onClick={closeVideo}
                  className="relative z-10 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="YouTube video"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
