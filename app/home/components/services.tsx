// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";
// import { Laptop, Cctv, Flame } from "lucide-react";
// import Link from "next/link";

// gsap.registerPlugin(ScrollTrigger);

// export function ServicesSection() {
//   const sectionRef = useRef(null);
//   const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         },
//       });

//       tl.from(sectionRef.current?.querySelectorAll(".section-heading"), {
//         y: 50,
//         opacity: 0,
//         duration: 1,
//         ease: "power3.out",
//         stagger: 0.2,
//       });

//       tl.from(
//         cardsRef.current,
//         {
//           y: 80,
//           opacity: 0,
//           duration: 1,
//           ease: "power3.out",
//           stagger: 0.3,
//         },
//         "-=0.3"
//       );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
//     >
//       {/* Section Title */}
//       <div className="flex items-center gap-2 mb-8 justify-center">
//         <div className="w-1 h-6 bg-primary"></div>
//         <span className="text-primary text-4xl font-medium">Our Services</span>
//         <div className="w-1 h-6 bg-primary"></div>
//       </div>

//       <div className="max-w-6xl mx-auto">
//         {/* Centered Heading */}
//         <h1 className="section-heading text-5xl md:text-5xl font-bold text-secondary leading-tight text-left mb-10">
//           Future-Ready IT Solutions
//         </h1>
//           <p className="text-foreground text-lg leading-relaxed text-justify">
//             Fortune Info Solutions delivers end to end IT infrastructure 
//             hardware, software, networking and security to future-proof
//             your business.
//           </p>
//           <br />
//         {/* Two-column text */}
//         <div className="section-heading grid md:grid-cols-2 gap-8 mb-10">
//           <div>
//            <ul className="list-disc pl-6 space-y-3 text-foreground text-base leading-relaxed">
//             <li>
//               <span className="font-semibold">Hardware Management:</span> Managing physical assets like servers, laptops and mobile devices.
//             </li>
//             <li>
//               <span className="font-semibold">Software & Operating Systems:</span> Ensuring enterprise software, SaaS applications and OS updates.
//             </li>
//             <li>
//               <span className="font-semibold">Network Management:</span> Overseeing network devices, firewalls and infrastructure.
//             </li>
//             <li>
//               <span className="font-semibold">Cloud & Data Center Management:</span> Administering cloud platforms and physical data centers.
//             </li>
//           </ul>
//           </div>

//           <ul className="list-disc pl-6 space-y-3 text-foreground text-base leading-relaxed">

//             <li>
//               <span className="font-semibold">Security Management:</span> Implementing measures, monitoring threats and managing data integrity.
//             </li>
//             <li>
//               <span className="font-semibold">Performance & Monitoring:</span> 24/7 observation of system health and performance.
//             </li>
//             <li>
//               <span className="font-semibold">Backup & Disaster Recovery:</span> Strategies to protect data and ensure business continuity.
//             </li>
//           </ul>
//         </div>

//         {/* Centered Button */}
//         <div className="flex justify-center mb-16">
//           <Link href="/services">
//             <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full">
//               More Services
//             </button>
//           </Link>
//         </div>

//         {/* Service Offerings */}
//         <h1 className="text-4xl font-bold text-primary mb-8 text-center">
//           Service Offerings
//         </h1>

//         <div className="grid md:grid-cols-3 gap-8">
//           {/* Laptop Services */}
//           <div
//             ref={(el) => (cardsRef.current[0] = el)}
//             className="bg-card p-8 rounded-2xl relative overflow-hidden shadow-lg"
//           >
//             <div className="absolute inset-0">
//               <Image
//                 src="/placeholder.svg?height=400&width=400"
//                 alt="Server room background"
//                 fill
//                 className="object-cover opacity-30"
//               />
//               <div className="absolute inset-0 bg-background/80"></div>
//             </div>
//             <div className="relative z-10">
//               <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
//                 <Laptop className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-secondary mb-4">
//                 Laptop Services & Rentals
//               </h3>
//               <p className="text-foreground mb-6 leading-relaxed text-justify">
//                 End-to-end laptop repair, upgrades, short and long term
//                 rental solutions with doorstep delivery and flexible plans.
//               </p>
//             </div>
//           </div>

//           {/* Fire Detection */}
//           <div
//             ref={(el) => (cardsRef.current[1] = el)}
//             className="bg-card p-8 rounded-2xl shadow-lg"
//           >
//             <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-primary">
//               <Flame className="w-8 h-8 text-white " />
//             </div>
//             <h3 className="text-2xl font-bold text-secondary mb-4">
//               Fire Detection and Alarm System
//             </h3>
//             <p className="text-foreground mb-6 leading-relaxed text-justify">
//               Early fire detection and alarm systems to protect your property and people.
//             </p>
//           </div>

