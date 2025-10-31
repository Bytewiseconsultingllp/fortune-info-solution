import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import nodemailer from "nodemailer"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("Please define MONGODB_URI in your .env file")
}

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Please define SMTP_USER and SMTP_PASS in your .env file")
}

// Cache client globally to avoid reconnecting on every request
let cachedClient: MongoClient | null = null
let cachedDb: any = null

async function connectDB() {
  if (cachedClient && cachedDb) {
    return cachedDb
  }

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  cachedDb = client.db("fortune_info_solutions").collection("complaints")
  return cachedDb
}

// Email template for complaint submission
const getComplaintEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${data.isCustomerCopy ? 'Your Complaint Has Been Received' : 'New Complaint Submission'}</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
  <div style="max-width:600px; margin:20px auto; background:#FDFAF6; border:1px solid #e0e0e0; border-radius:6px; overflow:hidden;">
    <!-- Header -->
    <div style="background: #B8001F; color:white; padding:20px; text-align:center;">
      <h1 style="margin:0; font-size:22px;">
        ${data.isCustomerCopy ? 'Thank You for Contacting Us' : 'New Complaint Received'}
      </h1>
    </div>
    
    <!-- Content -->
    <div style="padding:20px;">
      <p style="margin-top:0; color:#333;">A new complaint has been submitted with the following details:</p>
      
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; margin-top:20px;">
        <tr>
          <td width="35%" style="font-weight:bold; color:#333; vertical-align:top;">Complaint #:</td>
          <td style="color:#555;">${data.complaintNumber}</td>
        </tr>
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Name:</td>
          <td style="color:#555;">${data.name}</td>
        </tr>
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Email:</td>
          <td style="color:#555;">${data.email}</td>
        </tr>
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Phone:</td>
          <td style="color:#555;">${data.phone}</td>
        </tr>
        ${data.orderId ? `
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Order #:</td>
          <td style="color:#555;">${data.orderId}</td>
        </tr>
        ` : ''}
        ${data.type ? `
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Issue Type:</td>
          <td style="color:#555;">${data.type}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="font-weight:bold; color:#333; vertical-align:top;">Message:</td>
          <td style="color:#555; white-space:pre-line;">${data.message}</td>
        </tr>
      </table>
      
      <p style="margin-bottom:0; color:#333; margin-top:20px;">
        <strong>Status:</strong> New (Pending Review)
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
      ${data.isCustomerCopy 
        ? 'This is an automated confirmation of your complaint submission. Our team will review your concern and get back to you shortly.' 
        : 'This is an automated notification. Please log in to the admin panel to view and manage this complaint.'}
    </div>
  </div>
</body>
</html>
`

// Function to send email notification
async function sendComplaintNotification(complaintData: any) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  interface MailOptions {
    from: string;
    to: string;
    cc?: string;
    subject: string;
    html: string;
    bcc?: string;
  }

  // Create a customer-friendly version of the email
  const customerHtml = getComplaintEmailTemplate({
    ...complaintData,
    isCustomerCopy: true
  });

  // First send to admin (with customer in CC)
  const mailOptions: MailOptions = {
    from: `"Fortune Info Solutions" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || 'info@fortuneinfo.in',
    cc: complaintData.email, // Include customer in CC
    subject: `New Complaint #${complaintData.complaintNumber} - ${complaintData.name}`,
    html: getComplaintEmailTemplate(complaintData),
  }

  // Add BCC if configured
  if (process.env.BCC_EMAIL) {
    mailOptions.bcc = process.env.BCC_EMAIL;
  }

  // Send the admin email with customer in CC
  await transporter.sendMail(mailOptions);

  // Send a separate copy to the customer with a different subject
  const customerMailOptions: MailOptions = {
    from: `"Fortune Info Solutions Customer Support" <${process.env.SMTP_USER}>`,
    to: complaintData.email,
    subject: `Your Complaint #${complaintData.complaintNumber} has been received`,
    html: customerHtml,
  };

  // Send customer email (don't wait for it to complete)
  transporter.sendMail(customerMailOptions).catch(console.error);
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, type, orderId, message } = body

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Phone, and Message are required" },
        { status: 400 }
      )
    }

    const collection = await connectDB()

    // Generate a simple complaint number (like CMP-1234)
    const complaintNumber = `CMP-${Math.floor(1000 + Math.random() * 9000)}`

    const complaintDoc = {
      name,
      email,
      phone,
      type: type || null,
      orderId: orderId || null,
      message,
      complaintNumber,
      createdAt: new Date(),
      status: "new", // optional backend status
    }

    const result = await collection.insertOne(complaintDoc)

    // Send email notification (non-blocking)
    try {
      await sendComplaintNotification({
        ...complaintDoc,
        _id: result.insertedId.toString()
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      complaintNumber,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error saving complaint:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}


// ------------------ GET (Fetch Complaints with Pagination) ------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const skip = (page - 1) * limit

    const collection = await connectDB()

    const total = await collection.countDocuments()
    const complaints = await collection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const formatted = complaints.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      complaints: formatted,
    })
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
