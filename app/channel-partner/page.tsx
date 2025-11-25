import Header from "@/app/home/components/navigation/Header"
import Footer from "@/components/footerSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Globe, TrendingUp, Handshake, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ChannelPartnerPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      description: "Access to high-demand products and competitive pricing structures to maximize your profits.",
    },
    {
      icon: Globe,
      title: "Market Expansion",
      description: "Expand your reach with our extensive product portfolio and global distribution network.",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Receive comprehensive training, marketing support and dedicated account management.",
    },
    {
      icon: Handshake,
      title: "Flexible Terms",
      description: "Enjoy flexible partnership terms and customized solutions tailored to your business needs.",
    },
  ]

  const requirements = [
    "Established business with proven track record",
    "Strong local market presence and customer base",
    "Adequate warehouse and logistics capabilities",
    "Commitment to maintaining brand standards",
    "Financial stability and creditworthiness",
    "Dedicated sales and support team",
  ]

  const partnerTypes = [
    {
      title: "Authorized Distributor",
      description: "Full distribution rights for specific territories with comprehensive product access.",
      features: ["Exclusive territory rights", "Full product portfolio", "Marketing support", "Training programs"],
    },
    {
      title: "Value-Added Reseller",
      description: "Resell our products with additional services and solutions for end customers.",
      features: ["Product customization", "Technical support", "Sales incentives", "Co-marketing opportunities"],
    },
    {
      title: "System Integrator",
      description: "Integrate our products into larger solutions and systems for enterprise clients.",
      features: ["Technical certification", "Solution development", "Project support", "Preferred pricing"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-60">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Channel Partner Program</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join our global network of successful partners and unlock new opportunities for growth and success.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/partner-enquiry">
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Partner Benefits</h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Discover the advantages of partnering with Fortune Info Solutions and how we can help grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="text-center h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription >{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Partnership Types</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Choose the partnership model that best fits your business goals and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner Requirements</h2>
              <p className="text-primary text-foreground mb-8">
                To ensure mutual success, we look for partners who meet certain criteria and share our commitment to
                excellence.
              </p>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-foreground mb-6">
                Take the first step towards a successful partnership with Fortune Info Solutions. Our team will review
                your application and get back to you within 48 hours.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/partner-enquiry">Submit Partner Application</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
