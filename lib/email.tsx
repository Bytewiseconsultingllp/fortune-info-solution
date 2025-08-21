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
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #B8001F; color: white; padding: 20px; text-align: center; }
    .content { background-color: #FDFAF6; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #B8001F; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      ${
        data.company
          ? `
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company}</div>
      </div>
      `
          : ""
      }
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${data.message}</div>
      </div>
    </div>
  </div>
</body>
</html>
`

const getPartnerEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Partner Enquiry</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #B8001F; color: white; padding: 20px; text-align: center; }
    .content { background-color: #FDFAF6; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #B8001F; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Partner Enquiry</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Company Name:</div>
        <div class="value">${data.companyName}</div>
      </div>
      <div class="field">
        <div class="label">Contact Person:</div>
        <div class="value">${data.contactPerson}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      <div class="field">
        <div class="label">Business Type:</div>
        <div class="value">${data.businessType}</div>
      </div>
      <div class="field">
        <div class="label">Experience:</div>
        <div class="value">${data.experience}</div>
      </div>
      <div class="field">
        <div class="label">Territory:</div>
        <div class="value">${data.territory}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${data.message}</div>
      </div>
    </div>
  </div>
</body>
</html>
`

const getQuoteEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Quote Request</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #B8001F; color: white; padding: 20px; text-align: center; }
    .content { background-color: #FDFAF6; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #B8001F; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Quote Request</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company}</div>
      </div>
      <div class="field">
        <div class="label">Product:</div>
        <div class="value">${data.product}</div>
      </div>
      <div class="field">
        <div class="label">Quantity:</div>
        <div class="value">${data.quantity}</div>
      </div>
      <div class="field">
        <div class="label">Requirements:</div>
        <div class="value">${data.requirements}</div>
      </div>
    </div>
  </div>
</body>
</html>
`

// Main function to send admin notifications
export async function sendAdminNotification(type: "contact" | "partner" | "quote", data: any) {
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
        subject = `New Partner Enquiry from ${data.companyName}`
        htmlContent = getPartnerEmailTemplate(data)
        break
      case "quote":
        subject = `New Quote Request from ${data.name}`
        htmlContent = getQuoteEmailTemplate(data)
        break
      default:
        throw new Error("Invalid notification type")
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
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
