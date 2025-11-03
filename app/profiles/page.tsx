"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Search, MapPin, Briefcase, Award, Users } from "lucide-react"

const profiles = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "3D Fashion Designer",
    location: "New York, NY",
    avatar: "/woman-fashion-designer.png",
    bio: "Specializing in CLO3D and virtual fashion design. Passionate about sustainable digital prototyping.",
    skills: ["CLO3D", "Blender", "3D Design", "Virtual Fashion"],
    courses: 3,
    connections: 124,
  },
  {
    id: 2,
    name: "Maya Rodriguez",
    title: "Pattern Maker & AI Enthusiast",
    location: "Los Angeles, CA",
    avatar: "/latina-fashion-professional.jpg",
    bio: "Using AI to revolutionize pattern making. 10+ years in fashion tech innovation.",
    skills: ["AI Tools", "Pattern Making", "CAD", "Innovation"],
    courses: 5,
    connections: 89,
  },
  {
    id: 3,
    name: "Aisha Patel",
    title: "Digital Textile Artist",
    location: "London, UK",
    avatar: "/indian-woman-artist.png",
    bio: "Creating stunning digital prints and textile designs. Adobe Creative Suite expert.",
    skills: ["Textile Design", "Adobe Suite", "Digital Art", "Print Design"],
    courses: 4,
    connections: 156,
  },
  {
    id: 4,
    name: "Emma Thompson",
    title: "E-commerce Strategist",
    location: "Toronto, Canada",
    avatar: "/business-professional-woman.png",
    bio: "Helping fashion brands build successful online stores. Shopify and web development specialist.",
    skills: ["E-commerce", "Shopify", "Marketing", "Web Development"],
    courses: 6,
    connections: 203,
  },
  {
    id: 5,
    name: "Zara Williams",
    title: "Sustainable Fashion Tech Lead",
    location: "Berlin, Germany",
    avatar: "/black-woman-tech-professional.jpg",
    bio: "Implementing eco-friendly technology solutions in fashion production and supply chain.",
    skills: ["Sustainability", "Tech Innovation", "Supply Chain", "Green Tech"],
    courses: 4,
    connections: 178,
  },
  {
    id: 6,
    name: "Lily Zhang",
    title: "Social Media & Brand Strategist",
    location: "Singapore",
    avatar: "/asian-woman-marketing-professional.jpg",
    bio: "Growing fashion brands through strategic social media marketing and content creation.",
    skills: ["Social Media", "Marketing", "Content Strategy", "Brand Building"],
    courses: 5,
    connections: 267,
  },
]

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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

      {/* Page Header */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Community Profiles</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-6">
              Connect with fashion professionals who are mastering technology. Find mentors, collaborators, and friends
              who share your passion for innovation.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, title, or skills..."
                className="pl-10 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{profiles.length}</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">1.2K</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl">
          {filteredProfiles.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No profiles found matching your search.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-all hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                        <AvatarFallback>
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">{profile.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <Briefcase className="w-3 h-3" />
                          {profile.title}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{profile.courses} courses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{profile.connections} connections</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href={`/profiles/${profile.id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}




