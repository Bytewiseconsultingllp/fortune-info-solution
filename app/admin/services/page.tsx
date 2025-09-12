"use client";

import type React from "react";

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
import { Label, Label as UI_Label } from "@/components/ui/label";
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
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import type { Service } from "@/lib/models";

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingService, setViewingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    features: [""],
    image: "",
    price: "",
    duration: "",
    isPopular: false,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched services:", data);
          const servicesArray = Array.isArray(data)
            ? data
            : data.services || [];
          setServices(servicesArray);
        } else {
          console.error("Failed to fetch services:", response.statusText);
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services
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

  const handleInputChange = (
    field: string,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const filteredFeatures = formData.features.filter(
        (feature) => feature.trim() !== ""
      );
      const serviceData = { ...formData, features: filteredFeatures };

      if (editingService) {
        // Update existing service
        const response = await fetch(
          `/api/admin/services/${editingService._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serviceData),
          }
        );

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
        // Add new service
        const response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });

        if (response.ok) {
          const newService = await response.json();
          setServices((prev) => [...prev, newService.service]);
          toast({ title: "Service added successfully" });
        } else {
          throw new Error("Failed to add service");
        }
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        features: [""],
        image: "",
        price: "",
        duration: "",
        isPopular: false,
      });

      setEditingService(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category || "",
      features: service.features.length > 0 ? service.features : [""],
      price: service.price || "",
      duration: service.duration || "",
    });
    setIsDialogOpen(true);
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
      } catch (error) {
        toast({ title: "Error deleting service", variant: "destructive" });
      }
    }
  };

  const openAddDialog = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      features: [""],
      image: "",
      price: "",
      duration: "",
      isPopular: false,
    });

    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
            {/* <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <UI_Label htmlFor="name">Service Name *</UI_Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <UI_Label htmlFor="description">Description *</UI_Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div>
                <UI_Label htmlFor="category">Category *</UI_Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Infrastructure, Security, Cloud Services"
                  required
                />
              </div>
              <div>
                <UI_Label>Features</UI_Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Enter feature"
                      />
                      {formData.features.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    Add Feature
                  </Button>
                </div>
              </div>
              <div>
                <UI_Label htmlFor="price">Price</UI_Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., Starting from $2,500 or Custom Quote"
                />
              </div>
              <div>
                <UI_Label htmlFor="duration">Duration</UI_Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., 2-4 weeks"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingService ? "Update Service" : "Add Service"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form> */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <UI_Label htmlFor="name">Service Name *</UI_Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <UI_Label htmlFor="description">Description *</UI_Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <UI_Label htmlFor="category">Category *</UI_Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select category</option>
                  <option value="consulting">Consulting</option>
                  <option value="implementation">Implementation</option>
                  <option value="support">Support</option>
                  <option value="training">Training</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Image */}
              <div>
                <UI_Label htmlFor="image">Image URL *</UI_Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="/placeholder.svg?height=200&width=200"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <UI_Label>Features</UI_Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        placeholder="Enter feature"
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div>
                <UI_Label htmlFor="price">Price</UI_Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., 2500"
                />
              </div>

              {/* Duration */}
              <div>
                <UI_Label htmlFor="duration">Duration</UI_Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="e.g., 2-4 weeks"
                />
              </div>

              {/* Popular toggle */}
              <div className="flex items-center gap-2">
                <input
                  id="isPopular"
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) =>
                    handleInputChange("isPopular", e.target.checked)
                  }
                />
                <UI_Label htmlFor="isPopular">Mark as Popular</UI_Label>
              </div>

              {/* Submit / Cancel */}
              <div className="flex gap-2 pt-4">
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
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingService(service)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button> */}

                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {/* <Dialog
                  open={!!viewingService}
                  onOpenChange={() => setViewingService(null)}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Service Details</DialogTitle>
                      <DialogDescription>
                        Full service information
                      </DialogDescription>
                    </DialogHeader>

                    {viewingService && (
                      <div className="space-y-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold">Name</Label>
                            <p>{viewingService.name}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Category</Label>
                            <p>{viewingService.category}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Price</Label>
                            <p>{viewingService.price}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Duration</Label>
                            <p>{viewingService.duration}</p>
                          </div>
                        </div>

                       
                        {viewingService.description && (
                          <div>
                            <Label className="font-semibold">Description</Label>
                            <p className="mt-1 p-3 bg-muted rounded">
                              {viewingService.description}
                            </p>
                          </div>
                        )}

                       
                        {viewingService.features?.length > 0 && (
                          <div>
                            <Label className="font-semibold">Features</Label>
                            <ul className="mt-1 list-disc pl-6">
                              {viewingService.features.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog> */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
