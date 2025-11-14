import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from "next/link"

export default async function CreatorLessonsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all lessons created by this user with course info
  const { data: lessons } = await supabase
    .from("course_lessons")
    .select(`
      id,
      title,
      slug,
      status,
      duration,
      created_at,
      updated_at,
      course_id,
      courses (
        id,
        title
      )
    `)
    .eq("created_by", user.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Lessons</h1>
          <p className="text-muted-foreground">Create and edit MDX lessons for your courses</p>
        </div>
        <Button asChild>
          <Link href="/creator/lessons/new">
            <Plus className="w-4 h-4 mr-2" />
            New Lesson
          </Link>
        </Button>
      </div>

      {!lessons || lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any lessons yet</p>
            <Button asChild>
              <Link href="/creator/lessons/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lesson
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson: any) => (
            <Card key={lesson.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{lesson.title}</CardTitle>
                      <Badge variant={lesson.status === "published" ? "default" : "secondary"}>
                        {lesson.status || "draft"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {lesson.courses?.title || "No course assigned"} • {lesson.duration || "No duration"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/creator/lessons/${lesson.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last updated: {new Date(lesson.updated_at).toLocaleDateString()}</span>
                  {lesson.slug && <span className="font-mono text-xs">/{lesson.slug}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
