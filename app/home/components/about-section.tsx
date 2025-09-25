"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import expertImg1 from "/about1.jpg";
import expertImg2 from "@/app/assets/experts_two.jpeg";
import expertImg3 from "@/app/assets/experts_three.jpeg";


export function AboutSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const experienceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column animation (images + stats)
      gsap.from(leftColRef.current, {
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Right column animation (text content)
      gsap.from(rightColRef.current, {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      // Experience counter (25+ years)
      if (experienceRef.current) {
        const years = { val: 0 };
        gsap.to(years, {
          val: 25,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            if (experienceRef.current) {
              experienceRef.current.textContent = `${Math.floor(years.val)}+`;
            }
          },
          scrollTrigger: {
            trigger: experienceRef.current,
            start: "top 85%",
          },
        });
      }

      // Animate progress bars
      progressRefs.current.forEach((bar) => {
        if (bar) {
          const targetWidth = bar.getAttribute("data-progress") || "0%";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: targetWidth,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 90%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-8 px-4 md:px-4 lg:px-16 bg-background text-foreground "
    >
            <div className="flex items-center gap-2 mb-8 text-xl justify-center ">
              <div className="w-1 h-6 bg-primary"></div>
              <span className="text-primary font-medium text-4xl">About Us</span>
              <div className="w-1 h-6 bg-primary"></div>
            </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column (Images + Years of Experience) */}
          <div ref={leftColRef} className="space-y-8">
 
            <div className="relative h-65 rounded-2xl overflow-hidden">
              <Image
                // src="/placeholder.svg?height=200&width=600"
                src="/about2.jpg"
                alt="Professionals with laptop"
                fill
                className="object-cover"
              />
            </div>

                       <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  // src="/placeholder.svg?height=300&width=300"
                  src="/about1.jpg"
                  alt="Professionals working"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  // src="/placeholder.svg?height=300&width=300"
                  src="/customer.jpg"
                  alt="Business people in server room"
                  fill
                  className="object-cover"
                />
              </div>

            </div>

            <div className="text-center mb-6">
              <div
                ref={experienceRef}
                className="text-6xl font-bold text-primary mb-2 "
              >
                0+
              </div>
              <div className="text-secondary text-xl font-medium">
                Years of Experience
              </div>
            </div>
          </div>

          {/* Right Column (Content + Progress bars) */}
          <div ref={rightColRef}>

            {/* <h2 className="text-5xl font-bold text-primary mb-4 leading-tight ">
            </h2> */}
            <h2 className=" text-5xl font-bold text-primary mb-4 leading-tight text-left text-animate">
              Experts In Tech Evolution
            </h2>

            <p className="text-foreground text-lg mb-4 leading-relaxed text-justify">
              <strong>FORTUNE INFO SOLUTIONS</strong> is a leading IT hardware, software, Fire Detection, Suppression, CCTV & Access Control System
                sales and service provider. Head quartered in Bangalore, having regional office in Chennai & Hyderabad, we have grown inta trusted partner for businss across India by offering cutting-edge products & tailored IT, Fire Detection, Suppression, Survillance solutions
            </p>

            {/* <h2 className="text-5xl font-bold text-secondary mb-4 leading-tight">
              Core Values
            </h2> */}

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-primary  mb-1">
                  Innovation And Adaptability
                </h3>
                <p className="text-foreground mb-4 leading-relaxed text-justify">
                  We drive continuous innovation by integrating world-class
                  hardware and software solutions from leading brands <b> Dell, Lenovo, HP, Apple,  Dicota, Honeywell- Morley IAS System, System Sensor, Silient Knight 
, Samsung, LG, Cisco, HPE, Netgear, Ruckus, Canon, Epson, Brother, Microsoft, Fortinet, SentinelOne, Logitech,
Vention, Belkin, Jabra, Seagate, Western Digital and more.
                </b>
                
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">
                  Customer-Centric Excellence
                </h3>
                <p className="text-foreground mb-4 leading-relaxed text-justify">
                  From sales to after-sales support, we ensure unparalleled
                  service, competitive pricing, and reliable delivery across PAN
                  India.
                </p>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-primary font-bold text-xl">
                    Expertise Highlights
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary font-medium">
                      IT Support & Services
                    </span>
                    <span className="text-secoundary s">99%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      ref={(el) => {
                        progressRefs.current[0] = el;
                      }}
                      data-progress="99%"
                      className="bg-primary h-2 rounded-full"
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary font-medium">
                      Fire & Access Control
                    </span>
                    <span className="text-secoundary ">98%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      ref={(el) => {
                        progressRefs.current[2] = el;
                      }}
                      data-progress="98%"
                      className="bg-primary h-2 rounded-full"
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary font-medium">
                      Products Quality
                    </span>
                    <span className="text-secoundary ">96%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      ref={(el) => {
                        progressRefs.current[1] = el;
                      }}
                      data-progress="96%"
                      className="bg-primary h-2 rounded-full"
                    ></div>
                  </div>
                </div>


              </div>
            </div>
          </div>
          {/* End Right Column */}
        </div>
      </div>
    </section>
  );
}
