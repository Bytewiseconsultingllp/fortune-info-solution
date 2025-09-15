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
    console.log("Token received:", token)

    const body = await request.json()
    console.log("Incoming body:", body)

    const { name, description, features, image, category, price, duration, isPopular } = body

    // Validate required fields
    if (!name || !description || !features || !category) {
      console.error("Validation failed - missing fields:", { name, description, features, category })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectDB()
    console.log("Connected to DB")

    const formattedFeatures = Array.isArray(features)
      ? features
      : (typeof features === "string" ? features.split(",").map((f: string) => f.trim()) : [])

    const serviceData = {
      name,
      description,
      features: formattedFeatures,
      image: image || "/placeholder.svg?height=200&width=200",
      category,
      price: Number(price) || 0,
      duration: duration ?? "",
      isPopular: isPopular ?? false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "admin",
      updatedBy: "admin",
    }

    console.log("Prepared service data:", serviceData)

    const result = await db.collection("services").insertOne(serviceData)
    console.log("Insert result:", result)

    return NextResponse.json({
      message: "Service created successfully",
      serviceId: result.insertedId,
    })
  } catch (error:any) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service", details: error.message }, { status: 500 })
  }
}
