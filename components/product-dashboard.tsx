"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/filter-products-sidebar";
import { ProductCard } from "@/components/product-card";
import Pagination from "@/components/pagination";
import { Product } from "@/lib/models";

interface ProductDashboardProps {
  categories: string[];
  brands: string[];
}

const PRODUCTS_PER_PAGE = 12;

export const ProductDashboard = ({ categories, brands }: ProductDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: PRODUCTS_PER_PAGE.toString(),
    });

    if (searchTerm) params.append("search", searchTerm);
    if (selectedBrands.length === 1) params.append("brand", selectedBrands[0]);
    if (selectedCategories.length === 1) params.append("category", selectedCategories[0]);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    setProducts(data.products);
    setTotalPages(data.totalPages); // ✅ use backend-provided totalPages
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedBrands, selectedCategories, currentPage]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(checked ? [brand] : []);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(checked ? [category] : []);
    setCurrentPage(1);
  };

  const availableCategories = useMemo(() => {
    if (selectedBrands.length === 0) return categories;
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products, categories, selectedBrands]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </CardContent>
          </Card>

          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuote={() => console.log("Get quote for:", product.name)}
                  onDatasheet={() => console.log("Download datasheet for:", product.name)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
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
