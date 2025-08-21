import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-brand-cream">Fortune Info Solutions</h3>
            <p className="text-muted-foreground mb-4">
              Leading distribution hub company providing comprehensive solutions for brands, products, and services
              across various industries.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: info@fortuneinfosolutions.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-cream">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-cream">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-muted-foreground hover:text-brand-cream transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-brand-cream transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Fortune Info Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
