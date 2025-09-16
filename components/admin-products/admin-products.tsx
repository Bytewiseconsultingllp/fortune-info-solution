import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Loader2 } from 'lucide-react';
import ProductUpload from './product-upload';
import ProductCard from './product-card';
import ProductFilters from './product-filters';
import ProductPagination from './product-pagination';
import AddProductDialog from './add-product-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  eanNumber?: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  tags: string[];
  images: string[];
  createdAt: string;
  specifications?: string;
  datasheet?: string;
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  totalPages: number;
  categories: string[];
  brands: string[];
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [showUpload, setShowUpload] = useState(false);

  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedBrand !== 'all') params.append('brand', selectedBrand);

      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ProductsResponse = await response.json();
      
      setProducts(data.products);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setCategories(data.categories);
      setBrands(data.brands);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, selectedCategory, selectedBrand, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, selectedBrand]);

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchProducts();
    toast({
      title: "Success",
      description: "Products uploaded successfully and data refreshed",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Products Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your product catalog with bulk upload and advanced filtering
            </p>
          </div>
          <div className="flex gap-3">
            <AddProductDialog onProductAdded={fetchProducts} />
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showUpload ? 'Hide Upload' : 'Bulk Upload'}
            </Button>
          </div>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-8">
            <ProductUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            categories={categories}
            brands={brands}
            totalCount={totalCount}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="bg-gradient-card shadow-card border-border">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading products...</span>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} onProductUpdated={fetchProducts} />
                  ))}
                </div>

                {/* Pagination */}
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            ) : (
              <Card className="bg-gradient-card shadow-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all'
                      ? 'No products match your current filters. Try adjusting your search criteria.'
                      : 'Get started by uploading your first batch of products using the bulk upload feature.'}
                  </p>
                  {searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all' ? (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  ) : (
                    <Button onClick={() => setShowUpload(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Products
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;