import { connectToDatabase } from "./mongodb"
import type { AuditLog } from "./database-schema"

export class Logger {
  private static instance: Logger
  private db: any = null

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private async getDatabase() {
    if (!this.db) {
      const { db } = await connectToDatabase()
      this.db = db
    }
    return this.db
  }

  async logAction(logData: Omit<AuditLog, "_id" | "timestamp">) {
    try {
      const db = await this.getDatabase()
      const auditLog: AuditLog = {
        ...logData,
        timestamp: new Date(),
      }

      await db.collection("auditLogs").insertOne(auditLog)

      // Also log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[AUDIT] ${logData.action} on ${logData.resource}`, {
          user: logData.userEmail,
          success: logData.success,
          details: logData.details,
        })
      }
    } catch (error) {
      console.error("Failed to log audit action:", error)
    }
  }

  async logError(error: Error, context: Record<string, any> = {}) {
    try {
      const db = await this.getDatabase()
      const errorLog = {
        level: "error",
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date(),
      }

      await db.collection("errorLogs").insertOne(errorLog)
      console.error("[ERROR]", error.message, context)
    } catch (logError) {
      console.error("Failed to log error:", logError)
    }
  }

  async logInfo(message: string, data: Record<string, any> = {}) {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`[INFO] ${message}`, data)
      }

      const db = await this.getDatabase()
      await db.collection("infoLogs").insertOne({
        level: "info",
        message,
        data,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Failed to log info:", error)
    }
  }
}

export const logger = Logger.getInstance()
