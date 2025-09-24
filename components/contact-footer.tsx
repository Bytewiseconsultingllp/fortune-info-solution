"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Instagram, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/lib/models";

gsap.registerPlugin(ScrollTrigger);

export default function ContactFooterSection() {
  const [email, setEmail] = useState("");
  const newsletterRef = useRef<HTMLDivElement | null>(null);
  const mainFooterRef = useRef<HTMLDivElement | null>(null);
  const bottomFooterRef = useRef<HTMLDivElement | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const socials = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1024px-LinkedIn_icon.svg.png",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
      alt: "LinkedIn",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
      alt: "Instagram",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1200px-X_logo_2023.svg.png",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "#",
      alt: "X",
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched services:", data.services);
          setServices(data.services || []);
        } else {
          console.error("Failed to fetch services:", response.statusText);
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (newsletterRef.current) {
        gsap.from(newsletterRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: "top 90%",
          },
        });
      }

      if (mainFooterRef.current) {
        gsap.from(mainFooterRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mainFooterRef.current,
            start: "top 90%",
          },
        });
      }

      if (bottomFooterRef.current) {
        gsap.from(bottomFooterRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bottomFooterRef.current,
            start: "top 90%",
          },
        });
      }
    });
    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-secondary text-white">
      {/* Newsletter Section */}
      {/* <div ref={newsletterRef} className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h3 className="text-3xl font-bold text-secondary">
            Stay Connected, Stay Informed.
          </h3>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-4 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 md:w-80 bg-white border border-secondary rounded-full px-6 py-3 text-secondary placeholder-secondary focus:border-primary focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#990016] text-brand-cream px-8 py-3 rounded-full font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div> */}

      <div
        ref={mainFooterRef}
        className="py-16 px-4 md:px-8 lg:px-16 bg-secondary border-t border-secondary/50"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-white">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-30 h-20 flex items-center justify-center">
                <Image
                  src="/com.png"
                  alt="Company Logo"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">Fortune Info Solutions</span>
            </div>
            <p className="mb-6 leading-relaxed">
              Fortune Info Solutions is your trusted partner for IT hardware,
              software, and integrated solutions. With years of collective
              industry experience, we empower businesses with reliable products,
              professional services, and scalable solutions across networking,
              security, surveillance, cloud, and enterprise IT.
            </p>

            <div className="flex gap-4">
              {socials.map(({ src, url, alt }, i) => (
                <Link
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-white/50 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                >
                  <img src={src} alt={alt} className="w-6 h-6 object-contain" />
                </Link>
              ))}
            </div>
          </div>

          {/* Extra Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Extra Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "About Us", href: "/about" },
                { label: "Awards", href: "/awards" },
                { label: "Partner", href: "/channel-partner" },
                { label: "Products", href: "/products" },
                { label: "Contact Us", href: "/contact" },
                { label: "Admin", href: "/admin" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service._id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <a
                    href="/services"
                    className="hover:text-primary transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-xl font-bold mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p>
                  No.17/1, Old # 272, <br />
                  Sri Nandi, 12th Cross, 8th Main Road, <br />
                  Wilson Garden, Hombegowda Nagar, Bangalore, India - 560027
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>info@fortuneinfo.in</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>9686194471, 9845447654</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>Mon - Sat: 10:00 am - 07:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className=" p-4 border-t flex flex-col items-center justify-center text-center text-sm text-gray-400">
        <p>&copy; 2025 Fortune Info. All rights reserved.</p>
        <p className="mt-2">
          Developed by{" "}
          <Link
            href="https://www.bytewiseconsulting.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Bytewise Consulting LLP
          </Link>
        </p>
      </div>
    </footer>
  );
}
