import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
}

interface DeleteProductDialogProps {
  product: Product;
  onProductDeleted: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ product, onProductDeleted }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsSubmitting(true);
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

      setOpen(false);
      onProductDeleted();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-1">
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Product
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium mb-2">
              ⚠️ Warning: This action cannot be undone
            </p>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the product "<strong>{product.name}</strong>"? 
              This will permanently remove the product from the database.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
