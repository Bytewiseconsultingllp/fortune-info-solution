"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Add the actual logo files in the public/logos directory and update the names accordingly.
const logos: string[] = [
  "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png",            // Dell
  "https://logos-world.net/wp-content/uploads/2022/07/Lenovo-Logo.png",                    // Lenovo
  "https://in-media.apjonlinecdn.com/logo/stores/1/HP_New_logo_1.svg",                      // HP
  "https://images.seeklogo.com/logo-png/15/1/apple-logo-png_seeklogo-158013.png",           // Apple
  "https://static-ecapac.acer.com/media/logo/default/acer.png",                             // Acer
  "https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo-1995-present.png",          // Asus
  "https://www.honeywell.com/content/dam/honeywellbt/en/images/logos/honeywell-logo.svg",   // Honeywell
  "https://www.dicota.com/cdn/shop/files/dicota-logo.png?v=1750775911&width=1000",          // Dicota
  "https://storage-asset.msi.com/frontend/imgs/logo.png",                                   // MSI
  "https://logos-world.net/wp-content/uploads/2021/09/Intel-Logo-2006-2020-700x394.png",     // Intel
  "https://logos-world.net/wp-content/uploads/2020/03/AMD-Symbol.png", // AMD     //no
  "https://bsmedia.business-standard.com/_media/bs/img/about-page/1562575696.png",          // Samsung
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanq-iT58SaFVsaA72vhVcqkiTw2FLBSa-hQ&s", // LG
  "https://www.akamai.com/site/en/images/logo/2024/panasonic-logo.svg",                      // Panasonic
  "https://i0.wp.com/ethelcoplc.com/wp-content/uploads/2021/06/ed-2.jpg?fit=700%2C350&ssl=1",  // Philips
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",  // Cisco
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP1ZczSHotZYtB_g_qPQKhwGgyzIviI-CM3A&s",                          // HPE ARUBA
  "https://www.netgear.com/in/media/NETGEAR-Logo-Dark_tcm165-119366.png",                        // Netgear
  "https://webresources.commscope.com/images/assets/Ruckus_logo_black-orange/Zz05M2ZjZTZjYTNiZDYxMWYwOTU4MjFhZGNhYTkyZTI0ZQ==",// ruckus
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV8VCg7OUsGJKa9f_vaDyeBsQ8WTfuTKKCuQ&s",  // Canon
  "https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png",                         // Epson
  "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/TVS_Electronics.svg/1200px-TVS_Electronics.svg.png", // TVS Electronics
  "https://logodix.com/logo/16633.png",  // Brother (placeholder)
  "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg",                   // Wipro
  "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png",                      // Microsoft
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8q-lxJgiu_EJater2yqDScf2GYurRq4t7Q&s", // McAfee
  "https://www.fortinet.com/content/dam/fortinet/images/general/fortinet-logo.svg",             // Fortinet
  "https://raw.githubusercontent.com/hpe-design/logos/master/Requirements/color-logo.png",        // HPEnterprise
  "https://www.sentinelone.com/wp-content/themes/sentinelone/assets/svg/header-logo-dark.svg",     // SentinelOne
  "https://tse3.mm.bing.net/th/id/OIP.AGGGabP0HZJB65xPnb-LYAHaEK?w=640&h=360&rs=1&pid=ImgDetMain&o=7&rm=3",      // Digisol
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFFND_syThL51COY2xxMJqDb7WbS6aVYyOA&s", // Norton
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Quick-Heal-Logo.png",                       // Quick Heal
  "https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/trendmicro-ogsocial.jpg", // Trends (TrendMicro)
  "https://media.kasperskydaily.com/wp-content/uploads/sites/92/2019/07/18041948/kaspersky-rebranding-in-details-1.jpg", // Kaspersky
  "https://th.bing.com/th/id/R.8523777be2ce56d6af1ee2d6f2d511a2?rik=C3IpTVHOXx38Zg&riu=http%3a%2f%2fwww.jootech.co.za%2fimages%2fcache%2fLogitech%2flogitech.800.webp&ehk=PS%2b9blzaXMRiFGSEJ4y%2fbKzeIWVoKg3TABW8G7%2fLlfE%3d&risl=&pid=ImgRaw&r=0s", // Logitech
  "https://ventiontech.com/cdn/shop/files/logo-vention_200x@2x.png?v=1654826943", // Vention
  "https://logos-world.net/wp-content/uploads/2023/01/Belkin-Logo.png", // Belkin
  "https://tse3.mm.bing.net/th/id/OIP.IerSiqzlxWq9iKpQpPYBRQHaD2?rs=1&pid=ImgDetMain&o=7&rm=3", // Jabra
  "https://cdn.xingosoftware.com/audioxpress/images/fetch/dpr_1/https%3A%2F%2Faudioxpress.com%2Fassets%2Fupload%2Fimages%2F1%2F20170408190612_Sennheiser-CompactLogoWeb.jpg", // Sennheiser
  "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/news/_shared/images/seagate-logo-image-center-374x328.png", // Seagate
  "https://photos.prnewswire.com/prnfull/20000711/WDCLOGO", // Western Digital
  "https://media.kingston.com/kingston/opengraph/ktc-opengraph-homepage.jpg", // Kingston
  "https://www.transcend-info.com/Press/images/PrsImg/1-transcendCI_web.jpg", // Transcend
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/LogoAPC.svg/1200px-LogoAPC.svg.png", // APC
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eaton_Corporation_logo.svg/1024px-Eaton_Corporation_logo.svg.png", // Eaton
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Tally_-_Logo.png", // Tally ERP
  "https://logos-world.net/wp-content/uploads/2023/01/Hikvision-Logo.png", // HikVision
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp5mzYzXHjXsu67KRU0somtWd_D5t-oY1NsA&s", // CP Plus
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqRMTeLvryfntf0ffNf1z81rAtpk6mwyTIZA&s", // PosiFlex
  "https://download.logo.wine/logo/IBall_(company)/IBall_(company)-Logo.wine.png", // Iball
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSptsMV4vynPSgfE-5rkF4T3x1lvfBYj2iLEQ&s", // Viewsonic
  "https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png" // Corsair
];

export default function BrandMarquee() {
  const scrollingLogos = [...logos, ...logos];
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (trackRef.current) {
      setWidth(trackRef.current.scrollWidth / 2);
    }
  }, []);

  useEffect(() => {
    controls.start({
      x: [-0, -width],
      transition: {
        repeat: Infinity,
        duration: isHovered ? 80 : 40, // slower when hovered
        ease: "linear",
      },
    });
  }, [width, isHovered, controls]);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#b8001f] py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div ref={trackRef} className="flex gap-8" animate={controls}>
        {scrollingLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 h-24 bg-white rounded-xl shadow-md shadow-[#b8001f]/40 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <img
              src={logo}
              alt={`brand-${index}`}
              className="max-h-20 max-w-[90%] object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}