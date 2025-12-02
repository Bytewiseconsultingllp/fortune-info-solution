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
import {
  Plus,
  Search,
  Trash2,
  Package,
  Loader2,
  Edit,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Zap,
  Shield,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import type { Service } from "@/lib/models";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Schema Validation
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
  duration: z.string().optional(),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ServiceForm = z.infer<typeof serviceSchema>;

const categoryConfig = {
  consulting: { icon: Users, color: "bg-blue-500", label: "Consulting" },
  implementation: { icon: Settings, color: "bg-green-500", label: "Implementation" },
  support: { icon: Shield, color: "bg-purple-500", label: "Support" },
  training: { icon: Award, color: "bg-orange-500", label: "Training" },
  maintenance: { icon: Zap, color: "bg-red-500", label: "Maintenance" },
};

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showInactive, setShowInactive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "" as any,
      features: [""],
      image: "",
      duration: "",
      isPopular: false,
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features" as const,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          const servicesArray = Array.isArray(data) ? data : data.services || [];
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
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.features.some(feature => 
            feature.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(service => service.isActive !== false);
    }

    setFilteredServices(filtered);
  }, [searchTerm, services, selectedCategory, showInactive]);

  const onSubmit = async (data: ServiceForm) => {
    setSubmitting(true);
    try {
      if (editingService) {
        console.log("Updating service:", editingService._id, data);
        const response = await fetch(
          `/api/admin/services/${editingService._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        console.log("Update response status:", response.status);
        const responseData = await response.json();
        console.log("Update response data:", responseData);

        if (response.ok) {
          setServices((prev) =>
            prev.map((s) =>
              s._id === editingService._id ? responseData.service : s
            )
          );
          toast({ title: "Service updated successfully" });
          reset();
          setEditingService(null);
          setIsDialogOpen(false);
        } else {
          console.error("Update failed:", responseData);
          throw new Error(responseData.error || "Failed to update service");
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
          reset();
          setEditingService(null);
          setIsDialogOpen(false);
        } else {
          throw new Error("Failed to add service");
        }
      }
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

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    reset(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    if (service) {
      setServiceToDelete(service);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/services/${serviceToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices((prev) => prev.filter((s) => s._id !== serviceToDelete._id));
        toast({ title: "Service deleted successfully" });
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } else {
        throw new Error("Failed to delete service");
      }
    } catch {
      toast({ title: "Error deleting service", variant: "destructive" });
    }
  };

  const openAddDialog = () => {
    setEditingService(null);
    reset();
    setIsDialogOpen(true);
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices((prev) =>
          prev.map((s) =>
            s._id === service._id ? updatedService.service : s
          )
        );
        toast({ 
          title: `Service ${!service.isActive ? 'activated' : 'deactivated'}` 
        });
      } else {
        throw new Error("Failed to update service status");
      }
    } catch {
      toast({ 
        title: "Error updating service status", 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive !== false).length,
    popular: services.filter(s => s.isPopular).length,
    categories: [...new Set(services.map(s => s.category))].length,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground">Manage and organize your service offerings</p>
          </div>
          <Button onClick={openAddDialog} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Services</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-200 rounded-full">
                  <Package className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
                <div className="p-2 bg-green-200 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Popular</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.popular}</p>
                </div>
                <div className="p-2 bg-purple-200 rounded-full">
                  <Star className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Categories</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.categories}</p>
                </div>
                <div className="p-2 bg-orange-200 rounded-full">
                  <Grid3X3 className="h-5 w-5 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search services by name, description, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 h-11">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <Separator />
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", config.color)} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-11 w-11 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-11 w-11 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Show Inactive Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <UI_Label htmlFor="show-inactive" className="text-sm">
                Show Inactive
              </UI_Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Display */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first service"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Service
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => {
              const config = categoryConfig[service.category as keyof typeof categoryConfig];
              const Icon = config?.icon || Package;
              
              return (
                <Card key={service._id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", config?.color)}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      {service.isPopular && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {service.isActive === false && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {config?.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Features:</div>
                        <div className="space-y-1">
                          {service.features.map((feature, index) => (
                            <div key={index} className="text-xs text-foreground flex items-center gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                              <span className="line-clamp-1">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {service.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleServiceStatus(service)}>
                              {service.isActive === false ? (
                                <>
                                  <Eye className="h-3 w-3 mr-2" />
                                  Activate
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-2" />
                                  Deactivate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(service._id!)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => {
              const config = categoryConfig[service.category as keyof typeof categoryConfig];
              const Icon = config?.icon || Package;
              
              return (
                <Card key={service._id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", config?.color)}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {config?.label}
                              </Badge>
                              {service.isPopular && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                              {service.isActive === false && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs">
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {service.description}
                            </p>
                            
                            <div className="space-y-2 mb-3">
                              <div className="text-xs font-medium text-muted-foreground">Features:</div>
                              <div className="space-y-1">
                                {service.features.map((feature, index) => (
                                  <div key={index} className="text-xs text-foreground flex items-center gap-1">
                                    <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                                    <span className="line-clamp-1">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {service.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {service.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(service)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleServiceStatus(service)}>
                                  {service.isActive === false ? (
                                    <>
                                      <Eye className="h-3 w-3 mr-2" />
                                      Activate
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3 w-3 mr-2" />
                                      Deactivate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(service._id!)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update service information and settings"
                : "Create a new service to offer to your clients"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <UI_Label htmlFor="name">Service Name *</UI_Label>
                  <Input id="name" {...register("name")} placeholder="Enter service name" />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <UI_Label htmlFor="category">Category *</UI_Label>
                  <Select 
                    value={watch("category")} 
                    onValueChange={(value) => setValue("category", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", config.color)} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <UI_Label htmlFor="duration">Duration</UI_Label>
                  <Input id="duration" {...register("duration")} placeholder="e.g., 2 weeks, 1 month" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <UI_Label htmlFor="isPopular">Mark as Popular</UI_Label>
                    <Switch
                      id="isPopular"
                      checked={watch("isPopular")}
                      onCheckedChange={(checked) => setValue("isPopular", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <UI_Label htmlFor="isActive">Active Status</UI_Label>
                    <Switch
                      id="isActive"
                      checked={watch("isActive")}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <UI_Label htmlFor="image">Image URL *</UI_Label>
                  <Input id="image" {...register("image")} placeholder="https://example.com/image.jpg" />
                  {errors.image && (
                    <p className="text-destructive text-sm mt-1">{errors.image.message}</p>
                  )}
                </div>

                <div>
                  <UI_Label htmlFor="description">Description *</UI_Label>
                  <Textarea 
                    id="description" 
                    {...register("description")} 
                    placeholder="Describe your service in detail..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <UI_Label>Features *</UI_Label>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input 
                          {...register(`features.${index}`)} 
                          placeholder={`Feature ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="px-3"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append("")}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  {errors.features && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.features.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingService ? "Updating..." : "Adding..."}
                  </div>
                ) : editingService ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Service
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Service
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {serviceToDelete && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{serviceToDelete.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {serviceToDelete.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {serviceToDelete.category}
                  </Badge>
                  {serviceToDelete.isPopular && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setServiceToDelete(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
