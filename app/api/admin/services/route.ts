import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import type { Service } from "@/lib/models"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()
    const services = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, features, image } = body

    if (!title || !description || !features) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectDB()
    const service: Service = {
      title,
      description,
      features: Array.isArray(features) ? features : features.split(",").map((f: string) => f.trim()),
      image: image || "/placeholder.svg?height=200&width=200",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const result = await db.collection("services").insertOne(service)

    return NextResponse.json({
      message: "Service created successfully",
      serviceId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
