import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()

    // Get statistics from all collections
    const [
      totalProducts,
      totalServices,
      totalContacts,
      pendingContacts,
      totalPartners,
      pendingPartners,
      totalQuotes,
      pendingQuotes,
    ] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("services").countDocuments(),
      db.collection("contacts").countDocuments(),
      db.collection("contacts").countDocuments({ status: "new" }),
      db.collection("partner_enquiries").countDocuments(),
      db.collection("partner_enquiries").countDocuments({ status: "new" }),
      db.collection("quote_requests").countDocuments(),
      db.collection("quote_requests").countDocuments({ status: "pending" }),
    ])

    // Get recent activity
    const recentContacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    const recentPartners = await db.collection("partner_enquiries").find({}).sort({ createdAt: -1 }).limit(3).toArray()

    const recentQuotes = await db.collection("quote_requests").find({}).sort({ createdAt: -1 }).limit(3).toArray()

    return NextResponse.json({
      stats: {
        totalProducts,
        totalServices,
        totalContacts,
        pendingContacts,
        totalPartners,
        pendingPartners,
        totalQuotes,
        pendingQuotes,
      },
      recentActivity: {
        contacts: recentContacts,
        partners: recentPartners,
        quotes: recentQuotes,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
