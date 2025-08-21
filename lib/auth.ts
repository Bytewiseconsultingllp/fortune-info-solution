import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function verifyAuth() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("admin-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const auth = await verifyAuth()
  if (!auth) {
    throw new Error("Unauthorized")
  }
  return auth
}
