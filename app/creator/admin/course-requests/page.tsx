import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CourseRequestManager from "@/components/course-request-manager"

export default async function CourseRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin" && profile?.role !== "administrator") {
    redirect("/creator")
  }

  const { data: requests } = await supabase
    .from("course_creation_requests")
    .select(`
      *,
      requester:profiles!requester_id(full_name, email, avatar_url),
      reviewer:profiles!reviewer_id(full_name)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Course Creation Requests</CardTitle>
          <CardDescription>
            Review and approve course creation requests from creators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseRequestManager requests={requests || []} />
        </CardContent>
      </Card>
    </div>
  )
}
