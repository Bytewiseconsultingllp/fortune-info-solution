"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Search,
  Eye,
  Mail,
  Phone,
  Download,
  Calendar,
  Package,
  Hash,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Reply,
  Archive,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  X,
  Building,
  ShoppingCart,
  DollarSign,
  FileText,
  Send,
} from "lucide-react";
import type { QuoteRequest } from "@/lib/models";
import { cn } from "@/lib/utils";

const formatDate = (dateValue: string | Date) => {
  try {
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    // Handle MongoDB date format
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Invalid date";
  } catch (error) {
    return "Invalid date";
  }
};

const formatTableDate = (dateValue: string | Date) => {
  try {
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    // Handle MongoDB date format
    if (date instanceof Date && !isNaN(date.getTime())) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const quoteDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      // If today, show time only
      if (quoteDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // If yesterday, show "Yesterday"
      if (quoteDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
      }

      // If this week, show day name
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (quoteDate >= weekAgo) {
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }

      // Otherwise show month and day
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return "Invalid date";
  } catch (error) {
    return "Invalid date";
  }
};

export default function AdminQuotesPage() {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuoteRequest;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/admin/quotes");
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || []);
        } else {
          console.error("Failed to fetch quotes:", response.statusText);
          setQuotes([]);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // Filter quotes
  useEffect(() => {
    let filtered = quotes;

    if (searchTerm) {
      filtered = filtered.filter(
        (quote) =>
          quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.customerEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quote.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((quote) => quote.status === selectedStatus);
    }

    setFilteredQuotes(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, quotes]);

  const updateQuoteStatus = async (
    quoteId: string,
    newStatus: QuoteRequest["status"]
  ) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [quoteId]: true }));

      const response = await fetch(`/api/admin/quotes/${quoteId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setQuotes((prev) =>
          prev.map((quote) =>
            quote._id === quoteId ? { ...quote, status: newStatus } : quote
          )
        );
        // Update the selected quote in the modal if it's the one being updated
        if (selectedQuote?._id === quoteId) {
          setSelectedQuote((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }
        toast({
          title: "Status updated",
          description: `Quote status changed to ${newStatus}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to update status",
          description: errorData.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error updating status",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [quoteId]: false }));
    }
  };

  // Sorting function
  const handleSort = (key: keyof QuoteRequest) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedQuotes = useMemo(() => {
    let sortableQuotes = [...filteredQuotes];
    if (sortConfig !== null) {
      sortableQuotes.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableQuotes;
  }, [filteredQuotes, sortConfig]);

  // Pagination with sorted data
  const totalPages = Math.ceil(sortedQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotes = sortedQuotes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats
  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "pending").length,
    quoted: quotes.filter((q) => q.status === "quoted").length,
    converted: quotes.filter((q) => q.status === "converted").length,
    declined: quotes.filter((q) => q.status === "declined").length,
  };

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes((prev) =>
      prev.includes(quoteId)
        ? prev.filter((id) => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const toggleAllQuotes = () => {
    if (selectAll) {
      setSelectedQuotes([]);
      setSelectAll(false);
    } else {
      setSelectedQuotes(paginatedQuotes.map((q) => q._id!));
      setSelectAll(true);
    }
  };

  const bulkUpdateStatus = async (status: QuoteRequest["status"]) => {
    try {
      const promises = selectedQuotes.map((quoteId) =>
        fetch(`/api/admin/quotes/${quoteId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      );

      await Promise.all(promises);

      setQuotes((prev) =>
        prev.map((quote) =>
          selectedQuotes.includes(quote._id!) ? { ...quote, status } : quote
        )
      );

      setSelectedQuotes([]);
      setSelectAll(false);
      toast({ title: `Updated ${selectedQuotes.length} quotes successfully` });
    } catch (error) {
      toast({ title: "Error updating quotes", variant: "destructive" });
    }
  };

  const getSortIcon = (column: keyof QuoteRequest) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const exportQuotes = () => {
    const csvContent = [
      [
        "Customer Name",
        "Email",
        "Phone",
        "Company",
        "Product",
        "Quantity",
        "Message",
        "Status",
        "Date",
      ],
      ...filteredQuotes.map((quote) => [
        quote.customerName,
        quote.customerEmail,
        quote.customerPhone,
        quote.company || "",
        quote.productName,
        quote.quantity.toString(),
        quote.message || "",
        quote.status,
        formatDate(quote.createdAt),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quote-requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: "Quote requests exported successfully" });
  };

  const getStatusColor = (status: QuoteRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "quoted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: QuoteRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "quoted":
        return <Send className="h-3 w-3" />;
      case "converted":
        return <CheckCircle className="h-3 w-3" />;
      case "declined":
        return <X className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quote Management
            </h1>
            <p className="text-muted-foreground">
              Manage customer quote requests and pricing inquiries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportQuotes}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Quotes
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Quoted
                  </p>
                  <p className="text-2xl font-bold">{stats.quoted}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Send className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Converted
                  </p>
                  <p className="text-2xl font-bold">{stats.converted}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Declined
                  </p>
                  <p className="text-2xl font-bold">{stats.declined}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by customer name, email, product, company, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedQuotes.length > 0 && (
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedQuotes.length} quotes selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedQuotes([]);
                      setSelectAll(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkUpdateStatus("quoted")}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Mark as Quoted
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkUpdateStatus("converted")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Convert
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkUpdateStatus("declined")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotes Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quote Requests ({filteredQuotes.length})</span>
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, sortedQuotes.length)} of{" "}
                {sortedQuotes.length} quotes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleAllQuotes}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("customerName")}
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        {getSortIcon("customerName")}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">Message</th>
                    <th
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("productName")}
                    >
                      <div className="flex items-center gap-1">
                        Product
                        {getSortIcon("productName")}
                      </div>
                    </th>
                    <th
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center gap-1">
                        Quantity
                        {getSortIcon("quantity")}
                      </div>
                    </th>
                    <th
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuotes.map((quote, index) => (
                    <tr
                      key={quote._id}
                      className={cn(
                        "border-b hover:bg-muted/50 transition-colors",
                        index % 2 === 0 && "bg-muted/25",
                        selectedQuotes.includes(quote._id!) && "bg-blue-50"
                      )}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedQuotes.includes(quote._id!)}
                          onChange={() => toggleQuoteSelection(quote._id!)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-muted rounded">
                              <User className="h-3 w-3" />
                            </div>
                            <div className="font-medium">
                              {quote.customerName}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {quote.customerEmail}
                          </div>
                          {quote.company && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {quote.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="text-sm text-muted-foreground max-w-xs overflow-hidden cursor-pointer hover:text-foreground transition-colors"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {quote.message || "No additional message"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-md">
                            <div className="p-2">
                              <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                                {quote.message || "No additional message"}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{quote.productName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{quote.quantity}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Select
                          value={quote.status}
                          onValueChange={(value) =>
                            updateQuoteStatus(
                              quote._id!,
                              value as QuoteRequest["status"]
                            )
                          }
                          disabled={updatingStatus[quote._id!]}
                        >
                          <SelectTrigger className="w-32">
                            <div className="flex items-center gap-1">
                              {updatingStatus[quote._id!] ? (
                                <div className="h-3 w-3 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin" />
                              ) : (
                                getStatusIcon(quote.status)
                              )}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-medium">
                          {formatTableDate(quote.createdAt)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedQuote(quote)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="h-5 w-5" />
                                  Quote Request Details
                                </DialogTitle>
                                <DialogDescription>
                                  Complete quote request information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedQuote && (
                                <div className="space-y-6">
                                  {/* Customer Overview Card */}
                                  <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="p-3 bg-white rounded-lg shadow-sm">
                                            <User className="h-6 w-6 text-blue-600" />
                                          </div>
                                          <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                              {selectedQuote.customerName}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                              {selectedQuote.company ||
                                                "Individual"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <Badge
                                                className={getStatusColor(
                                                  selectedQuote.status
                                                )}
                                              >
                                                <div className="flex items-center gap-1">
                                                  {getStatusIcon(
                                                    selectedQuote.status
                                                  )}
                                                  {selectedQuote.status}
                                                </div>
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm text-gray-500">
                                            Requested
                                          </p>
                                          <p className="text-sm font-medium">
                                            {formatDate(
                                              selectedQuote.createdAt
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Contact Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="border-0 shadow-sm">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Mail className="h-4 w-4 text-blue-600" />
                                          <h4 className="font-medium text-sm">
                                            Email
                                          </h4>
                                        </div>
                                        <p className="text-sm text-gray-700 break-all">
                                          {selectedQuote.customerEmail}
                                        </p>
                                      </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Phone className="h-4 w-4 text-green-600" />
                                          <h4 className="font-medium text-sm">
                                            Phone
                                          </h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {selectedQuote.customerPhone}
                                        </p>
                                      </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Building className="h-4 w-4 text-purple-600" />
                                          <h4 className="font-medium text-sm">
                                            Company
                                          </h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {selectedQuote.company ||
                                            "Not provided"}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Product Details */}
                                  <Card className="border-0 shadow-sm">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        Product Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                          </label>
                                          <p className="mt-1 text-sm text-gray-900 font-medium">
                                            {selectedQuote.productName}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                          </label>
                                          <p className="mt-1 text-sm text-gray-900 font-medium">
                                            {selectedQuote.quantity} units
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Additional Message */}
                                  {selectedQuote.message && (
                                    <Card className="border-0 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          Additional Requirements
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedQuote.message}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Status Management */}
                                  <Card className="border-0 shadow-sm">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Status Management
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Status
                                          </label>
                                          <div className="mt-2">
                                            <Badge
                                              className={getStatusColor(
                                                selectedQuote.status
                                              )}
                                            >
                                              <div className="flex items-center gap-1">
                                                {getStatusIcon(
                                                  selectedQuote.status
                                                )}
                                                {selectedQuote.status}
                                              </div>
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              updateQuoteStatus(
                                                selectedQuote._id!,
                                                "quoted"
                                              )
                                            }
                                            disabled={
                                              selectedQuote.status ===
                                                "quoted" ||
                                              updatingStatus[selectedQuote._id!]
                                            }
                                          >
                                            {updatingStatus[
                                              selectedQuote._id!
                                            ] &&
                                            selectedQuote.status !==
                                              "quoted" ? (
                                              <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                            ) : (
                                              <>
                                                <Send className="h-4 w-4 mr-1" />
                                                Quote
                                              </>
                                            )}
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              updateQuoteStatus(
                                                selectedQuote._id!,
                                                "converted"
                                              )
                                            }
                                            disabled={
                                              selectedQuote.status ===
                                                "converted" ||
                                              updatingStatus[selectedQuote._id!]
                                            }
                                          >
                                            {updatingStatus[
                                              selectedQuote._id!
                                            ] &&
                                            selectedQuote.status !==
                                              "converted" ? (
                                              <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                            ) : (
                                              <>
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Convert
                                              </>
                                            )}
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              updateQuoteStatus(
                                                selectedQuote._id!,
                                                "declined"
                                              )
                                            }
                                            disabled={
                                              selectedQuote.status ===
                                                "declined" ||
                                              updatingStatus[selectedQuote._id!]
                                            }
                                          >
                                            {updatingStatus[
                                              selectedQuote._id!
                                            ] &&
                                            selectedQuote.status !==
                                              "declined" ? (
                                              <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                            ) : (
                                              <>
                                                <X className="h-4 w-4 mr-1" />
                                                Decline
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, sortedQuotes.length)}{" "}
                    of {sortedQuotes.length} quotes
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={
                                currentPage === pageNumber
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
