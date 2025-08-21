// const { MongoClient } = require("mongodb")

// async function setupDatabase() {
//   const client = new MongoClient(process.env.MONGODB_URI)

//   try {
//     await client.connect()
//     console.log("Connected to MongoDB")

//     const db = client.db("fortune_info_solutions")

//     // Create collections with validation
//     const collections = [
//       {
//         name: "products",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: ["name", "description", "category", "brand", "image", "inStock", "isActive"],
//             properties: {
//               name: { bsonType: "string", minLength: 1, maxLength: 200 },
//               description: { bsonType: "string", minLength: 10, maxLength: 2000 },
//               category: {
//                 bsonType: "string",
//                 enum: ["networking", "security", "storage", "servers", "accessories"],
//               },
//               brand: { bsonType: "string", minLength: 1, maxLength: 100 },
//               image: { bsonType: "string" },
//               price: { bsonType: "number", minimum: 0 },
//               inStock: { bsonType: "bool" },
//               stockQuantity: { bsonType: "number", minimum: 0 },
//               isActive: { bsonType: "bool" },
//               tags: { bsonType: "array", items: { bsonType: "string" } },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       {
//         name: "services",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: ["name", "description", "features", "image", "category", "isActive"],
//             properties: {
//               name: { bsonType: "string", minLength: 1, maxLength: 200 },
//               description: { bsonType: "string", minLength: 10, maxLength: 2000 },
//               category: {
//                 bsonType: "string",
//                 enum: ["consulting", "implementation", "support", "training", "maintenance"],
//               },
//               features: { bsonType: "array", minItems: 1 },
//               image: { bsonType: "string" },
//               price: { bsonType: "number", minimum: 0 },
//               isPopular: { bsonType: "bool" },
//               isActive: { bsonType: "bool" },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       {
//         name: "contacts",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: ["name", "email", "phone", "message", "source", "priority", "status"],
//             properties: {
//               name: { bsonType: "string", minLength: 1, maxLength: 100 },
//               email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
//               phone: { bsonType: "string", minLength: 10, maxLength: 20 },
//               message: { bsonType: "string", minLength: 10, maxLength: 2000 },
//               source: { bsonType: "string", enum: ["website", "phone", "email", "referral"] },
//               priority: { bsonType: "string", enum: ["low", "medium", "high"] },
//               status: { bsonType: "string", enum: ["new", "contacted", "in_progress", "resolved", "closed"] },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       {
//         name: "partnerEnquiries",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: ["name", "email", "phone", "company", "businessType", "location", "message", "status"],
//             properties: {
//               name: { bsonType: "string", minLength: 1, maxLength: 100 },
//               email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
//               phone: { bsonType: "string", minLength: 10, maxLength: 20 },
//               company: { bsonType: "string", minLength: 1, maxLength: 200 },
//               businessType: { bsonType: "string", minLength: 1, maxLength: 100 },
//               location: { bsonType: "string", minLength: 1, maxLength: 200 },
//               message: { bsonType: "string", minLength: 10, maxLength: 2000 },
//               status: {
//                 bsonType: "string",
//                 enum: ["new", "contacted", "under_review", "approved", "rejected", "on_hold"],
//               },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       {
//         name: "quoteRequests",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: [
//               "productId",
//               "productName",
//               "customerName",
//               "customerEmail",
//               "customerPhone",
//               "quantity",
//               "urgency",
//               "status",
//             ],
//             properties: {
//               productId: { bsonType: "string" },
//               productName: { bsonType: "string", minLength: 1, maxLength: 200 },
//               customerName: { bsonType: "string", minLength: 1, maxLength: 100 },
//               customerEmail: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
//               customerPhone: { bsonType: "string", minLength: 10, maxLength: 20 },
//               quantity: { bsonType: "number", minimum: 1 },
//               urgency: { bsonType: "string", enum: ["low", "medium", "high"] },
//               status: { bsonType: "string", enum: ["pending", "quoted", "converted", "declined", "expired"] },
//               quotedPrice: { bsonType: "number", minimum: 0 },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       {
//         name: "admins",
//         validator: {
//           $jsonSchema: {
//             bsonType: "object",
//             required: ["email", "password", "name", "role", "permissions", "isActive"],
//             properties: {
//               email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
//               password: { bsonType: "string", minLength: 8 },
//               name: { bsonType: "string", minLength: 1, maxLength: 100 },
//               role: { bsonType: "string", enum: ["admin", "super_admin"] },
//               permissions: { bsonType: "array", items: { bsonType: "string" } },
//               isActive: { bsonType: "bool" },
//               loginAttempts: { bsonType: "number", minimum: 0 },
//               createdAt: { bsonType: "date" },
//               updatedAt: { bsonType: "date" },
//             },
//           },
//         },
//       },
//       { name: "auditLogs" },
//       { name: "errorLogs" },
//       { name: "infoLogs" },
//     ]

