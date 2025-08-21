// // MongoDB Database Setup Script
// // This script creates collections and indexes for Fortune Info Solutions

// const { MongoClient } = require("mongodb")

// async function setupDatabase() {
//   const client = new MongoClient(process.env.MONGODB_URI)

//   try {
//     await client.connect()
//     console.log("Connected to MongoDB")

//     const db = client.db()

//     // Create collections with validation
//     await db.createCollection("products", {
//       validator: {
//         $jsonSchema: {
//           bsonType: "object",
//           required: ["name", "category", "brand", "description", "price", "image"],
//           properties: {
//             name: { bsonType: "string" },
//             category: { bsonType: "string" },
//             brand: { bsonType: "string" },
//             description: { bsonType: "string" },
//             price: { bsonType: "number" },
//             image: { bsonType: "string" },
//             features: { bsonType: "array" },
//             specifications: { bsonType: "object" },
//             inStock: { bsonType: "bool" },
//             createdAt: { bsonType: "date" },
//             updatedAt: { bsonType: "date" },
//           },
//         },
//       },
//     })

//     await db.createCollection("services", {
//       validator: {
//         $jsonSchema: {
//           bsonType: "object",
//           required: ["name", "description", "category"],
//           properties: {
//             name: { bsonType: "string" },
//             description: { bsonType: "string" },
//             category: { bsonType: "string" },
//             features: { bsonType: "array" },
//             price: { bsonType: "string" },
//             duration: { bsonType: "string" },
//             createdAt: { bsonType: "date" },
//             updatedAt: { bsonType: "date" },
//           },
//         },
//       },
//     })

//     // Create indexes for better performance
//     await db.collection("products").createIndex({ category: 1 })
//     await db.collection("products").createIndex({ brand: 1 })
//     await db.collection("products").createIndex({ name: "text", description: "text" })

//     await db.collection("services").createIndex({ category: 1 })
//     await db.collection("services").createIndex({ name: "text", description: "text" })

//     await db.collection("contacts").createIndex({ createdAt: -1 })
//     await db.collection("partners").createIndex({ createdAt: -1 })
//     await db.collection("quotes").createIndex({ createdAt: -1 })

//     console.log("Database collections and indexes created successfully")
//   } catch (error) {
//     console.error("Database setup error:", error)
//   } finally {
//     await client.close()
//   }
// }

// setupDatabase()
