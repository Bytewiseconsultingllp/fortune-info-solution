import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import type { Product } from "@/lib/models"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

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
  images = ["default.jpg"],   // ✅ non-empty default
  price = 0,
  specifications = "",        // ✅ force string
  inStock = true,
  stockQuantity = 0,
  sku = "",
  tags = [],
  datasheet = "N/A",          // ✅ non-empty default
} = body;

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
  specifications: typeof specifications === "object"
    ? JSON.stringify(specifications) // ✅ stringify if object
    : String(specifications || ""),
  inStock,
  stockQuantity,
  sku,
  tags,
  datasheet,
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
};

    const result = await db.collection("products").insertOne(productData)

    return NextResponse.json({
      message: "Product created successfully",
      productId: result.insertedId,
    })
  } catch (error: any) {
  console.error("Error creating product:", error?.errInfo ?? error);
  return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { db } = await connectDB()
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 })
    }
    const objectIds = ids.map((id: string) => new ObjectId(id))
    const result = await db.collection("products").deleteMany({ _id: { $in: objectIds } })
    return NextResponse.json({ message: `${result.deletedCount} products deleted successfully` })
  } catch (error) {
    console.error("Error deleting products:", error)
    return NextResponse.json({ error: "Failed to delete products" }, { status: 500 })
  }
}