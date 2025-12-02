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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

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
    const objectId = new ObjectId(id)

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Complaint not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      updated: true,
      status
    })
  } catch (error) {
    console.error("Error updating complaint status:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
