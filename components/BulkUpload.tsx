"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ValidationError {
  row: number
  field: string
  value: any
  message: string
}

interface UploadResult {
  success: boolean
  message: string
  successCount?: number
  errorCount?: number
  errors?: ValidationError[]
  duplicates?: string[]
}

export default function BulkUpload() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

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
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
  if (!file) {
    toast({
      title: "No file selected",
      description: "Please select a file to upload",
      variant: "destructive",
    });
    return;
  }

  setUploading(true);
  setUploadResult(null);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/products/bulk-upload", {
      method: "POST",
      body: formData,
    });

    let result = null;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      result = { message: "Invalid server response" };
    }

    if (response.ok) {
      setUploadResult({
        success: true,
        message: `Successfully uploaded ${result.successCount || 0} products`,
        successCount: result.successCount || 0,
        errorCount: result.errorCount || 0,
        errors: result.errors || [],
        duplicates: result.duplicates || [],
      });

      toast({
        title: "Upload successful",
        description: `${result.successCount || 0} products uploaded successfully`,
      });

      setFile(null);
      const fileInput = document.getElementById("bulk-upload-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setUploadResult({
        success: false,
        message: result.message || "Upload failed",
        errorCount: result.errorCount || 0,
        errors: result.errors || [],
        duplicates: result.duplicates || [],
      });

      toast({
        title: "Upload failed",
        description: result.message || "Failed to upload products",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Bulk upload error:", error);

    setUploadResult({
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
      errors: [],
    });

    toast({
      title: "Upload failed",
      description: error instanceof Error ? error.message : "Failed to upload products",
      variant: "destructive",
    });
  } finally {
    setUploading(false);
  }
};

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
    <div className="space-y-6">
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
              <span className="text-sm text-muted-foreground">
                Download the CSV template to see the required format
              </span>
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

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Alert */}
            <Alert variant={uploadResult.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{uploadResult.success ? "Upload Completed" : "Upload Failed"}</AlertTitle>
              <AlertDescription>
                {uploadResult.message}
                {uploadResult.successCount !== undefined && (
                  <div className="mt-2 text-sm">
                    <p>✅ Successfully processed: {uploadResult.successCount} products</p>
                    {uploadResult.errorCount && uploadResult.errorCount > 0 && (
                      <p>❌ Failed to process: {uploadResult.errorCount} products</p>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>

            {/* Duplicate Products */}
            {uploadResult.duplicates && uploadResult.duplicates.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Duplicate Products Skipped</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">The following products were skipped because they already exist:</p>
                  <div className="max-h-32 overflow-y-auto bg-muted p-2 rounded text-xs">
                    {uploadResult.duplicates.map((sku, index) => (
                      <div key={index} className="py-1">
                        • SKU: {sku}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Validation Errors */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">The following errors were found in your file:</p>
                  <div className="max-h-64 overflow-y-auto bg-destructive/10 p-3 rounded text-xs space-y-2">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="border-l-2 border-destructive pl-2">
                        <div className="font-medium">Row {error.row}:</div>
                        <div className="text-muted-foreground">
                          Field: <span className="font-mono">{error.field}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Value: <span className="font-mono">{String(error.value)}</span>
                        </div>
                        <div className="text-destructive-foreground">{error.message}</div>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUploadResult(null)}>
                Clear Results
              </Button>
              {!uploadResult.success && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Download className="h-3 w-3" />
                  Download Template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
