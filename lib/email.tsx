import nodemailer from "nodemailer"

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Email templates
const getContactEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Contact Enquiry</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
    <div style="max-width:600px; margin:20px auto; background:#FDFAF6; border:1px solid #e0e0e0; border-radius:6px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background: #B8001F; color:white; padding:20px; text-align:center;">
        <h1 style="margin:0; font-size:22px;">New Contact Enquiry</h1>
      </div>
      
      <!-- Content -->
      <div style="padding:20px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="35%" style="font-weight:bold; color:#333;">Company Name:</td>
            <td style="color:#555;">${data.name}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Email:</td>
            <td style="color:#555;">${data.email}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Phone:</td>
            <td style="color:#555;">${data.phone}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Company:</td>
            <td style="color:#555;">${data.company}</td>
          </tr>
        
          <tr>
            <td style="font-weight:bold; color:#333;">Message:</td>
            <td style="color:#555;">${data.message}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer -->
      <div style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
        This is an automated email from your website quote request form.
      </div>
    </div>
  </body>
</html>
`

const getPartnerEmailTemplate = (data: any) =>
 `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Quote Request</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
    <div style="max-width:600px; margin:20px auto; background:#FDFAF6; border:1px solid #e0e0e0; border-radius:6px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background: #B8001F; color:white; padding:20px; text-align:center;">
        <h1 style="margin:0; font-size:22px;">New Partner Enquiry </h1>
      </div>
      
      <!-- Content -->
      <div style="padding:20px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="35%" style="font-weight:bold; color:#333;">Company Name:</td>
            <td style="color:#555;">${data.name}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Email:</td>
            <td style="color:#555;">${data.email}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Phone:</td>
            <td style="color:#555;">${data.phone}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Business Type:</td>
            <td style="color:#555;">${data.businessType}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Location:</td>
            <td style="color:#555;">${data.location}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Message:</td>
            <td style="color:#555;">${data.message}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer -->
      <div style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
        This is an automated email from your website quote request form.
      </div>
    </div>
  </body>
</html>
`

const getQuoteEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Quote Request</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
    <div style="max-width:600px; margin:20px auto; background:#FDFAF6; border:1px solid #e0e0e0; border-radius:6px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background: #B8001F; color:white; padding:20px; text-align:center;">
        <h1 style="margin:0; font-size:22px;">New Quote Request</h1>
      </div>
      
      <!-- Content -->
      <div style="padding:20px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="35%" style="font-weight:bold; color:#333;">Product Id:</td>
            <td style="color:#555;">${data.productId}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Product Name:</td>
            <td style="color:#555;">${data.productName}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Customer Name:</td>
            <td style="color:#555;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Customer Email:</td>
            <td style="color:#555;">${data.customerEmail}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Customer Phone:</td>
            <td style="color:#555;">${data.customerPhone}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Company:</td>
            <td style="color:#555;">${data.company}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Quantity:</td>
            <td style="color:#555;">${data.quantity}</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:#333;">Message:</td>
            <td style="color:#555;">${data.message}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer -->
      <div style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
        This is an automated email from your website quote request form.
      </div>
    </div>
  </body>
</html>
`

// Main function to send admin notifications
export async function sendAdminNotification(type: "contact" | "partner" | "quote", data: any) {
  console.log(`Preparing to send ${type} notification email...`)
  console.log(data);
  try {
    const transporter = createTransporter()

    let subject = ""
    let htmlContent = ""

    switch (type) {
      case "contact":
        subject = `New Contact Form Submission from ${data.name}`
        htmlContent = getContactEmailTemplate(data)
        break
      case "partner":
        subject = `New Partner Enquiry from ${data.company}`
        htmlContent = getPartnerEmailTemplate(data)
        break
      case "quote":
        subject = `New Quote Request from ${data.customerName}`
        htmlContent = getQuoteEmailTemplate(data)
        break
      default:
        throw new Error("Invalid notification type")
    }

    console.log(`Sending email with subject: ${subject} to ${process.env.ADMIN_EMAIL}`)
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: [data.email ? data.email : data.customerEmail, process.env.ADMIN_EMAIL],
      bcc: process.env.BCC_EMAIL || undefined,
      subject,
      html: htmlContent,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return result 
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
