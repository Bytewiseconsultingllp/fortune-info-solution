import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { QuoteRequest } from "@/lib/models"
import { sendAdminNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, customerName, customerEmail, customerPhone, company, quantity, message } = body

    // Validate required fields
    if (!productId || !productName || !customerName || !customerEmail || !customerPhone || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create quote request record
    const quoteRequest: Omit<QuoteRequest, "_id"> = {
      productId,
      productName,
      customerName,
      customerEmail,
      customerPhone,
      company: company || "",
      quantity: Number.parseInt(quantity) || 1,
      message: message || "",
      createdAt: new Date(),
      status: "pending",
    }

    // Save to database
    const db = await getDatabase()
    const result = await db.collection("quote_requests").insertOne(quoteRequest)

    try {
      await sendAdminNotification("quote", {
        productId,
        productName,
        customerName,
        customerEmail,
        customerPhone,
        company,
        quantity,
        message,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error processing quote request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
