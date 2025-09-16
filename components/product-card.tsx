import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Quote,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/models";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onQuote: () => void;
  onDatasheet: () => void;
}

export const ProductCard = ({
  product,
  onQuote,
  onDatasheet,
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 bg-surface-elevated border border-border overflow-hidden flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative w-full aspect-[4/3] bg-muted">
        {product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
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
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-primary"
                        : "bg-background/60"
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

      <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Status and Brand Badges */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant={product.inStock ? "default" : "destructive"}
            className="text-xs"
          >
            {product.inStock ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium">
            {product.brand}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="space-y-2 flex-1">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 leading-snug text-base sm:text-lg">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">EAN: {product.sku}</p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
            {product.inStock && (
              <p className="text-xs text-muted-foreground">
                <strong>{product.stockQuantity} units available</strong>
              </p>
            )}
            <Badge variant="outline" className="text-xs capitalize w-fit">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0">
        <div className="flex flex-col sm:flex-row lg:flex-row gap-3 w-full">
          <Link
            href={`/quote?product=${product._id}&name=${encodeURIComponent(
              product.sku ? product.sku : product.name
            )}`}
          >
            <Button
              onClick={onQuote}
              className="flex-1 min-w-0 bg-primary hover:bg-primary-dark text-primary-foreground"
              size="sm"
              style={{ minWidth: 0 }}
            >
              <Quote className="h-4 w-4 mr-2" />
              Get Quote
            </Button>
          </Link>
          <Link
            href={product.datasheet ? product.datasheet : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              onClick={onDatasheet}
              variant="outline"
              className="flex-1 min-w-0"
              size="sm"
              style={{ minWidth: 0 }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Datasheet
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
