"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  MessageSquare, 
  Users, 
  FileText, 
  Clock,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  Zap,
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  type RecentActivityItem = {
    type: string
    message: string
    time: string
    priority?: 'high' | 'medium' | 'low'
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activityFilter, setActivityFilter] = useState<string>('all')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchDashboardData()
  }

  const handleActivityFilter = (filter: string) => {
    setActivityFilter(filter)
  }

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
        setIsRefreshing(false)
      }
    }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      trend: { value: 12, isUp: true },
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: Settings,
      description: "Active services",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      trend: { value: 5, isUp: true },
    },
    {
      title: "Pending Contacts",
      value: stats.pendingContacts,
      icon: MessageSquare,
      description: "Awaiting response",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      trend: { value: 8, isUp: false },
    },
    {
      title: "Partner Applications",
      value: stats.pendingPartners,
      icon: Users,
      description: "Under review",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      trend: { value: 23, isUp: true },
    },
    {
      title: "Quote Requests",
      value: stats.pendingQuotes,
      icon: FileText,
      description: "Pending quotes",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      trend: { value: 5, isUp: true },
    },
  ]

  const quickActions = [
    {
      title: "Add New Product",
      description: "Add products to catalog",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "Manage Services",
      description: "Update service offerings",
      icon: Settings,
      href: "/admin/services",
      color: "bg-green-500",
    },
    {
      title: "Review Contacts",
      description: "Respond to inquiries",
      icon: MessageSquare,
      href: "/admin/contacts",
      color: "bg-orange-500",
    },
    {
      title: "Process Quotes",
      description: "Generate price quotes",
      icon: FileText,
      href: "/admin/quotes",
      color: "bg-purple-500",
    },
  ]

  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={cn("border-0 shadow-sm hover:shadow-md transition-all duration-200", stat.borderColor)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", stat.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {stat.trend && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.trend.isUp ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.trend.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend.value}%
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and submissions across all modules</CardDescription>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-1 text-sm border rounded-md bg-background"
                value={activityFilter}
                onChange={(e) => handleActivityFilter(e.target.value)}
              >
                <option value="all">All Activity</option>
                <option value="contact">Contacts</option>
                <option value="partner">Partners</option>
                <option value="quote">Quotes</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity
                  .filter(activity => activityFilter === 'all' || activity.type === activityFilter)
                  .map((activity, index) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case 'contact': return <MessageSquare className="h-4 w-4" />
                      case 'partner': return <Users className="h-4 w-4" />
                      case 'quote': return <FileText className="h-4 w-4" />
                      default: return <Activity className="h-4 w-4" />
                    }
                  }
                  
                  const getBadgeColor = (type: string) => {
                    switch (type) {
                      case 'contact': return 'bg-blue-100 text-blue-800 border-blue-200'
                      case 'partner': return 'bg-green-100 text-green-800 border-green-200'
                      case 'quote': return 'bg-purple-100 text-purple-800 border-purple-200'
                      default: return 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  }

                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="p-2 bg-muted rounded-lg">
                        {getIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <Badge className={cn("text-xs", getBadgeColor(activity.type))}>
                            {activity.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Navigate to the appropriate page based on activity type
                          const routes: Record<string, string> = {
                            contact: '/admin/contacts',
                            partner: '/admin/partners', 
                            quote: '/admin/quotes'
                          }
                          const route = routes[activity.type] || '/admin'
                          window.location.href = route
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                  <p className="text-muted-foreground">Activity will appear here as users interact with your platform</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <a
                  key={index}
                  href={action.href}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all duration-200 group-hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", action.color)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </a>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
