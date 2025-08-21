import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Contact } from "@/lib/models"
import { sendAdminNotification } from "@/lib/email" // Assuming this function is defined elsewhere

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create contact record
    const contact: Omit<Contact, "_id"> = {
      name,
      email,
      phone,
      company: company || "",
      message,
      createdAt: new Date(),
      status: "new",
    }

    // Save to database
    const db = await getDatabase()
    const result = await db.collection("contacts").insertOne(contact)

    try {
      await sendAdminNotification("contact", {
        name,
        email,
        phone,
        company,
        message,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
