import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const filter: any = { inStock: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (brand && brand !== "all") {
      filter.brand = brand;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const [products, totalCount, categories, brands] = await Promise.all([
      db.collection("products")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("products").countDocuments(filter),
      db.collection("products").distinct("category"),
      db.collection("products").distinct("brand"),
    ]);

    return NextResponse.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      categories,
      brands,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
