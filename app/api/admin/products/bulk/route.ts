import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth check
    const token = req.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    // ⬇️ Parse form-data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ status: "error", message: "No file uploaded" }, { status: 400 });
    }

    // 📊 Read Excel into buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 🧩 Connect DB
    const { db } = await connectDB();

    // 🔎 Fetch existing SKUs for duplicate check
    const existingProducts = await db
      .collection("products")
      .find({}, { projection: { sku: 1 } })
      .toArray();
    const existingSkus = new Set(existingProducts.map((p) => p.sku));

    // Validation containers
    const validProducts: any[] = [];
    const errors: any[] = [];
    const duplicates: string[] = [];

    // 🧠 Validate each row
    rows.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row offset

      const name = row["Name"]?.toString().trim();
      const description = row["Description"]?.toString().trim();
      const category = row["Category"]?.toString().trim();
      const brand = row["Brand"]?.toString().trim();
      const sku = row["SKU"]?.toString().trim();

      // 🟥 Required field validation
      if (!name || !description || !category || !brand || !sku) {
        errors.push({
          row: rowNumber,
          field: "General",
          message: "Missing required fields (Name, Description, Category, Brand, SKU)",
        });
        return;
      }

      // 🟨 Price validation
      if (row["Price"] === "" || isNaN(Number(row["Price"]))) {
        errors.push({
          row: rowNumber,
          field: "Price",
          value: row["Price"],
          message: "Price must be a valid number",
        });
        return;
      }

      // 🟨 Stock Quantity validation
      if (row["StockQuantity"] !== "" && isNaN(Number(row["StockQuantity"]))) {
        errors.push({
          row: rowNumber,
          field: "StockQuantity",
          value: row["StockQuantity"],
          message: "Stock Quantity must be a valid number",
        });
        return;
      }

      // 🟨 InStock boolean check
      if (
        row["InStock"] &&
        !["true", "false"].includes(row["InStock"].toString().toLowerCase())
      ) {
        errors.push({
          row: rowNumber,
          field: "InStock",
          value: row["InStock"],
          message: "InStock must be 'true' or 'false'",
        });
        return;
      }

      // 🟥 Duplicate SKU check
      if (existingSkus.has(sku)) {
        duplicates.push(sku);
        return;
      }

      // ✅ Valid product
      validProducts.push({
        name,
        description,
        category,
        brand,
        sku,
        price: Number(row["Price"]),
        stockQuantity: Number(row["StockQuantity"]) || 0,
        inStock: row["InStock"]?.toString().toLowerCase() === "true",
        specifications: row["Specifications"]?.toString().trim() || "",
        datasheet: row["Datasheet"]?.toString().trim() || "",
        images: row["Images"] ? row["Images"].toString().split(",") : [],
        tags: row["Tags"] ? row["Tags"].toString().split(",") : [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      // Track inserted SKU to avoid duplicates in same batch
      existingSkus.add(sku);
    });

    // ❌ Stop upload if duplicates or validation errors exist
    if (duplicates.length > 0 || errors.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message:
            duplicates.length > 0
              ? "Duplicate SKUs found. Upload aborted."
              : "Validation failed. Please check your Excel data.",
          duplicates,
          errorCount: errors.length,
          errors,
        },
        { status: 400 }
      );
    }

    // ✅ Insert into MongoDB
    if (validProducts.length > 0) {
      const result = await db.collection("products").insertMany(validProducts);

      return NextResponse.json(
        {
          status: "success",
          message: "Bulk upload completed successfully.",
          insertedCount: result.insertedCount,
        },
        { status: 200 }
      );
    }

    // 🟨 If no valid rows
    return NextResponse.json(
      { status: "error", message: "No valid data found in file." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Error bulk uploading products:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error during upload.",
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
