
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/home" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Awards & Certificates", href: "/awards" },
    { name: "Partners", href: "/channel-partner" },
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Text */}
          <Link href="/" className="flex items-center space-x-2 min-w-max">
            <img src="/logo.svg" alt="Fortune Logo" className="h-8 w-8 shrink-0" />
            <div className="flex flex-col leading-tight whitespace-nowrap">
              <span className="text-lg md:text-xl font-bold text-foreground truncate">
                Fortune Info Solution
              </span>
              <span className="text-xs md:text-sm text-muted-foreground truncate">
                Tech Solutions Provider
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center space-x-6 xl:space-x-8 overflow-hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Support + Quote */}
          <div className="hidden lg:flex items-center space-x-6 whitespace-nowrap">
      
            <Button
              className="rounded-md px-5 py-2 font-semibold text-white whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, #B8001F 0%, #000000 100%)",
              }}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Button
                className="w-full rounded-md px-5 py-2 font-semibold text-white"
                style={{
                  background: "linear-gradient(90deg, #B8001F 0%, #000000 100%)",
                }}
              >
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
// }
// "use client"

// import { useState } from "react"
// import { ChevronDown, MapPin, Mail, Phone, Facebook, Twitter, Youtube } from "lucide-react"

// interface DropdownItem {
//   label: string
//   href: string
// }

// interface MenuItem {
//   label: string
//   href: string
//   dropdown?: DropdownItem[]
// }

// const menuItems: MenuItem[] = [
//   { label: "Home", href: "/home" },
//   { label: "Services", href: "/services" },
//   { label: "About Us", href: "/about" },
//   { label: "Awards & Certificates", href: "/awards" },
//   { label: "Partners", href: "/channel-partner" },
//   { label: "Products", href: "/products" },
//   { label: "Contact Us", href: "/contact" },
// ]

// export default function Header() {
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

//   return (
//     <header className="absolute top-0 left-0 right-0 z-50">
//       {/* Top Contact Bar */}
//       <div style={{ backgroundColor: "#FDFAF6" }} className="py-3 px-2 md:px-4 lg:px-8">
//         <div className="max-w-5xl mx-auto flex justify-between items-center text-sm">
//           <div className="flex items-center gap-8 text-black">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-[#B8001F]" />
//               <span>456 Creative District Ahmad Yani, Medan</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Mail className="w-4 h-4 text-[#B8001F]" />
//               <span>hola@dominantsite.com</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Phone className="w-4 h-4 text-[#B8001F]" />
//               <span>+800-3374-4676</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="w-8 h-8 bg-[#B8001F] rounded flex items-center justify-center hover:bg-red-700 transition-colors">
//               <Facebook className="w-4 h-4 text-white" />
//             </button>
//             <button className="w-8 h-8 bg-[#000000] rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
//               <Twitter className="w-4 h-4 text-white" />
//             </button>
//             <button className="w-8 h-8 bg-[#000000] rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
//               <Youtube className="w-4 h-4 text-white" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation */}
//       <nav style={{ backgroundColor: "#FDFAF6" }} className="py-4 px-2 md:px-4 lg:px-8">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#B8001F] rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">IT</span>
//             </div>
//             <span className="text-2xl md:text-3xl font-bold text-black">
//               InfoTechSolutions
//             </span>
//           </div>

//           {/* Navigation Menu */}
//           <div className="hidden lg:flex items-center gap-8 text-black">
//             {menuItems.map((item) => (
//               <div
//                 key={item.label}
//                 className="relative"
//                 onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <a
//                   href={item.href}
//                   className="flex items-center gap-1 hover:text-[#B8001F] transition-colors font-medium"
//                 >
//                   {item.label}
//                   {item.dropdown && <ChevronDown className="w-4 h-4" />}
//                 </a>

//                 {/* Dropdown Menu */}
//                 {item.dropdown && activeDropdown === item.label && (
//                   <div className="absolute top-full left-0 mt-2 w-48 bg-[#000000] rounded-lg shadow-xl border border-[#B8001F] py-2">
//                     {item.dropdown.map((dropdownItem) => (
//                       <a
//                         key={dropdownItem.label}
//                         href={dropdownItem.href}
//                         className="block px-4 py-2 text-white hover:bg-[#B8001F] hover:text-white transition-colors"
//                       >
//                         {dropdownItem.label}
//                       </a>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Get Started Button */}
//           <button
//             className="px-6 py-2 rounded-full font-medium transition-colors"
//             style={{ backgroundColor: "#B8001F", color: "#FDFAF6" }}
//           >
//             Get Started
//           </button>
//         </div>
//       </nav>
//     </header>
//   )
// }

