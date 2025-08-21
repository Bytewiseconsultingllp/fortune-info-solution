import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!["new", "contacted", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { db } = await connectDB()
    const result = await db
      .collection("partnerEnquiries")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { status } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Partner enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Partner status updated successfully" })
  } catch (error) {
    console.error("Error updating partner status:", error)
    return NextResponse.json({ error: "Failed to update partner status" }, { status: 500 })
  }
}
