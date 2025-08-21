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
import { Search, Eye, Mail, Phone, Download } from "lucide-react"
import type { Contact } from "@/lib/models"

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
    return date.toLocaleDateString()
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
          contact.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((contact) => contact.status === selectedStatus)
    }

    setFilteredContacts(filtered)
  }, [searchTerm, selectedStatus, contacts])

  const updateContactStatus = async (contactId: string, newStatus: Contact["status"]) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/status`, {
        method: "PATCH",
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
    // In a real app, this would generate and download a CSV/Excel file
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
    a.download = "contacts.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Contacts exported successfully" })
  }

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
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
          <h2 className="text-3xl font-bold">Contact Submissions</h2>
          <p className="text-muted-foreground">Manage customer inquiries and contact requests</p>
        </div>
        <Button onClick={exportContacts}>
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
                placeholder="Search contacts..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
          <CardDescription>Customer inquiries and contact requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    {contact.company && <span>Company: {contact.company}</span>}
                  </div>
                  <p className="text-sm line-clamp-2">{contact.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">Submitted: {formatDate(contact.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                        <DialogDescription>Full contact information and message</DialogDescription>
                      </DialogHeader>
                      {selectedContact && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Name</Label>
                              <p>{selectedContact.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Email</Label>
                              <p>{selectedContact.email}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Phone</Label>
                              <p>{selectedContact.phone}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Company</Label>
                              <p>{selectedContact.company || "Not provided"}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="font-semibold">Message</Label>
                            <p className="mt-1 p-3 bg-muted rounded">{selectedContact.message}</p>
                          </div>
                          <div>
                            <Label className="font-semibold">Status</Label>
                            <Select
                              value={selectedContact.status}
                              onValueChange={(value) =>
                                updateContactStatus(selectedContact._id!, value as Contact["status"])
                              }
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Select
                    value={contact.status}
                    onValueChange={(value) => updateContactStatus(contact._id!, value as Contact["status"])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
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
