import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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

// ------------------ POST (Save Complaint) ------------------
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, type, orderId, message } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Phone, and Message are required" },
        { status: 400 }
      )
    }

    const collection = await connectDB()

    const complaintNumber = `CMP-${Math.floor(1000 + Math.random() * 9000)}`

    const complaintDoc = {
      name,
      email,
      phone,
      type: type || null,
      orderId: orderId || null,
      message,
      complaintNumber,
      createdAt: new Date(),
      status: "new",
    }

    const result = await collection.insertOne(complaintDoc)

    return NextResponse.json({
      success: true,
      complaintNumber,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error saving complaint:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ------------------ GET (Fetch Complaints with Pagination) ------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const skip = (page - 1) * limit

    const collection = await connectDB()

    const total = await collection.countDocuments()
    const complaints = await collection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const formatted = complaints.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      complaints: formatted,
    })
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
