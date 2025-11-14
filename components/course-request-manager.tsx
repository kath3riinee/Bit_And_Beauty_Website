"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Eye, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

interface CourseRequestManagerProps {
  requests: any[]
}

export default function CourseRequestManager({ requests: initialRequests }: CourseRequestManagerProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from("course_creation_requests")
        .update({
          status: "approved",
          reviewer_id: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      const request = requests.find(r => r.id === requestId)
      await supabase.from("notifications").insert({
        user_id: request.requester_id,
        type: "course_request_approved",
        title: "Course Request Approved",
        message: "Your course creation request has been approved! You can now create your course.",
        link: "/creator/lessons/new",
      })

      setRequests(requests.map(r => 
        r.id === requestId 
          ? { ...r, status: "approved", reviewer_id: user?.id, reviewed_at: new Date().toISOString() }
          : r
      ))
      
      toast({
        title: "Request approved",
        description: "Course creation request has been approved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    
    setProcessing(selectedRequest.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from("course_creation_requests")
        .update({
          status: "rejected",
          reviewer_id: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason,
        })
        .eq("id", selectedRequest.id)

      if (error) throw error

      await supabase.from("notifications").insert({
        user_id: selectedRequest.requester_id,
        type: "course_request_rejected",
        title: "Course Request Rejected",
        message: `Your course creation request has been rejected. Reason: ${rejectionReason}`,
        link: "/creator",
      })

      setRequests(requests.map(r => 
        r.id === selectedRequest.id 
          ? { 
              ...r, 
              status: "rejected", 
              reviewer_id: user?.id, 
              reviewed_at: new Date().toISOString(),
              rejection_reason: rejectionReason 
            }
          : r
      ))
      
      toast({
        title: "Request rejected",
        description: "Course creation request has been rejected",
      })
      
      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRequest(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No course creation requests yet
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.requester?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.requester?.full_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.requester?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{request.requester?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{request.course_title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.course_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                        >
                          {processing === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowRejectDialog(true)
                          }}
                          disabled={processing === request.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Reviewed by {request.reviewer?.full_name || "Unknown"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Course Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this course creation request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processing !== null}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedRequest && !showRejectDialog && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Course Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Course Title</h4>
                <p>{selectedRequest.course_title}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Category</h4>
                <p>{selectedRequest.course_category}</p>
              </div>
              {selectedRequest.course_description && (
                <div>
                  <h4 className="font-semibold mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequest.course_description}</p>
                </div>
              )}
              {selectedRequest.rejection_reason && (
                <div>
                  <h4 className="font-semibold mb-1">Rejection Reason</h4>
                  <p className="text-sm text-destructive">{selectedRequest.rejection_reason}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
