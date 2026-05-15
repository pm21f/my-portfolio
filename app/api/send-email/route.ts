import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return NextResponse.json(
        { success: false, message: "Email service not configured." },
        { status: 503 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["piyushmodgil9@gmail.com"],
      replyTo: email,
      subject: `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #020817; color: #e2e8f0; padding: 32px; border-radius: 12px; max-width: 600px;">
          <div style="border-bottom: 1px solid rgba(0,212,255,0.2); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #00d4ff; margin: 0; font-size: 18px;">New Contact Form Submission</h2>
            <p style="color: rgba(148,163,184,0.7); margin: 4px 0 0; font-size: 12px;">piyushmodgil.dev/contact</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: rgba(0,212,255,0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">Name</td>
              <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: rgba(0,212,255,0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px;">${email}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); border-radius: 8px;">
            <p style="color: rgba(0,212,255,0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(0,212,255,0.1); color: rgba(148,163,184,0.4); font-size: 11px;">
            Sent from piyushmodgil.dev portfolio contact form
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to send email. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Message sent successfully!" })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}
