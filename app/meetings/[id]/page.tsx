"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { mockMeetings } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText, CheckSquare } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils-extended"
import { ProtectedLayout } from "@/components/protected-layout"

export default function MeetingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const meeting = mockMeetings.find(m => m.id === params.id)

  if (!meeting) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Meeting not found</p>
        </div>
      </ProtectedLayout>
    )
  }

  const canEdit = user?.role === "council" || user?.role === "manager"

  // Mock agenda items
  const agendaItems = [
    { id: "1", title: "Review Q4 Financial Report", duration: "15 min", status: "completed" },
    { id: "2", title: "Parking Policy Discussion", duration: "30 min", status: "in-progress" },
    { id: "3", title: "Amenity Renovation Proposal", duration: "20 min", status: "pending" },
    { id: "4", title: "Any Other Business", duration: "10 min", status: "pending" },
  ]

  // Mock attendees
  const attendees = [
    { name: "Sarah Chen", role: "President", status: "confirmed" },
    { name: "Michael Park", role: "Treasurer", status: "confirmed" },
    { name: "Jennifer Smith", role: "Secretary", status: "tentative" },
    { name: "Robert Kim", role: "Council Member", status: "declined" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
          <p className="text-sm text-muted-foreground">{meeting.type}</p>
        </div>
        {canEdit && (
          <Button>Edit Meeting</Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Meeting Details</CardTitle>
                  <CardDescription className="mt-1">
                    {formatDate(meeting.date)} at {formatTime(meeting.time)}
                  </CardDescription>
                </div>
                <Badge variant={
                  meeting.status === "upcoming" ? "default" :
                  meeting.status === "completed" ? "secondary" :
                  "outline"
                }>
                  {meeting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span className="text-muted-foreground">{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time:</span>
                  <span className="text-muted-foreground">{formatTime(meeting.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span className="text-muted-foreground">{meeting.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Attendees:</span>
                  <span className="text-muted-foreground">{meeting.attendees}/{attendees.length}</span>
                </div>
              </div>

              {meeting.description && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{meeting.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="agenda" className="space-y-4">
            <TabsList>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="minutes">Minutes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Meeting Agenda
                  </CardTitle>
                  <CardDescription>Topics to be discussed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agendaItems.map((item, index) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">Duration: {item.duration}</p>
                            </div>
                            <Badge variant={
                              item.status === "completed" ? "default" :
                              item.status === "in-progress" ? "secondary" :
                              "outline"
                            } className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="minutes">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Minutes</CardTitle>
                  <CardDescription>
                    {meeting.status === "completed" ? "Minutes from the meeting" : "Minutes will be available after the meeting"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {meeting.status === "completed" ? (
                    <div className="prose prose-sm max-w-none">
                      <h3>Key Decisions</h3>
                      <ul>
                        <li>Approved Q4 financial report with no amendments</li>
                        <li>Parking policy changes to be implemented from Feb 1st</li>
                        <li>Amenity renovation proposal approved with $50,000 budget</li>
                      </ul>
                      <h3>Action Items</h3>
                      <ul>
                        <li>Sarah to circulate new parking guidelines to all residents</li>
                        <li>Michael to obtain quotes from 3 contractors for renovations</li>
                        <li>Jennifer to update building bylaws document</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Minutes not yet available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Related Documents</CardTitle>
                  <CardDescription>Files attached to this meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Q4 Financial Report.pdf", "Parking Policy Draft.docx", "Renovation Proposal.pdf"].map(doc => (
                      <div key={doc} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendees</CardTitle>
              <CardDescription>{meeting.attendees} confirmed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendees.map(attendee => (
                  <div key={attendee.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{attendee.name}</p>
                      <p className="text-xs text-muted-foreground">{attendee.role}</p>
                    </div>
                    <Badge variant={
                      attendee.status === "confirmed" ? "default" :
                      attendee.status === "tentative" ? "secondary" :
                      "outline"
                    } className="text-xs">
                      {attendee.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {user?.role !== "resident" && (
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Manage Attendees
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              {canEdit && (
                <>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Minutes
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
