"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Menu, X, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: string
}

interface Course {
  title: string
  description: string
  lessons: Lesson[]
}

interface CourseSidebarProps {
  course: Course
  currentLessonId: string
  courseId: string
  completedLessons?: Set<string>
}

export function CourseSidebar({ course, currentLessonId, courseId, completedLessons = new Set() }: CourseSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-40 lg:hidden shadow-lg bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-80 border-r border-border bg-card flex-shrink-0 overflow-y-auto fixed lg:sticky top-[57px] h-[calc(100vh-57px)] z-30 transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6">
          <h2 className="text-lg font-bold mb-1">{course.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{course.lessons.length} lessons</p>

          <div className="space-y-1">
            {course.lessons.map((lesson, index) => {
              const isActive = lesson.id === currentLessonId
              const isCompleted = completedLessons.has(lesson.id)
              const isLocked = index > 0 && !completedLessons.has(course.lessons[index - 1].id)

              const content = (
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors",
                    !isLocked && "hover:bg-accent cursor-pointer",
                    isActive && "bg-accent",
                    isLocked && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">Lesson {index + 1}</div>
                    <div className={cn("text-sm font-medium mb-1", isActive && "text-primary")}>{lesson.title}</div>
                    <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                  </div>
                </div>
              )

              if (isLocked) {
                return <div key={lesson.id}>{content}</div>
              }

              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  onClick={() => setIsOpen(false)}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
