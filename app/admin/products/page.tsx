"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import type { Product } from "@/lib/models"
import BulkUpload from "@/components/BulkUpload"

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // Show 10 products per page

  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    category: "",
    brand: "",
    datasheet: "",
    images: [""],
    specifications: "",
    price: 0,
    inStock: false,
    stockQuantity: 0,
    sku: "",
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        const productsArray = Array.isArray(data) ? data : data.products || []
        setProducts(productsArray)
        setFilteredProducts(productsArray)
      } else {
        console.error("Failed to fetch products:", response.statusText)
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Filter products
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, products])

  const handleInputChange = (field: string, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newImages = [...prev.images]
      newImages[index] = value
      return { ...prev, images: newImages }
    })
  }
  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const removeImageField = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return { ...prev, images: newImages.length ? newImages : [""] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingProduct ? "Product updated successfully" : "Product added successfully",
        })
        fetchProducts() // Refresh the products list
        resetForm()
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      ...product,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      datasheet: product.datasheet || "",
      images: Array.isArray(product.images) ? product.images : [""],
      price: product.price || 0,
      specifications: product.specifications || "",
      inStock: product.inStock ?? true,
      stockQuantity: product.stockQuantity || 0,
      sku: product.sku || "",
      tags: product.tags || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isActive: product.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({ title: "Product deleted successfully" })
          fetchProducts() // Refresh the products list
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      datasheet: "",
      images: [""],
      price: 0,
      specifications: "",
      inStock: true,
      stockQuantity: 0,
      sku: "",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Add a new product to your catalog"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price ?? ""}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* SKU & Stock Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku ?? ""}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity ?? ""}
                      onChange={(e) => handleInputChange("stockQuantity", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ") ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "tags",
                        e.target.value.split(",").map((tag) => tag.trim()),
                      )
                    }
                    placeholder="e.g. electronics, mobile, accessories"
                  />
                </div>

                {/* Specifications */}
                <div>
                  <Label htmlFor="specifications">Specifications</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications ?? ""}
                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                    placeholder="Enter product specifications"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                {/*   datasheet URL */}
                <div>
                  <Label htmlFor="datasheet">Datasheet URL</Label>
                  <Input
                    id="datasheet"
                    value={formData.datasheet}
                    onChange={(e) => handleInputChange("datasheet", e.target.value)}
                    placeholder="/placeholder.svg"
                  />
                </div>
                {/* Image URL */}
                {/* <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="/placeholder.svg"
                  />
                </div> */}
                <div>
                  <Label>Image URLs</Label>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder={`/placeholder${idx + 1}.svg`}
                      />
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImageField(idx)}
                          title="Remove"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    className="mt-1 bg-transparent"
                  >
                    + Add Image URL
                  </Button>
                </div>

                {/* In Stock */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => handleInputChange("inStock", e.target.checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <BulkUpload />

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your product inventory - Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {product.price && <Badge variant="outline">${product.price}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{product.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Brand: {product.brand}</span>
                    <span>Category: {product.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button> */}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product._id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {paginatedProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No products found matching your criteria.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
