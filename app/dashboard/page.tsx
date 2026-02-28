'use client';

import { useAuth } from '@/lib/auth-context';
import { mockDashboardStatsCouncil, mockDashboardStatsManager, mockDashboardStatsResident, mockMaintenanceRequests, mockViolations, mockMeetings, mockTasks } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertTriangle, Calendar, CheckSquare, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Get appropriate stats based on user role
  const getStats = () => {
    if (!user) return mockDashboardStatsResident;
    switch (user.role) {
      case 'council_member':
      case 'admin':
        return mockDashboardStatsCouncil;
      case 'property_manager':
        return mockDashboardStatsManager;
      default:
        return mockDashboardStatsResident;
    }
  };

  const stats = getStats();

  // Get recent items
  const recentRequests = mockMaintenanceRequests.slice(0, 5);
  const recentViolations = mockViolations.filter(v => v.status !== 'resolved' && v.status !== 'dismissed').slice(0, 3);
  const upcomingMeetings = mockMeetings.filter(m => m.status === 'scheduled').slice(0, 3);
  const recentTasks = mockTasks.filter(t => t.status !== 'completed').slice(0, 5);

  const canViewViolations = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';
  const canViewTasks = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening at Harborview Towers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-orange-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        {canViewViolations && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeViolations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -3% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next meeting in 5 days
            </p>
          </CardContent>
        </Card>

        {canViewTasks && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.overdueTasksCount}/{stats.totalTasks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.overdueTasksCount} overdue tasks
              </p>
            </CardContent>
          </Card>
        )}

        {!canViewTasks && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requests processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Maintenance Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Maintenance</CardTitle>
                <CardDescription>Latest maintenance requests</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/maintenance">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <Link href={`/maintenance/${request.id}`} className="font-medium hover:underline">
                    {request.title}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {request.location}
                  </div>
                </div>
                <Badge variant={
                  request.priority === 'urgent' ? 'destructive' :
                  request.priority === 'high' ? 'default' : 'secondary'
                }>
                  {request.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/meetings">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <Link href={`/meetings/${meeting.id}`} className="font-medium hover:underline">
                    {meeting.title}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                  </div>
                </div>
                <Badge variant={meeting.isVirtual ? 'outline' : 'secondary'}>
                  {meeting.isVirtual ? 'Virtual' : 'In-person'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional sections for council/managers */}
      {(canViewViolations || canViewTasks) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {canViewViolations && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Violations</CardTitle>
                    <CardDescription>Requires attention</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/violations">
                      View all <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentViolations.length > 0 ? recentViolations.map((violation) => (
                  <div key={violation.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{violation.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {violation.unit && `Unit ${violation.unit} •`} {violation.category}
                      </div>
                    </div>
                    <Badge variant={
                      violation.severity === 'critical' || violation.severity === 'major' ? 'destructive' : 'secondary'
                    }>
                      {violation.severity}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No active violations</p>
                )}
              </CardContent>
            </Card>
          )}

          {canViewTasks && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Tasks</CardTitle>
                    <CardDescription>Your action items</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/tasks">
                      View all <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={
                      task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
