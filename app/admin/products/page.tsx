"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar,
  Package,
  DollarSign,
  BarChart3,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  X,
  Building,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Upload,
  Copy,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import ProductUpload from "@/components/admin-products/product-upload"
import AddProductDialog from "@/components/admin-products/add-product-dialog"
import EditProductDialog from "@/components/admin-products/edit-product-dialog"
import DuplicateProductDialog from "@/components/admin-products/duplicate-product-dialog"
import DeleteProductDialog from "@/components/admin-products/delete-product-dialog"

const formatDate = (dateValue: string | Date) => {
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return "Invalid date"
  } catch (error) {
    return "Invalid date"
  }
}

const formatTableDate = (dateValue: string | Date) => {
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    if (date instanceof Date && !isNaN(date.getTime())) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const productDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      if (productDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      if (productDate.getTime() === yesterday.getTime()) {
        return 'Yesterday'
      }
      
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (productDate >= weekAgo) {
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })
    }
    return "Invalid date"
  } catch (error) {
    return "Invalid date"
  }
}

type Product = {
  _id: string
  name: string
  description: string
  category: string
  brand: string
  eanNumber?: string
  price: number
  inStock: boolean
  stockQuantity: number
  sku: string
  tags: string[]
  images: string[]
  createdAt: string
  updatedAt: string
  specifications?: string
  datasheet?: string
  isActive: boolean
}

