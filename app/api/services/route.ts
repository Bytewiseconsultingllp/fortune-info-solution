import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB()

    // Fetch all active services from database
    const services = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      services: services,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch services" }, { status: 500 })
  }
}
