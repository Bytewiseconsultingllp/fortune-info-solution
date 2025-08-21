// const { MongoClient, ObjectId } = require("mongodb")

// async function seedData() {
//   const client = new MongoClient(process.env.MONGODB_URI)

//   try {
//     await client.connect()
//     console.log("Connected to MongoDB for seeding")

//     const db = client.db("fortune_info_solutions")

//     // Clear existing data (optional - remove in production)
//     const collections = ["products", "services", "contacts", "partnerEnquiries", "quoteRequests", "admins"]
//     for (const collectionName of collections) {
//       await db.collection(collectionName).deleteMany({})
//       console.log(`Cleared ${collectionName} collection`)
//     }

//     // Seed Products
//     const products = [
//       {
//         name: "Cisco Catalyst 9300 Series Switch",
//         description:
//           "High-performance enterprise-class stackable switches with advanced security and management features.",
//         category: "networking",
//         brand: "Cisco",
//         image: "/network-switch.png",
//         specifications: "48 ports, Layer 3, PoE+, 10G uplinks",
//         price: 2500,
//         inStock: true,
//         stockQuantity: 25,
//         sku: "CSC-9300-48P",
//         tags: ["enterprise", "stackable", "poe", "layer3"],
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Fortinet FortiGate 100F Firewall",
//         description: "Next-generation firewall with advanced threat protection and SD-WAN capabilities.",
//         category: "security",
//         brand: "Fortinet",
//         image: "/firewall.png",
//         specifications: "10 Gbps throughput, 8 ports, VPN support",
//         price: 1800,
//         inStock: true,
//         stockQuantity: 15,
//         sku: "FTN-FG100F",
//         tags: ["firewall", "ngfw", "sdwan", "vpn"],
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Dell PowerEdge R750 Server",
//         description: "2U rack server with Intel Xeon processors for demanding workloads.",
//         category: "servers",
//         brand: "Dell",
//         image: "/server.png",
//         specifications: "2U, Dual Xeon, 128GB RAM, 4TB Storage",
//         price: 5500,
//         inStock: true,
//         stockQuantity: 8,
//         sku: "DELL-R750-001",
//         tags: ["server", "2u", "xeon", "enterprise"],
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Ubiquiti UniFi Access Point",
//         description: "High-performance wireless access point with Wi-Fi 6 technology.",
//         category: "networking",
//         brand: "Ubiquiti",
//         image: "/wireless-access-point.png",
//         specifications: "Wi-Fi 6, 2.4/5 GHz, PoE powered",
//         price: 180,
//         inStock: true,
//         stockQuantity: 50,
//         sku: "UBI-UAP-AC-PRO",
//         tags: ["wifi6", "wireless", "poe", "unifi"],
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "NetApp FAS2750 Storage System",
//         description: "All-flash storage array for high-performance applications.",
//         category: "storage",
//         brand: "NetApp",
//         image: "/storage-array.png",
//         specifications: "24TB capacity, All-flash, Dual controllers",
//         price: 12000,
//         inStock: false,
//         stockQuantity: 0,
//         sku: "NTA-FAS2750",
//         tags: ["storage", "allflash", "netapp", "enterprise"],
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]

//     await db.collection("products").insertMany(products)
//     console.log("Seeded products")

