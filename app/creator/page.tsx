import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Users, TrendingUp, Shield } from 'lucide-react'
import Link from "next/link"

export default async function CreatorDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.role === "administrator" || profile?.role === "admin"

  // Get creator's lessons count
  const { count: lessonsCount } = await supabase
    .from("course_lessons")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)

  // Get creator's courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, enrollments_count")
    .eq("author_id", user.id)

  const totalEnrollments = courses?.reduce((sum, course) => sum + (course.enrollments_count || 0), 0) || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Manage your lessons and track your impact</p>
      </div>

      {isAdmin && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Administrator Resources
            </CardTitle>
            <CardDescription>Tools and guides for managing the platform</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link href="/creator/admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <a href="/SUPABASE_ROLE_MANAGEMENT.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Role Management Guide
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Published and draft</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Students learning from you</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with creating content</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/creator/lessons/new">
              <BookOpen className="w-4 h-4 mr-2" />
              Create New Lesson
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/creator/lessons">
              <FileText className="w-4 h-4 mr-2" />
              View All Lessons
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/create-course">
              <TrendingUp className="w-4 h-4 mr-2" />
              Create New Course
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/creator/tutorial">
              <BookOpen className="w-4 h-4 mr-2" />
              View MDX Tutorial
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Courses */}
      {courses && courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Recent courses you've created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.enrollments_count || 0} enrollments</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
