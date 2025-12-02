import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log("=== EMAIL REPLY API START ===");
  
  try {
    // Auth check
    const token = request.cookies.get("admin-token")?.value;
    console.log("Token check:", !!token);
    
    if (!token || !verifyToken(token)) {
      console.log("Auth failed - invalid or missing token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Auth successful");

    // Parse request body
    const body = await request.json();
    console.log("Request body received:", { 
      to: body.to, 
      subject: body.subject, 
      messageLength: body.message?.length || 0,
      contactId: body.contactId 
    });
    
    const { to, subject, message, contactId } = body

    if (!to || !subject || !message || !contactId) {
      console.log("Validation failed - missing fields:", { to: !!to, subject: !!subject, message: !!message, contactId: !!contactId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    console.log("Request validation passed");

    // Check environment variables
    const envVars = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? "***" : undefined,
    };
    console.log("Environment variables check:", envVars);

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing SMTP configuration in environment variables");
      return NextResponse.json({ 
        error: "Email service not configured properly",
        details: "Please check your SMTP environment variables"
      }, { status: 500 })
    }
    console.log("Environment variables validated");

    // Create email transporter
    console.log("Creating email transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    console.log("Email transporter created successfully");

    // Verify transporter configuration
    console.log("Verifying SMTP connection...");
    try {
      await transporter.verify()
      console.log("SMTP server connection verified successfully")
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      console.error("Verification error details:", {
        message: verifyError instanceof Error ? verifyError.message : 'Unknown error',
        stack: verifyError instanceof Error ? verifyError.stack : 'No stack trace'
      });
      return NextResponse.json({ 
        error: "Email service configuration error",
        details: "Could not connect to SMTP server",
        debugInfo: verifyError instanceof Error ? verifyError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Prepare email content
    console.log("Preparing email content...");
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Reply to Your Inquiry</h2>
          <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
            <p>This email was sent in response to your inquiry on our website.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Fortune Info Solutions Team</p>
          </div>
        </div>
      </div>
    `
    console.log("Email content prepared successfully");

    // Send email
    console.log("Preparing to send email...");
    const mailOptions = {
      from: `"Fortune Info Solutions" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailHtml,
      text: message, // Fallback for plain text
    }
    console.log("Mail options prepared:", { 
      from: mailOptions.from, 
      to: mailOptions.to, 
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html,
      hasText: !!mailOptions.text
    });
    
    console.log("Sending email...");
    const emailResult = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", { 
      messageId: emailResult.messageId,
      response: emailResult.response,
      envelope: emailResult.envelope
    });

    // Update contact status to "contacted"
    console.log("Updating contact status in database...");
    const { db } = await connectDB()
    console.log("Database connected successfully");
    
    const updateResult = await db.collection("contacts").updateOne(
      { _id: new ObjectId(contactId) },
      { 
        $set: { 
          status: "contacted",
          updatedAt: new Date()
        }
      }
    )
    console.log("Database update result:", { 
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      upsertedCount: updateResult.upsertedCount
    });

    if (updateResult.matchedCount === 0) {
      console.error("Contact not found in database for ID:", contactId);
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }
    console.log("Contact status updated successfully");

    console.log("=== EMAIL REPLY API SUCCESS ===");
    return NextResponse.json({ 
      message: "Reply sent successfully",
      emailId: emailResult.messageId,
      contactUpdated: true,
      debugInfo: {
        emailSent: true,
        contactUpdated: true,
        messageId: emailResult.messageId
      }
    })
  } catch (error) {
    console.error("=== EMAIL REPLY API ERROR ===");
    console.error("Error sending reply:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    // Additional error context
    if (error instanceof Error) {
      console.error("Error type:", error.constructor.name);
      if ('code' in error) {
        console.error("Error code:", (error as any).code);
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to send reply",
      details: error instanceof Error ? error.message : 'Unknown error',
      debugInfo: {
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
