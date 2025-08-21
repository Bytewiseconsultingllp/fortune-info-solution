import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

export async function GET() {
  try {
    const auth = await verifyAuth()

    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: auth })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
