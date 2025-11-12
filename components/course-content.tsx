"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Code2, Play, CheckCircle2, ChevronRight, Trophy } from "lucide-react"

interface Lesson {
  id: string
  title: string
  duration: string
}

interface CourseContentProps {
  lesson: Lesson
  courseId: string
  onComplete?: () => void
  isCompleted?: boolean
  isCompleting?: boolean
  hasNextLesson?: boolean
  isLastLesson?: boolean
}

export function CourseContent({
  lesson,
  courseId,
  onComplete,
  isCompleted = false,
  isCompleting = false,
  hasNextLesson = true,
  isLastLesson = false,
}: CourseContentProps) {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
        <p className="text-muted-foreground leading-relaxed">
          Welcome to this lesson! In this section, you'll learn the fundamental concepts and practical skills needed to
          master this topic. We'll cover everything from basic principles to advanced techniques.
        </p>
      </div>

      {/* Video Placeholder */}
      <Card className="bg-muted border-2 border-dashed border-border">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Video content would appear here</p>
          </div>
        </div>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Understanding the core concepts and terminology</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Practical techniques you can apply immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Industry best practices and common pitfalls to avoid</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Real-world examples from successful fashion brands</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Key Concepts</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              This lesson introduces you to the fundamental principles that form the foundation of this topic.
              Understanding these concepts is crucial for your success in applying these techniques to your own fashion
              projects.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We'll explore practical examples and walk through step-by-step processes that you can follow along with.
              By the end of this lesson, you'll have a solid understanding of how to implement these techniques in your
              own work.
            </p>
          </div>
        </section>

        {/* Try It Yourself Section */}
        <Card className="bg-accent/50 border-primary/20">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Try It Yourself</h4>
                <p className="text-sm text-muted-foreground">
                  Practice what you've learned with this hands-on exercise
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-muted-foreground">// Example code or exercise would go here</div>
              <div className="text-foreground">function createPattern() {"{"}</div>
              <div className="text-foreground ml-4">// Your code here</div>
              <div className="text-foreground">{"}"}</div>
            </div>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Run Example
            </Button>
          </div>
        </Card>

        {/* Tip Section */}
        <Card className="bg-secondary/50 border-secondary">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pro Tip</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When working with these techniques, always start with simple examples and gradually increase
                  complexity. This approach helps you build confidence and understand how different elements work
                  together.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {onComplete && (
          <div className="pt-4">
            {isCompleted ? (
              <Card className="bg-primary/10 border-primary/20">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">Lesson Completed</h4>
                      <p className="text-sm text-muted-foreground">Great job! You've finished this lesson.</p>
                    </div>
                  </div>
                  {hasNextLesson && (
                    <Button onClick={onComplete} disabled={isCompleting}>
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Button onClick={onComplete} disabled={isCompleting} size="lg" className="w-full">
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Completing...
                  </>
                ) : isLastLesson ? (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Complete and Finish Course
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete & Continue
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Additional Resources */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-primary hover:underline text-sm">
                → Official Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline text-sm">
                → Community Forum Discussion
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline text-sm">
                → Download Practice Files
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
