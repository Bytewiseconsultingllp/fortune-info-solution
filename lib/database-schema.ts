import type { Collection } from "mongodb"

// Enhanced database models with validation schemas
export interface DatabaseSchema {
  products: Collection<Product>
  services: Collection<Service>
  contacts: Collection<Contact>
  partnerEnquiries: Collection<PartnerEnquiry>
  quoteRequests: Collection<QuoteRequest>
  admins: Collection<Admin>
  auditLogs: Collection<AuditLog>
}

export interface Product {
  _id?: string
  name: string
  description: string
  category: string 
  brand: string
  image: string
  specifications?: string
  price?: number
  inStock: boolean
  stockQuantity?: number
  sku?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  createdBy?: string
  updatedBy?: string
}

export interface Service {
  _id?: string
  name: string // Changed from title to match frontend
  description: string
  features: string[]
  image: string
  category: string
  price?: number
  duration?: string
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  createdBy?: string
  updatedBy?: string
}

export interface Contact {
  _id?: string
  name: string
  email: string
  phone: string
  company?: string
  subject?: string
  message: string
  source: "website" | "phone" | "email" | "referral"
  priority: "low" | "medium" | "high"
  assignedTo?: string
  notes?: string[]
  createdAt: Date
  updatedAt: Date
  status: "new" | "contacted" | "in_progress" | "resolved" | "closed"
}

export interface PartnerEnquiry {
  _id?: string
  name: string
  email: string
  phone: string
  company: string
  businessType: string
  location: string
  website?: string
  yearsInBusiness?: number
  annualRevenue?: string
  message: string
  documents?: string[]
  assignedTo?: string
  notes?: string[]
  createdAt: Date
  updatedAt: Date
  status: "new" | "contacted" | "under_review" | "approved" | "rejected" | "on_hold"
}

export interface QuoteRequest {
  _id?: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  company?: string
  quantity: number
  urgency: "low" | "medium" | "high"
  budget?: string
  deliveryLocation?: string
  message?: string
  quotedPrice?: number
  quotedBy?: string
  validUntil?: Date
  notes?: string[]
  createdAt: Date
  updatedAt: Date
  status: "pending" | "quoted" | "converted" | "declined" | "expired"
}

export interface Admin {
  _id?: string
  email: string
  password: string
  name: string
  role: "admin" | "super_admin"
  permissions: string[]
  isActive: boolean
  lastLogin?: Date
  loginAttempts: number
  lockedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  _id?: string
  userId?: string
  userEmail?: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  success: boolean
  errorMessage?: string
}

// Database validation schemas
export const ProductSchema = {
  name: { type: "string", required: true, minLength: 1, maxLength: 200 },
  description: { type: "string", required: true, minLength: 10, maxLength: 2000 },
  category: { type: "string", required: true, enum: ["networking", "security", "storage", "servers", "accessories"] },
  brand: { type: "string", required: true, minLength: 1, maxLength: 100 },
  image: { type: "string", required: true },
  price: { type: "number", min: 0 },
  inStock: { type: "boolean", required: true },
  stockQuantity: { type: "number", min: 0 },
  isActive: { type: "boolean", required: true },
}

export const ServiceSchema = {
  name: { type: "string", required: true, minLength: 1, maxLength: 200 },
  description: { type: "string", required: true, minLength: 10, maxLength: 2000 },
  category: {
    type: "string",
    required: true,
    enum: ["consulting", "implementation", "support", "training", "maintenance"],
  },
  features: { type: "array", required: true, minItems: 1 },
  image: { type: "string", required: true },
  isActive: { type: "boolean", required: true },
}

// Database indexes for performance
export const DatabaseIndexes = {
  products: [
    { key: { name: "text", description: "text", brand: "text" } },
    { key: { category: 1 } },
    { key: { brand: 1 } },
    { key: { isActive: 1 } },
    { key: { createdAt: -1 } },
  ],
  services: [
    { key: { name: "text", description: "text" } },
    { key: { category: 1 } },
    { key: { isActive: 1 } },
    { key: { createdAt: -1 } },
  ],
  contacts: [{ key: { email: 1 } }, { key: { status: 1 } }, { key: { createdAt: -1 } }, { key: { priority: 1 } }],
  partnerEnquiries: [
    { key: { email: 1 } },
    { key: { status: 1 } },
    { key: { businessType: 1 } },
    { key: { createdAt: -1 } },
  ],
  quoteRequests: [
    { key: { customerEmail: 1 } },
    { key: { productId: 1 } },
    { key: { status: 1 } },
    { key: { createdAt: -1 } },
  ],
  admins: [{ key: { email: 1 }, unique: true }, { key: { isActive: 1 } }],
  auditLogs: [{ key: { userId: 1 } }, { key: { action: 1 } }, { key: { resource: 1 } }, { key: { timestamp: -1 } }],
}