//     // Seed Services
//     const services = [
//       {
//         name: "Network Infrastructure Consulting",
//         description: "Comprehensive network design and planning services for enterprise environments.",
//         category: "consulting",
//         features: [
//           "Network assessment and audit",
//           "Architecture design and planning",
//           "Technology roadmap development",
//           "Cost optimization analysis",
//           "Security assessment",
//         ],
//         image: "/consulting-service.png",
//         price: 150,
//         duration: "2-4 weeks",
//         isPopular: true,
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Security Implementation Services",
//         description: "End-to-end security solution implementation and configuration.",
//         category: "implementation",
//         features: [
//           "Firewall deployment and configuration",
//           "VPN setup and management",
//           "Security policy implementation",
//           "Threat detection setup",
//           "Compliance configuration",
//         ],
//         image: "/security-service.png",
//         price: 200,
//         duration: "1-3 weeks",
//         isPopular: true,
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "24/7 Technical Support",
//         description: "Round-the-clock technical support for all your IT infrastructure needs.",
//         category: "support",
//         features: [
//           "24/7 phone and email support",
//           "Remote troubleshooting",
//           "On-site support when needed",
//           "Preventive maintenance",
//           "Performance monitoring",
//         ],
//         image: "/support-service.png",
//         price: 100,
//         duration: "Ongoing",
//         isPopular: false,
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Staff Training Programs",
//         description: "Comprehensive training programs for IT staff on latest technologies.",
//         category: "training",
//         features: [
//           "Customized training curriculum",
//           "Hands-on lab sessions",
//           "Certification preparation",
//           "Online and on-site options",
//           "Progress tracking and assessment",
//         ],
//         image: "/training-service.png",
//         price: 75,
//         duration: "1-2 weeks",
//         isPopular: false,
//         isActive: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]

//     await db.collection("services").insertMany(services)
//     console.log("Seeded services")

//     // Seed Sample Contacts
//     const contacts = [
//       {
//         name: "John Smith",
//         email: "john.smith@techcorp.com",
//         phone: "+1-555-0123",
//         company: "TechCorp Solutions",
//         subject: "Network Infrastructure Inquiry",
//         message: "We are looking to upgrade our network infrastructure and would like to discuss our requirements.",
//         source: "website",
//         priority: "high",
//         status: "new",
//         createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//       },
//       {
//         name: "Sarah Johnson",
//         email: "sarah.j@innovatetech.com",
//         phone: "+1-555-0456",
//         company: "InnovateTech",
//         subject: "Security Solutions",
//         message: "Interested in your security implementation services for our new office.",
//         source: "referral",
//         priority: "medium",
//         status: "contacted",
//         createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//         updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//       },
//     ]

//     await db.collection("contacts").insertMany(contacts)
//     console.log("Seeded contacts")

//     // Seed Sample Partner Enquiries
//     const partnerEnquiries = [
//       {
//         name: "Michael Chen",
//         email: "michael@globaltech.com",
//         phone: "+1-555-0789",
//         company: "GlobalTech Distribution",
//         businessType: "IT Distributor",
//         location: "California, USA",
//         website: "https://globaltech.com",
//         yearsInBusiness: 8,
//         annualRevenue: "$5M-$10M",
//         message: "We are interested in becoming a channel partner for your networking products.",
//         status: "new",
//         createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//         updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//       },
//     ]

//     await db.collection("partnerEnquiries").insertMany(partnerEnquiries)
//     console.log("Seeded partner enquiries")

//     // Seed Sample Quote Requests
//     const quoteRequests = [
//       {
//         productId: products[0]._id?.toString() || new ObjectId().toString(),
//         productName: "Cisco Catalyst 9300 Series Switch",
//         customerName: "David Wilson",
//         customerEmail: "david@enterprise.com",
//         customerPhone: "+1-555-0321",
//         company: "Enterprise Networks",
//         quantity: 5,
//         urgency: "high",
//         budget: "$10,000-$15,000",
//         deliveryLocation: "New York, NY",
//         message: "Need quote for 5 switches for our data center upgrade project.",
//         status: "pending",
//         createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//         updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//       },
//     ]

//     await db.collection("quoteRequests").insertMany(quoteRequests)
//     console.log("Seeded quote requests")

//     // Seed Admin User
//     const bcrypt = require("bcryptjs")
//     const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12)

//     const admins = [
//       {
//         email: process.env.ADMIN_EMAIL || "admin@fortuneinfo.com",
//         password: hashedPassword,
//         name: "System Administrator",
//         role: "super_admin",
//         permissions: ["all"],
//         isActive: true,
//         loginAttempts: 0,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]

//     await db.collection("admins").insertMany(admins)
//     console.log("Seeded admin users")

//     console.log("Data seeding completed successfully!")
//   } catch (error) {
//     console.error("Data seeding failed:", error)
//   } finally {
//     await client.close()
//   }
// }

// seedData()
