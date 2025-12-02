import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand must be less than 100 characters'),
  price: z.number().min(0, 'Price must be positive'),
  specifications: z.string().optional(),
  inStock: z.boolean(),
  stockQuantity: z.number().min(0, 'Stock quantity must be positive'),
  sku: z.string().optional(),
  tags: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url('Please enter a valid URL')
  })).min(1, 'At least one image is required'),
  datasheet: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

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
  specifications?: string;
  datasheet?: string;
}

interface DuplicateProductDialogProps {
  product: Product;
  onProductDuplicated: () => void;
}

const DuplicateProductDialog: React.FC<DuplicateProductDialogProps> = ({ product, onProductDuplicated }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      brand: '',
      price: 0,
      specifications: '',
      inStock: true,
      stockQuantity: 0,
      sku: '',
      tags: '',
      images: [{ url: '' }],
      datasheet: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  useEffect(() => {
    if (open && product) {
      const duplicatedName = `${product.name} (Copy)`;
      const duplicatedSku = product.sku ? `${product.sku}-COPY` : '';
      
      form.reset({
        name: duplicatedName,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        specifications: product.specifications || '',
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
        sku: duplicatedSku,
        tags: product.tags.join(', '),
        images: product.images.length > 0 ? product.images.map(url => ({ url })) : [{ url: '' }],
        datasheet: product.datasheet || '',
      });
    }
  }, [open, product, form]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images: data.images.map(img => img.url),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        isActive: true, 
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate product');
      }

      toast({
        title: "Success",
        description: "Product duplicated successfully",
      });

      setOpen(false);
      onProductDuplicated();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to duplicate product',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Copy className="h-3 w-3" />
          Duplicate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duplicate Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter product name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Enter product description"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...form.register('category')}
                placeholder="Enter category"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                {...form.register('brand')}
                placeholder="Enter brand"
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...form.register('sku')}
                placeholder="Enter SKU"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...form.register('stockQuantity', { valueAsNumber: true })}
                placeholder="0"
              />
              {form.formState.errors.stockQuantity && (
                <p className="text-sm text-destructive">{form.formState.errors.stockQuantity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...form.register('tags')}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="space-y-3">
            <Label>Product Images *</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...form.register(`images.${index}.url`)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.images && (
              <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ url: '' })}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Add More Images
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Textarea
              id="specifications"
              {...form.register('specifications')}
              placeholder="Enter product specifications"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datasheet">Data Sheet</Label>
            <Input
              id="datasheet"
              {...form.register('datasheet')} 
              placeholder="Enter data sheet information"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={form.watch('inStock')}
              onCheckedChange={(checked) => form.setValue('inStock', checked)}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Duplicate Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateProductDialog;
