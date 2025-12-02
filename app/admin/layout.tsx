"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  MessageSquare, 
  Users, 
  FileText, 
  Menu, 
  X, 
  LogOut,
  Bell,
  Search,
  User,
  ChevronDown,
  Archive,
  UserCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { env } from "process"

// Format time as "X minutes/hours/days ago"
const formatTimeAgo = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true })
}

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Services", href: "/admin/services", icon: Settings },
    ]
  },
  {
    title: "Communication",
    items: [
      { name: "Contact Submissions", href: "/admin/contacts", icon: MessageSquare },
      { name: "Partner Enquiries", href: "/admin/partners", icon: Users },
      { name: "Quote Requests", href: "/admin/quotes", icon: FileText },
      { name: "Complaint", href: "/admin/complaint", icon: FileText },
    ]
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{type: string; id: string; title: string; description: string}>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  // Notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'order' | 'product' | 'alert' | 'system'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      // In a real app, you would fetch this from your API
      const mockNotifications = [
        {
          id: '1',
          type: 'order' as const,
          title: 'New Order Received',
          message: 'Order #12345 has been placed',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          read: false
        },
        {
          id: '2',
          type: 'product' as const,
          title: 'Low Stock Alert',
          message: 'MacBook Pro is running low on stock',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: false
        },
        {
          id: '3',
          type: 'system' as const,
          title: 'System Update',
          message: 'New system update available',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: true
        },
      ]
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Search functionality with debounce
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        // In a real app, you would make an API call here
        // const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        // const data = await response.json()
        
        // Mock search results
        setTimeout(() => {
          const mockResults = [
            { type: 'product', id: '1', title: 'iPhone 15 Pro', description: 'Latest iPhone model' },
            { type: 'order', id: '12345', title: 'Order #12345', description: 'Placed 5 minutes ago' },
            { type: 'customer', id: 'cust1', title: 'John Doe', description: 'john@example.com' },
          ].filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          
          setSearchResults(mockResults)
          setShowSearchResults(true)
          setIsSearching(false)
        }, 500)
      } catch (error) {
        console.error('Search error:', error)
        setIsSearching(false)
      }
    }

    const timerId = setTimeout(search, 300) // Debounce for 300ms
    return () => clearTimeout(timerId)
  }, [searchQuery])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real app, you would make an API call here to mark all as read
      // await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      
      toast({
        title: "Marked as read",
        description: "All notifications have been marked as read",
      })
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === "/admin/login") {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/verify", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        setIsAuthenticated(true)
        fetchNotifications() // Fetch notifications after successful authentication
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        })
        router.push("/admin/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8001F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Takes full sidebar width and height */}
          <div className="relative h-60 border-b">
            <Link href="/admin" className="flex items-center justify-center h-full w-full">
              <Image 
                src="/com.png" 
                alt="Fortune Info Solutions Logo" 
                className="object-contain p-4"
                fill
                priority
              />
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden absolute right-2 top-4 text-muted-foreground hover:bg-muted" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-foreground hover:text-foreground hover:bg-muted",
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-primary-foreground/20 text-primary-foreground" 
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t p-4">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 bg-gradient-to-r from-primary from-80% to-secondary to-100%">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-white">ADMIN DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-primary"
                      onClick={(e) => {
                        e.preventDefault()
                        markAllAsRead()
                      }}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                      onMouseEnter={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'order' ? 'bg-green-500' :
                        notification.type === 'product' ? 'bg-blue-500' :
                        notification.type === 'alert' ? 'bg-orange-500' : 'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/20">
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
<Link href="/admin/products" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Package className="h-4 w-4" />
                    Products
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/services" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Services
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/complaint" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Complaints
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/contacts" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    Contact Submissions
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/partners" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    Partner Enquiries
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
