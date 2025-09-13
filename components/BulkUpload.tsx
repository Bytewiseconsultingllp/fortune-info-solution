"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function BulkUpload() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  // just select file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setReport(null); // reset old report when new file selected
    }
  };

  // triggered when pressing button
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose an Excel/CSV file before uploading.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setReport(result);

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: `${result.insertedCount} products added, ${result.skippedCount} skipped.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Upload failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Error",
        description: "Something went wrong during upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileSelect}
        className="block"
      />

      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload Products"}
      </Button>

      {/* Report Section */}
      {report && report.skippedCount > 0 && (
        <div className="mt-4 p-3 border rounded bg-red-50 text-sm">
          <p className="font-semibold text-red-600">
            {report.skippedCount} rows skipped:
          </p>
          <ul className="list-disc ml-5">
            {report.skipped.map((err: any, idx: number) => (
              <li key={idx}>
                Row {err.row}: {err.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
