import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { PartnerEnquiry } from "@/lib/models"
import { sendAdminNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, businessType, location, message } = body

    // Validate required fields
    if (!name || !email || !phone || !company || !businessType || !location || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create partner enquiry record
    const partnerEnquiry: Omit<PartnerEnquiry, "_id"> = {
      name,
      email,
      phone,
      company,
      businessType,
      location,
      message,
      createdAt: new Date(),
      status: "new",
    }

    // Save to database
    const db = await getDatabase()
    const result = await db.collection("partner_enquiries").insertOne(partnerEnquiry)

    try {
      await sendAdminNotification("partner", {
        name,
        email,
        phone,
        company,
        businessType,
        location,
        message,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error processing partner enquiry form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
