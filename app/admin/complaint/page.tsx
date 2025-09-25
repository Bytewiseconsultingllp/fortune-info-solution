// app/admin/complaints/page.tsx
import { MongoClient } from "mongodb";
import ComplaintsClient from "@/components/ComplaintsClient";

type Complaint = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
  orderId?: string;
  message: string;
  complaintNumber: string;
  createdAt: string; // ISO string
};

async function fetchComplaints(): Promise<Complaint[]> {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "your_database_name");
  const raw = await db
    .collection("complaints")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  await client.close();

  return raw.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    type: c.type ?? "",
    orderId: c.orderId ?? "",
    message: c.message ?? "",
    complaintNumber: c.complaintNumber ?? "",
    createdAt:
      c.createdAt instanceof Date ? c.createdAt.toISOString() : new Date(c.createdAt).toISOString(),
  }));
}

export default async function AdminComplaintsPage() {
  const complaints = await fetchComplaints();

  // Render the CLIENT component and pass server-side data as props
  return <ComplaintsClient complaints={complaints} />;
}
