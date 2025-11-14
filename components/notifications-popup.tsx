"use client"

import { useState, useEffect } from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  link: string | null
  created_at: string
}

export function NotificationsPopup() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [processingNotificationId, setProcessingNotificationId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadNotifications()

      // Subscribe to new notifications
      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadNotifications()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadNotifications = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Error loading notifications:", error)
      return
    }

    setNotifications(data || [])
    setUnreadCount(data?.filter((n) => !n.is_read).length || 0)
  }

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    if (error) {
      console.error("[v0] Error marking notification as read:", error)
      return
    }

    loadNotifications()
  }

  const markAllAsRead = async () => {
    if (!user) return

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      console.error("[v0] Error marking all as read:", error)
      return
    }

    loadNotifications()
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "friend_request") {
      return
    }
    
    if (notification.type === "course_request" || 
        notification.type === "course_request_approved" || 
        notification.type === "course_request_rejected") {
      markAsRead(notification.id)
      if (notification.link) {
        router.push(notification.link)
        setIsOpen(false)
      }
      return
    }
    
    markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
    }
  }

  const handleAcceptFriendRequest = async (notificationId: string, requesterId: string) => {
    setProcessingNotificationId(notificationId)
    try {
      const { data: connection, error: findError } = await supabase
        .from("connections")
        .select("*")
        .eq("requester_id", requesterId)
        .eq("recipient_id", user.id)
        .eq("status", "pending")
        .single()

      if (findError) throw findError

      const { error: updateError } = await supabase
        .from("connections")
        .update({ status: "accepted" })
        .eq("id", connection.id)

      if (updateError) throw updateError

      await supabase.from("notifications").delete().eq("id", notificationId)

      await supabase.from("notifications").insert({
        user_id: requesterId,
        title: "Connection Accepted",
        message: "Your connection request was accepted",
        type: "friend_request_accepted",
        link: `/profiles/${user.id}`,
        is_read: false,
      })

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("[v0] Error accepting friend request:", error)
    } finally {
      setProcessingNotificationId(null)
    }
  }

  const handleRejectFriendRequest = async (notificationId: string, requesterId: string) => {
    setProcessingNotificationId(notificationId)
    try {
      const { error } = await supabase
        .from("connections")
        .delete()
        .eq("requester_id", requesterId)
        .eq("recipient_id", user.id)
        .eq("status", "pending")

      if (error) throw error

      await supabase.from("notifications").delete().eq("id", notificationId)

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("[v0] Error rejecting friend request:", error)
    } finally {
      setProcessingNotificationId(null)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course_request":
        return "📚"
      case "course_request_approved":
        return "✅"
      case "course_request_rejected":
        return "❌"
      case "friend_request":
        return "👥"
      case "friend_request_accepted":
        return "🤝"
      default:
        return "🔔"
    }
  }

  if (!user) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-lg shadow-lg relative" variant="default">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end" side="top">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn("w-full p-4 transition-colors", !notification.is_read && "bg-muted/30")}
                  >
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full text-left hover:bg-muted/50 -m-4 p-4 rounded"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.is_read && (
                              <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.created_at)}</p>
                        </div>
                      </div>
                    </button>
                    {notification.type === "friend_request" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            const requesterId = notification.link?.split("/").pop()
                            if (requesterId) handleAcceptFriendRequest(notification.id, requesterId)
                          }}
                          disabled={processingNotificationId === notification.id}
                          className="flex-1"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const requesterId = notification.link?.split("/").pop()
                            if (requesterId) handleRejectFriendRequest(notification.id, requesterId)
                          }}
                          disabled={processingNotificationId === notification.id}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
