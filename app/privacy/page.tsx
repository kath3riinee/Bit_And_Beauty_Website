import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including name, email address, profile information, and
              course progress data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to communicate with you,
              and to personalize your learning experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with service providers who assist
              in operating our platform, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You can manage your data
              through your account settings or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold certain
              information to improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page.
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
