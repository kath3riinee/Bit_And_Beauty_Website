"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sparkles, Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, LogOut, User, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

type Conversation = {
  id: string
  updated_at: string
  other_participant: Profile
  last_message: string | null
  unread_count: number
}

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
  sender: Profile
  attachment_url?: string | null
  attachment_type?: string | null
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadUser()
    loadConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation) return

    loadMessages(selectedConversation.id)

    const supabase = createClient()
    const channel = supabase
      .channel(`conversation:${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          loadMessages(selectedConversation.id)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)
  }

  const loadConversations = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: participantData } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)

      if (!participantData) return

      const conversationIds = participantData.map((p) => p.conversation_id)

      const conversationsWithDetails = await Promise.all(
        conversationIds.map(async (convId) => {
          const { data: participants } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", convId)
            .neq("user_id", user.id)
            .single()

          if (!participants) return null

          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", participants.user_id)
            .single()

          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          const { data: conv } = await supabase.from("conversations").select("id, updated_at").eq("id", convId).single()

          return {
            id: convId,
            updated_at: conv?.updated_at || new Date().toISOString(),
            other_participant: profile || { id: "", full_name: "Unknown", avatar_url: null },
            last_message: lastMsg?.content || null,
            unread_count: 0,
          }
        }),
      )

      const validConversations = conversationsWithDetails.filter((c) => c !== null) as Conversation[]
      setConversations(validConversations)

      if (validConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(validConversations[0])
      }
    } catch (error) {
      console.error("[v0] Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      console.log("[v0] Loading messages for conversation:", conversationId)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          sender_id,
          created_at,
          attachment_url,
          attachment_type,
          sender:profiles(id, full_name, avatar_url)
        `,
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("[v0] Error loading messages:", error)
        return
      }

      console.log("[v0] Loaded messages:", data)
      if (data) {
        setMessages(data as any)
      }
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedConversation || !currentUser) return

    console.log("[v0] Sending message:", {
      conversation_id: selectedConversation.id,
      sender_id: currentUser.id,
      content: messageInput.trim(),
    })

    try {
      const supabase = createClient()

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", currentUser.id)
        .single()

      if (profileError || !profile) {
        console.error("[v0] Profile not found for user:", currentUser.id, profileError)
        alert("Your profile is not set up. Please complete your profile first.")
        return
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          content: messageInput.trim(),
        })
        .select()

      if (error) {
        console.error("[v0] Error sending message:", error)
        alert(`Failed to send message: ${error.message}`)
        throw error
      }

      console.log("[v0] Message sent successfully:", data)
      setMessageInput("")

      await loadMessages(selectedConversation.id)
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedConversation || !currentUser) return

    // Validate file type (images and videos only)
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const supabase = createClient()

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-attachments").getPublicUrl(fileName)

      // Send message with attachment
      const attachmentType = file.type.startsWith("image/") ? "image" : "video"

      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: selectedConversation.id,
        sender_id: currentUser.id,
        content: attachmentType === "image" ? "📷 Image" : "🎥 Video",
        attachment_url: publicUrl,
        attachment_type: attachmentType,
      })

      if (messageError) throw messageError

      await loadMessages(selectedConversation.id)

      toast({
        title: "File sent",
        description: "Your file has been sent successfully",
      })
    } catch (error) {
      console.error("[v0] Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for reporting. We'll review this conversation.",
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">FashionTech Academy</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No conversations yet</h2>
            <p className="text-muted-foreground mb-4">Start connecting with other members!</p>
            <Button asChild>
              <Link href="/profiles">Browse Profiles</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FashionTech Academy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/profiles" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Community
            </Link>
            <Link href="/settings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Settings
            </Link>
          </nav>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-3 rounded-lg hover:bg-accent transition-colors text-left mb-1 ${
                    selectedConversation?.id === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={conv.other_participant.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conv.other_participant.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">
                          {conv.other_participant.full_name || "Unknown User"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.last_message || "No messages yet"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {selectedConversation && (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.other_participant.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedConversation.other_participant.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/profiles/${selectedConversation.other_participant.id}`}
                    className="font-semibold hover:text-primary transition-colors cursor-pointer"
                  >
                    {selectedConversation.other_participant.full_name || "Unknown User"}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profiles/${selectedConversation.other_participant.id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReport} className="flex items-center cursor-pointer">
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => {
                  const isOwn = message.sender_id === currentUser?.id
                  return (
                    <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                        {!isOwn && (
                          <Link href={`/profiles/${message.sender_id}`} className="flex-shrink-0">
                            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                              <AvatarImage src={message.sender.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>
                                {message.sender.full_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "?"}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        )}
                        <div>
                          <Card className={`p-3 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {message.attachment_url && message.attachment_type === "image" && (
                              <img
                                src={message.attachment_url || "/placeholder.svg"}
                                alt="Shared image"
                                className="rounded-lg max-w-full h-auto mb-2 max-h-96 object-cover"
                              />
                            )}
                            {message.attachment_url && message.attachment_type === "video" && (
                              <video
                                src={message.attachment_url}
                                controls
                                className="rounded-lg max-w-full h-auto mb-2 max-h-96"
                              />
                            )}
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </Card>
                          <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button type="submit" size="icon" className="flex-shrink-0 bg-primary text-primary-foreground">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
