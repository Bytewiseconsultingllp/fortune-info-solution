"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Add the actual logo files in the public/logos directory and update the names accordingly.
const logos: string[] = [
  "/logos/hp.svg",
  "/logos/dell.svg",
  "/logos/lenovo.svg",
  "/logos/acer.svg",
  "/logos/asus.svg",
  "/logos/microsoft.svg",
  "/logos/cisco.svg",
  "/logos/apple.svg",
  "/logos/intel.svg",
  "/logos/amd.svg",
  "/logos/samsung.svg",
  "/logos/logitech.svg",
  "/logos/seagate.svg",
  "/logos/wd.svg",
  "/logos/aoc.svg",
  "/logos/apc.svg",
  "/logos/dlink.svg",
  "/logos/viewsonic.svg",
  "/logos/mcafee.svg",
  "/logos/transcend.svg",
  "/logos/kingston.svg",
  "/logos/toshiba.svg",
  "/logos/canon.svg",
  "/logos/corsair.svg",
  "/logos/epson.svg",
  "/logos/msi.svg",
  "/logos/iball.svg",
  "/logos/sennheiser.svg",
  "/logos/posiflex.svg",
  "/logos/tvs.svg",
  "/logos/honeywell.svg",
  "/logos/norton.svg",
  "/logos/lg.svg",
  "/logos/quickheal.svg",
  "/logos/trendmicro.svg",
  "/logos/kaspersky.svg",
  "/logos/eaton.svg",
  "/logos/tally.svg",
  "/logos/cpplus.svg",
  "/logos/panasonic.svg",
];

export default function BrandMarquee() {
  // Duplicate the array to create a seamless infinite scroll effect
  const scrollingLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-white py-8">
      <motion.div
        className="flex gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
        }}
      >
        {scrollingLogos.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-28 h-16 relative">
            <Image src={src} alt="brand logo" fill style={{ objectFit: "contain" }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
