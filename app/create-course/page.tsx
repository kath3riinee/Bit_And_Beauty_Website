"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { MarkdownEditor } from "@/components/markdown-editor"
import { Plus, Trash2, Save, Eye } from "lucide-react"

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

  useEffect(() => {
    checkApprovalStatus()
  }, [])

  const checkApprovalStatus = async () => {
    
    const {
      data: { user },
    } = await ()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await prisma.from("profiles").select("role").eq("id", user.id).single()

    // If user is instructor or admin, they're approved
    if (profile && (profile.role === "instructor" || profile.role === "admin")) {
      setIsApproved(true)
      setCheckingAuth(false)
      return
    }

    // Otherwise check if user has an approved application
    const { data, error } = await prisma
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
    
    const {
      data: { user },
    } = await ()

    if (!user) {
      setError("Please log in to create a course")
      setIsLoading(false)
      return
    }

    try {
      // Insert course
      const { data: course, error: courseError } = await prisma
        .from("courses")
        .insert({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          instructor_id: user.id,
          level: formData.get("level") as string,
          category: formData.get("category") as string,
          published: false,
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Insert lessons
      const lessonsToInsert = lessons.map((lesson, index) => ({
        course_id: course.id,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        order_index: index,
      }))

      const { error: lessonsError } = await prisma.from("course_lessons").insert(lessonsToInsert)

      if (lessonsError) throw lessonsError

      router.push("/courses")
    } catch (err: any) {
      setError(err.message || "Failed to create course")
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
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground">Design your course with markdown-powered lessons</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Basic information about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input id="title" name="title" placeholder="e.g., Advanced 3D Fashion Design" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What will students learn in this course?"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <select
                    id="level"
                    name="level"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" name="category" placeholder="e.g., 3D Design" required />
                </div>
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
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
                          <Trash2 className="w-4 h-4" />
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
                      <MarkdownEditor
                        value={lesson.content}
                        onChange={(value) => updateLesson(lesson.id, "content", value)}
                      />
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

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}




