"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarkdownEditor } from "@/components/markdown-editor"
import { Save, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { toast } from "sonner"

export default function NewLessonPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [duration, setDuration] = useState("")
  const [mdxContent, setMdxContent] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [courseId, setCourseId] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("courses")
      .select("id, title")
      .eq("author_id", user.id)
      .order("title")

    setCourses(data || [])
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please log in to create lessons")
      setIsLoading(false)
      return
    }

    console.log("[v0] Current user ID:", user.id)
    
    // Check user's profile and role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, is_course_maker, full_name")
      .eq("id", user.id)
      .single()
    
    console.log("[v0] User profile:", profile)
    console.log("[v0] Profile error:", profileError)
    
    if (!profile) {
      toast.error("Profile not found. Please contact support.")
      setIsLoading(false)
      return
    }

    if (!["admin", "instructor", "course_maker"].includes(profile.role || "") && !profile.is_course_maker) {
      toast.error("You don't have permission to create lessons. Your role: " + profile.role)
      setIsLoading(false)
      return
    }

    try {
      const lessonData = {
        title,
        slug: slug || generateSlug(title),
        duration,
        content: mdxContent,
        status,
        course_id: courseId || null,
        created_by: user.id,
        order_index: 0,
      }
      
      console.log("[v0] Attempting to insert lesson:", lessonData)

      const { data, error } = await supabase
        .from("course_lessons")
        .insert(lessonData)
        .select()
        .single()

      if (error) {
        console.log("[v0] Insert error details:", error)
        throw error
      }

      console.log("[v0] Lesson created successfully:", data)
      toast.success("Lesson created successfully!")
      router.push("/creator/lessons")
    } catch (error: any) {
      console.error("[v0] Error creating lesson:", error)
      toast.error(error.message || "Failed to create lesson")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/creator/lessons">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Lesson</h1>
        <p className="text-muted-foreground">Write your lesson content using MDX</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>Basic information about your lesson</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Introduction to 3D Modeling"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="introduction-to-3d-modeling"
                required
              />
              <p className="text-xs text-muted-foreground">Auto-generated from title, but you can customize it</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 15 min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course (Optional)</Label>
                <select
                  id="course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No course assigned</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
            <CardDescription>Write your lesson using Markdown and MDX syntax</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownEditor value={mdxContent} onChange={setMdxContent} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading || !title}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Creating..." : "Create Lesson"}
          </Button>
          <Button type="button" variant="outline" asChild className="bg-transparent">
            <Link href="/creator/lessons">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
