"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Sparkles, CheckCircle2 } from "lucide-react"

export default function ApplyInstructorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Please log in to apply")
      setIsLoading(false)
      router.push("/login")
      return
    }

    try {
      const { error: insertError } = await supabase.from("course_maker_applications").insert({
        user_id: user.id,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        expertise: formData.get("expertise") as string,
        experience: formData.get("experience") as string,
        sample_content: formData.get("courseIdea") as string,
      })

      if (insertError) throw insertError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>We'll review your application and get back to you soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Our team typically reviews applications within 3-5 business days. You'll receive an email once we've
                made a decision.
              </p>
              <Button asChild className="w-full">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Become a Course Creator</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Share your expertise with women in fashion technology. Help shape the future of the industry by creating
              courses that empower and educate.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>Tell us about your expertise and what you'd like to teach</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" placeholder="Jane Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Area of Expertise *</Label>
                  <Input
                    id="expertise"
                    name="expertise"
                    placeholder="e.g., 3D Design, AI Pattern Making, Digital Marketing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Professional Experience *</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Tell us about your background in fashion technology..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include years of experience, notable projects, and relevant achievements
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseIdea">Course Idea *</Label>
                  <Textarea
                    id="courseIdea"
                    name="courseIdea"
                    placeholder="Describe the course you'd like to create..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    What will students learn? What makes your course unique?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio/Website URL</Label>
                  <Input id="portfolio" name="portfolio" type="url" placeholder="https://yourportfolio.com" />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
