// // MongoDB Seed Data Script
// // This script populates the database with initial sample data

// const { MongoClient } = require("mongodb")

// async function seedData() {
//   const client = new MongoClient(process.env.MONGODB_URI)

//   try {
//     await client.connect()
//     console.log("Connected to MongoDB for seeding")

//     const db = client.db()

//     // Sample Products Data
//     const sampleProducts = [
//       {
//         name: "Smart Security Camera Pro",
//         category: "Security Systems",
//         brand: "SecureTech",
//         description: "Advanced 4K security camera with AI-powered motion detection and night vision capabilities.",
//         price: 299.99,
//         image: "/smart-home-security.png",
//         features: ["4K Resolution", "AI Motion Detection", "Night Vision", "Cloud Storage", "Mobile App"],
//         specifications: {
//           resolution: "4K Ultra HD",
//           connectivity: "Wi-Fi 6",
//           storage: "Cloud + Local",
//           warranty: "2 Years",
//         },
//         inStock: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Enterprise Network Switch",
//         category: "Networking",
//         brand: "NetPro",
//         description: "High-performance 48-port managed switch for enterprise networking solutions.",
//         price: 1299.99,
//         image: "/network-switch.png",
//         features: ["48 Ports", "Layer 3 Switching", "PoE+", "VLAN Support", "SNMP Management"],
//         specifications: {
//           ports: "48 x Gigabit",
//           power: "PoE+ 740W",
//           management: "Web/CLI/SNMP",
//           warranty: "Lifetime",
//         },
//         inStock: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Wireless Access Point",
//         category: "Networking",
//         brand: "WifiMax",
//         description: "High-speed Wi-Fi 6 access point for seamless wireless connectivity.",
//         price: 199.99,
//         image: "/wireless-access-point.png",
//         features: ["Wi-Fi 6", "Dual Band", "MU-MIMO", "Easy Setup", "Enterprise Grade"],
//         specifications: {
//           standard: "802.11ax (Wi-Fi 6)",
//           speed: "Up to 1.8 Gbps",
//           coverage: "5000 sq ft",
//           warranty: "3 Years",
//         },
//         inStock: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]

//     // Sample Services Data
//     const sampleServices = [
//       {
//         name: "Network Infrastructure Setup",
//         description: "Complete network infrastructure design and implementation for businesses of all sizes.",
//         category: "Infrastructure",
//         features: [
//           "Network Design & Planning",
//           "Hardware Installation",
//           "Configuration & Testing",
//           "Documentation & Training",
//           "24/7 Support",
//         ],
//         price: "Starting from $2,500",
//         duration: "2-4 weeks",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Cybersecurity Assessment",
//         description: "Comprehensive security audit and vulnerability assessment to protect your business.",
//         category: "Security",
//         features: [
//           "Vulnerability Scanning",
//           "Penetration Testing",
//           "Security Policy Review",
//           "Compliance Assessment",
//           "Detailed Reporting",
//         ],
//         price: "Starting from $1,500",
//         duration: "1-2 weeks",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: "Cloud Migration Services",
//         description: "Seamless migration of your business operations to cloud infrastructure.",
//         category: "Cloud Services",
//         features: [
//           "Cloud Strategy Planning",
//           "Data Migration",
//           "Application Modernization",
//           "Security Implementation",
//           "Training & Support",
//         ],
//         price: "Custom Quote",
//         duration: "4-8 weeks",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]

//     // Insert sample data
//     await db.collection("products").insertMany(sampleProducts)
//     await db.collection("services").insertMany(sampleServices)

//     console.log("Sample data inserted successfully")
//     console.log(`Inserted ${sampleProducts.length} products`)
//     console.log(`Inserted ${sampleServices.length} services`)
//   } catch (error) {
//     console.error("Seeding error:", error)
//   } finally {
//     await client.close()
//   }
// }

// seedData()
