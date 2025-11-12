"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft, BookOpen, Clock, Award, Play } from "lucide-react"

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
  "digital-textile": {
    title: "Digital Textile Design",
    description: "Create stunning digital fabric designs and patterns",
    lessons: [
      { id: "intro", title: "Introduction to Digital Textiles", duration: "12 min" },
      { id: "software-overview", title: "Software and Tools Overview", duration: "18 min" },
      { id: "pattern-basics", title: "Pattern Design Basics", duration: "25 min" },
      { id: "color-theory", title: "Color Theory for Textiles", duration: "22 min" },
      { id: "repeat-patterns", title: "Creating Repeat Patterns", duration: "30 min" },
      { id: "texture-mapping", title: "Texture Mapping", duration: "28 min" },
      { id: "print-ready", title: "Preparing Print-Ready Files", duration: "25 min" },
      { id: "final-project", title: "Final Project", duration: "40 min" },
    ],
  },
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const course = courseData[params.courseId as keyof typeof courseData] || courseData["3d-design"]

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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>{course.lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>~4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Certificate</span>
            </div>
          </div>
        </div>

        {/* Start Course Button */}
        <div className="mb-12">
          <Link href={`/courses/${params.courseId}/lessons/intro`}>
            <Button size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Start Course
            </Button>
          </Link>
        </div>

        {/* Course Curriculum */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/courses/${params.courseId}/lessons/${lesson.id}`}
                className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-balance">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
