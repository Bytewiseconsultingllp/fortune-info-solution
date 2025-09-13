import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Quote, Package, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
// }

interface ProductCardProps {
  product: Product;
  onQuote: () => void;
  onDatasheet: () => void;
}

export const ProductCard = ({ product, onQuote, onDatasheet }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 bg-surface-elevated border border-border overflow-hidden h-full flex flex-col">
      {/* Image Carousel */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground animate-pulse" />
              </div>
            )}
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Status and Brand Badges */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
            {product.inStock ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium">
            {product.brand}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight text-base sm:text-lg">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
            <div>
              <p className="text-lg sm:text-xl font-bold text-primary">
                {typeof product.price === 'number' ? formatPrice(product.price) : 'N/A'}
              </p>
              {product.inStock && (
                <p className="text-xs text-muted-foreground">
                  {product.stockQuantity} units available
                </p>
              )}
            </div>
            <Badge variant="outline" className="text-xs capitalize w-fit">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={onQuote}
            className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
            size="sm"
          >
            <Quote className="h-4 w-4 mr-2" />
            Get Quote
          </Button>
          <Button
            onClick={onDatasheet}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Datasheet
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};