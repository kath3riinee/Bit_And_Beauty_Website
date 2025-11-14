"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Briefcase, Award, Users, Lock } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("[v0] Error checking auth:", error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProfiles(data || [])
      } catch (error) {
        console.error("[v0] Error fetching profiles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        {/* Blurred background content */}
        <div className="blur-sm pointer-events-none select-none">
          <section className="bg-muted py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Community Profiles</h1>
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-6">
                  Connect with fashion professionals who are mastering technology.
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="text" placeholder="Search..." className="pl-10 bg-card" disabled />
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">--</div>
                    <div className="text-sm text-muted-foreground">Loading</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Auth gate overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm">
          <Card className="max-w-md mx-4 shadow-2xl border-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Sign In Required</CardTitle>
              <CardDescription className="text-base">
                You must be logged in to view community profiles and connect with other members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <Link href="/signup">Create an Account</Link>
              </Button>
              <Button className="w-full" variant="outline" size="lg" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

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
              <div className="text-2xl font-bold text-primary mb-1">
                {profiles.reduce((sum, p) => sum + (p.connections_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl">
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading profiles...</p>
            </Card>
          ) : filteredProfiles.length === 0 ? (
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
                        <AvatarImage
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt={profile.display_name || profile.full_name}
                        />
                        <AvatarFallback>
                          {(profile.display_name || profile.full_name || "U")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">
                          {profile.display_name || profile.full_name || "User"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <Briefcase className="w-3 h-3" />
                          {profile.title || "Fashion Professional"}
                        </CardDescription>
                      </div>
                    </div>

                    {profile.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}

                    {profile.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{profile.bio}</p>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.skills.slice(0, 3).map((skill: string) => (
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
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{profile.courses_count || 0} courses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{profile.connections_count || 0} connections</span>
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
