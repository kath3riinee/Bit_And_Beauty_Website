"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft, ChevronRight, BookOpen, Clock, Award, Lock } from "lucide-react"
import { CourseSidebar } from "@/components/course-sidebar"
import { CourseContent } from "@/components/course-content"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { CourseCompletionModal } from "@/components/course-completion-modal"

// Mock course data - in a real app, this would come from a database
const courseData = {
  "3d-design": {
    title: "3D Design Fundamentals",
    description: "Master CLO3D and Blender for digital fashion design",
    lessons: [
      { id: "intro", title: "Introduction to 3D Fashion Design", duration: "10 min" },
      { id: "clo3d-basics", title: "CLO3D Basics", duration: "25 min" },
      { id: "avatar-setup", title: "Setting Up Your Avatar", duration: "20 min" },
      { id: "pattern-creation", title: "Creating Basic Patterns", duration: "30 min" },
      { id: "fabric-simulation", title: "Fabric Simulation", duration: "25 min" },
      { id: "blender-intro", title: "Introduction to Blender", duration: "20 min" },
      { id: "rendering", title: "Rendering Your Designs", duration: "30 min" },
      { id: "final-project", title: "Final Project", duration: "45 min" },
    ],
  },
  "ai-pattern-making": {
    title: "AI for Pattern Making",
    description: "Use AI to generate and optimize fashion patterns",
    lessons: [
      { id: "intro", title: "Introduction to AI in Fashion", duration: "15 min" },
      { id: "ai-tools", title: "AI Pattern Making Tools", duration: "20 min" },
      { id: "pattern-generation", title: "Generating Patterns with AI", duration: "30 min" },
      { id: "optimization", title: "Pattern Optimization", duration: "25 min" },
      { id: "customization", title: "Customizing AI Outputs", duration: "30 min" },
      { id: "integration", title: "Integrating with CAD Software", duration: "25 min" },
      { id: "best-practices", title: "Best Practices", duration: "20 min" },
      { id: "case-studies", title: "Industry Case Studies", duration: "30 min" },
      { id: "future-trends", title: "Future of AI in Fashion", duration: "20 min" },
      { id: "final-project", title: "Final Project", duration: "45 min" },
    ],
  },
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const course = courseData[params.courseId as keyof typeof courseData] || courseData["3d-design"]
  const currentLessonIndex = course.lessons.findIndex((l) => l.id === params.lessonId)
  const currentLesson = course.lessons[currentLessonIndex]
  const nextLesson = course.lessons[currentLessonIndex + 1]
  const prevLesson = course.lessons[currentLessonIndex - 1]

  const isLastLesson = currentLessonIndex === course.lessons.length - 1

  // Check if current lesson is locked
  const isLocked = currentLessonIndex > 0 && !completedLessons.has(prevLesson?.id)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (!mounted) return

        console.log("[v0] Auth check - User:", user?.email || "Not logged in", "Error:", error?.message || "None")

        setIsAuthenticated(!!user)
        setCurrentUserId(user?.id || null)

        if (user) {
          // Load lesson progress
          const { data: progress, error: progressError } = await supabase
            .from("lesson_progress")
            .select("lesson_id")
            .eq("user_id", user.id)
            .eq("course_id", params.courseId)
            .eq("completed", true)

          console.log("[v0] Progress loaded:", progress?.length || 0, "lessons completed")

          if (progress && mounted) {
            setCompletedLessons(new Set(progress.map((p) => p.lesson_id)))
          }
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        if (mounted) {
          setIsAuthenticated(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [params.courseId])

  useEffect(() => {
    if (isAuthenticated === false) {
      console.log("[v0] Not authenticated - redirecting to login")
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleCompleteLesson = async () => {
    if (!currentUserId || isCompleting) {
      console.log("[v0] Cannot complete - userId:", currentUserId, "isCompleting:", isCompleting)
      return
    }

    setIsCompleting(true)
    const supabase = createClient()

    try {
      console.log("[v0] Marking lesson complete:", params.lessonId)

      // Mark lesson as complete
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          user_id: currentUserId,
          course_id: params.courseId,
          lesson_id: params.lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,course_id,lesson_id",
        },
      )

      if (error) throw error

      // Update local state
      setCompletedLessons((prev) => new Set([...prev, params.lessonId]))

      if (isLastLesson) {
        console.log("[v0] Last lesson completed - showing celebration")

        // Increment courses_count in profiles table
        const { error: profileError } = await supabase.rpc("increment_courses_count", {
          user_id: currentUserId,
        })

        if (profileError) {
          console.error("[v0] Error incrementing courses_count:", profileError)
        }

        // Create course completion notification
        await supabase.from("notifications").insert({
          user_id: currentUserId,
          title: "Course Completed! 🎉",
          message: `Congratulations! You've completed ${course.title}`,
          type: "achievement",
          link: `/courses/${params.courseId}`,
          is_read: false,
        })

        setShowCelebration(true)
      } else {
        toast.success("Lesson completed!")

        // Navigate to next lesson if available
        if (nextLesson) {
          console.log("[v0] Navigating to next lesson:", nextLesson.id)
          router.replace(`/courses/${params.courseId}/lessons/${nextLesson.id}`)
        }
      }
    } catch (error) {
      console.error("[v0] Error completing lesson:", error)
      toast.error("Failed to complete lesson")
    } finally {
      setIsCompleting(false)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Lesson not found</p>
          <Link href={`/courses/${params.courseId}`}>
            <Button className="mt-4">Back to Course</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:inline">FashionTech Academy</span>
            </Link>
            <Link href={`/courses/${params.courseId}`}>
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Course
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Lesson Locked</h2>
            <p className="text-muted-foreground mb-6">Complete the previous lesson to unlock this one.</p>
            <Link href={`/courses/${params.courseId}/lessons/${prevLesson.id}`}>
              <Button>Go to Previous Lesson</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isCurrentLessonCompleted = completedLessons.has(params.lessonId)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:inline">FashionTech Academy</span>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Courses
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <CourseSidebar
          course={course}
          currentLessonId={currentLesson.id}
          courseId={params.courseId}
          completedLessons={completedLessons}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Course Header */}
          <div className="bg-muted border-b border-border px-6 py-6">
            <div className="max-w-4xl">
              <Link
                href="/courses"
                className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Courses
              </Link>
              <h1 className="text-3xl font-bold mb-2 text-balance">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>~4 hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="px-6 py-8">
            <CourseContent
              lesson={currentLesson}
              courseId={params.courseId}
              onComplete={handleCompleteLesson}
              isCompleted={isCurrentLessonCompleted}
              isCompleting={isCompleting}
              hasNextLesson={!!nextLesson}
              isLastLesson={isLastLesson}
            />
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-border bg-card px-6 py-4 sticky bottom-0">
            <div className="max-w-4xl flex items-center justify-between">
              <Link href={prevLesson ? `/courses/${params.courseId}/lessons/${prevLesson.id}` : "#"}>
                <Button variant="outline" disabled={!prevLesson}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {course.lessons.length}
              </span>
              <Link href={nextLesson ? `/courses/${params.courseId}/lessons/${nextLesson.id}` : "#"}>
                <Button disabled={!nextLesson || !isCurrentLessonCompleted}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <CourseCompletionModal
        isOpen={showCelebration}
        courseTitle={course.title}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  )
}