//     // Create collections
//     for (const collection of collections) {
//       try {
//         if (collection.validator) {
//           await db.createCollection(collection.name, { validator: collection.validator })
//         } else {
//           await db.createCollection(collection.name)
//         }
//         console.log(`Created collection: ${collection.name}`)
//       } catch (error) {
//         if (error.code === 48) {
//           console.log(`Collection ${collection.name} already exists`)
//         } else {
//           console.error(`Error creating collection ${collection.name}:`, error.message)
//         }
//       }
//     }

//     // Create indexes for performance
//     const indexes = {
//       products: [
//         { key: { name: "text", description: "text", brand: "text" } },
//         { key: { category: 1 } },
//         { key: { brand: 1 } },
//         { key: { isActive: 1 } },
//         { key: { createdAt: -1 } },
//         { key: { inStock: 1 } },
//       ],
//       services: [
//         { key: { name: "text", description: "text" } },
//         { key: { category: 1 } },
//         { key: { isActive: 1 } },
//         { key: { createdAt: -1 } },
//         { key: { isPopular: -1 } },
//       ],
//       contacts: [
//         { key: { email: 1 } },
//         { key: { status: 1 } },
//         { key: { createdAt: -1 } },
//         { key: { priority: 1 } },
//         { key: { source: 1 } },
//       ],
//       partnerEnquiries: [
//         { key: { email: 1 } },
//         { key: { status: 1 } },
//         { key: { businessType: 1 } },
//         { key: { createdAt: -1 } },
//         { key: { location: 1 } },
//       ],
//       quoteRequests: [
//         { key: { customerEmail: 1 } },
//         { key: { productId: 1 } },
//         { key: { status: 1 } },
//         { key: { createdAt: -1 } },
//         { key: { urgency: 1 } },
//       ],
//       admins: [{ key: { email: 1 }, unique: true }, { key: { isActive: 1 } }, { key: { role: 1 } }],
//       auditLogs: [
//         { key: { userId: 1 } },
//         { key: { action: 1 } },
//         { key: { resource: 1 } },
//         { key: { timestamp: -1 } },
//         { key: { success: 1 } },
//       ],
//       errorLogs: [{ key: { timestamp: -1 } }, { key: { level: 1 } }],
//       infoLogs: [{ key: { timestamp: -1 } }, { key: { level: 1 } }],
//     }

//     // Create indexes
//     for (const [collectionName, collectionIndexes] of Object.entries(indexes)) {
//       try {
//         for (const index of collectionIndexes) {
//           await db.collection(collectionName).createIndex(index.key, index)
//         }
//         console.log(`Created indexes for ${collectionName}`)
//       } catch (error) {
//         console.error(`Error creating indexes for ${collectionName}:`, error.message)
//       }
//     }

//     console.log("Database setup completed successfully!")
//   } catch (error) {
//     console.error("Database setup failed:", error)
//   } finally {
//     await client.close()
//   }
// }

// setupDatabase()
