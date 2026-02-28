'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, Calendar, Video, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMeetings } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

export default function MeetingsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeetings = mockMeetings.filter((meeting) => {
    return meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'scheduled');
  const pastMeetings = filteredMeetings.filter(m => m.status === 'completed');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager';

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Council meetings, AGMs, and community events
          </p>
        </div>
        {isCouncilOrManager && (
          <Link href="/meetings/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Schedule Meeting
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="upcoming" className="text-base py-3">
            Upcoming
            <Badge variant="secondary" className="ml-2">{upcomingMeetings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="past" className="text-base py-3">
            Past
            <Badge variant="secondary" className="ml-2">{pastMeetings.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {formatDate(meeting.date, 'dd')}
                        </span>
                        <span className="text-xs text-primary font-medium">
                          {formatDate(meeting.date, 'MMM')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-xl leading-tight">{meeting.title}</h3>
                        <Badge variant="secondary">{meeting.type.toUpperCase()}</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(meeting.date, 'EEEE, MMMM dd, yyyy')} at {meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {meeting.isVirtual ? (
                            <>
                              <Video className="h-4 w-4" />
                              <span>Virtual Meeting</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4" />
                              <span>{meeting.location}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{meeting.attendees.length} attendees</span>
                        </div>
                      </div>
                      {meeting.agenda.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-1">Agenda ({meeting.agenda.length} items)</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.agenda[0].title}
                            {meeting.agenda.length > 1 && ` and ${meeting.agenda.length - 1} more...`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past meetings</h3>
                <p className="text-muted-foreground">Past meetings will appear here</p>
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map((meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight mb-2">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(meeting.date, 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
      </div>
    </ProtectedLayout>
  );
}
