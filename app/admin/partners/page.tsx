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
import { Search, Eye, Mail, Phone, Download, Building } from "lucide-react"
import type { PartnerEnquiry } from "@/lib/models"

export default function AdminPartnersPage() {
  const { toast } = useToast()
  const [partners, setPartners] = useState<PartnerEnquiry[]>([])
  const [filteredPartners, setFilteredPartners] = useState<PartnerEnquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBusinessType, setSelectedBusinessType] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<PartnerEnquiry | null>(null)
  const [loading, setLoading] = useState(true)

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
          partner.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((partner) => partner.status === selectedStatus)
    }

    if (selectedBusinessType !== "all") {
      filtered = filtered.filter((partner) => partner.businessType === selectedBusinessType)
    }

    setFilteredPartners(filtered)
  }, [searchTerm, selectedStatus, selectedBusinessType, partners])

  const updatePartnerStatus = async (partnerId: string, newStatus: PartnerEnquiry["status"]) => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setPartners((prev) =>
          prev.map((partner) => (partner._id === partnerId ? { ...partner, status: newStatus } : partner)),
        )
        toast({ title: "Partner status updated" })
      } else {
        toast({ title: "Failed to update status", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    }
  }

  const exportPartners = () => {
    // In a real app, this would generate and download a CSV/Excel file
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
        partner.createdAt.toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "partner-enquiries.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Partner enquiries exported successfully" })
  }

  const getStatusColor = (status: PartnerEnquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
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
          <h2 className="text-3xl font-bold">Partner Enquiries</h2>
          <p className="text-muted-foreground">Manage partnership applications and enquiries</p>
        </div>
        <Button onClick={exportPartners}>
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
                placeholder="Search partners..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
              <SelectTrigger className="w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Enquiries ({filteredPartners.length})</CardTitle>
          <CardDescription>Partnership applications and business enquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPartners.map((partner) => (
              <div key={partner._id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{partner.name}</h3>
                    <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
                    <Badge variant="outline">{partner.businessType}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {partner.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {partner.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {partner.company}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2">{partner.message}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>Location: {partner.location}</span>
                    <span>
                      Submitted: {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPartner(partner)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Partner Enquiry Details</DialogTitle>
                        <DialogDescription>Full partnership application information</DialogDescription>
                      </DialogHeader>
                      {selectedPartner && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Name</Label>
                              <p>{selectedPartner.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Email</Label>
                              <p>{selectedPartner.email}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Phone</Label>
                              <p>{selectedPartner.phone}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Company</Label>
                              <p>{selectedPartner.company}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Business Type</Label>
                              <p>{selectedPartner.businessType}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Location</Label>
                              <p>{selectedPartner.location}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="font-semibold">Message</Label>
                            <p className="mt-1 p-3 bg-muted rounded">{selectedPartner.message}</p>
                          </div>
                         
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
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
