// Database models and types for Fortune Info Solutions

export interface Contact {
  _id?: string
  name: string
  email: string
  phone: string
  company?: string
  message: string
  createdAt: Date
  status: "new" | "contacted" | "resolved"
}

export interface PartnerEnquiry {
  _id?: string
  name: string
  email: string
  phone: string
  company: string
  businessType: string
  location: string
  message: string
  createdAt: Date
  status: "new" | "contacted" | "approved" | "rejected"
}

// export interface Product {
//   _id?: string
//   name: string
//   description: string
//   category: string 
//   brand: string
//   datasheet?: string
//   images: string[]
//   specifications?: string
//   price?: number 
//   inStock: boolean
//   stockQuantity?: number
//   sku?: string
//   tags: string[]
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   createdBy?: string
//   updatedBy?: string
// }
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  tags: string[];
  images: string[];
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  createdBy?: string
  updatedBy?: string
  specifications?: string;
  datasheet?: string;
}


// export interface Service {
//   _id?: string
//   title: string
//   description: string
//   features: string[]
//   image: string
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
// }

export interface Service {
  _id?: string
  name: string
  description: string
  features: string[]
  image: string
  category: "consulting" | "implementation" | "support" | "training" | "maintenance"
  price?: number
  duration?: string
  isPopular?: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
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
  message?: string
  createdAt: Date
  status: "pending" | "quoted" | "converted" | "declined"
  urgency: "low" | "medium" | "high"
}

export interface Admin {
  _id?: string
  email: string
  password: string
  name: string
  role: "admin" | "super_admin"
  createdAt: Date
  lastLogin?: Date
}
