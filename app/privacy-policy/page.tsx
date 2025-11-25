import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Fortune Info Solutions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose and safeguard your information when you visit our website or use
              our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <p className="mb-4">We may collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Name and contact information (email, phone, address)</li>
              <li>Company information and job title</li>
              <li>Account credentials and preferences</li>
              <li>Communication preferences</li>
              <li>Payment and billing information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
            <p className="mb-4">We automatically collect certain information when you visit our website:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for various purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Provide and maintain our services</li>
              <li>Process transactions and manage accounts</li>
              <li>Communicate with you about our services</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and security threats</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>With your consent or at your direction</li>
              <li>With service providers and business partners</li>
              <li>For legal compliance and protection</li>
              <li>In connection with business transfers</li>
              <li>With affiliates and subsidiaries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can manage
              your cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p>
                <strong>Fortune Info Solutions</strong>
                <br />
                Email: privacy@fortuneinfosolutions.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Address: 123 Business District, Corporate City, CC 12345
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