function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  // Fetch all products for better filtering and sorting
  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?page=1&limit=1000`)
      const data = await res.json()
      if (res.ok) {
        setAllProducts(data.products || [])
        setProducts(data.products || [])
        
        // Extract unique categories and brands
        const uniqueCategories = [...new Set(data.products.map((p: Product) => p.category).filter(Boolean) as string[])]
        const uniqueBrands = [...new Set(data.products.map((p: Product) => p.brand).filter(Boolean) as string[])]
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      toast({ title: "Failed to fetch products", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

  useEffect(() => {
    let filtered = allProducts

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    setProducts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedBrand, allProducts])

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products]
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue == null) return 1
        if (bValue == null) return -1
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableProducts
  }, [products, sortConfig])

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const stats = {
    total: allProducts.length,
    inStock: allProducts.filter(p => p.inStock).length,
    outOfStock: allProducts.filter(p => !p.inStock).length,
    active: allProducts.filter(p => p.isActive).length,
    inactive: allProducts.filter(p => !p.isActive).length,
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    if (selectAll) {
      setSelectedProducts([])
      setSelectAll(false)
    } else {
      setSelectedProducts(paginatedProducts.map(p => p._id))
      setSelectAll(true)
    }
  }

  const bulkUpdateStatus = async (isActive: boolean) => {
    try {
      // This would need an API endpoint for bulk updates
      toast({ title: "Bulk status update not yet implemented", variant: "destructive" })
    } catch (error) {
      toast({ title: "Error updating products", variant: "destructive" })
    }
  }

  const getSortIcon = (column: keyof Product) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  const exportProducts = async () => {
    try {
      const csvContent = [
        ["Name", "SKU", "Category", "Brand", "Price", "Stock", "Status", "EAN", "Created At"],
        ...products.map((product) => [
          product.name,
          product.sku,
          product.category,
          product.brand,
          product.price.toString(),
          product.stockQuantity.toString(),
          product.inStock ? "In Stock" : "Out of Stock",
          product.eanNumber || "",
          formatDate(product.createdAt),
        ]),
      ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({ title: "Products exported successfully" })
    } catch (error) {
      toast({ title: "Error exporting products", variant: "destructive" })
    }
  }

  const getStockColor = (inStock: boolean, stockQuantity: number) => {
    if (!inStock || stockQuantity === 0) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    if (stockQuantity < 10) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getStockIcon = (inStock: boolean, stockQuantity: number) => {
    if (!inStock || stockQuantity === 0) {
      return <XCircle className="h-3 w-3" />
    }
    if (stockQuantity < 10) {
      return <AlertCircle className="h-3 w-3" />
    }
    return <CheckCircle className="h-3 w-3" />
  }

  const getStockText = (inStock: boolean, stockQuantity: number) => {
    if (!inStock || stockQuantity === 0) {
      return "Out of Stock"
    }
    if (stockQuantity < 10) {
      return `Low Stock (${stockQuantity})`
    }
    return `In Stock (${stockQuantity})`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog with advanced filtering and bulk operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportProducts}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => setShowBulkUpload(true)}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button 
              onClick={() => window.open('https://drive.google.com/drive/folders/1NMaBGZAEXH5TvxoBdyQFuVOxWZOtluS_?usp=sharing', '_blank')}
              className="bg-red-600 hover:bg-red-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Drive Folder
            </Button>
            <AddProductDialog onProductAdded={fetchAllProducts} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold">{stats.inStock}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <X className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, SKU, category, brand, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by category" />
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
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{selectedProducts.length} products selected</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedProducts([])
                    setSelectAll(false)
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products ({products.length})</span>
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleAllProducts}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Product
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">SKU</th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        Category
                        {getSortIcon('category')}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('brand')}
                    >
                      <div className="flex items-center gap-1">
                        Brand
                        {getSortIcon('brand')}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">Stock</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => (
                    <tr 
                      key={product._id} 
                      className={cn(
                        "border-b hover:bg-muted/50 transition-colors",
                        index % 2 === 0 && "bg-muted/25",
                        selectedProducts.includes(product._id!) && "bg-blue-50"
                      )}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id!)}
                          onChange={() => toggleProductSelection(product._id!)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {product.images && product.images.length > 0 ? (
                              <div className="w-8 h-8 rounded bg-muted overflow-hidden">
                                <img 
                                  src={product.images[0].startsWith('http') ? product.images[0] : `https://${product.images[0]}`} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                                <Package className="w-full h-full p-2 text-muted-foreground hidden" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                <Package className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="font-medium">{product.name}</div>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">{product.sku}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{product.brand}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStockColor(product.inStock, product.stockQuantity)}>
                          <div className="flex items-center gap-1">
                            {getStockIcon(product.inStock, product.stockQuantity)}
                            {getStockText(product.inStock, product.stockQuantity)}
                          </div>
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-medium">
                          {formatTableDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Package className="h-5 w-5" />
                                  Product Details - {product.name}
                                </DialogTitle>
                                <DialogDescription>Complete product information</DialogDescription>
                              </DialogHeader>
                              {selectedProduct && (
                                <div className="space-y-6">
                                  {/* Product Overview Card */}
                                  <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                          {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                                              <img 
                                                src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `https://${selectedProduct.images[0]}`} 
                                                alt={selectedProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = 'none'
                                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                }}
                                              />
                                              <Package className="w-full h-full p-4 text-blue-600 hidden" />
                                            </div>
                                          ) : (
                                            <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                              <Package className="w-8 h-8 text-blue-600" />
                                            </div>
                                          )}
                                          <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                                            <p className="text-sm text-gray-600">{selectedProduct.category} • {selectedProduct.brand}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <Badge variant={selectedProduct.isActive ? "default" : "secondary"}>
                                                {selectedProduct.isActive ? "Active" : "Inactive"}
                                              </Badge>
                                              <Badge className={getStockColor(selectedProduct.inStock, selectedProduct.stockQuantity)}>
                                                <div className="flex items-center gap-1">
                                                  {getStockIcon(selectedProduct.inStock, selectedProduct.stockQuantity)}
                                                  {getStockText(selectedProduct.inStock, selectedProduct.stockQuantity)}
                                                </div>
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm text-gray-500 mt-1">SKU: {selectedProduct.sku}</p>
                                          <p className="text-xs text-gray-400 mt-1">{formatDate(selectedProduct.createdAt)}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Product Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="border-0 shadow-sm">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Package className="h-4 w-4 text-blue-600" />
                                          <h4 className="font-medium text-sm">Product Info</h4>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-700"><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                                          <p className="text-sm text-gray-700"><span className="font-medium">Brand:</span> {selectedProduct.brand}</p>
                                          <p className="text-sm text-gray-700"><span className="font-medium">EAN:</span> {selectedProduct.eanNumber || 'N/A'}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card className="border-0 shadow-sm">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Package className="h-4 w-4 text-green-600" />
                                          <h4 className="font-medium text-sm">Stock Information</h4>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-700"><span className="font-medium">Stock:</span> {selectedProduct.stockQuantity} units</p>
                                          <p className="text-sm text-gray-700"><span className="font-medium">Status:</span> {selectedProduct.inStock ? 'Available' : 'Unavailable'}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                        <h4 className="font-medium text-sm">Timestamps</h4>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm text-gray-700"><span className="font-medium">Created:</span> {formatDate(selectedProduct.createdAt)}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Updated:</span> {formatDate(selectedProduct.updatedAt)}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Active:</span> {selectedProduct.isActive ? 'Yes' : 'No'}</p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Product Description */}
                                  <Card className="border-0 shadow-sm">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Description
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                          {selectedProduct.description}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Specifications */}
                                  {selectedProduct.specifications && (
                                    <Card className="border-0 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                          <BarChart3 className="h-4 w-4" />
                                          Specifications
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedProduct.specifications}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Tags */}
                                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                                    <Card className="border-0 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                          <Star className="h-4 w-4" />
                                          Tags
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedProduct.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Product Images */}
                                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                                    <Card className="border-0 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                          <Image className="h-4 w-4" />
                                          Product Images
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                          {selectedProduct.images.map((image, index) => (
                                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                                              <img 
                                                src={image.startsWith('http') ? image : `https://${image}`}
                                                alt={`${selectedProduct.name} - Image ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                onClick={() => window.open(image.startsWith('http') ? image : `https://${image}`, '_blank')}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Action Buttons */}
                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Actions</label>
                                          <div className="mt-2 text-sm text-gray-600">
                                            Edit product details, manage inventory, or update status
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <EditProductDialog product={selectedProduct} onProductUpdated={fetchAllProducts} />
                                          <DuplicateProductDialog product={selectedProduct} onProductDuplicated={fetchAllProducts} />
                                          <DeleteProductDialog product={selectedProduct} onProductDeleted={fetchAllProducts} />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Upload Dialog */}
      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Upload Products
            </DialogTitle>
            <DialogDescription>
              Upload multiple products at once using an Excel or CSV file. The system will validate your data and show any errors before processing.
            </DialogDescription>
          </DialogHeader>
          <ProductUpload 
            onUploadComplete={() => {
              setShowBulkUpload(false)
              fetchAllProducts()
              toast({ title: "Products uploaded successfully" })
            }} 
          />
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  )
}

function page() {
  return (
    <AdminProductsPage />
  )
}

export default page