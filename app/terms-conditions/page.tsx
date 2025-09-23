import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the Fortune Info Solutions website and services, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use
              this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials on Fortune Info Solutions' website
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
              title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p className="mb-4">
              The materials on Fortune Info Solutions' website are provided on an 'as is' basis. Fortune Info Solutions
              makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p className="mb-4">
              In no event shall Fortune Info Solutions or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on Fortune Info Solutions' website, even if Fortune Info Solutions or a
              Fortune Info Solutions authorized representative has been notified orally or in writing of the possibility
              of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p className="mb-4">
              The materials appearing on Fortune Info Solutions' website could include technical, typographical, or
              photographic errors. Fortune Info Solutions does not warrant that any of the materials on its website are
              accurate, complete, or current. Fortune Info Solutions may make changes to the materials contained on its
              website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Links</h2>
            <p className="mb-4">
              Fortune Info Solutions has not reviewed all of the sites linked to our website and is not responsible for
              the contents of any such linked site. The inclusion of any link does not imply endorsement by Fortune Info
              Solutions of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
            <p className="mb-4">
              Fortune Info Solutions may revise these terms of service for its website at any time without notice. By
              using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of [Jurisdiction] and
              you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="mb-4">If you have any questions about these Terms & Conditions, please contact us at:</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p>
                <strong>Fortune Info Solutions</strong>
                <br />
                Email: legal@fortuneinfosolutions.com
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
