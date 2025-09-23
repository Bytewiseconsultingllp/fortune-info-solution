"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Add the actual logo files in the public/logos directory and update the names accordingly.
const logos: string[] = [
  "https://in-media.apjonlinecdn.com/logo/stores/1/HP_New_logo_1.svg",
  "https://raw.githubusercontent.com/hpe-design/logos/master/Requirements/color-logo.png",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanq-iT58SaFVsaA72vhVcqkiTw2FLBSa-hQ&s",,
  // "https://p3-ofp.static.pub/fes/cms/2023/03/22/8hjmcte754uauw07ypikjkjtx0m5ib450914.svg",
  "https://static-ecapac.acer.com/media/logo/default/acer.png",
  "https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo-1995-present.png",
  "https://images.seeklogo.com/logo-png/15/1/apple-logo-png_seeklogo-158013.png",
  "https://bsmedia.business-standard.com/_media/bs/img/about-page/1562575696.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanq-iT58SaFVsaA72vhVcqkiTw2FLBSa-hQ&s",
  "https://www.akamai.com/site/en/images/logo/2024/panasonic-logo.svg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSln9EzYFPXEF7aBAxsVhUjkgRvqeTd0rk78Q&s",
  "https://1000logos.net/wp-content/uploads/2021/05/AOC-logo.png",
  "https://download.logo.wine/logo/IBall_(company)/IBall_(company)-Logo.wine.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSptsMV4vynPSgfE-5rkF4T3x1lvfBYj2iLEQ&s",
  "https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV8VCg7OUsGJKa9f_vaDyeBsQ8WTfuTKKCuQ&s",
  "https://logos-world.net/wp-content/uploads/2020/12/Epson-Logo.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqRMTeLvryfntf0ffNf1z81rAtpk6mwyTIZA&s",
  "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/TVS_Electronics.svg/1200px-TVS_Electronics.svg.png",
  "https://logos-world.net/wp-content/uploads/2021/09/Intel-Logo-2006-2020-700x394.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTknMzoCPsq-CN0MiZJdwI3xKx1dTzgkt5t8g&s",
  "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/news/_shared/images/seagate-logo-image-center-374x328.png",
  "https://photos.prnewswire.com/prnfull/20000711/WDCLOGO",
  "https://media.kingston.com/kingston/opengraph/ktc-opengraph-homepage.jpg",
  "https://www.transcend-info.com/Press/images/PrsImg/1-transcendCI_web.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/LogoAPC.svg/1200px-LogoAPC.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eaton_Corporation_logo.svg/1024px-Eaton_Corporation_logo.svg.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp5mzYzXHjXsu67KRU0somtWd_D5t-oY1NsA&s",
  "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8q-lxJgiu_EJater2yqDScf2GYurRq4t7Q&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFFND_syThL51COY2xxMJqDb7WbS6aVYyOA&s",
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Quick-Heal-Logo.png",
  "https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/trendmicro-ogsocial.jpg",
  "https://media.kasperskydaily.com/wp-content/uploads/sites/92/2019/07/18041948/kaspersky-rebranding-in-details-1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Tally_-_Logo.png",
  "https://ifdalivestorage.blob.core.windows.net/user-uploads/73707/204336/00000000-0000-0000-0000-000000000000/01_Logitech_Brand_Logo.jpg",
  "https://cdn.xingosoftware.com/audioxpress/images/fetch/dpr_1/https%3A%2F%2Faudioxpress.com%2Fassets%2Fupload%2Fimages%2F1%2F20170408190612_Sennheiser-CompactLogoWeb.jpg",
];

export default function BrandMarquee() {
  // Duplicate the array to create a seamless infinite scroll effect
  const scrollingLogos = [...logos, ...logos];

  return (
  <div className="relative w-full overflow-hidden bg-[#b8001f] py-6">
    <motion.div
      className="flex gap-8"
      animate={{ x: ["0%", "-100%"] }}
      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
    >
      {[...logos, ...logos].map((logo, index) => (
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
