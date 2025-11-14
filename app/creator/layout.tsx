import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, LayoutDashboard, BookOpen, Settings, GraduationCap, Shield } from 'lucide-react'

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_course_maker, full_name")
    .eq("id", user.id)
    .single()

  const isCreator =
    profile?.role === "admin" ||
    profile?.role === "administrator" ||
    profile?.is_course_maker === true

  if (!isCreator) {
    redirect("/apply-instructor")
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "administrator"

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Creator Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/courses">View Site</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">Settings</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-57px)] hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/creator">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/creator/lessons">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Lessons
              </Button>
            </Link>
            <Link href="/creator/tutorial">
              <Button variant="ghost" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                MDX Tutorial
              </Button>
            </Link>
            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs font-semibold text-muted-foreground px-3">ADMIN</p>
                </div>
                <Link href="/creator/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
