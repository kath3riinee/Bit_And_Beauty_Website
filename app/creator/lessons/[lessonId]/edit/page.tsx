"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarkdownEditor } from "@/components/markdown-editor"
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from "next/link"
import { toast } from "sonner"

export default function EditLessonPage({ params }: { params: { lessonId: string } }) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [duration, setDuration] = useState("")
  const [mdxContent, setMdxContent] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [courseId, setCourseId] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingLesson, setLoadingLesson] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadLesson()
    loadCourses()
  }, [params.lessonId])

  const loadLesson = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("course_lessons")
      .select("*")
      .eq("id", params.lessonId)
      .single()

    if (error || !data) {
      toast.error("Lesson not found")
      router.push("/creator/lessons")
      return
    }

    setTitle(data.title || "")
    setSlug(data.slug || "")
    setDuration(data.duration || "")
    setMdxContent(data.content || "")
    setStatus(data.status || "draft")
    setCourseId(data.course_id || "")
    setLoadingLesson(false)
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("course_lessons")
        .update({
          title,
          slug,
          duration,
          content: mdxContent,
          status,
          course_id: courseId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.lessonId)

      if (error) throw error

      toast.success("Lesson updated successfully!")
      router.push("/creator/lessons")
    } catch (error: any) {
      console.error("[v0] Error updating lesson:", error)
      toast.error(error.message || "Failed to update lesson")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("course_lessons")
        .delete()
        .eq("id", params.lessonId)

      if (error) throw error

      toast.success("Lesson deleted successfully")
      router.push("/creator/lessons")
    } catch (error: any) {
      console.error("[v0] Error deleting lesson:", error)
      toast.error(error.message || "Failed to delete lesson")
      setIsDeleting(false)
    }
  }

  if (loadingLesson) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/creator/lessons">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Lesson"}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Lesson</h1>
        <p className="text-muted-foreground">Update your lesson content and settings</p>
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
                onChange={(e) => setTitle(e.target.value)}
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
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild className="bg-transparent">
            <Link href="/creator/lessons">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
