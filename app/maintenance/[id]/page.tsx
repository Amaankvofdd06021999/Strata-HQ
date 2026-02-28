"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockMaintenanceRequests, mockUsers } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Clock, User, MapPin, AlertCircle, MessageSquare, Paperclip } from "lucide-react"
import { formatDate, getRequestStatusColor, getPriorityColor } from "@/lib/utils-extended"
import { ProtectedLayout } from "@/components/protected-layout"

export default function MaintenanceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const request = mockMaintenanceRequests.find(r => r.id === params.id)

  if (!request) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Request not found</p>
        </div>
      </ProtectedLayout>
    )
  }

  const submitter = mockUsers.find(u => u.id === request.submittedBy)
  const canEdit = user?.role === "council" || user?.role === "manager"

  // Mock activity timeline
  const timeline = [
    {
      id: "1",
      action: "Request submitted",
      user: submitter?.name,
      timestamp: request.createdAt,
      type: "create"
    },
    {
      id: "2",
      action: "Status updated to In Progress",
      user: "Council Member",
      timestamp: new Date(Date.now() - 86400000),
      type: "status"
    },
    {
      id: "3",
      action: "Assigned to vendor: ABC Plumbing",
      user: "Property Manager",
      timestamp: new Date(Date.now() - 172800000),
      type: "assign"
    }
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <p className="text-sm text-muted-foreground">Request #{request.id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Request Details</CardTitle>
                  <CardDescription className="mt-1">
                    Submitted {formatDate(request.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getRequestStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <Badge variant={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{request.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span className="text-muted-foreground">{request.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span className="text-muted-foreground capitalize">{request.category}</span>
                </div>
              </div>

              {request.images && request.images.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Attachments</h3>
                  <div className="flex gap-2">
                    {request.images.map((img, index) => (
                      <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Paperclip className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map(event => (
                <div key={event.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {event.user?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{event.user}</span>{" "}
                      <span className="text-muted-foreground">{event.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {canEdit && (
                <div className="pt-4 border-t space-y-3">
                  <Label>Add Comment</Label>
                  <Textarea placeholder="Add a comment or update..." rows={3} />
                  <Button size="sm">Post Comment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {canEdit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={request.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue={request.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign Vendor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc-plumbing">ABC Plumbing</SelectItem>
                      <SelectItem value="elite-hvac">Elite HVAC</SelectItem>
                      <SelectItem value="pro-electrical">Pro Electrical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Submitted By</p>
                  <p className="text-muted-foreground">{submitter?.name}</p>
                  <p className="text-muted-foreground text-xs">{submitter?.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm pt-3 border-t">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              {request.estimatedCost && (
                <div className="pt-3 border-t">
                  <p className="font-medium text-sm">Estimated Cost</p>
                  <p className="text-2xl font-bold text-primary">${request.estimatedCost}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </ProtectedLayout>
  )
}
