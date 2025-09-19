"use client";

import Image from "next/image";  // ✅ Add this import
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Awards & Certificates", href: "/awards" },
    { name: "Partners", href: "/channel-partner" },
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
    { name: "Admin", href: "/admin" },

  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Text */}
          <Link href="/" className="flex items-center space-x-2 min-w-max">
            <Image
              src="/logo.svg"
              alt="Fortune Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <div className="flex flex-col leading-tight whitespace-nowrap">
              <span className="text-lg md:text-xl font-bold text-foreground truncate">
                Fortune Info Solution
              </span>
              <span className="text-xs md:text-sm text-muted-foreground truncate">
                Tech Solutions Provider
              </span>
            </div>
          </Link>

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
