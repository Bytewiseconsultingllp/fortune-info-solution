"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/app/home/components/navigation/Header";
import Footer from "@/components/footerSection";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  "https://picsum.photos/id/1018/1200/800",
  "https://picsum.photos/id/1015/1200/800",
  "https://picsum.photos/id/1025/1200/800",
  "https://picsum.photos/id/1035/1200/800",
  "https://picsum.photos/id/1043/1200/800",
  "https://picsum.photos/id/1067/1200/800",
  "https://picsum.photos/id/1080/1200/800",
  "https://picsum.photos/id/1084/1200/800",
];

export default function EventsGallery() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galleryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(subTextRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

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

      gsap.from(galleryRefs.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Modal navigation
  const showNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev !== null ? (prev + 1) % galleryImages.length : 0
      );
    }
  }, [selectedIndex]);

  const showPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev !== null
          ? (prev - 1 + galleryImages.length) % galleryImages.length
          : galleryImages.length - 1
      );
    }
  }, [selectedIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showNext, showPrev]);

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-r from-red-50 via-white to-red-50 overflow-hidden"
    >
      <Header />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 text-center space-y-6">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl font-extrabold tracking-wide text-gray-800"
        >
          Gallery & Our Events
        </h1>

        {/* Subtext */}
        <p
          ref={subTextRef}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Relive our cherished memories and special occasions through this
          collection of photos.
        </p>

        {/* Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 justify-items-center">
          {["📸", "🎉", "🎶", "✨"].map((icon, idx) => (
            <div
              key={idx}
              ref={(el) => {
                badgeRefs.current[idx] = el;
              }}
              className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-white shadow-lg border border-red-100"
            >
              <span className="text-4xl">{icon}</span>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              ref={(el) => {
                galleryRefs.current[idx] = el;
              }}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
              onClick={() => setSelectedIndex(idx)}
            >
              <img
                src={src}
                alt={`Event ${idx + 1}`}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
                View
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[selectedIndex]}
              alt="Selected event"
              className="w-full h-auto rounded-xl shadow-2xl animate-fadeIn"
            />

            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Prev / Next buttons */}
            <button
              onClick={showPrev}
              className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white/90 text-black px-3 py-2 rounded-full shadow hover:bg-gray-100"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white/90 text-black px-3 py-2 rounded-full shadow hover:bg-gray-100"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <Footer />
    </section>
  );
}
