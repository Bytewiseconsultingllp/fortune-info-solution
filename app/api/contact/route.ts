import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Contact } from "@/lib/models"
import { sendAdminNotification } from "@/lib/email" // Assuming this function is defined elsewhere


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, subject, source, priority } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Default values if not provided
    const contact = {
      name,
      email,
      phone,
      company: company || "",
      subject: subject || "",
      message,
      source: source || "website",       // ✅ required by schema
      priority: priority || "medium",    // ✅ required by schema
      status: "new",                     // ✅ required by schema
      assignedTo: "",                    // optional, can be empty
      notes: [],                         // optional array
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to DB
    const db = await getDatabase();
    const result = await db.collection("contacts").insertOne(contact);

    // Send admin email (non-blocking)
    try {
      await sendAdminNotification("contact", {
        name,
        email,
        phone,
        company,
        subject: subject || "",
        message,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
