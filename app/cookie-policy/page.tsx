import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footer"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">Fortune Info Solutions uses cookies for several purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>To ensure our website functions properly</li>
              <li>To improve your browsing experience</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To remember your preferences and settings</li>
              <li>To provide personalized content and advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
            <p className="mb-4">
              These cookies are necessary for the website to function and cannot be switched off. They are usually set
              in response to actions made by you, such as setting privacy preferences or filling in forms.
            </p>

            <h3 className="text-xl font-semibold mb-3">3.2 Performance Cookies</h3>
            <p className="mb-4">
              These cookies collect information about how visitors use our website, such as which pages are visited most
              often. This data helps us improve how our website works.
            </p>

            <h3 className="text-xl font-semibold mb-3">3.3 Functionality Cookies</h3>
            <p className="mb-4">
              These cookies allow our website to remember choices you make and provide enhanced features and personal
              content.
            </p>

            <h3 className="text-xl font-semibold mb-3">3.4 Targeting Cookies</h3>
            <p className="mb-4">
              These cookies are used to deliver advertisements that are relevant to you and your interests. They may be
              set by us or by third-party providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">
              We may also use third-party cookies from trusted partners for analytics, advertising, and social media
              features. These cookies are subject to the respective privacy policies of these external services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in various ways. Please note that removing or blocking cookies can
              impact your user experience and parts of our website may no longer be fully accessible.
            </p>

            <h3 className="text-xl font-semibold mb-3">5.1 Browser Settings</h3>
            <p className="mb-4">
              Most browsers allow you to view, manage, delete, and block cookies. You can do this through your browser
              settings. Here are links to cookie settings for major browsers:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
              <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
              <li>Safari: Preferences → Privacy → Cookies and website data</li>
              <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.2 Opt-Out Tools</h3>
            <p className="mb-4">You can also use online opt-out tools to prevent certain types of tracking:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Google Analytics Opt-out Browser Add-on</li>
              <li>Network Advertising Initiative Opt-out Tool</li>
              <li>Digital Advertising Alliance Opt-out Tool</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Changes to This Cookie Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. Please check this page periodically for updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
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
