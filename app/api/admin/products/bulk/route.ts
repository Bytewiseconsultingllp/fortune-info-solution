// import { NextRequest, NextResponse } from "next/server";
// import * as XLSX from "xlsx";
// import { connectDB } from "@/lib/mongodb";
// import { verifyToken } from "@/lib/auth";
// import { IncomingForm } from "formidable";

// // Required for formidable in Next.js API routes
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Helper: parse multipart form
// async function parseForm(req: any): Promise<{ fields: any; files: any }> {
//   const form = new IncomingForm({ keepExtensions: true });
//   return new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     // ⬇️ Parse file
//     const reqObj: any = (req as any).req; // formidable expects Node req
//     const { files } = await parseForm(reqObj);

//     const file = files.file?.[0] || files.file;
//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // 📊 Read Excel
//     const workbook = XLSX.readFile(file.filepath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows: any[] = XLSX.utils.sheet_to_json(sheet);

//     // Validation & transformation
//     const validProducts: any[] = [];
//     const errors: any[] = [];

//     rows.forEach((row, index) => {
//       const name = row["Name"]?.toString().trim();
//       const description = row["Description"]?.toString().trim();
//       const category = row["Category"]?.toString().trim();
//       const brand = row["Brand"]?.toString().trim();

//       // Required field check
//       if (!name || !description || !category || !brand) {
//         errors.push({
//           row: index + 2, // +2 = account for header row + 1-based index
//           reason: "Missing required fields (Name, Description, Category, Brand)",
//           data: row,
//         });
//         return;
//       }

//       validProducts.push({
//         name,
//         description,
//         category,
//         brand,
//         price: Number(row["Price"]) || 0,
//         specifications: row["Specifications"]?.toString().trim() || "",
//         inStock: row["InStock"]?.toString().toLowerCase() === "true",
//         stockQuantity: Number(row["StockQuantity"]) || 0,
//         sku: row["SKU"]?.toString().trim() || "",
//         tags: row["Tags"] ? row["Tags"].toString().split(",") : [],
//         images: row["Images"] ? row["Images"].toString().split(",") : [""],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         isActive: true,
//       });
//     });

//     if (!validProducts.length) {
//       return NextResponse.json(
//         { error: "No valid rows found", skipped: errors },
//         { status: 400 }
//       );
//     }

//     // 💾 Insert into MongoDB
//     const { db } = await connectDB();
//     const result = await db.collection("products").insertMany(validProducts);

//     return NextResponse.json({
//       message: "Bulk upload completed",
//       insertedCount: result.insertedCount,
//       skippedCount: errors.length,
//       skipped: errors,
//     });
//   } catch (err) {
//     console.error("Error bulk uploading products:", err);
//     return NextResponse.json(
//       { error: "Failed to upload products" },
//       { status: 500 }
//     );
//   }
// }
// app/api/admin/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth check
    const token = req.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ⬇️ Parse form-data (no formidable)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 📊 Read Excel into buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    // Validation
    const validProducts: any[] = [];
    const errors: any[] = [];

    rows.forEach((row, index) => {
      const name = row["Name"]?.toString().trim();
      const description = row["Description"]?.toString().trim();
      const category = row["Category"]?.toString().trim();
      const brand = row["Brand"]?.toString().trim();

      if (!name || !description || !category || !brand) {
        errors.push({
          row: index + 2, // +2 because Excel rows start at 1 and row 1 is headers
          reason: "Missing required fields (Name, Description, Category, Brand)",
          data: row,
        });
        return;
      }

      validProducts.push({
        name,
        description,
        category,
        brand,
        price: Number(row["Price"]) || 0,
        specifications: row["Specifications"]?.toString().trim() || "",
        inStock:
          row["InStock"]?.toString().toLowerCase() === "true" ? true : false,
        stockQuantity: Number(row["StockQuantity"]) || 0,
        sku: row["SKU"]?.toString().trim() || "",
        tags: row["Tags"] ? row["Tags"].toString().split(",") : [],
        images: row["Images"] ? row["Images"].toString().split(",") : [""],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });
    });

    if (!validProducts.length) {
      return NextResponse.json(
        { error: "No valid rows found", skipped: errors },
        { status: 400 }
      );
    }

    // 💾 Insert into MongoDB
    const { db } = await connectDB();
    const result = await db.collection("products").insertMany(validProducts);

    return NextResponse.json({
      message: "Bulk upload completed",
      insertedCount: result.insertedCount,
      skippedCount: errors.length,
      skipped: errors,
    });
  } catch (err) {
    console.error("Error bulk uploading products:", err);
    return NextResponse.json(
      { error: "Failed to upload products" },
      { status: 500 }
    );
  }
}
