import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Code,
  Palette,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  TestTube,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Free Technology Courses for Fashion Innovators</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Bits &amp; Beauty
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              Learn cutting-edge digital tools, 3D design, AI-powered pattern making, and sustainable tech solutions.
              Empower your creative vision with skills that transform fashion.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/courses">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Courses
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-accent" asChild>
                <Link href="/profiles">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Self-Paced Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Expert Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TestTube className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Try the Platform</CardTitle>
                <CardDescription>Test messaging and features with demo accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Demo Accounts
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get pre-configured demo credentials to test all features
                </p>
                <Button asChild className="w-full">
                  <Link href="/demo">
                    Get Demo Access
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Quick Login
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Already have demo accounts? Login to test features</p>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/login">
                    Go to Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-1">12+</div>
              <div className="text-sm text-primary-foreground/80 font-medium">Free Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-1">500+</div>
              <div className="text-sm text-primary-foreground/80 font-medium">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-1">50+</div>
              <div className="text-sm text-primary-foreground/80 font-medium">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-1">100%</div>
              <div className="text-sm text-primary-foreground/80 font-medium">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Start Your Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty leading-relaxed">
            Explore our most popular technology courses designed specifically for fashion professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Code className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">3D Design Fundamentals</CardTitle>
              <CardDescription className="leading-relaxed">
                Master CLO3D and Blender for digital fashion design and virtual prototyping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">8 lessons • 4 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/3d-design">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">AI for Pattern Making</CardTitle>
              <CardDescription className="leading-relaxed">
                Use artificial intelligence to generate and optimize fashion patterns efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">10 lessons • 5 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/ai-patterns">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Palette className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Digital Textile Design</CardTitle>
              <CardDescription className="leading-relaxed">
                Create stunning digital prints and textile patterns using Adobe Creative Suite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">12 lessons • 6 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/textile-design">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Code className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">E-commerce Essentials</CardTitle>
              <CardDescription className="leading-relaxed">
                Build and manage your online fashion store with Shopify and modern web tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">15 lessons • 7 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/ecommerce">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Award className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Sustainable Tech Solutions</CardTitle>
              <CardDescription className="leading-relaxed">
                Implement eco-friendly technology and digital solutions in fashion production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">9 lessons • 4.5 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/sustainable-tech">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Social Media Marketing</CardTitle>
              <CardDescription className="leading-relaxed">
                Grow your fashion brand using Instagram, TikTok, and digital marketing strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">11 lessons • 5.5 hours</span>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/courses/social-media">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="shadow-sm hover:shadow-md transition-all bg-transparent"
            asChild
          >
            <Link href="/courses">
              View All Courses <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 md:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Transform Your Fashion Career?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join hundreds of women in fashion who are already using technology to bring their creative visions to life
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/signup">
                Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/profiles">Explore Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-lg">FashionTech</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering women in fashion through technology education
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Courses</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-primary transition-colors">
                    Browse All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/courses/3d-design" className="hover:text-primary transition-colors">
                    3D Design
                  </Link>
                </li>
                <li>
                  <Link href="/courses/ai-patterns" className="hover:text-primary transition-colors">
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link href="/courses/ecommerce" className="hover:text-primary transition-colors">
                    E-commerce
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Community</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/profiles" className="hover:text-primary transition-colors">
                    Browse Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-primary transition-colors">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/apply-instructor" className="hover:text-primary transition-colors">
                    Become an Instructor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/settings" className="hover:text-primary transition-colors">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-primary transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 FashionTech Academy. Empowering women through technology education.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}




