"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Complaint = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type?: string | null;
  orderId?: string | null;
  message: string;
  complaintNumber: string;
  createdAt: string;
  status?: string;
};

export default function ComplaintsClient() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async (pageNum: number, query: string) => {
    setLoading(true);
    const res = await fetch(
      `/api/complaints?page=${pageNum}&limit=10&search=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    setComplaints(data.complaints);
    setPages(data.pages);
    setPage(data.page);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints(page, search);
  }, [page, search]);

  const exportCsv = () => {
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = complaints.map((c) =>
      [
        c.complaintNumber,
        c.name,
        c.email,
        c.phone,
        c.type || "",
        c.orderId || "",
        c.message || "",
        c.createdAt || "",
        c.status || "",
      ].map(escapeCsv).join(",")
    );

    const header = [
      "Complaint Number",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Order ID",
      "Message",
      "Created At",
      "Status",
    ].map(escapeCsv).join(",");

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "complaints.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-sm text-muted-foreground">
            All customer complaints submitted through the portal
          </p>
        </div>
        <Button onClick={exportCsv}>Export CSV</Button>
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
          {complaints.map((c) => (
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
                    📧 {c.email} | 📞 {c.phone} | Status:{" "}
                    <span className="font-medium">{c.status || "N/A"}</span>
                  </p>
                  <p className="mt-2">{c.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button size="sm" onClick={() => setSelected(c)}>
                  View
                </Button>
              </div>
            </Card>
          ))}
          {complaints.length === 0 && (
            <p className="text-center text-gray-500">No complaints found</p>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {pages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Popup modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Complaint Details – {selected?.complaintNumber}
            </DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selected?.createdAt &&
                new Date(selected.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 mt-2 text-sm">
              <p>
                <strong>Name:</strong> {selected.name}
              </p>
              <p>
                <strong>Email:</strong> {selected.email}
              </p>
              <p>
                <strong>Phone:</strong> {selected.phone}
              </p>
              <p>
                <strong>Type:</strong> {selected.type || "N/A"}
              </p>
              <p>
                <strong>Order ID:</strong> {selected.orderId || "N/A"}
              </p>
              <p>
                <strong>Message:</strong> {selected.message}
              </p>
              <p>
                <strong>Status:</strong> {selected.status || "N/A"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
