"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { 
  Search, 
  Eye, 
  Mail, 
  Phone, 
  Download, 
  Calendar,
  Building,
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
  MapPin,
  Briefcase
} from "lucide-react"
import type { PartnerEnquiry } from "@/lib/models"
import { cn } from "@/lib/utils"

const formatDate = (dateValue: string | Date) => {
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    // Handle MongoDB date format
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return "Invalid date"
  } catch (error) {
    return "Invalid date"
  }
}

const formatTableDate = (dateValue: string | Date) => {
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    // Handle MongoDB date format
    if (date instanceof Date && !isNaN(date.getTime())) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const contactDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      // If today, show time only
      if (contactDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      // If yesterday, show "Yesterday"
      if (contactDate.getTime() === yesterday.getTime()) {
        return 'Yesterday'
      }
      
      // If this week, show day name
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (contactDate >= weekAgo) {
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })
      }
      
      // Otherwise show month and day
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })
    }
    return "Invalid date"
  } catch (error) {
    return "Invalid date"
  }
}

export default function AdminPartnersPage() {
  const { toast } = useToast()
  const [partners, setPartners] = useState<PartnerEnquiry[]>([])
  const [filteredPartners, setFilteredPartners] = useState<PartnerEnquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBusinessType, setSelectedBusinessType] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<PartnerEnquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof PartnerEnquiry; direction: 'asc' | 'desc' } | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/admin/partners")
        if (response.ok) {
          const data = await response.json()
          setPartners(data.partners || [])
        } else {
          console.error("Failed to fetch partners:", response.statusText)
          setPartners([])
        }
      } catch (error) {
        console.error("Error fetching partners:", error)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // Get unique business types from real data
  const businessTypes = Array.from(new Set(partners.map((partner) => partner.businessType)))

  // Filter partners
  useEffect(() => {
    let filtered = partners

    if (searchTerm) {
      filtered = filtered.filter(
        (partner) =>
          partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((partner) => partner.status === selectedStatus)
    }

    if (selectedBusinessType !== "all") {
      filtered = filtered.filter((partner) => partner.businessType === selectedBusinessType)
    }

    setFilteredPartners(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedBusinessType, partners])

  const updatePartnerStatus = async (partnerId: string, newStatus: PartnerEnquiry["status"]) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [partnerId]: true }))
      
      const response = await fetch(`/api/admin/partners/${partnerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setPartners((prev) =>
          prev.map((partner) => (partner._id === partnerId ? { ...partner, status: newStatus } : partner)),
        )
        // Update the selected partner in the modal if it's the one being updated
        if (selectedPartner?._id === partnerId) {
          setSelectedPartner(prev => prev ? { ...prev, status: newStatus } : null)
        }
        toast({ 
          title: "Status updated",
          description: `Partner status changed to ${newStatus}`,
        })
      } else {
        const errorData = await response.json()
        toast({ 
          title: "Failed to update status", 
          description: errorData.error || "Please try again",
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({ 
        title: "Error updating status", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      })
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [partnerId]: false }))
    }
  }

  // Sorting function
  const handleSort = (key: keyof PartnerEnquiry) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedPartners = useMemo(() => {
    let sortablePartners = [...filteredPartners]
    if (sortConfig !== null) {
      sortablePartners.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue == null) return 1
        if (bValue == null) return -1
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortablePartners
  }, [filteredPartners, sortConfig])

  // Pagination with sorted data
  const totalPages = Math.ceil(sortedPartners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPartners = sortedPartners.slice(startIndex, startIndex + itemsPerPage)

  // Stats
  const stats = {
    total: partners.length,
    new: partners.filter(p => p.status === 'new').length,
    contacted: partners.filter(p => p.status === 'contacted').length,
    approved: partners.filter(p => p.status === 'approved').length,
    rejected: partners.filter(p => p.status === 'rejected').length,
  }

  const togglePartnerSelection = (partnerId: string) => {
    setSelectedPartners(prev => 
      prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    )
  }

  const toggleAllPartners = () => {
    if (selectAll) {
      setSelectedPartners([])
      setSelectAll(false)
    } else {
      setSelectedPartners(paginatedPartners.map(p => p._id!))
      setSelectAll(true)
    }
  }

  const bulkUpdateStatus = async (status: PartnerEnquiry["status"]) => {
    try {
      const promises = selectedPartners.map(partnerId => 
        fetch(`/api/admin/partners/${partnerId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
      
      await Promise.all(promises)
      
      setPartners(prev => 
        prev.map(partner => 
          selectedPartners.includes(partner._id!) 
            ? { ...partner, status }
            : partner
        )
      )
      
      setSelectedPartners([])
      setSelectAll(false)
      toast({ title: `Updated ${selectedPartners.length} partners successfully` })
    } catch (error) {
      toast({ title: "Error updating partners", variant: "destructive" })
    }
  }

  const getSortIcon = (column: keyof PartnerEnquiry) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  const exportPartners = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Business Type", "Location", "Message", "Status", "Date"],
      ...filteredPartners.map((partner) => [
        partner.name,
        partner.email,
        partner.phone,
        partner.company,
        partner.businessType,
        partner.location,
        partner.message,
        partner.status,
        formatDate(partner.createdAt),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `partner-enquiries-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Partner enquiries exported successfully" })
  }

  const getStatusColor = (status: PartnerEnquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: PartnerEnquiry["status"]) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-3 w-3" />
      case "contacted":
        return <Clock className="h-3 w-3" />
      case "approved":
        return <CheckCircle className="h-3 w-3" />
      case "rejected":
        return <X className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Management</h1>
          <p className="text-muted-foreground">Manage partnership applications and business enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportPartners}>
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
                <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">{stats.contacted}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
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
                placeholder="Search by name, email, company, location, or message..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value))
              setCurrentPage(1)
            }}>
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
      {selectedPartners.length > 0 && (
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedPartners.length} partners selected</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedPartners([])
                  setSelectAll(false)
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('contacted')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Contacted
                </Button>
                <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('approved')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('rejected')}>
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Partner Enquiries ({filteredPartners.length})</span>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPartners.length)} of {sortedPartners.length} partners
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
                      onChange={toggleAllPartners}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Partner
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center gap-1">
                      Company
                      {getSortIcon('company')}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">
                    Message
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('businessType')}
                  >
                    <div className="flex items-center gap-1">
                      Business Type
                      {getSortIcon('businessType')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPartners.map((partner, index) => (
                  <tr 
                    key={partner._id} 
                    className={cn(
                      "border-b hover:bg-muted/50 transition-colors",
                      index % 2 === 0 && "bg-muted/25",
                      selectedPartners.includes(partner._id!) && "bg-blue-50"
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedPartners.includes(partner._id!)}
                        onChange={() => togglePartnerSelection(partner._id!)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-muted rounded">
                            <User className="h-3 w-3" />
                          </div>
                          <div className="font-medium">{partner.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {partner.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{partner.company}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-muted-foreground max-w-xs overflow-hidden cursor-pointer hover:text-foreground transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {partner.message}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-md">
                          <div className="p-2">
                            <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{partner.message}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{partner.businessType}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Select
                        value={partner.status}
                        onValueChange={(value) => updatePartnerStatus(partner._id!, value as PartnerEnquiry["status"])}
                        disabled={updatingStatus[partner._id!]}
                      >
                        <SelectTrigger className="w-32">
                          <div className="flex items-center gap-1">
                            {updatingStatus[partner._id!] ? (
                              <div className="h-3 w-3 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin" />
                            ) : (
                              getStatusIcon(partner.status)
                            )}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium">
                        {formatTableDate(partner.createdAt)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPartner(partner)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Partner Enquiry Details
                              </DialogTitle>
                              <DialogDescription>Complete partnership application information</DialogDescription>
                            </DialogHeader>
                            {selectedPartner && (
                              <div className="space-y-6">
                                {/* Partner Overview Card */}
                                <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                                  <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                          <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                          <h3 className="text-xl font-semibold text-gray-900">{selectedPartner.name}</h3>
                                          <p className="text-sm text-gray-600">{selectedPartner.company}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge className={getStatusColor(selectedPartner.status)}>
                                              <div className="flex items-center gap-1">
                                                {getStatusIcon(selectedPartner.status)}
                                                {selectedPartner.status}
                                              </div>
                                            </Badge>
                                            <Badge variant="outline" className="bg-white">
                                              {selectedPartner.businessType}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">Submitted</p>
                                        <p className="text-sm font-medium">{formatDate(selectedPartner.createdAt)}</p>
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
                                        <h4 className="font-medium text-sm">Email</h4>
                                      </div>
                                      <p className="text-sm text-gray-700 break-all">{selectedPartner.email}</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        <h4 className="font-medium text-sm">Phone</h4>
                                      </div>
                                      <p className="text-sm text-gray-700">{selectedPartner.phone}</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-red-600" />
                                        <h4 className="font-medium text-sm">Location</h4>
                                      </div>
                                      <p className="text-sm text-gray-700">{selectedPartner.location}</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Business Details */}
                                <Card className="border-0 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <Briefcase className="h-4 w-4" />
                                      Business Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</label>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">{selectedPartner.company}</p>
                                      </div>
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</label>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">{selectedPartner.businessType}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Partnership Message */}
                                <Card className="border-0 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      Partnership Message
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedPartner.message}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>

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
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</label>
                                        <div className="mt-2">
                                          <Badge className={getStatusColor(selectedPartner.status)}>
                                            <div className="flex items-center gap-1">
                                              {getStatusIcon(selectedPartner.status)}
                                              {selectedPartner.status}
                                            </div>
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updatePartnerStatus(selectedPartner._id!, 'contacted')}
                                          disabled={selectedPartner.status === 'contacted' || updatingStatus[selectedPartner._id!]}
                                        >
                                          {updatingStatus[selectedPartner._id!] && selectedPartner.status !== 'contacted' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <Clock className="h-4 w-4 mr-1" />
                                              Contacted
                                            </>
                                          )}
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updatePartnerStatus(selectedPartner._id!, 'approved')}
                                          disabled={selectedPartner.status === 'approved' || updatingStatus[selectedPartner._id!]}
                                        >
                                          {updatingStatus[selectedPartner._id!] && selectedPartner.status !== 'approved' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Approve
                                            </>
                                          )}
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updatePartnerStatus(selectedPartner._id!, 'rejected')}
                                          disabled={selectedPartner.status === 'rejected' || updatingStatus[selectedPartner._id!]}
                                        >
                                          {updatingStatus[selectedPartner._id!] && selectedPartner.status !== 'rejected' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <X className="h-4 w-4 mr-1" />
                                              Reject
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPartners.length)} of {sortedPartners.length} partners
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
  )
}
