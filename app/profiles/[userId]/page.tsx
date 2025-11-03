"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  MapPin,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  UserPlus,
  Mail,
  Calendar,
  BookOpen,
  Star,
} from "lucide-react"

// Mock profile data - in a real app, this would come from a database
const profilesData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Sarah Chen",
    title: "3D Fashion Designer",
    location: "New York, NY",
    avatar: "/woman-fashion-designer.png",
    bio: "Specializing in CLO3D and virtual fashion design. Passionate about sustainable digital prototyping and helping others learn the power of 3D design in fashion.",
    skills: ["CLO3D", "Blender", "3D Design", "Virtual Fashion", "Sustainable Design", "Digital Prototyping"],
    courses: 3,
    connections: 124,
    joined: "January 2024",
    completedCourses: [
      { title: "3D Design Fundamentals", progress: 100 },
      { title: "Digital Textile Design", progress: 100 },
      { title: "Sustainable Tech Solutions", progress: 75 },
    ],
    achievements: [
      { title: "Early Adopter", description: "Joined in the first month", icon: Star },
      { title: "Course Completer", description: "Completed 2 courses", icon: Award },
      { title: "Community Builder", description: "100+ connections", icon: Users },
    ],
  },
  "2": {
    id: 2,
    name: "Maya Rodriguez",
    title: "Pattern Maker & AI Enthusiast",
    location: "Los Angeles, CA",
    avatar: "/latina-fashion-professional.jpg",
    bio: "Using AI to revolutionize pattern making. 10+ years in fashion tech innovation.",
    skills: ["AI Tools", "Pattern Making", "CAD", "Innovation", "Machine Learning", "Fashion Tech"],
    courses: 5,
    connections: 89,
    joined: "December 2023",
    completedCourses: [
      { title: "AI for Pattern Making", progress: 100 },
      { title: "3D Design Fundamentals", progress: 100 },
      { title: "E-commerce Essentials", progress: 60 },
    ],
    achievements: [
      { title: "AI Pioneer", description: "Completed AI course", icon: Sparkles },
      { title: "Course Completer", description: "Completed 2 courses", icon: Award },
    ],
  },
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const profile = profilesData[params.userId] || profilesData["1"]
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

      // Check if conversation already exists
      const { data: existingParticipants } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)

      if (existingParticipants) {
        for (const participant of existingParticipants) {
          const { data: otherParticipant } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", participant.conversation_id)
            .eq("user_id", params.userId)
            .single()

          if (otherParticipant) {
            router.push("/chat")
            return
          }
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

      if (participantsError) throw participantsError

      router.push("/chat")
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    } finally {
      setIsCreatingConversation(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
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
            <Link href="/profiles" className="text-sm font-medium text-primary">
              Community
            </Link>
            <Link href="/settings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

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
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.title}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSendMessage}
                    disabled={isCreatingConversation}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isCreatingConversation ? "Starting chat..." : "Send Message"}
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{profile.courses}</div>
                        <div className="text-xs text-muted-foreground">Courses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{profile.connections}</div>
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
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Member Since</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{profile.joined}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Journey</CardTitle>
                  <CardDescription>Courses in progress and completed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.completedCourses.map((course: any) => (
                    <div key={course.title} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium">{course.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement: any) => {
                  const Icon = achievement.icon
                  return (
                    <Card key={achievement.title}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
