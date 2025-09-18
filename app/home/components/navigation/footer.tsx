"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const newsletterRef = useRef<HTMLDivElement | null>(null);
  const mainFooterRef = useRef<HTMLDivElement | null>(null);
  const bottomFooterRef = useRef<HTMLDivElement | null>(null);

   const socials = [
    {
      Icon: Facebook,
      url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
    },
    {
      Icon: Instagram,
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    },
    {
      Icon: Linkedin,
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
    },
  ];

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
    <footer style={{ backgroundColor: "#FDFAF6", color: "#000000" }}>
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

      {/* Main Footer */}
      <div
        ref={mainFooterRef}
        className="py-16 px-4 md:px-8 lg:px-16 border-t border-secondary/50"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-brand-cream font-bold text-sm">FIS</span>
              </div>
              <span className="text-2xl font-bold text-secondary">Fortune Info Solutions</span>
            </div>
            <p className="text-secondary/70 mb-6 leading-relaxed">
              Fortune Info Solutions is your trusted partner for IT hardware,
              software, and integrated solutions. With years of collective
              industry experience, we empower businesses with reliable products,
              professional services, and scalable solutions across networking,
              security, surveillance, cloud, and enterprise IT.
            </p>
             <div className="flex gap-4">
      {socials.map(({ Icon, url }, i) => (
        <Link
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 border-2 border-secondary rounded-lg flex items-center justify-center hover:border-primary transition-colors"
        >
          <Icon className="w-5 h-5 text-secondary hover:text-primary" />
        </Link>
      ))}
    </div>
          </div>

          {/* Extra Links */}
          <div>
            <h4 className="text-xl font-bold text-secondary mb-6">
              Extra Links
            </h4>
            <ul className="space-y-3">
              {["About Us", "Our Team", "Services", "Case Studies", "FAQ"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-secondary/70 hover:text-secondary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-secondary mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                "Laptop Services & Rentals",
                "Annual Maintenance Contract (AMC)",
                "CCTV Installation",
                "Fire Detection and Alarm System",
                "Fire Suppression System",
                "Public Address and Voice Alarm",
              ].map((service) => (
                <li key={service} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <a
                    href="/sevices"
                    className="text-secondary/70 hover:text-secondary transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-xl font-bold text-secondary mb-6">
              Get In Touch
            </h4>
            <div className="space-y-4 text-secondary/70">
              <div className="flex items-start gap-2">
                <div className="w-4 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p>
                    No.17/1, Old No.272, <br />
                    Sri Nandi 12th Cross 8th Main Road <br />
                    Wilson Garden, Hombegowda Nagar, Bangalore, India - 560027
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>info@fortuneinfo.in</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>9845447654, 9686194471</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p>Mon - Sat: 09:00 am - 07:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Fortune Info. All rights reserved.</p>
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

// "use client";

// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Link from "next/link";

// gsap.registerPlugin(ScrollTrigger);

// export default function FooterSection() {
//   const [email, setEmail] = useState("");
//   const newsletterRef = useRef<HTMLDivElement | null>(null);
//   const mainFooterRef = useRef<HTMLDivElement | null>(null);
//   const bottomFooterRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       if (newsletterRef.current) {
//         gsap.from(newsletterRef.current, {
//           opacity: 0,
//           y: 50,
//           duration: 1,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: newsletterRef.current,
//             start: "top 90%",
//           },
//         });
//       }

//       if (mainFooterRef.current) {
//         gsap.from(mainFooterRef.current, {
//           opacity: 0,
//           y: 50,
//           duration: 1,
//           delay: 0.2,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: mainFooterRef.current,
//             start: "top 90%",
//           },
//         });
//       }

//       if (bottomFooterRef.current) {
//         gsap.from(bottomFooterRef.current, {
//           opacity: 0,
//           y: 50,
//           duration: 1,
//           delay: 0.4,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: bottomFooterRef.current,
//             start: "top 90%",
//           },
//         });
//       }
//     });
//     return () => {
//       ctx.revert();
//     };
//   }, []);

//   const handleSubscribe = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Newsletter subscription:", email);
//     setEmail("");
//   };

//   const socials = [
//     {
//       Icon: Facebook,
//       url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
//     },
//     {
//       Icon: Instagram,
//       url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
//     },
//     {
//       Icon: Linkedin,
//       url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
//     },
//   ];

//   return (
//     <footer style={{ backgroundColor: "#FDFAF6", color: "#000000" }}>
//       {/* Newsletter Section */}
//       {/* <div ref={newsletterRef} className="py-12 px-4 md:px-8 lg:px-16">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
//           <h3 className="text-3xl font-bold text-secondary">
//             Stay Connected, Stay Informed.
//           </h3>
//           <form
//             onSubmit={handleSubscribe}
//             className="flex gap-4 w-full md:w-auto"
//           >
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="flex-1 md:w-80 bg-white border border-secondary rounded-full px-6 py-3 text-secondary placeholder-secondary focus:border-primary focus:outline-none"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-primary hover:bg-[#990016] text-brand-cream px-8 py-3 rounded-full font-medium transition-colors"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </div> */}

//       {/* Main Footer */}
//       <div
//         ref={mainFooterRef}
//         className="py-16 px-4 md:px-8 lg:px-16 border-t border-secondary/50"
//       >
//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
//           {/* Company Info */}
//           <div>
//             <div className="flex items-center gap-2 mb-6">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                 <span className="text-brand-cream font-bold text-sm">iT</span>
//               </div>
//               <span className="text-2xl font-bold text-secondary">iTech</span>
//             </div>
//             <p className="text-secondary/70 mb-6 leading-relaxed">
//               Fortune Info Solutions is your trusted partner for IT hardware,
//               software, and integrated solutions. With years of collective
//               industry experience, we empower businesses with reliable products,
//               professional services, and scalable solutions across networking,
//               security, surveillance, cloud, and enterprise IT.
//             </p>
//             <div className="flex gap-4">
//               {socials.map(({ Icon, url }, i) => (
//                 <Link
//                   key={i}
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-12 h-12 border-2 border-secondary rounded-lg flex items-center justify-center hover:border-primary transition-colors"
//                 >
//                   <Icon className="w-5 h-5 text-secondary hover:text-primary" />
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Extra Links */}
//           <div>
//             <h4 className="text-xl font-bold text-secondary mb-6">
//               Extra Links
//             </h4>
//             <ul className="space-y-3">
//               {["About Us", "Our Team", "Services", "Case Studies", "FAQ"].map(
//                 (link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-secondary/70 hover:text-secondary transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 )
//               )}
//             </ul>
//           </div>

//           {/* Services */}
//           <div>
//             <h4 className="text-xl font-bold text-secondary mb-6">Services</h4>
//             <ul className="space-y-3">
//               {[
//                 "Laptop Services & Rentals",
//                 "Annual Maintenance Contract (AMC)",
//                 "CCTV Installation",
//               ].map((service) => (
//                 <li key={service} className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-primary rounded-full"></div>
//                   <a
//                     href="#"
//                     className="text-secondary/70 hover:text-secondary transition-colors"
//                   >
//                     {service}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Get In Touch */}
//           <div>
//             <h4 className="text-xl font-bold text-secondary mb-6">
//               Get In Touch
//             </h4>
//             <div className="space-y-4 text-secondary/70">
//               <div className="flex items-start gap-2">
//                 <div className="w-4 h-2 bg-primary rounded-full mt-2"></div>
//                 <div>
//                   <p>
//                     No.17/1, Old No.272, <br />
//                     Sri Nandi 12th Cross 8th Main Road <br />
//                     Wilson Garden, Hombegowda Nagar, Bangalore, India - 560027
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-primary rounded-full"></div>
//                 <p>info@fortuneinfo.in</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-primary rounded-full"></div>
//                 <p>9845447654, 9686194471</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-primary rounded-full"></div>
//                 <p>Mon - Sat: 09:00 am - 07:00 pm</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
//           <p>&copy; 2024 Fortune Info. All rights reserved.</p>
//           <p className="mt-2">
//             Developed by{" "}
//             <Link
//               href="https://www.bytewiseconsulting.in/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-primary hover:text-primary/80 transition-colors font-medium"
//             >
//               Bytewise Consulting LLP
//             </Link>
//           </p>
//         </div>
//     </footer>
//   );
// }
