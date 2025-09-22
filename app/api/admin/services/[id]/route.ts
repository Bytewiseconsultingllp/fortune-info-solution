import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Auth check
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse request body
    const body = await request.json();
    const { name, description, category, features, image, price, duration, isPopular } = body;

    const { db } = await connectDB();

    // ✅ Await params
    const { id } = await context.params;

    // ✅ Update service
    const result = await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          category,
          features: Array.isArray(features) ? features : [],
          image,
          price,
          duration,
          isPopular,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}


// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const token = request.cookies.get("admin-token")?.value
//     if (!token || !verifyToken(token)) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { db } = await connectDB()
//     const result = await db.collection("services").deleteOne({ _id: new ObjectId(params.id) })

//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: "Service not found" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Service deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting service:", error)
//     return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
//   }
// }
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();

    // validate ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await db
      .collection("services")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}