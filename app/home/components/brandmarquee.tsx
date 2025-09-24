"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Add the actual logo files in the public/logos directory and update the names accordingly.
const logos: string[] = [
  "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png",              //dell
  "https://in-media.apjonlinecdn.com/logo/stores/1/HP_New_logo_1.svg",                      //hp
  "https://raw.githubusercontent.com/hpe-design/logos/master/Requirements/color-logo.png",   //hpe
  "https://static-ecapac.acer.com/media/logo/default/acer.png",           //acer
  "https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo-1995-present.png",     //asus
  "https://images.seeklogo.com/logo-png/15/1/apple-logo-png_seeklogo-158013.png",        //apple
  "https://bsmedia.business-standard.com/_media/bs/img/about-page/1562575696.png",      //samsung
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanq-iT58SaFVsaA72vhVcqkiTw2FLBSa-hQ&s",      //lg
  "https://www.akamai.com/site/en/images/logo/2024/panasonic-logo.svg",         //panasonic
  "https://storage-asset.msi.com/frontend/imgs/logo.png",     //msi
  "https://1000logos.net/wp-content/uploads/2021/05/AOC-logo.png",       //aoc
  "https://download.logo.wine/logo/IBall_(company)/IBall_(company)-Logo.wine.png",        //iball
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSptsMV4vynPSgfE-5rkF4T3x1lvfBYj2iLEQ&s",         //viewsonic
  "https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png",          //corsair
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV8VCg7OUsGJKa9f_vaDyeBsQ8WTfuTKKCuQ&s",     //canon
  "https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png",        //epson
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqRMTeLvryfntf0ffNf1z81rAtpk6mwyTIZA&s",        //fosiflex
  "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/TVS_Electronics.svg/1200px-TVS_Electronics.svg.png",         //tvs
  "https://logos-world.net/wp-content/uploads/2021/09/Intel-Logo-2006-2020-700x394.png",            //intel
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTknMzoCPsq-CN0MiZJdwI3xKx1dTzgkt5t8g&s",         //amd
  "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/news/_shared/images/seagate-logo-image-center-374x328.png",      //seagate
  "https://photos.prnewswire.com/prnfull/20000711/WDCLOGO",          //western Digital
  "https://media.kingston.com/kingston/opengraph/ktc-opengraph-homepage.jpg",           //kingston
  "https://www.transcend-info.com/Press/images/PrsImg/1-transcendCI_web.jpg",              //transcend
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",        //cisco
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/LogoAPC.svg/1200px-LogoAPC.svg.png",           //apc
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eaton_Corporation_logo.svg/1024px-Eaton_Corporation_logo.svg.png",   //eaton
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp5mzYzXHjXsu67KRU0somtWd_D5t-oY1NsA&s",        //cpplus
  "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png",            //microsoft
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8q-lxJgiu_EJater2yqDScf2GYurRq4t7Q&s",       //macafee
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFFND_syThL51COY2xxMJqDb7WbS6aVYyOA&s",       //nortan
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Quick-Heal-Logo.png",          //quickheal
  "https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/trendmicro-ogsocial.jpg",       //trendmicro
  "https://media.kasperskydaily.com/wp-content/uploads/sites/92/2019/07/18041948/kaspersky-rebranding-in-details-1.jpg",      //kaspersky
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Tally_-_Logo.png",    //tally
  "https://webresources.commscope.com/images/assets/Ruckus_logo_black-orange/Zz05M2ZjZTZjYTNiZDYxMWYwOTU4MjFhZGNhYTkyZTI0ZQ==", //ruckus
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP1ZczSHotZYtB_g_qPQKhwGgyzIviI-CM3A&s", //hpe aruba
  "https://www.sentinelone.com/wp-content/themes/sentinelone/assets/svg/header-logo-dark.svg",          //sentinelone
  "https://www.fortinet.com/content/dam/fortinet/images/general/fortinet-logo.svg",         //fortinet
  "https://ifdalivestorage.blob.core.windows.net/user-uploads/73707/204336/00000000-0000-0000-0000-000000000000/01_Logitech_Brand_Logo.jpg",  //logitech
  "https://cdn.xingosoftware.com/audioxpress/images/fetch/dpr_1/https%3A%2F%2Faudioxpress.com%2Fassets%2Fupload%2Fimages%2F1%2F20170408190612_Sennheiser-CompactLogoWeb.jpg",   //sennheiser
  "https://www.honeywell.com/content/dam/honeywellbt/en/images/logos/honeywell-logo.svg",   //honeywell
  "https://www.dicota.com/cdn/shop/files/dicota-logo.png?v=1750775911&width=1000",        //dicota
  "https://www.netgear.com/in/media/NETGEAR-Logo-Dark_tcm165-119366.png" //netgear

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