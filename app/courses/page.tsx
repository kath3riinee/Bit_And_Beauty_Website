import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Palette, Sparkles, Users, Award, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function CoursesPage() {
  const courses = [
    {
      id: "3d-design",
      title: "3D Design Fundamentals",
      description: "Master CLO3D and Blender for digital fashion design and virtual prototyping",
      icon: Code,
      lessons: 8,
      level: "Beginner",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      id: "ai-pattern-making",
      title: "AI for Pattern Making",
      description: "Use artificial intelligence to generate and optimize fashion patterns efficiently",
      icon: Sparkles,
      lessons: 10,
      level: "Intermediate",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      id: "digital-textile",
      title: "Digital Textile Design",
      description: "Create stunning digital prints and textile patterns using Adobe Creative Suite",
      icon: Palette,
      lessons: 12,
      level: "Beginner",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      id: "ecommerce",
      title: "E-commerce Essentials",
      description: "Build and manage your online fashion store with Shopify and modern web tools",
      icon: Code,
      lessons: 15,
      level: "Beginner",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      id: "sustainable-tech",
      title: "Sustainable Tech Solutions",
      description: "Implement eco-friendly technology and digital solutions in fashion production",
      icon: Award,
      lessons: 9,
      level: "Intermediate",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "social-media",
      title: "Social Media Marketing",
      description: "Grow your fashion brand using Instagram, TikTok, and digital marketing strategies",
      icon: Users,
      lessons: 11,
      level: "Beginner",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Page Header */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">All Courses</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Explore our comprehensive collection of technology courses designed specifically for fashion
              professionals. From 3D design to AI-powered tools, learn the skills that will transform your creative
              process.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {courses.map((course) => {
            const Icon = course.icon
            return (
              <Card key={course.id} className="hover:shadow-lg transition-all hover:border-primary/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${course.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">
                      {course.level}
                    </span>
                    <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full bg-transparent" variant="outline">
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
