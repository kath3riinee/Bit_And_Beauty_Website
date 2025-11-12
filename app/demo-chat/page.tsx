"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, Users, MessageSquare } from "lucide-react"

export default function DemoChatPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const createDemoUsers = async () => {
    setIsCreating(true)
    setMessage("Creating demo users...")

    const supabase = createClient()

    try {
      // Create two demo users
      const demoUsers = [
        { email: "alice@demo.com", password: "demo123456", name: "Alice Designer" },
        { email: "bob@demo.com", password: "demo123456", name: "Bob Developer" },
      ]

      const createdUsers = []

      for (const demo of demoUsers) {
        // Sign up user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: demo.email,
          password: demo.password,
          options: {
            data: {
              full_name: demo.name,
            },
          },
        })

        if (signUpError) {
          console.log(`User ${demo.email} might already exist`)
          continue
        }

        if (authData.user) {
          createdUsers.push({ id: authData.user.id, ...demo })
        }
      }

      // Create a conversation between them if we have both users
      if (createdUsers.length >= 2) {
        setMessage("Creating conversation...")

        // Create conversation
        const { data: convData, error: convError } = await supabase.from("conversations").insert({}).select().single()

        if (!convError && convData) {
          // Add participants
          await supabase.from("conversation_participants").insert([
            { conversation_id: convData.id, user_id: createdUsers[0].id },
            { conversation_id: convData.id, user_id: createdUsers[1].id },
          ])

          // Add some demo messages
          await supabase.from("messages").insert([
            {
              conversation_id: convData.id,
              sender_id: createdUsers[0].id,
              content: "Hi! I'm excited to learn about fashion tech!",
            },
            {
              conversation_id: convData.id,
              sender_id: createdUsers[1].id,
              content: "Welcome! I'm here to help with the technical side of things.",
            },
          ])
        }
      }

      setMessage(
        `Demo users created! You can now login with:\n\nEmail: alice@demo.com\nPassword: demo123456\n\nOR\n\nEmail: bob@demo.com\nPassword: demo123456`,
      )
    } catch (error) {
      console.error("Error creating demo:", error)
      setMessage("Error creating demo users. They might already exist. Try logging in with the credentials above.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FashionTech Academy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Demo Chat Setup</CardTitle>
            <CardDescription>Create demo users to test the messaging feature</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                What this does:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Creates two demo user accounts (Alice and Bob)</li>
                <li>• Sets up a conversation between them</li>
                <li>• Adds sample messages to test the chat feature</li>
                <li>• Allows you to login as either user to test messaging</li>
              </ul>
            </div>

            <Button onClick={createDemoUsers} disabled={isCreating} className="w-full" size="lg">
              {isCreating ? "Creating Demo Users..." : "Create Demo Users & Conversation"}
            </Button>

            {message && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm whitespace-pre-line">{message}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/chat">Go to Chat</Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>After creating demo users, login with either account to test the chat feature.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
