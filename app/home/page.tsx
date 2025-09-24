import { AboutSection } from "./components/about-section";
import { ExpertiseSection } from "./components/expertise-section";
import { ServicesSection } from "./components/services";
import { TestimonialsSection } from "./components/testimonials-section";
import { CaseStudiesSection } from "./components/case-studies-section";
import { CertificationsSection } from "./components/certificate-section";
import { ContactSection } from "./components/contact-section";
import FooterSection  from "@/components/footerSection";
import Header from "./components/navigation/Header"
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { CompanyLogosSection } from "./components/company-logos-section";
import { VideoParallaxSection } from "./components/video-parallex-section";
import BrandMarquee from "./components/brandmarquee";

export default function Home() {
  return (<>
  <div className="mb-35">
      <Header />
  </div>
    
    <div>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      {/* <CompanyLogosSection /> */}
      <BrandMarquee/>
      <ExpertiseSection />
      {/* <TestimonialsSection /> */}
      {/* <VideoParallaxSection /> */}
      {/* <CaseStudiesSection /> */}
      <CertificationsSection />
      <ContactSection />
      <FooterSection />
      
    </div>
  </>
  );
}
