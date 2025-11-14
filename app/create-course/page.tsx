"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Send, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Lesson {
  id: string
  title: string
  duration: string
  content: string
}

export default function CreateCoursePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [lessons, setLessons] = useState<Lesson[]>([{ id: "1", title: "", duration: "", content: "" }])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkApprovalStatus()
  }, [])

  const checkApprovalStatus = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("role, is_course_maker").eq("id", user.id).single()

    if (profile && (profile.role === "admin" || profile.role === "administrator" || profile.is_course_maker === true)) {
      setIsApproved(true)
      setCheckingAuth(false)
      return
    }

    // Otherwise check if user has an approved application
    const { data, error } = await supabase
      .from("course_maker_applications")
      .select("status")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single()

    if (error || !data) {
      setIsApproved(false)
    } else {
      setIsApproved(true)
    }

    setCheckingAuth(false)
  }

  const addLesson = () => {
    setLessons([...lessons, { id: Date.now().toString(), title: "", duration: "", content: "" }])
  }

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id))
  }

  const updateLesson = (id: string, field: keyof Lesson, value: string) => {
    setLessons(lessons.map((lesson) => (lesson.id === id ? { ...lesson, [field]: value } : lesson)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Please log in to create a course")
      setIsLoading(false)
      return
    }

    try {
      const { error: requestError } = await supabase
        .from("course_creation_requests")
        .insert({
          requester_id: user.id,
          course_title: formData.get("title") as string,
          course_description: formData.get("description") as string,
          course_category: formData.get("category") as string,
          status: "pending",
        })

      if (requestError) throw requestError

      toast({
        title: "Request submitted",
        description: "Your course creation request has been sent to administrators for review",
      })

      router.push("/creator")
    } catch (err: any) {
      setError(err.message || "Failed to submit course request")
      toast({
        title: "Error",
        description: err.message || "Failed to submit course request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    )
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Course Creator Access Required</CardTitle>
              <CardDescription>You need to be an approved course creator to access this page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Apply to become a course creator and share your expertise with our community.
              </p>
              <Button asChild className="w-full">
                <a href="/apply-instructor">Apply Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <section className="bg-muted py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Request Course Creation</h1>
          <p className="text-muted-foreground">Submit your course idea for administrator approval</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Approval Required</p>
                  <p className="text-sm text-blue-700">
                    Your course creation request will be reviewed by administrators. You'll receive a notification once it's been approved or if any changes are needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Tell us about the course you'd like to create</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g., Advanced 3D Fashion Design" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what students will learn, the course structure, and any prerequisites..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    placeholder="e.g., 3D Design, Pattern Making, Fashion Business" 
                    required 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Lessons</CardTitle>
                    <CardDescription>Add lessons with markdown content</CardDescription>
                  </div>
                  <Button type="button" onClick={addLesson} size="sm" variant="outline">
                    {/* Plus icon here */}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Lesson {index + 1}</CardTitle>
                        {lessons.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeLesson(lesson.id)}>
                            {/* Trash2 icon here */}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Lesson Title *</Label>
                          <Input
                            value={lesson.title}
                            onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                            placeholder="e.g., Introduction to CLO3D"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration *</Label>
                          <Input
                            value={lesson.duration}
                            onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)}
                            placeholder="e.g., 15 min"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Lesson Content (Markdown) *</Label>
                        {/* MarkdownEditor component here */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
