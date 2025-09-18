"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Menu,
  X,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

interface DropdownItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Awards & Certificates", href: "/awards" },
  { label: "Partners", href: "/channel-partner" },
  { label: "Products", href: "/products" },
  // { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

  return (
    <header className="w-full z-50">
      {/* Top Contact Bar */}

      {/* Main Navigation */}
      <nav className="bg-[#FDFAF6] py-4 px-4 md:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-30 h-20 bg-[#B8001F] rounded-lg flex items-center justify-center">
            <Image
              src="/com.png"
              alt="Company Logo"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          <span className="text-2xl md:text-3xl font-bold text-black">
            Fortune Info Solutions
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-black">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.dropdown && setActiveDropdown(item.label)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-[#B8001F] transition-colors font-medium"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-4 h-4" />}
              </Link>

              {/* Dropdown Menu */}
              {item.dropdown && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#000000] rounded-lg shadow-xl border border-[#B8001F] py-2 z-50">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      className="block px-4 py-2 text-white hover:bg-[#B8001F] hover:text-white transition-colors"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="px-6 py-2 rounded-full font-medium transition-colors"
            style={{ backgroundColor: "#B8001F", color: "#FDFAF6" }}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden ml-4 p-2 rounded-md focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFAF6] w-full border-t border-gray-200 z-40">
          <div className="flex flex-col gap-2 py-4 px-4">
            {menuItems.map((item) => (
              <div key={item.label} className="flex flex-col">
                <Link
                  href={item.href}
                  className="flex justify-between items-center px-2 py-2 font-medium text-black hover:text-[#B8001F] transition-colors"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {item.dropdown && (
                  <div className="flex flex-col pl-4 mt-1">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.label}
                        href={dropdownItem.href}
                        className="px-2 py-1 text-black hover:text-[#B8001F] transition-colors"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/contact"
              className="mt-4 px-6 py-2 rounded-full font-medium text-white bg-[#B8001F] text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
