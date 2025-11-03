import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft, ChevronRight, BookOpen, Clock, Award } from "lucide-react"
import { CourseSidebar } from "@/components/course-sidebar"
import { CourseContent } from "@/components/course-content"

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

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const course = courseData[params.courseId as keyof typeof courseData] || courseData["3d-design"]
  const currentLessonIndex = 0 // In a real app, this would be tracked
  const currentLesson = course.lessons[currentLessonIndex]

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
        <CourseSidebar course={course} currentLessonId={currentLesson.id} courseId={params.courseId} />

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
            <CourseContent lesson={currentLesson} courseId={params.courseId} />
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-border bg-card px-6 py-4 sticky bottom-0">
            <div className="max-w-4xl flex items-center justify-between">
              <Button variant="outline" disabled={currentLessonIndex === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {course.lessons.length}
              </span>
              <Button disabled={currentLessonIndex === course.lessons.length - 1}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
