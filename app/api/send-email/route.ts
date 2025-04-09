import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, message } = data

    // In a real application, you would use a service like Nodemailer, SendGrid, or Resend
    // to send the email to piyushmodgil9@gmail.com

    // For demonstration purposes, we'll just log the data
    console.log("Email would be sent with:", { name, email, message })

    // Simulate email sending
    // In production, replace this with actual email sending code
    const emailSent = true

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully!",
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
