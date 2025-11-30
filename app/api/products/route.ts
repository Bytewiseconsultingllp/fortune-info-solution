import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// Smart SKU sorting function that handles numeric, alphabetic, and alphanumeric SKUs
function sortProductsBySKU(products: any[]): any[] {
  return products.sort((a, b) => {
    const skuA = a.sku || "";
    const skuB = b.sku || "";
    
    // Function to extract numeric and alphabetic parts
    const parseSKU = (sku: string) => {
      const parts = sku.match(/(\d+)|(\D+)/g) || [];
      return parts.map(part => ({
        isNumeric: /^\d+$/.test(part),
        value: part
      }));
    };
    
    const partsA = parseSKU(skuA);
    const partsB = parseSKU(skuB);
    
    const maxLength = Math.max(partsA.length, partsB.length);
    
    for (let i = 0; i < maxLength; i++) {
      const partA = partsA[i];
      const partB = partsB[i];
      
      // If one SKU has fewer parts, the shorter one comes first
      if (!partA) return -1;
      if (!partB) return 1;
      
      if (partA.isNumeric && partB.isNumeric) {
        // Compare numeric parts as numbers
        const numA = parseInt(partA.value, 10);
        const numB = parseInt(partB.value, 10);
        if (numA !== numB) return numA - numB;
      } else if (!partA.isNumeric && !partB.isNumeric) {
        // Compare alphabetic parts lexicographically (case-insensitive)
        const compare = partA.value.localeCompare(partB.value, undefined, { sensitivity: 'base' });
        if (compare !== 0) return compare;
      } else {
        // Numeric parts come before alphabetic parts
        return partA.isNumeric ? -1 : 1;
      }
    }
    
    // If all parts are equal, compare the full SKU lexicographically
    return skuA.localeCompare(skuB, undefined, { sensitivity: 'base' });
  });
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const categories = searchParams.getAll("category");
    const brands = searchParams.getAll("brand");
    const search = searchParams.get("search");
    const getAllFilters = searchParams.get("getAllFilters") === "true";
    const getBrandCategories = searchParams.get("getBrandCategories") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const sortBy = searchParams.get("sortBy") || "category"; // "category", "sku", "name", "createdAt"

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

    // If getBrandCategories is true, fetch all categories for the specified brands
    if (getBrandCategories && brands.length > 0) {
      const validBrands = brands.filter(b => b !== "all");
      if (validBrands.length > 0) {
        const brandFilter = { brand: { $in: validBrands } };
        const brandCategories = await db.collection("products").distinct("category", brandFilter);

        console.log("getBrandCategories mode - Brands:", validBrands);
        console.log("getBrandCategories mode - Categories for these brands:", brandCategories);

        return NextResponse.json({
          brandCategories,
          brands: validBrands
        });
      }
    }

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

    // Get all products first for custom sorting
    const [allProducts, totalCount, allCategories, allBrands] = await Promise.all([
      db.collection("products")
        .find(filter)
        .sort({ category: 1 }) // Sort by category first
        .toArray(),
      db.collection("products").countDocuments(filter),
      allCategoriesPromise,
      allBrandsPromise,
    ]);

    // Apply custom sorting: category first, then SKU within each category
    let sortedProducts = allProducts;
    
    // Group products by category
    const productsByCategory: { [key: string]: any[] } = {};
    sortedProducts.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    });

    // Sort each category's products by SKU
    Object.keys(productsByCategory).forEach(category => {
      productsByCategory[category] = sortProductsBySKU(productsByCategory[category]);
    });

    // Flatten the sorted products back into a single array
    sortedProducts = Object.keys(productsByCategory)
      .sort() // Sort categories alphabetically
      .flatMap(category => productsByCategory[category]);

    // Apply pagination after sorting
    const paginatedProducts = sortedProducts.slice(skip, skip + limit);

    console.log("Normal mode - Total products:", totalCount);
    console.log("Normal mode - Categories:", allCategories);
    console.log("Normal mode - Brands:", allBrands);

    // Convert ObjectId to string for JSON serialization
    const serializedProducts = paginatedProducts.map(product => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString?.() || new Date().toISOString(),
    }));

    return NextResponse.json({
      products: serializedProducts,
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
