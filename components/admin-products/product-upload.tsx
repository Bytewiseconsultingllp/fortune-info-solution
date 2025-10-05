"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ValidationError {
  row: number | null;
  reason: string;
  data: any;
}

interface ParsedData {
  validProducts: any[];
  errors: ValidationError[];
}

interface ProductUploadProps {
  onUploadComplete: () => void;
}

const ProductUpload: React.FC<ProductUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateProduct = (row: any, index: number): ValidationError | null => {
    const name = row["Name"]?.toString().trim();
    const description = row["Description"]?.toString().trim();
    const category = row["Category"]?.toString().trim();
    const brand = row["Brand"]?.toString().trim();

    if (!name || !description || !category || !brand) {
      return {
        row: index + 2,
        reason: "Missing required fields (Name, Description, Category, Brand)",
        data: row,
      };
    }

    if (name.length > 200) {
      return {
        row: index + 2,
        reason: "Name exceeds 200 characters",
        data: row,
      };
    }

    if (description.length < 10 || description.length > 2000) {
      return {
        row: index + 2,
        reason: "Description must be between 10-2000 characters",
        data: row,
      };
    }

    if (brand.length > 100) {
      return {
        row: index + 2,
        reason: "Brand exceeds 100 characters",
        data: row,
      };
    }

    const price = Number(row["Price"]);
    if (row["Price"] && (isNaN(price) || price < 0)) {
      return {
        row: index + 2,
        reason: "Price must be a valid positive number",
        data: row,
      };
    }

    const stockQuantity = Number(row["StockQuantity"]);
    if (row["StockQuantity"] && (isNaN(stockQuantity) || stockQuantity < 0)) {
      return {
        row: index + 2,
        reason: "Stock quantity must be a valid positive number",
        data: row,
      };
    }

    return null;
  };

  const processFile = useCallback((acceptedFile: File) => {
    setIsValidating(true);
    setFile(acceptedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (rows.length === 0) {
          setParsedData({
            validProducts: [],
            errors: [
              {
                row: null,
                reason:
                  "The uploaded sheet is empty. Please add data before uploading.",
                data: {},
              },
            ],
          });
          setIsValidating(false);
          return;
        }

        const requiredColumns = [
          "Name",
          "Description",
          "Category",
          "Brand",
          "Price",
          "StockQuantity",
          "InStock",
          "Specifications",
          "Datasheet",
          "SKU",
          "Tags",
          "Images",
        ];

        const uploadedColumns = Object.keys(rows[0]);

        const missingColumns = requiredColumns.filter(
          (col) => !uploadedColumns.includes(col)
        );
        const extraColumns = uploadedColumns.filter(
          (col) => !requiredColumns.includes(col)
        );

        const fileLevelErrors: ValidationError[] = [];

        // ✅ Add only specific missing columns if any
        if (missingColumns.length > 0) {
          fileLevelErrors.push({
            row: null,
            reason: `Missing required columns: ${missingColumns.join(", ")}`,
            data: {},
          });
        }

        // ✅ Add extra column info (optional)
        if (extraColumns.length > 0) {
          fileLevelErrors.push({
            row: null,
            reason: `Unexpected columns found: ${extraColumns.join(", ")}`,
            data: {},
          });
        }

        // ✅ Stop validation early if header issue exists
        if (fileLevelErrors.length > 0) {
          setParsedData({
            validProducts: [],
            errors: fileLevelErrors,
          });
          setIsValidating(false);
          return;
        }

        // Continue with row validation...
        const validProducts: any[] = [];
        const errors: ValidationError[] = [];

        rows.forEach((row, index) => {
          const error = validateProduct(row, index);
          if (error) {
            errors.push(error);
            return;
          }

          validProducts.push({
            name: row["Name"]?.toString().trim(),
            description: row["Description"]?.toString().trim(),
            category: row["Category"]?.toString().trim(),
            brand: row["Brand"]?.toString().trim(),
            datasheet: row["Datasheet"]?.toString().trim() || "",
            price: Number(row["Price"]) || 0,
            specifications: row["Specifications"]?.toString().trim() || "",
            inStock:
              row["InStock"]?.toString().toLowerCase() === "true"
                ? true
                : false,
            stockQuantity: Number(row["StockQuantity"]) || 0,
            sku: row["SKU"]?.toString().trim() || "",
            tags: row["Tags"] ? row["Tags"].toString().split(",") : [],
            images: row["Images"] ? row["Images"].toString().split(",") : [""],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
          });
        });

        setParsedData({ validProducts, errors });
        setIsValidating(false);
      } catch (error) {
        console.error("Error processing file:", error);
        setParsedData({
          validProducts: [],
          errors: [
            {
              row: null,
              reason:
                error instanceof Error
                  ? error.message
                  : "Unknown error while reading file.",
              data: {},
            },
          ],
        });
        setIsValidating(false);
      }
    };
    reader.readAsArrayBuffer(acceptedFile);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/productTemplate.xlsx"; // path relative to /public folder
    link.download = "Product Template.xlsx"; // desired download name
    link.click();
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file || !parsedData || parsedData.errors.length > 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // ✅ UPDATED: Show proper feedback based on API response
      if (response.ok) {
        toast.success(result.message || "Upload Successful");

        // Show duplicate SKU list (if any)
        if (result.duplicates?.length > 0) {
          toast.warning(
            `Duplicate SKUs skipped: ${result.duplicates
              .slice(0, 5)
              .join(", ")}${
              result.duplicates.length > 5
                ? ` ...and ${result.duplicates.length - 5} more`
                : ""
            }`
          );
        }

        // Show validation error summary (if any)
        if (result.errors?.length > 0) {
          toast.error(`Some rows failed validation`, {
            description: `${result.errors.length} errors found in uploaded sheet.`,
          });
        }

        setFile(null);
        setParsedData(null);
        onUploadComplete();
      } else {
        // ❌ Handle backend errors gracefully
        toast.error(result.error || "Upload Failed", {
          description: result.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload products",
        { description: "Upload Failed" }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setParsedData(null);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border">
     <CardHeader>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
      <FileSpreadsheet className="h-5 w-5 text-green-600" />
      Bulk Product Upload
    </CardTitle>

    <button
      onClick={handleDownload}
      className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg shadow-md transition-all w-full sm:w-auto"
    >
      Download Template
    </button>
  </div>
</CardHeader>

      <CardContent className="space-y-4">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? "Drop the Excel file here" : "Upload Excel File"}
            </p>
            <p className="text-sm text-foreground">
              Drag and drop your .xlsx or .xls file here, or click to browse
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isValidating && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Validating Excel data...</AlertDescription>
              </Alert>
            )}

            {parsedData && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Total Rows:{" "}
                    {parsedData.validProducts.length + parsedData.errors.length}
                  </Badge>
                  <Badge
                    variant={
                      parsedData.validProducts.length > 0
                        ? "default"
                        : "secondary"
                    }
                  >
                    Valid: {parsedData.validProducts.length}
                  </Badge>
                  <Badge
                    variant={
                      parsedData.errors.length > 0 ? "destructive" : "secondary"
                    }
                  >
                    Errors: {parsedData.errors.length}
                  </Badge>
                </div>

                {parsedData.errors.length > 0 ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Validation errors found:</p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {parsedData.errors.slice(0, 5).map((error, index) => (
                            <div key={index} className="text-sm">
                              <strong>Row {error.row}:</strong> {error.reason}
                            </div>
                          ))}
                          {parsedData.errors.length > 5 && (
                            <p className="text-sm">
                              ...and {parsedData.errors.length - 5} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-success/20 bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success-foreground">
                      All data validated successfully! Ready to upload{" "}
                      {parsedData.validProducts.length} products.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={parsedData.errors.length > 0 || isUploading}
                    className="flex-1"
                  >
                    {isUploading ? "Uploading..." : "Push to Database"}
                  </Button>
                  <Button variant="outline" onClick={clearFile}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductUpload;
