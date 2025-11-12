"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MapPin,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  UserPlus,
  Mail,
  Calendar,
  Check,
  X,
  Clock,
  Settings,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending_sent" | "pending_received" | "connected">(
    "none",
  )
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [isProcessingConnection, setIsProcessingConnection] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    async function init() {
      await checkCurrentUser()
      await fetchProfile()
    }
    init()
  }, [params.userId])

  useEffect(() => {
    if (currentUser && profile && currentUser.id !== params.userId) {
      checkConnectionStatus()

      const channel = supabase
        .channel("connection_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "connections",
            filter: `or(and(requester_id.eq.${currentUser.id},recipient_id.eq.${params.userId}),and(requester_id.eq.${params.userId},recipient_id.eq.${currentUser.id}))`,
          },
          () => {
            checkConnectionStatus()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [currentUser, profile])

  const checkCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const checkConnectionStatus = async () => {
    if (!currentUser) return

    try {
      // Check if there's a connection between current user and profile user
      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .or(
          `and(requester_id.eq.${currentUser.id},recipient_id.eq.${params.userId}),and(requester_id.eq.${params.userId},recipient_id.eq.${currentUser.id})`,
        )
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("[v0] Error checking connection:", error)
        return
      }

      if (data) {
        setConnectionId(data.id)
        if (data.status === "accepted") {
          setConnectionStatus("connected")
        } else if (data.status === "pending") {
          // Check if current user sent or received the request
          if (data.requester_id === currentUser.id) {
            setConnectionStatus("pending_sent")
          } else {
            setConnectionStatus("pending_received")
          }
        }
      } else {
        setConnectionStatus("none")
      }
    } catch (error) {
      console.error("[v0] Error checking connection status:", error)
    }
  }

  const handleSendConnectionRequest = async () => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    setIsProcessingConnection(true)
    try {
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("display_name, full_name")
        .eq("id", currentUser.id)
        .single()

      // Create connection request
      const { data: connection, error: connectionError } = await supabase
        .from("connections")
        .insert({
          requester_id: currentUser.id,
          recipient_id: params.userId,
          status: "pending",
        })
        .select()
        .single()

      if (connectionError) throw connectionError

      const senderName = senderProfile?.display_name || senderProfile?.full_name || "Someone"

      // Create notification for recipient
      await supabase.from("notifications").insert({
        user_id: params.userId,
        title: "New Connection Request",
        message: `${senderName} wants to connect with you`,
        type: "friend_request",
        link: `/profiles/${currentUser.id}`,
        is_read: false,
      })

      toast({
        title: "Connection request sent",
        description: "Your request has been sent successfully",
      })

      checkConnectionStatus()
    } catch (error) {
      console.error("[v0] Error sending connection request:", error)
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      })
    } finally {
      setIsProcessingConnection(false)
    }
  }

  const handleAcceptConnection = async () => {
    if (!connectionId) return

    setIsProcessingConnection(true)
    try {
      const { error } = await supabase.from("connections").update({ status: "accepted" }).eq("id", connectionId)

      if (error) throw error

      // Create notification for requester
      await supabase.from("notifications").insert({
        user_id: profile.id,
        title: "Connection Accepted",
        message: `${currentUser.user_metadata?.full_name || "Someone"} accepted your connection request`,
        type: "friend_request_accepted",
        link: `/profiles/${currentUser.id}`,
        is_read: false,
      })

      toast({
        title: "Connection accepted",
        description: "You are now connected",
      })

      checkConnectionStatus()
    } catch (error) {
      console.error("[v0] Error accepting connection:", error)
      toast({
        title: "Error",
        description: "Failed to accept connection",
        variant: "destructive",
      })
    } finally {
      setIsProcessingConnection(false)
    }
  }

  const handleRejectConnection = async () => {
    if (!connectionId) return

    setIsProcessingConnection(true)
    try {
      const { error } = await supabase.from("connections").delete().eq("id", connectionId)

      if (error) throw error

      toast({
        title: "Connection rejected",
        description: "The connection request has been rejected",
      })

      checkConnectionStatus()
    } catch (error) {
      console.error("[v0] Error rejecting connection:", error)
      toast({
        title: "Error",
        description: "Failed to reject connection",
        variant: "destructive",
      })
    } finally {
      setIsProcessingConnection(false)
    }
  }

  const handleRemoveFriend = async () => {
    if (!connectionId) return

    setIsProcessingConnection(true)
    try {
      const { error } = await supabase.from("connections").delete().eq("id", connectionId)

      if (error) throw error

      toast({
        title: "Connection removed",
        description: "You are no longer connected with this user",
      })

      checkConnectionStatus()
    } catch (error) {
      console.error("[v0] Error removing connection:", error)
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      })
    } finally {
      setIsProcessingConnection(false)
    }
  }

  async function fetchProfile() {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", params.userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    setIsCreatingConversation(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Find all conversations where the current user is a participant
      const { data: userConversations } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)

      if (userConversations && userConversations.length > 0) {
        // Check if any of these conversations also include the target user
        const conversationIds = userConversations.map((p) => p.conversation_id)

        const { data: sharedConversation } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", params.userId)
          .in("conversation_id", conversationIds)
          .limit(1)
          .single()

        if (sharedConversation) {
          // Conversation already exists, redirect to chat
          router.push("/chat")
          return
        }
      }

      // Create new conversation
      const { data: conversation, error: convError } = await supabase.from("conversations").insert({}).select().single()

      if (convError) throw convError

      // Add both participants
      const { error: participantsError } = await supabase.from("conversation_participants").insert([
        { conversation_id: conversation.id, user_id: user.id },
        { conversation_id: conversation.id, user_id: params.userId },
      ])

      if (participantsError) {
        if (participantsError.message.includes("duplicate key")) {
          // Conversation was created by another request, just redirect
          router.push("/chat")
          return
        }
        throw participantsError
      }

      router.push("/chat")
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    } finally {
      setIsCreatingConversation(false)
    }
  }

  const renderConnectionButton = () => {
    if (!currentUser || currentUser.id === params.userId) {
      return null // Don't show connect button on own profile
    }

    if (connectionStatus === "connected") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-transparent">
              <Check className="w-4 h-4 mr-2" />
              Connected
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleRemoveFriend}
              disabled={isProcessingConnection}
              className="text-destructive cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Remove Friend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    if (connectionStatus === "pending_sent") {
      return (
        <Button variant="outline" className="bg-transparent" disabled>
          <Clock className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      )
    }

    if (connectionStatus === "pending_received") {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleAcceptConnection}
            disabled={isProcessingConnection}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button variant="outline" onClick={handleRejectConnection} disabled={isProcessingConnection}>
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )
    }

    return (
      <Button
        variant="outline"
        className="bg-transparent"
        onClick={handleSendConnectionRequest}
        disabled={isProcessingConnection}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Connect
      </Button>
    )
  }

  const renderMessageButton = () => {
    if (!currentUser) {
      return (
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/login")}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      )
    }

    if (currentUser.id === params.userId) {
      return (
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      )
    }

    return (
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={handleSendMessage}
        disabled={isCreatingConversation}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isCreatingConversation ? "Starting chat..." : "Send Message"}
      </Button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Profile not found</p>
          <Button asChild>
            <Link href="/profiles">Back to Community</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Profile Header */}
      <section className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/profiles"
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center"
            >
              ← Back to Community
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.display_name || profile.full_name}
                />
                <AvatarFallback className="text-2xl">
                  {(profile.display_name || profile.full_name || "U")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile.display_name || profile.full_name || "User"}</h1>
                {profile.title && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.title}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.bio && <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>}

                <div className="flex flex-wrap gap-3">
                  {renderMessageButton()}
                  {renderConnectionButton()}
                  {profile.email && currentUser?.id !== params.userId && (
                    <Button variant="outline" className="bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{profile.courses_count || 0}</div>
                        <div className="text-xs text-muted-foreground">Courses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{profile.connections_count || 0}</div>
                        <div className="text-xs text-muted-foreground">Connections</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Member Since</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
