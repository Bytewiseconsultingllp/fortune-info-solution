// import { type NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/lib/mongodb"

// export async function GET(request: NextRequest) {
//   try {
//     const { db } = await connectDB()

//     const searchParams = request.nextUrl.searchParams
//     const category = searchParams.get("category")
//     const brand = searchParams.get("brand")
//     const search = searchParams.get("search")

//     // Build filter query
//     const filter: any = { inStock: true } // Only show in-stock products on frontend

//     if (category && category !== "all") {
//       filter.category = category
//     }

//     if (brand && brand !== "all") {
//       filter.brand = brand
//     }

//     if (search) {
//       filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
//     }

//     const products = await db.collection("products").find(filter).sort({ createdAt: -1 }).toArray()

//     return NextResponse.json(products)
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")

    // Build filter query
    const filter: any = { inStock: true }

    if (category && category !== "all") {
      filter.category = category
    }

    if (brand && brand !== "all") {
      filter.brand = brand
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ]
    }

    // Fetch filtered products
    const products = await db.collection("products").find(filter).sort({ createdAt: -1 }).toArray()

    // Fetch all categories and brands (not filtered)
    const categories = await db.collection("products").distinct("category")
    const brands = await db.collection("products").distinct("brand")

    return NextResponse.json({ products, categories, brands })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
