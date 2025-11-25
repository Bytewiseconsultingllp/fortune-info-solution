"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import healthcareImg from "@/app/assets/healthcare.jpeg";
import expertiseImg from "@/app/assets/expertise.jpg";
import retailImg from "@/app/assets/retail.jpeg"

gsap.registerPlugin(ScrollTrigger);

import type { StaticImageData } from "next/image";

interface CaseStudy {
  id: number;
  title: string;
  company: string;
  metric: string;
  problem: string;
  image: string | StaticImageData;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Modernizing Healthcare IT Infrastructure",
    company: "Multispeciality Hospital",
    metric: "Improved Data Security",
    problem:
      "Legacy systems created compliance risks. We deployed Dell servers, Lenovo workstations and Honeywell surveillance systems to ensure secure and efficient patient data management.",
    image: healthcareImg,
  },
  {
    id: 2,
    title: "Cloud & Security Upgrade for FinTech",
    company: "Digital Payments Company",
    metric: "Reduced Operational Costs",
    problem:
      "Outdated infrastructure slowed transaction processing. We provided HP enterprise servers, Cisco firewalls and VMware virtualization, cutting costs by 40% and tripling processing speed.",
    image: expertiseImg,
  },
  {
    id: 3,
    title: "The Retail Store Digital Transformation",
    company: "National Retail Chain",
    metric: "RIncreased Sales Growth",
    problem:
      "Inefficient POS and e-commerce systems limited sales. We implemented modern POS hardware, Samsung LFDs and retail software, boosting the sales by 70% in one year.",
    image: retailImg,
  },
];

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length) {
      // Animate Section Heading
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".heading"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate Cards
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 heading">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-1 h-6 bg-brand-red"></div>
            <span className="text-2xl font-medium brand-red">Case Studies</span>
            <div className="w-1 h-6 bg-brand-red"></div>
          </div>

          <h2 className="text-5xl font-bold mb-8 leading-tight text-secondary">
            Real Solutions, Real Impact.
          </h2>

          <p className="text-lg max-w-4xl mx-auto leading-relaxed text-secondary">
            Discover how Fortune Info Solutions
            helps businesses modernize with the right mix of IT hardware,
            licensed software and integrated solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="rounded-2xl overflow-hidden border border-brand-red/30 shadow-lg bg-brand-red/5 transition-shadow duration-300 hover:shadow-brand-red/30"
            >
              <div className="relative h-64">
                <Image
                  src={study.image || "/placeholder.svg"}
                  alt={study.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary">
                  {study.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                  <span className="text-sm font-medium brand-red">
                    {study.company}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                  <span className="text-sm font-medium brand-red">
                    {study.metric}
                  </span>
                </div>
                <p className="mb-6 leading-relaxed text-secondary text-justify">
                  {study.problem}
                </p>
                {/* <button className="flex items-center gap-2 font-medium text-brand-red hover:text-brand-red/80 transition-colors duration-300">
                  Read More <Plus className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
