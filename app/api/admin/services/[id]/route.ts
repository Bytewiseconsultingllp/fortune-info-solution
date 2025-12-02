import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let id: string = "unknown";
  let body: any = null;
  
  try {
    // Auth check
    const token = request.cookies.get("admin-token")?.value;
    console.log("Token check:", !!token);
    if (!token || !verifyToken(token)) {
      console.log("Auth failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    body = await request.json();
    console.log("Request body:", body);
    const { name, description, category, features, image, price, duration, isPopular, isActive } = body;

    const { db } = await connectDB();

    // Await params
    const params = await context.params;
    id = params.id;
    console.log("Service ID:", id);
    console.log("ObjectId valid:", ObjectId.isValid(id));

    // Update service
    const updateData = {
      name,
      description,
      category,
      features: Array.isArray(features) ? features : [],
      image,
      price,
      duration,
      isPopular,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    console.log("Update data:", updateData);

    const result = await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { bypassDocumentValidation: true }
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      console.log("No service found with ID:", id);
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Fetch and return the updated service
    const updatedService = await db.collection("services").findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      message: "Service updated successfully",
      service: updatedService 
    });
  } catch (error) {
    console.error("Error updating service:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      id,
      body
    });
    return NextResponse.json({ 
      error: "Failed to update service",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}



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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();
    const { id } = await context.params;

    // validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await db
      .collection("services")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}