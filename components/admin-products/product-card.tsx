import React, { useState } from 'react';
import { Package, Tag, Calendar, DollarSign, Trash2, Loader2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-gradient-card shadow-card border-border hover:shadow-elegant transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          </div>
          <Badge variant={product.inStock ? "default" : "destructive"} className="ml-2">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground line-clamp-2">
          {product.description}
        </p>

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

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Category:</span>
          </div>
          <span className="font-medium">{product.category}</span>

          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">SKU:</span>
          </div>
          <span className="font-medium font-mono text-xs">
            {product.sku || 'N/A'}
          </span>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">EAN Number:</span>
          </div>
          <span className="font-medium font-mono text-xs">
            {product.eanNumber || 'N/A'}
          </span>

          {product.eanNumber && (
            <>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">EAN:</span>
              </div>
              <span className="font-medium font-mono text-xs">
                {product.eanNumber}
              </span>
            </>
          )}

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Price:</span>
          </div>
          <span className="font-semibold text-primary">
            {product.price > 0 ? formatPrice(product.price) : 'N/A'}
          </span>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Added:</span>
          </div>
          <span className="text-xs">{formatDate(product.createdAt)}</span>
        </div>

        {product.stockQuantity > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stock Quantity</span>
              <Badge variant="outline" className="text-xs">
                {product.stockQuantity} units
              </Badge>
            </div>
          </div>
        )}

        {product.specifications && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground line-clamp-2">
              <strong>Specs:</strong> {product.specifications}
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-border">
          <div className="flex gap-2">
            <EditProductDialog product={product} onProductUpdated={onProductUpdated} />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-1" disabled={isDeleting}>
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
                    This action cannot be undone. This will permanently delete the product "{product.name}" from your catalog.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Product
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;