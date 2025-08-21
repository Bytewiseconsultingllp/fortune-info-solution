import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import type { Service } from "@/lib/models";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();
    const services = await db
      .collection("services")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, features, image, category, price, duration, isPopular } = body

    // Validate required fields
    if (!name || !description || !features || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectDB()
    // Omit _id to let MongoDB generate it as ObjectId
    const serviceData = {
      name,
      description,
      features: Array.isArray(features)
        ? features
        : features.split(",").map((f: string) => f.trim()),
      image: image || "/placeholder.svg?height=200&width=200",
      category,
      price: price ?? 0,
      duration: duration ?? "",
      isPopular: isPopular ?? false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("services").insertOne(serviceData)

    return NextResponse.json({
      message: "Service created successfully",
      serviceId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
