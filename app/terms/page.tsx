import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using FashionTech Academy, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the courses and materials on FashionTech Academy for personal,
              non-commercial use only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept
              responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Course Content</h2>
            <p>
              All course materials, including videos, text, and resources, are the property of FashionTech Academy and
              its instructors. Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Community Guidelines</h2>
            <p>
              Users must treat all community members with respect. Harassment, discrimination, or inappropriate behavior
              will result in account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Modifications</h2>
            <p>
              FashionTech Academy reserves the right to modify these terms at any time. Continued use of the platform
              constitutes acceptance of modified terms.
            </p>
          </section>

          <p className="text-sm mt-8">Last updated: January 2024</p>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
