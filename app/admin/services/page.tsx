"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label as UI_Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Package, Loader2 } from "lucide-react";
import type { Service } from "@/lib/models";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema Validation
const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(10, "At least 10 characters").max(2000),
  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature required"),
  image: z.string().min(1, "Image URL is required"),
  category: z.enum(
    ["consulting", "implementation", "support", "training", "maintenance"],
    { required_error: "Category is required" }
  ),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  duration: z.string().optional(),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "" as any,
      features: [""],
      image: "",
      price: 0,
      duration: "",
      isPopular: false,
      isActive: true,
    },
  });

  // ✅ Field Array for dynamic features
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          const servicesArray = Array.isArray(data)
            ? data
            : data.services || [];
          setServices(servicesArray);
        } else {
          setServices([]);
        }
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  // const onSubmit = async (data: ServiceForm) => {
  //   try {
  //     setSubmitting(true);
  //     if (editingService) {
  //       // Update
  //       const response = await fetch(
  //         `/api/admin/services/${editingService._id}`,
  //         {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(data),
  //         }
  //       );

  //       if (response.ok) {
  //         const updatedService = await response.json();
  //         setServices((prev) =>
  //           prev.map((s) =>
  //             s._id === editingService._id ? updatedService.service : s
  //           )
  //         );
  //         toast({ title: "Service updated successfully" });
  //       } else {
  //         throw new Error("Failed to update service");
  //       }
  //     } else {
  //       // Create
  //       const response = await fetch("/api/admin/services", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       });

  //       if (response.ok) {
  //         const newService = await response.json();
  //         setServices((prev) => [...prev, newService.service]);
  //         toast({ title: "Service added successfully" });
  //       } else {
  //         throw new Error("Failed to add service");
  //       }
  //     }

  //     reset();
  //     setEditingService(null);
  //     setIsDialogOpen(false);
  //   } catch {
  //     toast({
  //       title: "Error",
  //       description: "Failed to save service",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: ServiceForm) => {
  setSubmitting(true);
  try {
    if (editingService) {
      const response = await fetch(`/api/admin/services/${editingService._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id ? updatedService.service : s
          )
        );
        toast({ title: "Service updated successfully" });
      } else {
        throw new Error("Failed to update service");
      }
    } else {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newService = await response.json();
        setServices((prev) => [...prev, newService.service]);
        toast({ title: "Service added successfully" });
      } else {
        throw new Error("Failed to add service");
      }
    }

    reset();
    setEditingService(null);
    setIsDialogOpen(false);
  } catch {
    toast({
      title: "Error",
      description: "Failed to save service",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setServices((prev) => prev.filter((s) => s._id !== serviceId));
          toast({ title: "Service deleted successfully" });
        } else {
          throw new Error("Failed to delete service");
        }
      } catch {
        toast({ title: "Error deleting service", variant: "destructive" });
      }
    }
  };

  const openAddDialog = () => {
    setEditingService(null);
    reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Services Management</h2>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update service information"
                  : "Add a new service to your offerings"}
              </DialogDescription>
            </DialogHeader>

            {/* ✅ Zod validated form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <UI_Label htmlFor="name">Service Name *</UI_Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <UI_Label htmlFor="description">Description *</UI_Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <UI_Label htmlFor="category">Category *</UI_Label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select category</option>
                  <option value="consulting">Consulting</option>
                  <option value="implementation">Implementation</option>
                  <option value="support">Support</option>
                  <option value="training">Training</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <UI_Label htmlFor="image">Image URL *</UI_Label>
                <Input id="image" {...register("image")} />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>

              <div>
                <UI_Label>Features *</UI_Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <Input {...register(`features.${index}`)} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                >
                  Add Feature
                </Button>
                {errors.features && (
                  <p className="text-red-500 text-sm">
                    {errors.features.message as string}
                  </p>
                )}
              </div>

              <div>
                <UI_Label htmlFor="price">Price *</UI_Label>
                <Input id="price" type="number" {...register("price")} />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div>
                <UI_Label htmlFor="duration">Duration</UI_Label>
                <Input id="duration" {...register("duration")} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isPopular"
                  type="checkbox"
                  {...register("isPopular")}
                />
                <UI_Label htmlFor="isPopular">Mark as Popular</UI_Label>
              </div>

              {/* <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingService ? "Update Service" : "Add Service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div> */}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingService ? "Updating..." : "Adding..."}
                    </div>
                  ) : editingService ? (
                    "Update Service"
                  ) : (
                    "Add Service"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting} // optional
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
          <CardDescription>Manage your service offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service?._id}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{service?.name}</h3>
                    <Badge variant="outline">{service?.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service?.description}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{service?.features.length} features</span>
                    {service?.price && <span>Price: {service?.price}</span>}
                    {service?.duration && (
                      <span>Duration: {service?.duration}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
