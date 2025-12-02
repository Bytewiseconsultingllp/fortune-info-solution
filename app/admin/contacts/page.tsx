"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Trash
} from "lucide-react"
import type { Contact } from "@/lib/models"
import { cn } from "@/lib/utils"

// Sample contacts data - in real app this would come from database
// const sampleContacts: Contact[] = [
//   {
//     _id: "1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     company: "Tech Solutions Inc",
//     message: "Interested in your industrial automation products. Please contact me for a consultation.",
//     createdAt: new Date("2024-01-15"),
//     status: "new",
//   },
//   {
//     _id: "2",
//     name: "Jane Smith",
//     email: "jane.smith@company.com",
//     phone: "+1 (555) 987-6543",
//     company: "Manufacturing Corp",
//     message: "Looking for bulk pricing on security systems for our facilities.",
//     createdAt: new Date("2024-01-14"),
//     status: "contacted",
//   },
//   {
//     _id: "3",
//     name: "Mike Johnson",
//     email: "mike@startup.com",
//     phone: "+1 (555) 456-7890",
//     company: "",
//     message: "Need information about your networking equipment for a small office setup.",
//     createdAt: new Date("2024-01-13"),
//     status: "resolved",
//   },
// ]

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


export default function AdminContactsPage() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' } | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Contact | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/admin/contacts")
        if (response.ok) {
          const data = await response.json()
          setContacts(data.contacts || [])
        } else {
          console.error("Failed to fetch contacts:", response.statusText)
          setContacts([])
        }
      } catch (error) {
        console.error("Error fetching contacts:", error)
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  // Filter contacts
  useEffect(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((contact) => contact.status === selectedStatus)
    }

    setFilteredContacts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, contacts])

  const updateContactStatus = async (contactId: string, newStatus: Contact["status"]) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setContacts((prev) =>
          prev.map((contact) => (contact._id === contactId ? { ...contact, status: newStatus } : contact)),
        )
        toast({ title: "Contact status updated" })
      } else {
        toast({ title: "Failed to update status", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    }
  }

  const exportContacts = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Message", "Status", "Date"],
      ...filteredContacts.map((contact) => [
        contact.name,
        contact.email,
        contact.phone,
        contact.company || "",
        contact.message,
        contact.status,
        formatDate(contact.createdAt),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Contacts exported successfully" })
  }

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-3 w-3" />
      case "contacted":
        return <Clock className="h-3 w-3" />
      case "resolved":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const toggleAllContacts = () => {
    if (selectAll) {
      setSelectedContacts([])
      setSelectAll(false)
    } else {
      setSelectedContacts(paginatedContacts.map(c => c._id!))
      setSelectAll(true)
    }
  }

  const bulkUpdateStatus = useCallback(async (status: Contact["status"]) => {
    try {
      const promises = selectedContacts.map(contactId => 
        fetch(`/api/admin/contacts/${contactId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
      
      await Promise.all(promises)
      
      setContacts(prev => 
        prev.map(contact => 
          selectedContacts.includes(contact._id!) 
            ? { ...contact, status }
            : contact
        )
      )
      
      setSelectedContacts([])
      setSelectAll(false)
      toast({ title: `Updated ${selectedContacts.length} contacts successfully` })
    } catch (error) {
      toast({ title: "Error updating contacts", variant: "destructive" })
    }
  }, [selectedContacts]);

  const handleDelete = useCallback(async (contactId: string) => {
    const contact = contacts.find(c => c._id === contactId);
    if (contact) {
      setContactToDelete(contact);
      setDeleteDialogOpen(true);
    }
  }, [contacts]);

  const confirmDelete = useCallback(async () => {
    if (!contactToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/contacts/${contactToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== contactToDelete._id));
        toast({ title: "Contact deleted successfully" });
        setDeleteDialogOpen(false);
        setContactToDelete(null);
      } else {
        throw new Error("Failed to delete contact");
      }
    } catch {
      toast({ title: "Error deleting contact", variant: "destructive" });
    }
  }, [contactToDelete]);

  const handleReply = useCallback((contact: Contact) => {
    setReplyingTo(contact);
    setReplyMessage("");
    setReplyDialogOpen(true);
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(e.target.value);
  }, []);

  const sendReply = useCallback(async () => {
    if (!replyingTo || !replyMessage.trim()) return;
    
    console.log("=== FRONTEND REPLY SEND START ===");
    console.log("Replying to:", replyingTo.email);
    console.log("Message length:", replyMessage.length);
    console.log("Contact ID:", replyingTo._id);
    
    setSendingReply(true);
    try {
      const requestData = {
        to: replyingTo.email,
        subject: `Re: ${(replyingTo as any).subject || 'Your inquiry'}`,
        message: replyMessage,
        contactId: replyingTo._id,
      };
      console.log("Request data prepared:", requestData);

      console.log("Sending request to /api/admin/contacts/reply...");
      const response = await fetch("/api/admin/contacts/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        
        toast({ title: "Reply sent successfully" });
        setReplyDialogOpen(false);
        setReplyingTo(null);
        setReplyMessage("");
        
        // Update contact status to contacted
        console.log("Updating local contact status...");
        setContacts(prev => 
          prev.map(c => 
            c._id === replyingTo._id 
              ? { ...c, status: "contacted" as Contact["status"] }
              : c
          )
        );
        console.log("=== FRONTEND REPLY SEND SUCCESS ===");
      } else {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("=== FRONTEND REPLY SEND ERROR ===");
      console.error("Error:", error);
      toast({ title: "Error sending reply", variant: "destructive" });
    } finally {
      setSendingReply(false);
    }
  }, [replyingTo, replyMessage]);

  const getSortIcon = (column: keyof Contact) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  // Sorting function
  const handleSort = (key: keyof Contact) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedContacts = useMemo(() => {
    let sortableContacts = [...filteredContacts]
    if (sortConfig !== null) {
      sortableContacts.sort((a, b) => {
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
    return sortableContacts
  }, [filteredContacts, sortConfig])

  // Pagination with sorted data
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedContacts = sortedContacts.slice(startIndex, startIndex + itemsPerPage)

  // Stats
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
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
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">Manage customer inquiries and support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportContacts}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
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
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
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
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                placeholder="Search by name, email, company, or message..."
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
                <SelectItem value="resolved">Resolved</SelectItem>
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
      {selectedContacts.length > 0 && (
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedContacts.length} contacts selected</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedContacts([])
                  setSelectAll(false)
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('contacted')}>
                  <Clock className="h-4 w-4 mr-1" />
                  Mark as Contacted
                </Button>
                <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('resolved')}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contacts ({sortedContacts.length})</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAllContacts}
                className="text-xs"
              >
                {selectAll ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Customer inquiries and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleAllContacts}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="text-left p-3 font-medium">
                      Message
                    </th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-1">
                        Email
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center gap-1">
                        Phone
                        {getSortIcon('phone')}
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
                  {paginatedContacts.map((contact, index) => (
                    <tr 
                      key={contact._id} 
                      className={cn(
                        "border-b hover:bg-muted/50 transition-colors",
                        index % 2 === 0 && "bg-muted/25",
                        selectedContacts.includes(contact._id!) && "bg-blue-50"
                      )}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact._id!)}
                          onChange={() => toggleContactSelection(contact._id!)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-muted rounded">
                            <User className="h-3 w-3" />
                          </div>
                          <div className="font-medium">{contact.name}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-muted-foreground max-w-xs overflow-hidden cursor-pointer hover:text-foreground transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {contact.message}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-md">
                            <div className="p-2">
                              <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{contact.message}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {contact.company ? (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{contact.company}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Select
                          value={contact.status}
                          onValueChange={(value) => updateContactStatus(contact._id!, value as Contact["status"])}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-medium">
                          {formatTableDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Contact Details</DialogTitle>
                                <DialogDescription>Full contact information and message</DialogDescription>
                              </DialogHeader>
                              {selectedContact && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Name</label>
                                      <p className="text-sm">{selectedContact.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm">{selectedContact.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Phone</label>
                                      <p className="text-sm">{selectedContact.phone}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Company</label>
                                      <p className="text-sm">{selectedContact.company || "Not provided"}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Status</label>
                                      <Badge className={getStatusColor(selectedContact.status)}>
                                        {selectedContact.status}
                                      </Badge>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Submitted</label>
                                      <p className="text-sm">{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <div className="p-4 bg-muted rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4">
                                    {/* <Button 
                                      variant="outline" 
                                      className="flex-1"
                                      onClick={() => selectedContact && handleReply(selectedContact)}
                                    >
                                      <Reply className="h-4 w-4 mr-2" />
                                      Reply
                                    </Button> */}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem onClick={() => handleReply(contact)}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem> */}
                              <DropdownMenuItem 
                                onClick={() => handleDelete(contact._id!)}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedContacts.length)} of {sortedContacts.length} contacts
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash className="h-5 w-5" />
              Delete Contact
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{contactToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {contactToDelete && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{contactToDelete.name}</h4>
                <p className="text-sm text-muted-foreground">{contactToDelete.email}</p>
                {contactToDelete.company && (
                  <p className="text-sm text-muted-foreground">{contactToDelete.company}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {contactToDelete.status}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setContactToDelete(null);
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
                <Trash className="h-4 w-4 mr-2" />
                Delete Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-5 w-5" />
              Reply to {replyingTo?.name}
            </DialogTitle>
            <DialogDescription>
              Send a reply email to {replyingTo?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {replyingTo && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{replyingTo.name}</h4>
                  <Badge variant="outline">{replyingTo.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{replyingTo.email}</p>
                {replyingTo.company && (
                  <p className="text-sm text-muted-foreground mb-2">{replyingTo.company}</p>
                )}
                {(replyingTo as any).subject && (
                  <p className="text-sm font-medium mb-2">Subject: {(replyingTo as any).subject}</p>
                )}
                <div className="border-t pt-2">
                  <p className="text-sm text-muted-foreground">Original message:</p>
                  <p className="text-sm mt-1 line-clamp-3">{replyingTo.message}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="reply-message" className="text-sm font-medium">
                Your Reply
              </label>
              <Textarea
                id="reply-message"
                placeholder="Type your reply message here..."
                value={replyMessage}
                onChange={handleMessageChange}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setReplyDialogOpen(false);
                  setReplyingTo(null);
                  setReplyMessage("");
                }}
                className="flex-1"
                disabled={sendingReply}
              >
                Cancel
              </Button>
              <Button
                onClick={sendReply}
                className="flex-1"
                disabled={sendingReply || !replyMessage.trim()}
              >
                {sendingReply ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Reply className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  )
}
