"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, FileText } from "lucide-react"

export default function BulkUpload() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Upload successful",
          description: `${result.count || 0} products uploaded successfully`,
        })
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("bulk-upload-file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        const error = await response.json()
        throw new Error(error.message || "Upload failed")
      }
    } catch (error) {
      console.error("Bulk upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload products",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Create CSV template
    const headers = [
      "name",
      "description",
      "category",
      "brand",
      "price",
      "sku",
      "stockQuantity",
      "inStock",
      "specifications",
      "datasheet",
      "images",
      "tags",
    ]

    const csvContent =
      headers.join(",") +
      "\n" +
      "Sample Product,Sample product description,Electronics,Sample Brand,99.99,SKU001,10,true,Sample specifications,/datasheet.pdf,/image1.jpg|/image2.jpg,tag1|tag2"

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your device",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Products
        </CardTitle>
        <CardDescription>Upload multiple products at once using a CSV or Excel file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <span className="text-sm text-muted-foreground">Download the CSV template to see the required format</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-upload-file">Select File</Label>
            <Input
              id="bulk-upload-file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Products
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Supported formats: CSV, Excel (.xlsx, .xls)</p>
            <p>• Maximum file size: 10MB</p>
            <p>• Use pipe (|) to separate multiple images or tags</p>
            <p>• Boolean fields: use 'true' or 'false'</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
