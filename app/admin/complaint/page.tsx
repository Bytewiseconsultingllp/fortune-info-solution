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
  FileText,
  Send,
  MessageSquare,
  AlertTriangle,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

const formatDate = (dateValue: string | Date) => {
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
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
    if (date instanceof Date && !isNaN(date.getTime())) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const complaintDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      if (complaintDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      if (complaintDate.getTime() === yesterday.getTime()) {
        return 'Yesterday'
      }
      
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (complaintDate >= weekAgo) {
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })
      }
      
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

type Complaint = {
  _id: string
  name: string
  email: string
  phone: string
  type?: string | null
  orderId?: string | null
  message: string
  complaintNumber: string
  createdAt: string
  status: "open" | "investigating" | "resolved" | "closed"
}

export default function AdminComplaintsPage() {
  const { toast } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Complaint; direction: 'asc' | 'desc' } | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({})

  // Fetch all complaints for better filtering and sorting
  const fetchAllComplaints = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/complaints?all=true`)
      const data = await res.json()
      if (data.success) {
        setAllComplaints(data.complaints)
        setComplaints(data.complaints)
      }
    } catch (err) {
      console.error("Error fetching complaints:", err)
      toast({ title: "Failed to fetch complaints", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllComplaints()
  }, [])

  // Filter complaints
  useEffect(() => {
    let filtered = allComplaints

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus)
    }

    setComplaints(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, allComplaints])

  // Sorting function
  const handleSort = (key: keyof Complaint) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedComplaints = useMemo(() => {
    let sortableComplaints = [...complaints]
    if (sortConfig !== null) {
      sortableComplaints.sort((a, b) => {
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
    return sortableComplaints
  }, [complaints, sortConfig])

  // Pagination with sorted data
  const totalPages = Math.ceil(sortedComplaints.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedComplaints = sortedComplaints.slice(startIndex, startIndex + itemsPerPage)

  // Stats
  const stats = {
    total: allComplaints.length,
    open: allComplaints.filter(c => c.status === 'open').length,
    investigating: allComplaints.filter(c => c.status === 'investigating').length,
    resolved: allComplaints.filter(c => c.status === 'resolved').length,
    closed: allComplaints.filter(c => c.status === 'closed').length,
  }

  const toggleComplaintSelection = (complaintId: string) => {
    setSelectedComplaints(prev => 
      prev.includes(complaintId) 
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    )
  }

  const toggleAllComplaints = () => {
    if (selectAll) {
      setSelectedComplaints([])
      setSelectAll(false)
    } else {
      setSelectedComplaints(paginatedComplaints.map(c => c._id))
      setSelectAll(true)
    }
  }

  const updateComplaintStatus = async (complaintId: string, newStatus: Complaint["status"]) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }))
      
      const response = await fetch(`/api/admin/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setComplaints(prev => prev.map(complaint => 
          complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
        ))
        setAllComplaints(prev => prev.map(complaint => 
          complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
        ))
        if (selectedComplaint?._id === complaintId) {
          setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null)
        }
        toast({ 
          title: "Status updated",
          description: `Complaint status changed to ${newStatus}`,
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
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }))
    }
  }

  const bulkUpdateStatus = async (status: Complaint["status"]) => {
    try {
      // Update local state optimistically
      const updatedComplaints = complaints.map(complaint => 
        selectedComplaints.includes(complaint._id!) ? { ...complaint, status } : complaint
      )
      setComplaints(updatedComplaints)
      setAllComplaints(prev => 
        prev.map(complaint => 
          selectedComplaints.includes(complaint._id!) ? { ...complaint, status } : complaint
        )
      )
      
      // Update selected complaint if it's in the selection
      if (selectedComplaint && selectedComplaints.includes(selectedComplaint._id!)) {
        setSelectedComplaint(prev => prev ? { ...prev, status } : null)
      }
      
      // Update the server
      const response = await fetch('/api/admin/complaints/bulk-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintIds: selectedComplaints,
          status
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update complaints')
      }
      
      toast({
        title: "Statuses updated",
        description: `Updated ${selectedComplaints.length} complaints to ${status}`
      })
      
      // Clear selection after successful update
      setSelectedComplaints([])
      setSelectAll(false)
      
    } catch (error) {
      console.error("Bulk update error:", error)
      // Revert optimistic update on error
      fetchAllComplaints()
      toast({
        title: "Failed to update complaints",
        description: "An error occurred while updating the complaints. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getSortIcon = (column: keyof Complaint) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  const exportComplaints = async () => {
    try {
      const csvContent = [
        ["Complaint Number", "Name", "Email", "Phone", "Type", "Order ID", "Message", "Status", "Date"],
        ...complaints.map((complaint) => [
          complaint.complaintNumber,
          complaint.name,
          complaint.email,
          complaint.phone,
          complaint.type || "",
          complaint.orderId || "",
          complaint.message || "",
          complaint.status,
          formatDate(complaint.createdAt),
        ]),
      ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({ title: "Complaints exported successfully" })
    } catch (error) {
      toast({ title: "Error exporting complaints", variant: "destructive" })
    }
  }

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "investigating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Complaint["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-3 w-3" />
      case "investigating":
        return <Clock className="h-3 w-3" />
      case "resolved":
        return <CheckCircle className="h-3 w-3" />
      case "closed":
        return <Archive className="h-3 w-3" />
      default:
        return <AlertTriangle className="h-3 w-3" />
    }
  }

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
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
          <p className="text-muted-foreground">Manage customer complaints and support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportComplaints}>
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
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                <p className="text-2xl font-bold">{stats.investigating}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closed}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Archive className="h-5 w-5 text-gray-600" />
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
                placeholder="Search by name, email, complaint number, order ID, or message..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
      {selectedComplaints.length > 0 && (
        <Card className="border-0 shadow-sm bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedComplaints.length} complaints selected</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedComplaints([])
                  setSelectAll(false)
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => bulkUpdateStatus('investigating')}
                  disabled={selectedComplaints.some(id => updatingStatus[id])}
                >
                  {selectedComplaints.some(id => updatingStatus[id]) ? (
                    <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-2" />
                  ) : (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  Mark as Investigating
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => bulkUpdateStatus('resolved')}
                  disabled={selectedComplaints.some(id => updatingStatus[id])}
                >
                  {selectedComplaints.some(id => updatingStatus[id]) ? (
                    <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Mark as Resolved
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => bulkUpdateStatus('closed')}
                  disabled={selectedComplaints.some(id => updatingStatus[id])}
                >
                  {selectedComplaints.some(id => updatingStatus[id]) ? (
                    <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-2" />
                  ) : (
                    <Archive className="h-4 w-4 mr-2" />
                  )}
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complaints Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Complaints ({complaints.length})</span>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedComplaints.length)} of {sortedComplaints.length} complaints
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
                      onChange={toggleAllComplaints}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">
                    Complaint #
                  </th>
                  <th className="text-left p-3 font-medium">
                    Message
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1">
                      Type
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">
                    Order ID
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
                {paginatedComplaints.map((complaint, index) => (
                  <tr 
                    key={complaint._id} 
                    className={cn(
                      "border-b hover:bg-muted/50 transition-colors",
                      index % 2 === 0 && "bg-muted/25",
                      selectedComplaints.includes(complaint._id!) && "bg-red-50"
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedComplaints.includes(complaint._id!)}
                        onChange={() => toggleComplaintSelection(complaint._id!)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-muted rounded">
                            <User className="h-3 w-3" />
                          </div>
                          <div className="font-medium">{complaint.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {complaint.email}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {complaint.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">{complaint.complaintNumber}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-muted-foreground max-w-xs overflow-hidden cursor-pointer hover:text-foreground transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {complaint.message || 'No message'}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-md">
                          <div className="p-2">
                            <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{complaint.message || 'No message'}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{complaint.type || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {complaint.orderId ? (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">{complaint.orderId}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => updateComplaintStatus(complaint._id, value as Complaint["status"])}
                        disabled={updatingStatus[complaint._id!]}
                      >
                        <SelectTrigger className="w-36">
                          <div className="flex items-center gap-1">
                            {updatingStatus[complaint._id!] ? (
                              <div className="h-3 w-3 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin" />
                            ) : (
                              getStatusIcon(complaint.status)
                            )}
                            <span className="capitalize">{complaint.status}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="investigating">Investigating</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium">
                        {formatTableDate(complaint.createdAt)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Complaint Details - {complaint.complaintNumber}
                              </DialogTitle>
                              <DialogDescription>Complete complaint information</DialogDescription>
                            </DialogHeader>
                            {selectedComplaint && (
                              <div className="space-y-6">
                                {/* Customer Overview Card */}
                                <Card className="border-0 bg-gradient-to-r from-red-50 to-pink-50">
                                  <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                          <User className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                          <h3 className="text-xl font-semibold text-gray-900">{selectedComplaint.name}</h3>
                                          <p className="text-sm text-gray-600">{selectedComplaint.type || 'General Complaint'}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge className={getStatusColor(selectedComplaint.status)}>
                                              <div className="flex items-center gap-1">
                                                {getStatusIcon(selectedComplaint.status)}
                                                {selectedComplaint.status}
                                              </div>
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">Complaint #</p>
                                        <p className="text-sm font-medium">{selectedComplaint.complaintNumber}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(selectedComplaint.createdAt)}</p>
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
                                      <p className="text-sm text-gray-700 break-all">{selectedComplaint.email}</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        <h4 className="font-medium text-sm">Phone</h4>
                                      </div>
                                      <p className="text-sm text-gray-700">{selectedComplaint.phone}</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4 text-purple-600" />
                                        <h4 className="font-medium text-sm">Order ID</h4>
                                      </div>
                                      <p className="text-sm text-gray-700">{selectedComplaint.orderId || 'Not provided'}</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Complaint Message */}
                                <Card className="border-0 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      Complaint Message
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedComplaint.message}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Status Management */}
                                <Card className="border-0 shadow-sm">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4" />
                                      Status Management
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</label>
                                        <div className="mt-2">
                                          <Badge className={getStatusColor(selectedComplaint.status)}>
                                            <div className="flex items-center gap-1">
                                              {getStatusIcon(selectedComplaint.status)}
                                              {selectedComplaint.status}
                                            </div>
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updateComplaintStatus(selectedComplaint._id!, 'investigating')}
                                          disabled={selectedComplaint.status === 'investigating' || updatingStatus[selectedComplaint._id!]}
                                        >
                                          {updatingStatus[selectedComplaint._id!] && selectedComplaint.status !== 'investigating' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <Clock className="h-4 w-4 mr-1" />
                                              Investigate
                                            </>
                                          )}
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updateComplaintStatus(selectedComplaint._id!, 'resolved')}
                                          disabled={selectedComplaint.status === 'resolved' || updatingStatus[selectedComplaint._id!]}
                                        >
                                          {updatingStatus[selectedComplaint._id!] && selectedComplaint.status !== 'resolved' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Resolve
                                            </>
                                          )}
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => updateComplaintStatus(selectedComplaint._id!, 'closed')}
                                          disabled={selectedComplaint.status === 'closed' || updatingStatus[selectedComplaint._id!]}
                                        >
                                          {updatingStatus[selectedComplaint._id!] && selectedComplaint.status !== 'closed' ? (
                                            <div className="h-4 w-4 border-2 border-gray-400 border-t-2 border-t-blue-500 rounded-full animate-spin mr-1" />
                                          ) : (
                                            <>
                                              <Archive className="h-4 w-4 mr-1" />
                                              Close
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedComplaints.length)} of {sortedComplaints.length} complaints
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
