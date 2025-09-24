"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/app/home/components/navigation/Header";
import Footer from "@/components/footerSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target, Eye, Users, Award } from "lucide-react";
import ABoutHeroSection from "@/components/about-hero-section";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const heroRef = useRef(null);
  const companyRef = useRef(null);
  const profileTextRef = useRef(null);
  const profileCardRef = useRef(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
      });

      // Company profile (split left and right)
      gsap.from(profileTextRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: companyRef.current,
          start: "top 80%",
        },
      });

      gsap.from(profileCardRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: companyRef.current,
          start: "top 80%",
        },
      });

      // Mission & Vision cards
      if (missionVisionRef.current) {
        gsap.from(missionVisionRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionVisionRef.current,
            start: "top 85%",
          },
        });
      }

      // Values (staggered cards)
      if (valuesRef.current) {
        gsap.from(valuesRef.current?.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 85%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ABoutHeroSection />

      {/* Company Profile */}
      <section ref={companyRef} className="py-16 text-justify">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={profileTextRef}>
              <h2 className="text-3xl font-bold mb-6">Our Company</h2>
              <p className="text-lg text-foreground mb-6">
                <b>Fortune Info Solutions</b> is a leading IT hardware &
                software sales and service provider with a professional team
                carrying over 100+ years of combined experience.
                Headquartered in Bangalore, we have been at the forefront of
                business transformation, offering complete{" "}
                end-to-end IT solution for organizations across India.
              </p>
              <p className="text-lg text-foreground mb-6">
                We are a trusted partner for global technology leaders such as{" "}
                <br />
                <b>
Dell, Lenovo, HP, Apple, Honeywell, Dicota, Samsung, LG, Cisco, HPE, Netgear,
Ruckus, Canon, Epson, Brother, Microsoft, Fortinet, SentinelOne, Logitech,
Vention, Belkin, Jabra, Seagate and Western Digital
                </b>
                . As a direct partner for several top brands, we ensure our
                clients receive only{" "}
                genuine, reliable, and scalable IT products and services.
              </p>



            </div>
            <div ref={profileCardRef} className="bg-muted/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Company Highlights</h3>
              <div className="space-y-4">
                {[
                  "Direct Partnerships with Global IT Brands",
                  "PAN-India Sales & Service Network",
                  "Trusted by 5000+ Businesss Nationwide",
                  "Dedicated After-Sales & 24/7 IT Support",
                  "Expertise in enterprise and SMB solutions",
                  "Proven track record of 20 + years",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={missionVisionRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card>
              <CardHeader className="flex gap-5 items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>

              

              <CardContent>
                <CardDescription className="text-base text-justify">
                  To provide exceptional distribution services that connect
                  quality brands with global markets, delivering value through
                  innovation, reliability, and customer-centric solutions. We
                  strive to be the bridge that enables businesses to reach their
                  full potential
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex gap-5 items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-base text-justify">
                  To become the world’s most trusted distribution hub,
                  recognized for our commitment to excellence, innovation, and
                  sustainable growth. We envision a future where every business
                  has access to global markets through our comprehensive
                  distribution network.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              These fundamental principles guide every decision we make and
              every relationship we build.
            </p>
          </div>

          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-foreground ">
                We pursue excellence in everything we do, from product quality
                to customer service, ensuring the highest standards are
                maintained.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-foreground">
                Honesty and transparency form the foundation of our business
                relationships, building trust with every interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-foreground">
                We embrace new technologies and methodologies to continuously
                improve our services and stay ahead of industry trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
