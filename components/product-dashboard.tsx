import { useState, useMemo } from 'react';
import { Search, Menu } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from '@/components/filter-products-sidebar';
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { Product } from '@/lib/models';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   category: string;
//   brand: string;
//   images: string[];
//   price: number;
//   specifications: string;
//   inStock: boolean;
//   stockQuantity: number;
//   sku: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
//   isActive: boolean;
// }

interface ProductDashboardProps {
  products: Product[];
  categories: string[];
  brands: string[];
}

const PRODUCTS_PER_PAGE = 12;

export const ProductDashboard = ({ products, categories, brands }: ProductDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, searchTerm, selectedBrands, selectedCategories]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev => 
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
    setCurrentPage(1);
  };

   const availableCategories = useMemo(() => {
    if (selectedBrands.length === 0) {
      return categories; // show all if no brand selected
    }
    const brandCategories = products
      .filter((p) => selectedBrands.includes(p.brand))
      .map((p) => p.category);

    return Array.from(new Set(brandCategories)); // unique categories
  }, [products, categories, selectedBrands]);

  const handleQuote = (product: Product) => {
    console.log('Get quote for:', product.name);
    // Implement quote request logic
  };

  const handleDatasheet = (product: Product) => {
    console.log('Download datasheet for:', product.name);
    // Implement datasheet download logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <FilterSidebar
                  brands={brands}
                  categories={availableCategories}
                  selectedBrands={selectedBrands}
                  selectedCategories={selectedCategories}
                  onBrandChange={handleBrandChange}
                  onCategoryChange={handleCategoryChange}
                />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Product Catalog</h1>
          </div>
          
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            brands={brands}
            categories={availableCategories}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            onBrandChange={handleBrandChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Results Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {currentProducts.length} of {filteredProducts.length} products
                </p>
                {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setCurrentPage(1);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuote={() => handleQuote(product)}
                  onDatasheet={() => handleDatasheet(product)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};