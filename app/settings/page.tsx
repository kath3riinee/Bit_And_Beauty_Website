"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Lock, Palette, Save, Upload, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    title: "",
    location: "",
    bio: "",
    avatar_url: "",
    role: "",
    is_course_maker: false,
  })

  const [notifications, setNotifications] = useState({
    course_updates: true,
    community: true,
    achievements: true,
    newsletter: false,
    marketing: false,
  })

  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    two_factor_enabled: false,
  })

  const [appearance, setAppearance] = useState({
    theme: "light" as "light" | "dark" | "auto",
    compact_mode: false,
    animations: true,
  })

  useEffect(() => {
    loadProfile()
    loadSettings()
  }, [])

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view settings",
          variant: "destructive",
        })
        return
      }

      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("[v0] Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
        return
      }

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: profileData.email || "",
          title: profileData.title || "",
          location: profileData.location || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
          role: profileData.role || "",
          is_course_maker: profileData.is_course_maker || false,
        })
      }
    } catch (error) {
      console.error("[v0] Error in loadProfile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: settingsData, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("[v0] Error loading settings:", error)
        return
      }

      if (settingsData) {
        setNotifications({
          course_updates: settingsData.notifications_course_updates ?? true,
          community: settingsData.notifications_community ?? true,
          achievements: settingsData.notifications_achievements ?? true,
          newsletter: settingsData.notifications_newsletter ?? false,
          marketing: settingsData.notifications_marketing ?? false,
        })

        setSecurity((prev) => ({
          ...prev,
          two_factor_enabled: settingsData.security_two_factor_enabled ?? false,
        }))

        setAppearance({
          theme: settingsData.appearance_theme ?? "light",
          compact_mode: settingsData.appearance_compact_mode ?? false,
          animations: settingsData.appearance_animations ?? true,
        })
      }
    } catch (error) {
      console.error("[v0] Error in loadSettings:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save changes",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
          title: profile.title,
          location: profile.location,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("[v0] Error saving profile:", error)
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error in handleSave:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, or GIF)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload an avatar",
          variant: "destructive",
        })
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) {
        console.error("[v0] Error uploading avatar:", uploadError)
        toast({
          title: "Upload failed",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("[v0] Error updating profile:", updateError)
        toast({
          title: "Update failed",
          description: "Failed to update profile with new avatar",
          variant: "destructive",
        })
        return
      }

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }))

      toast({
        title: "Success",
        description: "Your avatar has been updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error in handleAvatarUpload:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save changes",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          notifications_course_updates: notifications.course_updates,
          notifications_community: notifications.community,
          notifications_achievements: notifications.achievements,
          notifications_newsletter: notifications.newsletter,
          notifications_marketing: notifications.marketing,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) {
        console.error("[v0] Error saving notification settings:", error)
        toast({
          title: "Error",
          description: "Failed to save notification preferences",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Notification preferences saved successfully",
      })
    } catch (error) {
      console.error("[v0] Error in handleSaveNotifications:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (!security.current_password || !security.new_password || !security.confirm_password) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (security.new_password !== security.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (security.new_password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: security.new_password,
      })

      if (error) {
        console.error("[v0] Error updating password:", error)
        toast({
          title: "Error",
          description: "Failed to update password. Please check your current password.",
          variant: "destructive",
        })
        return
      }

      setSecurity((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }))

      toast({
        title: "Success",
        description: "Password updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error in handleSavePassword:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave2FA = async (enabled: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          security_two_factor_enabled: enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) {
        console.error("[v0] Error saving 2FA setting:", error)
        toast({
          title: "Error",
          description: "Failed to update 2FA setting",
          variant: "destructive",
        })
        return
      }

      setSecurity((prev) => ({ ...prev, two_factor_enabled: enabled }))

      toast({
        title: "Success",
        description: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      })
    } catch (error) {
      console.error("[v0] Error in handleSave2FA:", error)
    }
  }

  const handleSaveAppearance = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save changes",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          appearance_theme: appearance.theme,
          appearance_compact_mode: appearance.compact_mode,
          appearance_animations: appearance.animations,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) {
        console.error("[v0] Error saving appearance settings:", error)
        toast({
          title: "Error",
          description: "Failed to save appearance preferences",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Appearance preferences saved successfully",
      })
    } catch (error) {
      console.error("[v0] Error in handleSaveAppearance:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "course_maker":
      case "instructor":
        return "default"
      case "mentor":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "course_maker":
        return "Course Creator"
      case "instructor":
        return "Instructor"
      case "mentor":
        return "Mentor"
      case "business_owner":
        return "Business Owner"
      case "student":
        return "Student"
      default:
        return role
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Settings</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Manage your account preferences, profile information, and notification settings.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Type
                  </CardTitle>
                  <CardDescription>Your current role and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Current Role</p>
                      <p className="text-2xl font-bold">{getRoleDisplayName(profile.role)}</p>
                    </div>
                    <Badge variant={getRoleBadgeVariant(profile.role)} className="text-sm px-3 py-1">
                      {profile.role.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {profile.is_course_maker && (
                    <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <Shield className="w-4 h-4 text-primary" />
                      <p className="text-sm text-primary font-medium">Creator Dashboard Access Enabled</p>
                    </div>
                  )}
                  
                  {(profile.role === "admin" || profile.is_course_maker) && (
                    <div className="pt-2">
                      <Button variant="outline" asChild>
                        <a href="/creator">Go to Creator Dashboard</a>
                      </Button>
                    </div>
                  )}
                  
                  {!profile.is_course_maker && profile.role !== "admin" && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Want to create courses and content? Apply to become a creator.
                      </p>
                      <Button variant="outline" asChild>
                        <a href="/apply-instructor">Apply to Become Creator</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mb-2 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Jane Doe"
                      value={profile.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      placeholder="Fashion Designer"
                      value={profile.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="New York, NY"
                      value={profile.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile. Max 200 characters.
                    </p>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Manage how you receive email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="course-updates">Course Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new courses and lessons
                      </p>
                    </div>
                    <Switch
                      id="course-updates"
                      checked={notifications.course_updates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, course_updates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="community">Community Activity</Label>
                      <p className="text-sm text-muted-foreground">Get notified about community interactions</p>
                    </div>
                    <Switch
                      id="community"
                      checked={notifications.community}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, community: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="achievements">Achievements</Label>
                      <p className="text-sm text-muted-foreground">Celebrate your learning milestones</p>
                    </div>
                    <Switch
                      id="achievements"
                      checked={notifications.achievements}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, achievements: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">Weekly digest of fashion tech news and tips</p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newsletter: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional content and special offers</p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
                    />
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={security.current_password}
                      onChange={(e) => setSecurity((prev) => ({ ...prev, current_password: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={security.new_password}
                      onChange={(e) => setSecurity((prev) => ({ ...prev, new_password: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={security.confirm_password}
                      onChange={(e) => setSecurity((prev) => ({ ...prev, confirm_password: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleSavePassword} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Require a verification code when signing in</p>
                    </div>
                    <Switch
                      checked={security.two_factor_enabled}
                      onCheckedChange={(checked) => handleSave2FA(checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="bg-transparent">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>Customize how the platform looks for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setAppearance((prev) => ({ ...prev, theme: "light" }))}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg bg-card hover:bg-accent transition-colors ${
                          appearance.theme === "light" ? "border-primary" : "border-border"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-background to-muted border border-border" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => setAppearance((prev) => ({ ...prev, theme: "dark" }))}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg bg-card hover:bg-accent transition-colors ${
                          appearance.theme === "dark" ? "border-primary" : "border-border"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button
                        onClick={() => setAppearance((prev) => ({ ...prev, theme: "auto" }))}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg bg-card hover:bg-accent transition-colors ${
                          appearance.theme === "auto" ? "border-primary" : "border-border"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-background via-muted to-gray-700 border border-border" />
                        <span className="text-sm font-medium">Auto</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for a denser layout</p>
                    </div>
                    <Switch
                      checked={appearance.compact_mode}
                      onCheckedChange={(checked) => setAppearance((prev) => ({ ...prev, compact_mode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch
                      checked={appearance.animations}
                      onCheckedChange={(checked) => setAppearance((prev) => ({ ...prev, animations: checked }))}
                    />
                  </div>

                  <Button onClick={handleSaveAppearance} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
