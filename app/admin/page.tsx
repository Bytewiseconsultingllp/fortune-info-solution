"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MessageSquare, Users, FileText, TrendingUp, Clock } from "lucide-react"

export default function AdminDashboard() {
  type RecentActivityItem = {
    type: string
    message: string
    time: string
  }

  const [stats, setStats] = useState<{
    totalProducts: number
    totalServices: number
    pendingContacts: number
    pendingPartners: number
    pendingQuotes: number
    recentActivity: RecentActivityItem[]
  }>({
    totalProducts: 0,
    totalServices: 0,
    pendingContacts: 0,
    pendingPartners: 0,
    pendingQuotes: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/stats")

        if (response.ok) {
          const data = await response.json()

          const recentActivity: {
            type: string
            message: string
            time: string
          }[] = []

          if (data.recentActivity.contacts?.length > 0) {
            data.recentActivity.contacts.slice(0, 2).forEach((contact: { name: string; createdAt: string }) => {
              recentActivity.push({
                type: "contact",
                message: `New contact from ${contact.name}`,
                time: new Date(contact.createdAt).toLocaleDateString(),
              })
            })
          }

          if (data.recentActivity.partners?.length > 0) {
            data.recentActivity.partners.slice(0, 2).forEach((partner: { company: string; createdAt: string }) => {
              recentActivity.push({
                type: "partner",
                message: `Partner application from ${partner.company}`,
                time: new Date(partner.createdAt).toLocaleDateString(),
              })
            })
          }

          if (data.recentActivity.quotes?.length > 0) {
            data.recentActivity.quotes.slice(0, 2).forEach((quote: { productName?: string; createdAt: string }) => {
              recentActivity.push({
                type: "quote",
                message: `Quote request for ${quote.productName || "product"}`,
                time: new Date(quote.createdAt).toLocaleDateString(),
              })
            })
          }

          setStats({
            totalProducts: data.stats.totalProducts,
            totalServices: data.stats.totalServices,
            pendingContacts: data.stats.pendingContacts,
            pendingPartners: data.stats.pendingPartners,
            pendingQuotes: data.stats.pendingQuotes,
            recentActivity: recentActivity,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setStats({
          totalProducts: 0,
          totalServices: 0,
          pendingContacts: 0,
          pendingPartners: 0,
          pendingQuotes: 0,
          recentActivity: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600",
    },
    {
      title: "Pending Contacts",
      value: stats.pendingContacts,
      icon: MessageSquare,
      description: "Awaiting response",
      color: "text-orange-600",
    },
    {
      title: "Partner Applications",
      value: stats.pendingPartners,
      icon: Users,
      description: "Under review",
      color: "text-green-600",
    },
    {
      title: "Quote Requests",
      value: stats.pendingQuotes,
      icon: FileText,
      description: "Pending quotes",
      color: "text-purple-600",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
        <p className="text-foreground">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Add New Product</p>
                  <p className="text-sm text-foreground">Add products to catalog</p>
                </div>
                <Package className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Review Contacts</p>
                  <p className="text-sm text-foreground">Respond to inquiries</p>
                </div>
                <MessageSquare className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Process Quotes</p>
                  <p className="text-sm text-foreground">Generate price quotes</p>
                </div>
                <FileText className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