//           {/* CCTV */}
//           <div
//             ref={(el) => (cardsRef.current[2] = el)}
//             className="bg-card p-8 rounded-2xl shadow-lg"
//           >
//             <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
//               <Cctv className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-secondary mb-4">
//               CCTV Installation
//             </h3>
//             <p className="text-foreground mb-6 leading-relaxed text-justify">
//               Professional setup of single or multiple CCTV cameras with
//               DVR/NVR configuration and remote mobile access.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Laptop, Cctv, Flame } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate heading
      tl.from(headingRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Animate text + bullet points
      tl.from(
        textRef.current?.querySelectorAll("p, ul, li"),
        {
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
        },
        "-=0.5"
      );

      // Animate button
      tl.from(
        buttonRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );

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
        "-=0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        <div className="w-1 h-6 bg-primary"></div>
        <span className="text-primary text-4xl font-medium">Our Services</span>
        <div className="w-1 h-6 bg-primary"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Centered Heading */}
        <h1
          ref={headingRef}
          className="section-heading text-5xl md:text-5xl font-bold text-secondary leading-tight text-center mb-10"
        >
          Future - Ready IT, Fire & Security Solutions
        </h1>

        <div ref={textRef}>
          <p className="text-foreground text-lg leading-relaxed text-justify">
            At Fortune Info Solutions, we empower businesses with future-ready IT Infrastructure, Fire and Security solutions that drives resilience, security and growth. From hardware and software to cloud, networking, fire and security, our comprehensive solutions ensure your enterprise is equipped to handle today’s challenges while staying prepared for tomorrow’s innovations.
          </p>
          <br />
          {/* Two-column text */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <ul className="list-disc pl-6 space-y-3 text-foreground text-base leading-relaxed">
                <li>
                  <span className="font-semibold">Hardware Management</span>{" "}<br />
                  Managing physical assets like servers, laptops and mobile
                  devices
                </li>
                <li>
                  <span className="font-semibold">
                    Software & Operating Systems<br />
                  </span>{" "}
                  Ensuring enterprise software, SaaS applications and OS
                  updates
                </li>
                <li>
                  <span className="font-semibold">Network Management<br /></span>{" "}
                  Overseeing network devices, firewalls and infrastructure
                </li>
                <li>
                  <span className="font-semibold">
                    Cloud & Data Center Management<br />
                  </span>{" "}
                  Administering cloud platforms and physical data centers
                </li>
                              <li>
                <span className="font-semibold">Security Management<br /></span>{" "}
                Implementing measures, monitoring threats and managing data
                integrity
              </li>
              </ul>
            </div>

            <ul className="list-disc pl-6 space-y-3 text-foreground text-base leading-relaxed">

              <li>
                <span className="font-semibold">Performance & Monitoring<br /></span>{" "}
                24/7 observation of system health and performance
              </li>
              <li>
                <span className="font-semibold">Backup & Disaster Recovery<br /></span>{" "}
                Strategies to protect data and ensure business continuity
              </li>
               <li>
                <span className="font-semibold">Strategic Focus<br /></span>{" "}
                Allows businesses to focus on core competencies & IT operations
              </li>
              <li>
                  <span className="font-semibold">Fire & Security Management </span>{" "}<br />
                  Ensuring solutions for Fire detection, Suppression & Security system

                </li>
              <li>
                  <span className="font-semibold">Surveillance & Access Control </span>{" "}<br />
Deploying CCTV, biometric systems and smart access solutions
                </li>
            </ul>
          </div>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center mb-16">
          <Link href="/services">
            <button
              ref={buttonRef}
              className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full"
            >
              More Services
            </button>
          </Link>
        </div>

        {/* Service Offerings */}
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Service Offerings
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Laptop Services */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="bg-card p-8 rounded-2xl relative overflow-hidden shadow-lg"
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
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Laptop <br/> Sales, Services, Rentals
              </h3>
              <p className="text-foreground mb-6 leading-relaxed ">
                End-to-end laptop sales, repair, upgrades, short and long term rental
                solutions with doorstep delivery and flexible plans.
              </p>
            </div>
          </div>

          {/* Fire Detection */}
          <div
            ref={(el) => (cardsRef.current[1] = el)}
            className="bg-card p-8 rounded-2xl shadow-lg"
          >
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-primary">
              <Flame className="w-8 h-8 text-white " />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Fire & Security<br/> Solutions Management
            </h3>
            <p className="text-foreground mb-6 leading-relaxed">
            Ensuring complete solutions for fire detection, suppression and security systems.  
            Safeguarding businesses with reliable and trusted expertise.
            </p>
          </div>

          {/* CCTV */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="bg-card p-8 rounded-2xl shadow-lg"
          >
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Cctv className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Survillance <br/> Access Control System
            </h3>
            <p className="text-foreground mb-6 leading-relaxed">
              Professional setup of CCTV surveillance with DVR/NVR integration for continuous monitoring, along with advanced access control systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
