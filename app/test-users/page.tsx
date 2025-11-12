"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { CheckCircle2, Users } from "lucide-react"

export default function TestUsersPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [testAccounts, setTestAccounts] = useState<any[]>([])

  const createTestUsers = async () => {
    setIsCreating(true)
    const supabase = createClient()
    const accounts = []

    try {
      // Create test user 1
      const { data: user1, error: error1 } = await supabase.auth.signUp({
        email: "sarah.chen@fashiontech.test",
        password: "TestPassword123!",
        options: {
          data: {
            full_name: "Sarah Chen",
            display_name: "Sarah",
          },
        },
      })

      if (!error1 && user1.user) {
        accounts.push({ email: "sarah.chen@fashiontech.test", password: "TestPassword123!", name: "Sarah Chen" })

        // Create profile
        await supabase.from("profiles").insert({
          id: user1.user.id,
          full_name: "Sarah Chen",
          bio: "3D Fashion Designer specializing in CLO3D",
          location: "New York, NY",
          title: "3D Fashion Designer",
        })
      }

      // Create test user 2
      const { data: user2, error: error2 } = await supabase.auth.signUp({
        email: "maya.rodriguez@fashiontech.test",
        password: "TestPassword123!",
        options: {
          data: {
            full_name: "Maya Rodriguez",
            display_name: "Maya",
          },
        },
      })

      if (!error2 && user2.user) {
        accounts.push({
          email: "maya.rodriguez@fashiontech.test",
          password: "TestPassword123!",
          name: "Maya Rodriguez",
        })

        // Create profile
        await supabase.from("profiles").insert({
          id: user2.user.id,
          full_name: "Maya Rodriguez",
          bio: "Pattern Maker & AI Enthusiast",
          location: "Los Angeles, CA",
          title: "Pattern Maker",
        })

        // Create a conversation between the two users if both were created
        if (user1.user) {
          const { data: conversation } = await supabase.from("conversations").insert({}).select().single()

          if (conversation) {
            await supabase.from("conversation_participants").insert([
              { conversation_id: conversation.id, user_id: user1.user.id },
              { conversation_id: conversation.id, user_id: user2.user.id },
            ])

            // Add a test message
            await supabase.from("messages").insert({
              conversation_id: conversation.id,
              sender_id: user1.user.id,
              content: "Hi Maya! I'd love to learn more about AI pattern making.",
            })
          }
        }
      }

      setTestAccounts(accounts)
      setCreated(true)
    } catch (error) {
      console.error("[v0] Error creating test users:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-center text-2xl">Create Test Users</CardTitle>
              <CardDescription className="text-center">
                Generate sample accounts to test the chat and profile features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!created ? (
                <>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>This will create two test user accounts:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Sarah Chen (3D Fashion Designer)</li>
                      <li>Maya Rodriguez (Pattern Maker)</li>
                    </ul>
                    <p className="text-xs">
                      Both accounts will have the password:{" "}
                      <code className="bg-muted px-2 py-1 rounded">TestPassword123!</code>
                    </p>
                    <p className="text-xs">
                      A test conversation will be created between them so you can test the chat feature.
                    </p>
                  </div>

                  <Button onClick={createTestUsers} disabled={isCreating} className="w-full">
                    {isCreating ? "Creating test users..." : "Create Test Users"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Test users created successfully!</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">You can now log in with these accounts:</p>
                    {testAccounts.map((account, index) => (
                      <Card key={index} className="bg-muted">
                        <CardContent className="pt-4">
                          <div className="space-y-1 text-sm">
                            <div>
                              <strong>Name:</strong> {account.name}
                            </div>
                            <div>
                              <strong>Email:</strong> {account.email}
                            </div>
                            <div>
                              <strong>Password:</strong> {account.password}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <a href="/login">Go to Login</a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <a href="/profiles">View Profiles</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
