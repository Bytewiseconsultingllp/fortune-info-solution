const { MongoClient } = require("mongodb")

async function createAllCollections() {
  const client = new MongoClient("mongodb+srv://admin:admin@fortuneinfosolutions.sh3jhok.mongodb.net/?retryWrites=true&w=majority&appName=fortuneInfoSolutions");

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    // const db = client.db("fortune_info_solutions")
    const db = client.db(process.env.DB_NAME || "fortune_info_solutions");
    console.log("Using database:", db.databaseName);

    // Get existing collections
    const existingCollections = await db.listCollections().toArray()
    const existingNames = existingCollections.map((col) => col.name)

    console.log("Existing collections:", existingNames)

    // Define all collections with their validation schemas
    const collections = {
      products: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "category", "brand", "images", "inStock", "isActive"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 200 },
              description: { bsonType: "string", minLength: 10, maxLength: 2000 },
              category: {
                bsonType: "string",
                // enum: ["networking", "security", "storage", "servers", "accessories"],
              },
              brand: { bsonType: "string", minLength: 1, maxLength: 100 },
              images: { bsonType: "array", items: { bsonType: "string" }, minItems: 1 },
              datasheet: { bsonType: "string", minLength: 1},
              specifications: { bsonType: "string" },
              price: { bsonType: "number", minimum: 0 }, 
              inStock: { bsonType: "bool" },
              
              stockQuantity: { bsonType: "number", minimum: 0 },
              sku: { bsonType: "string" }, 
              tags: { bsonType: "array", items: { bsonType: "string" } },
              isActive: { bsonType: "bool" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
              createdBy: { bsonType: "string" },
              updatedBy: { bsonType: "string" },
            },
          },
        },
      },

      services: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "features", "category", "image", "isActive"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 200 },
              description: { bsonType: "string", minLength: 10, maxLength: 2000 },
              features: {
                bsonType: "array",
                minItems: 1,
                items: { bsonType: "string" },
              },
              image: { bsonType: "string" },
              category: {
                bsonType: "string",
                enum: ["consulting", "implementation", "support", "training", "maintenance"],
              },
              price: { bsonType: "number", minimum: 0 },
              duration: { bsonType: "string" },
              isPopular: { bsonType: "bool" },
              isActive: { bsonType: "bool" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
              createdBy: { bsonType: "string" },
              updatedBy: { bsonType: "string" },
            },
          },
        },
      },

      contacts: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "phone", "message", "source", "priority", "status"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
              phone: { bsonType: "string", minLength: 10, maxLength: 20 },
              company: { bsonType: "string" },
              subject: { bsonType: "string" },
              message: { bsonType: "string", minLength: 1 },
              source: { bsonType: "string", enum: ["website", "phone", "email", "referral"] },
              priority: { bsonType: "string", enum: ["low", "medium", "high"] },
              status: { bsonType: "string", enum: ["new", "contacted", "in_progress", "resolved", "closed"] },
              assignedTo: { bsonType: "string" },
              notes: { bsonType: "array", items: { bsonType: "string" } },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
          },
        },
      },

      partner_enquiries: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "phone", "company", "businessType", "location", "message", "status"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
              phone: { bsonType: "string", minLength: 10, maxLength: 20 },
              company: { bsonType: "string", minLength: 1 },
              businessType: { bsonType: "string", minLength: 1 },
              location: { bsonType: "string", minLength: 1 },
              website: { bsonType: "string" },
              yearsInBusiness: { bsonType: "number", minimum: 0 },
              annualRevenue: { bsonType: "string" },
              message: { bsonType: "string", minLength: 1 },
              documents: { bsonType: "array", items: { bsonType: "string" } },
              status: {
                bsonType: "string",
                enum: ["new", "contacted", "under_review", "approved", "rejected", "on_hold"],
              },
              assignedTo: { bsonType: "string" },
              notes: { bsonType: "array", items: { bsonType: "string" } },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
          },
        },
      },

      quote_requests: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: [
              "productId",
              "productName",
              "customerName",
              "customerEmail",
              "customerPhone",
              "quantity",
              "urgency",
              "status",
            ],
            properties: {
              productId: { bsonType: "string" },
              productName: { bsonType: "string", minLength: 1 },
              customerName: { bsonType: "string", minLength: 1, maxLength: 100 },
              customerEmail: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
              customerPhone: { bsonType: "string", minLength: 10, maxLength: 20 },
              company: { bsonType: "string" },
              quantity: { bsonType: "number", minimum: 1 },
              urgency: { bsonType: "string", enum: ["low", "medium", "high"] },
              budget: { bsonType: "string" },
              deliveryLocation: { bsonType: "string" },
              message: { bsonType: "string" },
              quotedPrice: { bsonType: "number", minimum: 0 },
              quotedBy: { bsonType: "string" },
              validUntil: { bsonType: "date" },
              notes: { bsonType: "array", items: { bsonType: "string" } },
              status: { bsonType: "string", enum: ["pending", "quoted", "converted", "declined", "expired"] },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
          },
        },
      },

      admins: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["email", "password", "name", "role", "permissions", "isActive"],
            properties: {
              email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
              password: { bsonType: "string", minLength: 8 },
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              role: { bsonType: "string", enum: ["admin", "super_admin"] },
              permissions: { bsonType: "array", items: { bsonType: "string" } },
              isActive: { bsonType: "bool" },
              lastLogin: { bsonType: "date" },
              loginAttempts: { bsonType: "number", minimum: 0 },
              lockedUntil: { bsonType: "date" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
          },
        },
      },

      audit_logs: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["action", "resource", "timestamp", "success"],
            properties: {
              userId: { bsonType: "string" },
              userEmail: { bsonType: "string" },
              action: { bsonType: "string", minLength: 1 },
              resource: { bsonType: "string", minLength: 1 },
              resourceId: { bsonType: "string" },
              details: { bsonType: "object" },
              ipAddress: { bsonType: "string" },
              userAgent: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              success: { bsonType: "bool" },
              errorMessage: { bsonType: "string" },
            },
          },
        },
      },
    }

    // Create collections that don't exist
    for (const [collectionName, options] of Object.entries(collections)) {
      if (!existingNames.includes(collectionName)) {
        console.log(`Creating collection: ${collectionName}`)
        await db.createCollection(collectionName, options)
        console.log(`✓ Created collection: ${collectionName}`)
      } else {
        console.log(`Collection already exists: ${collectionName}`)
        // Update validation schema for existing collections
        try {
          await db.command({
            collMod: collectionName,
            validator: options.validator,
          })
          console.log(`✓ Updated validation for: ${collectionName}`)
        } catch (error) {
          console.log(`Warning: Could not update validation for ${collectionName}:`, error.message)
        }
      }
    }

    // Create indexes for performance
    const indexes = {
      products: [
        { key: { name: "text", description: "text", brand: "text" } },
        { key: { category: 1 } },
        { key: { brand: 1 } },
        { key: { isActive: 1 } },
        { key: { createdAt: -1 } },
        { key: { sku: 1 }, unique: true, sparse: true },
      ],
      services: [
        { key: { name: "text", description: "text" } },
        { key: { category: 1 } },
        { key: { isActive: 1 } },
        { key: { createdAt: -1 } },
      ],
      contacts: [{ key: { email: 1 } }, { key: { status: 1 } }, { key: { createdAt: -1 } }, { key: { priority: 1 } }],
      partner_enquiries: [
        { key: { email: 1 } },
        { key: { status: 1 } },
        { key: { businessType: 1 } },
        { key: { createdAt: -1 } },
      ],
      quote_requests: [
        { key: { customerEmail: 1 } },
        { key: { productId: 1 } },
        { key: { status: 1 } },
        { key: { createdAt: -1 } },
      ],
      admins: [{ key: { email: 1 }, unique: true }, { key: { isActive: 1 } }],
      audit_logs: [
        { key: { userId: 1 } },
        { key: { action: 1 } },
        { key: { resource: 1 } },
        { key: { timestamp: -1 } },
      ],
    }

    // Create indexes
    for (const [collectionName, indexSpecs] of Object.entries(indexes)) {
      console.log(`Creating indexes for: ${collectionName}`)
      const collection = db.collection(collectionName)

      for (const indexSpec of indexSpecs) {
        try {
          await collection.createIndex(indexSpec.key, {
            unique: indexSpec.unique || false,
            sparse: indexSpec.sparse || false,
          })
          console.log(`✓ Created index for ${collectionName}:`, indexSpec.key)
        } catch (error) {
          if (error.code !== 85) {
            // Index already exists
            console.log(`Warning: Could not create index for ${collectionName}:`, error.message)
          }
        }
      }
    }

    console.log("✅ Database setup completed successfully!")

    // List all collections to verify
    const finalCollections = await db.listCollections().toArray()
    console.log(
      " Final collections:",
      finalCollections.map((col) => col.name),
    )
  } catch (error) {
    console.error(" Error setting up database:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the setup
createAllCollections()
  .then(() => {
    console.log("Database setup script completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Database setup failed:", error)
    process.exit(1)
  })
