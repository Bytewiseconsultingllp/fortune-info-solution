import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const categories = searchParams.getAll("category");
    const brands = searchParams.getAll("brand");
    const search = searchParams.get("search");
    const getAllFilters = searchParams.get("getAllFilters") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const filter: any = { };

    // Handle multiple categories
    if (categories.length > 0) {
      const validCategories = categories.filter(cat => cat !== "all");
      if (validCategories.length > 0) {
        filter.category = { $in: validCategories };
      }
    }

    // Handle multiple brands
    if (brands.length > 0) {
      const validBrands = brands.filter(b => b !== "all");
      if (validBrands.length > 0) {
        filter.brand = { $in: validBrands };
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    // Get all categories and brands regardless of filters
    const allCategoriesPromise = db.collection("products").distinct("category");
    const allBrandsPromise = db.collection("products").distinct("brand");

    // If getAllFilters is true, just return categories and brands
    if (getAllFilters) {
      const [allCategories, allBrands] = await Promise.all([
        allCategoriesPromise,
        allBrandsPromise,
      ]);

      console.log("getAllFilters mode - Categories:", allCategories);
      console.log("getAllFilters mode - Brands:", allBrands);

      return NextResponse.json({
        products: [],
        totalCount: 0,
        totalPages: 0,
        categories: allCategories,
        brands: allBrands,
      });
    }

    // Normal mode with pagination
    const skip = (page - 1) * limit;

    // Get filtered products and count
    const [products, totalCount, allCategories, allBrands] = await Promise.all([
      db.collection("products")
        .find(filter)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("products").countDocuments(filter),
      allCategoriesPromise,
      allBrandsPromise,
    ]);

    console.log("Normal mode - Total products:", totalCount);
    console.log("Normal mode - Categories:", allCategories);
    console.log("Normal mode - Brands:", allBrands);

    return NextResponse.json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      categories: allCategories,
      brands: allBrands,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
