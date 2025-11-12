"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, LogIn, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Account Setup</h1>
          <p className="text-lg text-gray-600">
            Test the FashionTech Academy platform with pre-configured demo accounts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Demo User 1 */}
          <Card className="border-2 border-rose-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-rose-600" />
                Demo User: Alice
              </CardTitle>
              <CardDescription>Fashion Designer & Student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">alice@fashiontech.demo</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText("alice@fashiontech.demo")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Password</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">demo123456</code>
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText("demo123456")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Link href="/login">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login as Alice
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Demo User 2 */}
          <Card className="border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Demo User: Bob
              </CardTitle>
              <CardDescription>Tech Mentor & Instructor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">bob@fashiontech.demo</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText("bob@fashiontech.demo")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Password</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border">demo123456</code>
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText("demo123456")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Link href="/login">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login as Bob
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card className="bg-gradient-to-br from-rose-50 to-emerald-50 border-2">
          <CardHeader>
            <CardTitle>How to Test the Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Demo Accounts</p>
                  <p className="text-sm text-gray-600">
                    First, you need to sign up these demo accounts. Click "Sign Up" and use the credentials above.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Login as Alice</p>
                  <p className="text-sm text-gray-600">
                    Use alice@fashiontech.demo / demo123456 to login and explore the platform.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Test Messaging</p>
                  <p className="text-sm text-gray-600">
                    Go to Community, find Bob's profile, and send a message to start a conversation.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Switch Users</p>
                  <p className="text-sm text-gray-600">
                    Logout and login as Bob to see the conversation from the other side.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/signup" className="flex-1">
                <Button className="w-full bg-transparent" variant="outline">
                  Sign Up Demo Accounts
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Quick Access</p>
          <div className="flex justify-center gap-4">
            <Link href="/profiles">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Community
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
