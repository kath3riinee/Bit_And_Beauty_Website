"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true
      router.replace(`/courses/${params.courseId}/lessons/intro`)
    }
  }, [params.courseId])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    </div>
  )
}
