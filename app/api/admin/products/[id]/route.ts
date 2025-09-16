import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const token = request.cookies.get("admin-token")?.value
//     if (!token || !verifyToken(token)) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { name, description, category, brand, image, specifications, isActive } = body
    
//     const { db } = await connectDB()
//     const result = await db.collection("products").updateOne(
//       { _id: new ObjectId(params.id) },
//       {
//         $set: {
//           name,
//           description,
//           category,
//           brand,
//           image,
//           specifications,
//           isActive,
//           updatedAt: new Date(),
//         },
//       },
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Product updated successfully" })
//   } catch (error) {
//     console.error("Error updating product:", error)
//     return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
//   }
// }
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      brand,
      price,
      specifications,
      inStock,
      stockQuantity,
      sku,
      tags,
      images,
      datasheet, // 👈 fix naming
      eanNumber,
      isActive,  // 👈 required in schema
    } = body

    const { id } = context.params
    const { db } = await connectDB()

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          category,
          brand,
          price,
          specifications,
          inStock,
          stockQuantity,
          sku,
          tags: Array.isArray(tags) ? tags : [], // ensure array
          images: Array.isArray(images) ? images : [], // ensure array of strings
          datasheet: datasheet || "", // required → at least empty string
          eanNumber,
          isActive: typeof isActive === "boolean" ? isActive : true, // required
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
