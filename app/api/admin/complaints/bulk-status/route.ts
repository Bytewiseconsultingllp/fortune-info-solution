import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("Please define MONGODB_URI in your .env file")
}

// Cache client globally to avoid reconnecting on every request
let cachedClient: MongoClient | null = null
let cachedDb: any = null

async function connectDB() {
  if (cachedClient && cachedDb) {
    return cachedDb
  }

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  cachedDb = client.db("fortune_info_solutions").collection("complaints")
  return cachedDb
}

export async function PATCH(request: Request) {
  try {
    const { complaintIds, status } = await request.json()

    // Validate input
    if (!Array.isArray(complaintIds) || complaintIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No complaint IDs provided" },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ["open", "investigating", "resolved", "closed"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid status. Must be one of: " + validStatuses.join(", ") 
        },
        { status: 400 }
      )
    }

    const collection = await connectDB()
    const objectIds = complaintIds.map((id: string) => new ObjectId(id))

    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "No matching complaints found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      status
    })
  } catch (error) {
    console.error("Error bulk updating complaint statuses:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
