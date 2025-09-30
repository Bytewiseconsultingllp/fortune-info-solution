"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Complaint = {
  _id: string
  name: string
  email: string
  phone: string
  type?: string | null
  orderId?: string | null
  message: string
  complaintNumber: string
  createdAt: string
  status: string
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch complaints (paginated)
  const fetchComplaints = async (pageNum: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/complaints?page=${pageNum}&limit=10`)
      const data = await res.json()
      if (data.success) {
        setComplaints(data.complaints)
        setTotalPages(data.pages)
      }
    } catch (err) {
      console.error("Error fetching complaints:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints(page)
  }, [page])

  // 🔹 Export function
  const exportComplaints = async () => {
    try {
      // Fetch all complaints (no pagination)
      const res = await fetch(`/api/complaints?all=true`)
      const data = await res.json()
      if (!data.success) return

      const allComplaints: Complaint[] = data.complaints

      // Convert to CSV
      const headers = [
        "Complaint Number",
        "Name",
        "Email",
        "Phone",
        "Type",
        "OrderId",
        "Message",
        "Status",
        "Created At",
      ]
      const rows = allComplaints.map((c) => [
        c.complaintNumber,
        c.name,
        c.email,
        c.phone,
        c.type || "N/A",
        c.orderId || "N/A",
        `"${c.message.replace(/"/g, '""')}"`, // escape quotes
        c.status,
        new Date(c.createdAt).toLocaleString(),
      ])

      const csvContent =
        [headers, ...rows].map((r) => r.join(",")).join("\n")

      // Trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "complaints.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error exporting complaints:", err)
    }
  }

  const filtered = complaints.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-sm text-muted-foreground">
            All customer complaints submitted through the portal
          </p>
        </div>
        {/* 🔹 Export Button */}
        <Button onClick={exportComplaints}>Export</Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading complaints...</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <Card key={c._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">
                    {c.name}{" "}
                    <span className="text-sm text-gray-500">
                      ({c.complaintNumber})
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    📧 {c.email} | 📞 {c.phone} | Company:{" "}
                    {c.type || "N/A"} | Order: {c.orderId || "N/A"}
                  </p>
                  <p className="mt-2 line-clamp-2">{c.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* View details in popup */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">View</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Complaint {c.complaintNumber}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {c.name}</p>
                      <p><strong>Email:</strong> {c.email}</p>
                      <p><strong>Phone:</strong> {c.phone}</p>
                      <p><strong>Type:</strong> {c.type || "N/A"}</p>
                      <p><strong>Order ID:</strong> {c.orderId || "N/A"}</p>
                      <p><strong>Message:</strong> {c.message}</p>
                      <p><strong>Status:</strong> {c.status}</p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500">No complaints found</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
