"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Mail, Phone, Download, Package, Hash } from "lucide-react"
import type { QuoteRequest } from "@/lib/models"

export default function AdminQuotesPage() {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/admin/quotes")
        if (response.ok) {
          const data = await response.json()
          setQuotes(data.quotes || [])
        } else {
          console.error("Failed to fetch quotes:", response.statusText)
          setQuotes([])
        }
      } catch (error) {
        console.error("Error fetching quotes:", error)
        setQuotes([])
      } finally {
        setLoading(false)
      } 
    }

    fetchQuotes()
  }, [])

  // Filter quotes
  useEffect(() => {
    let filtered = quotes

    if (searchTerm) {
      filtered = filtered.filter(
        (quote) =>
          quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((quote) => quote.status === selectedStatus)
    }

    setFilteredQuotes(filtered)
  }, [searchTerm, selectedStatus, quotes])

  const updateQuoteStatus = async (quoteId: string, newStatus: QuoteRequest["status"]) => {
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setQuotes((prev) => prev.map((quote) => (quote._id === quoteId ? { ...quote, status: newStatus } : quote)))
        toast({ title: "Quote status updated" })
      } else {
        toast({ title: "Failed to update status", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    }
  }

  const exportQuotes = () => {
    // In a real app, this would generate and download a CSV/Excel file
    const csvContent = [
      ["Customer Name", "Email", "Phone", "Company", "Product", "Quantity", "Message", "Status", "Date"],
      ...filteredQuotes.map((quote) => [
        quote.customerName,
        quote.customerEmail,
        quote.customerPhone,
        quote.company || "",
        quote.productName,
        quote.quantity.toString(),
        quote.message || "",
        quote.status,
        quote.createdAt.toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "quote-requests.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Quote requests exported successfully" })
  }

  const getStatusColor = (status: QuoteRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "quoted":
        return "bg-yellow-100 text-yellow-800"
      case "converted":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Quote Requests</h2>
          <p className="text-muted-foreground">Manage customer quote requests and pricing inquiries</p>
        </div>
        <Button onClick={exportQuotes}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests ({filteredQuotes.length})</CardTitle>
          <CardDescription>Customer pricing requests and quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote._id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{quote.customerName}</h3>
                    <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {quote.customerEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {quote.customerPhone}
                    </span>
                    {quote.company && <span>Company: {quote.company}</span>}
                  </div>
                  <div className="flex gap-4 text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {quote.productName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Qty: {quote.quantity}
                    </span>
                  </div>
                  {quote.message && <p className="text-sm line-clamp-2">{quote.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested: {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedQuote(quote)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Quote Request Details</DialogTitle>
                        <DialogDescription>Full quote request information</DialogDescription>
                      </DialogHeader>
                      {selectedQuote && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Customer Name</Label>
                              <p>{selectedQuote.customerName}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Email</Label>
                              <p>{selectedQuote.customerEmail}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Phone</Label>
                              <p>{selectedQuote.customerPhone}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Company</Label>
                              <p>{selectedQuote.company || "Not provided"}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Product</Label>
                              <p>{selectedQuote.productName}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Quantity</Label>
                              <p>{selectedQuote.quantity} units</p>
                            </div>
                          </div>
                          {selectedQuote.message && (
                            <div>
                              <Label className="font-semibold">Additional Requirements</Label>
                              <p className="mt-1 p-3 bg-muted rounded">{selectedQuote.message}</p>
                            </div>
                          )}
                          <div>
                            <Label className="font-semibold">Status</Label>
                            <Select
                              value={selectedQuote.status}
                              onValueChange={(value) =>
                                updateQuoteStatus(selectedQuote._id!, value as QuoteRequest["status"])
                              }
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="quoted">Quoted</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Select
                    value={quote.status}
                    onValueChange={(value) => updateQuoteStatus(quote._id!, value as QuoteRequest["status"])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>
}
