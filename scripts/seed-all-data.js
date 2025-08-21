const { MongoClient, ObjectId } = require("mongodb")

async function seedAllData() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB for seeding")

    const db = client.db("fortune_info_solutions")

    console.log(" Clearing existing data...")

    // Clear all collections
    const collections = [
      "products",
      "services",
      "contacts",
      "partner_enquiries",
      "quote_requests",
      "admins",
      "audit_logs",
    ]
    for (const collectionName of collections) {
      await db.collection(collectionName).deleteMany({})
      console.log(`Cleared ${collectionName}`)
    }

    // Seed Products
    const products = [
      {
        name: "Cisco Catalyst 9300 Series Switch",
        description:
          "High-performance enterprise switch with advanced security features and cloud management capabilities. Perfect for modern network infrastructure.",
        category: "networking",
        brand: "Cisco",
        image: "/network-switch.png",
        specifications: "48 ports, PoE+, 10G uplinks, Layer 3 routing",
        price: 2500,
        inStock: true,
        stockQuantity: 25,
        sku: "CISCO-C9300-48P",
        tags: ["enterprise", "managed", "poe", "layer3"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fortinet FortiGate 100F Firewall",
        description:
          "Next-generation firewall with advanced threat protection, VPN capabilities, and centralized management for small to medium businesses.",
        category: "security",
        brand: "Fortinet",
        image: "/security-firewall.png",
        specifications: "10 Gbps throughput, 8 ports, SSL VPN, IPS/IDS",
        price: 1800,
        inStock: true,
        stockQuantity: 15,
        sku: "FORTI-FG100F",
        tags: ["firewall", "vpn", "threat-protection", "ngfw"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dell PowerEdge R750 Server",
        description:
          "Versatile 2U rack server designed for demanding workloads with Intel Xeon processors and extensive storage options.",
        category: "servers",
        brand: "Dell",
        image: "/server-rack.png",
        specifications: "Intel Xeon Gold, 64GB RAM, 2TB SSD, Redundant PSU",
        price: 4500,
        inStock: true,
        stockQuantity: 8,
        sku: "DELL-R750-001",
        tags: ["server", "rack", "enterprise", "xeon"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ubiquiti UniFi Access Point WiFi 6",
        description:
          "High-performance wireless access point with WiFi 6 technology, perfect for high-density environments and modern connectivity needs.",
        category: "networking",
        brand: "Ubiquiti",
        image: "/wireless-access-point.png",
        specifications: "WiFi 6, 2.4/5 GHz, PoE powered, Cloud management",
        price: 350,
        inStock: true,
        stockQuantity: 50,
        sku: "UBNT-U6-LITE",
        tags: ["wifi6", "wireless", "access-point", "unifi"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Synology DiskStation DS920+ NAS",
        description:
          "4-bay network attached storage solution with powerful Intel processor, perfect for data backup, file sharing, and multimedia streaming.",
        category: "storage",
        brand: "Synology",
        image: "/nas-storage.png",
        specifications: "4-bay, Intel Celeron, 4GB RAM, RAID support",
        price: 650,
        inStock: true,
        stockQuantity: 20,
        sku: "SYNO-DS920PLUS",
        tags: ["nas", "storage", "backup", "raid"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("products").insertMany(products)
    console.log(` ✓ Seeded ${products.length} products`)

    // Seed Services
    const services = [
      {
        name: "Network Infrastructure Consulting",
        description:
          "Comprehensive network assessment and design services to optimize your IT infrastructure for performance, security, and scalability.",
        features: [
          "Network topology analysis",
          "Performance optimization",
          "Security assessment",
          "Scalability planning",
          "Technology roadmap",
          "Cost optimization",
        ],
        image: "/consulting-service.png",
        category: "consulting",
        price: 150,
        duration: "2-4 weeks",
        isPopular: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cybersecurity Implementation",
        description:
          "End-to-end cybersecurity solution implementation including firewalls, intrusion detection, and security monitoring systems.",
        features: [
          "Firewall configuration",
          "IDS/IPS setup",
          "Security monitoring",
          "Vulnerability assessment",
          "Compliance reporting",
          "Staff training",
        ],
        image: "/security-service.png",
        category: "implementation",
        price: 200,
        duration: "3-6 weeks",
        isPopular: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "24/7 Technical Support",
        description:
          "Round-the-clock technical support for your IT infrastructure with guaranteed response times and expert troubleshooting.",
        features: [
          "24/7 monitoring",
          "Remote troubleshooting",
          "On-site support",
          "Preventive maintenance",
          "Performance reporting",
          "Emergency response",
        ],
        image: "/support-service.png",
        category: "support",
        price: 100,
        duration: "Ongoing",
        isPopular: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "IT Staff Training Programs",
        description:
          "Comprehensive training programs for your IT staff on latest technologies, security practices, and best practices.",
        features: [
          "Customized curriculum",
          "Hands-on workshops",
          "Certification preparation",
          "Online resources",
          "Progress tracking",
          "Ongoing support",
        ],
        image: "/training-service.png",
        category: "training",
        price: 75,
        duration: "1-2 weeks",
        isPopular: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("services").insertMany(services)
    console.log(`✓ Seeded ${services.length} services`)

    // Seed Sample Contacts
    const contacts = [
      {
        name: "John Smith",
        email: "john.smith@techcorp.com",
        phone: "+1-555-0123",
        company: "TechCorp Solutions",
        subject: "Network Upgrade Inquiry",
        message: "We're looking to upgrade our network infrastructure and would like to discuss options.",
        source: "website",
        priority: "high",
        status: "new",
        assignedTo: "",
        notes: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@innovatetech.com",
        phone: "+1-555-0456",
        company: "InnovateTech",
        subject: "Security Consultation",
        message: "Need help with implementing a comprehensive cybersecurity solution.",
        source: "referral",
        priority: "medium",
        status: "contacted",
        assignedTo: "admin",
        notes: ["Initial call scheduled for next week"],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection("contacts").insertMany(contacts)
    console.log(`✓ Seeded ${contacts.length} contacts`)

    // Seed Sample Partner Enquiries
    const partnerEnquiries = [
      {
        name: "Michael Chen",
        email: "m.chen@globaltech.com",
        phone: "+1-555-0789",
        company: "GlobalTech Partners",
        businessType: "System Integrator",
        location: "San Francisco, CA",
        website: "https://globaltech.com",
        yearsInBusiness: 8,
        annualRevenue: "$5M-$10M",
        message: "Interested in becoming a channel partner for networking solutions.",
        documents: [],
        status: "new",
        assignedTo: "",
        notes: [],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection("partner_enquiries").insertMany(partnerEnquiries)
    console.log(`✓ Seeded ${partnerEnquiries.length} partner enquiries`)

    // Seed Sample Quote Requests
    const productIds = products.map((p) => p._id || new ObjectId())
    const quoteRequests = [
      {
        productId: productIds[0].toString(),
        productName: "Cisco Catalyst 9300 Series Switch",
        customerName: "David Wilson",
        customerEmail: "d.wilson@enterprise.com",
        customerPhone: "+1-555-0321",
        company: "Enterprise Networks",
        quantity: 5,
        urgency: "high",
        budget: "$10,000-$15,000",
        deliveryLocation: "New York, NY",
        message: "Need quote for 5 switches for our new office setup.",
        quotedPrice: null,
        quotedBy: "",
        validUntil: null,
        notes: [],
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection("quote_requests").insertMany(quoteRequests)
    console.log(`✓ Seeded ${quoteRequests.length} quote requests`)

    // Seed Admin User
    const bcrypt = require("bcrypt")
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10)

    const admins = [
      {
        email: process.env.ADMIN_EMAIL || "admin@fortuneinfo.com",
        password: hashedPassword,
        name: "System Administrator",
        role: "super_admin",
        permissions: ["all"],
        isActive: true,
        lastLogin: null,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("admins").insertMany(admins)
    console.log(`✓ Seeded ${admins.length} admin users`)

    // Seed Sample Audit Logs
    const auditLogs = [
      {
        userId: admins[0]._id?.toString(),
        userEmail: admins[0].email,
        action: "CREATE",
        resource: "product",
        resourceId: productIds[0].toString(),
        details: { productName: "Cisco Catalyst 9300 Series Switch" },
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        success: true,
        errorMessage: null,
      },
    ]

    await db.collection("audit_logs").insertMany(auditLogs)
    console.log(`✓ Seeded ${auditLogs.length} audit logs`)

    console.log("✅ All data seeded successfully!")

    // Verify data
    const stats = {}
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments()
      stats[collectionName] = count
    }

    console.log("Final collection counts:", stats)
  } catch (error) {
    console.error(" Error seeding data:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the seeding
seedAllData()
  .then(() => {
    console.log("Data seeding completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Data seeding failed:", error)
    process.exit(1)
  })
