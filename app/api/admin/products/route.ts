import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import type { Product } from "@/lib/models"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get("admin-token")?.value
//     if (!token || !verifyToken(token)) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { name, description, category, brand, image, specifications } = body

//     if (!name || !description || !category || !brand) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const { db } = await connectDB()
//     const product: Product = {
//       name,
//       description,
//       category,
//       brand,
//       image: image || "/placeholder.svg?height=200&width=200",
//       specifications,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       isActive: true,
//     }

//     const result = await db.collection("products").insertOne(product)

//     return NextResponse.json({
//       message: "Product created successfully",
//       productId: result.insertedId,
//     })
//   } catch (error) {
//     console.error("Error creating product:", error)
//     return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
//   }
// }
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Destructure with defaults
    const {
      name,
      description,
      category,
      brand,
      images=[""],
      price = 0,
      specifications,
      inStock = true,
      stockQuantity = 0,
      sku = "",
      tags = [],
    } = body

    if (!name || !description || !category || !brand) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectDB()

    // Prepare product data for insertion
    const productData = {
      name,
      description,
      category,
      brand,
      images,
      price,
      specifications,
      inStock,
      stockQuantity,
      sku,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const result = await db.collection("products").insertOne(productData)

    return NextResponse.json({
      message: "Product created successfully",
      productId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}









































// | Name     | Description | Category    | Brand   | Price | Specifications | InStock | StockQuantity | SKU    | Tags          | Images            |
// | -------- | ----------- | ----------- | ------- | ----- | -------------- | ------- | ------------- | ------ | ------------- | ----------------- |
// | Laptop 1 | Good laptop | Electronics | Dell    | 599   | i5, 8GB RAM    | true    | 10            | LPT001 | laptop,work   | img1.jpg,img2.jpg |
// | Phone 1  | Smart phone | Mobile      | Samsung | 299   | Android        | true    | 50            | PHN001 | phone,android | phone1.jpg        |
