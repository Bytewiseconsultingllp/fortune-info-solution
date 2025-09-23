import React, { useState } from 'react';
import { Package, Tag, Calendar, DollarSign, Trash2, Loader2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EditProductDialog from './edit-product-dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


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

interface ProductCardProps {
  product: Product;
  onProductUpdated: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductUpdated }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      onProductUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border hover:shadow-elegant transition-smooth group flex flex-col h-full">
<CardHeader className="pb-3 h-[80px] flex items-start justify-between">
  <div className="flex-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
            {product.name}
          </CardTitle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{product.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <p className="text-sm text-foreground mt-1">{product.brand}</p>
  </div>
  
  <Badge
    variant={product.inStock ? "default" : "destructive"}
    className="ml-2"
  >
    {product.inStock ? "In Stock" : "Out of Stock"}
  </Badge>
</CardHeader>

  {/* 🔑 Add flex-1 so content grows and pushes footer down */}
  <CardContent className="space-y-4 flex-1">
    <p className="text-sm text-foreground line-clamp-2">
      {product.description}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-1">
      {product.tags.slice(0, 3).map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
      {product.tags.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{product.tags.length - 3}
        </Badge>
      )}
    </div>

    {/* Product details grid */}
    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
      {/* Category */}
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-foreground" />
        <span className="text-foreground">Category:</span>
      </div>
      <span className="font-medium">{product.category}</span>

      {/* SKU */}
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-foreground" />
        <span className="text-foreground">SKU:</span>
      </div>
      <span className="font-mono text-xs font-medium">
        {product.sku || "N/A"}
      </span>

      {/* Price */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-foreground" />
        <span className="text-foreground">Price:</span>
      </div>
      <span className="font-semibold text-primary">
        {product.price > 0 ? formatPrice(product.price) : "N/A"}
      </span>

      {/* Created At */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-foreground" />
        <span className="text-foreground">Added:</span>
      </div>
      <span className="text-xs">{formatDate(product.createdAt)}</span>

      {/* Stock Quantity */}
      {product.stockQuantity > 0 && (
        <>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-foreground" />
            <span className="text-foreground">Stock:</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {product.stockQuantity} units
          </Badge>
        </>
      )}

      {/* Specifications */}
      {product.specifications && (
        <>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-foreground" />
            <span className="text-foreground">Specs:</span>
          </div>
          <p className="text-xs font-medium line-clamp-2">
            {product.specifications}
          </p>
        </>
      )}
    </div>
  </CardContent>

  {/* 🔑 mt-auto ensures footer sticks to bottom */}
  <CardFooter className="mt-auto">
    <div className="pt-3 border-t border-border w-full">
      <div className="flex gap-2">
        <EditProductDialog
          product={product}
          onProductUpdated={onProductUpdated}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product "{product.name}" from your catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </CardFooter>
</Card>

  );
};

export default ProductCard;