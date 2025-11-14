"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

interface UserRoleManagerProps {
  users: any[]
}

export default function UserRoleManager({ users: initialUsers }: UserRoleManagerProps) {
  const [users, setUsers] = useState(initialUsers)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleCourseMakerToggle = async (userId: string, currentValue: boolean) => {
    setUpdating(userId)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_course_maker: !currentValue })
        .eq("id", userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId ? { ...u, is_course_maker: !currentValue } : u))
      
      toast({
        title: "Course maker status updated",
        description: `User ${!currentValue ? "can now" : "can no longer"} create courses`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Course Maker</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.full_name?.[0] || user.email?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.full_name || "No name"}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_course_maker ? "default" : "secondary"}>
                  {user.is_course_maker ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="business_owner">Business Owner</SelectItem>
                      <SelectItem value="course_maker">Course Maker</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant={user.is_course_maker ? "destructive" : "default"}
                    onClick={() => handleCourseMakerToggle(user.id, user.is_course_maker)}
                    disabled={updating === user.id}
                  >
                    {updating === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.is_course_maker ? (
                      "Revoke"
                    ) : (
                      "Grant"
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
