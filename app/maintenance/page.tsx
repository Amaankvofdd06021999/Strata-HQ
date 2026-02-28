'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, Filter, Wrench, Clock, CheckCircle2, XCircle, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockMaintenanceRequests } from '@/lib/mock-data';
import { formatTimeAgo, formatDate, getPriorityColor, getRequestStatusColor, getRequestStatusLabel } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';
import type { RequestStatus } from '@/lib/types';

export default function MaintenancePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager';

  // Filter requests
  const filteredRequests = mockMaintenanceRequests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    // Residents only see their own requests
    if (user?.role === 'resident') {
      return matchesSearch && matchesStatus && matchesPriority && request.submittedBy === user.id;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group by status for tabs
  const pendingRequests = filteredRequests.filter(r => r.status === 'submitted' || r.status === 'under_review');
  const activeRequests = filteredRequests.filter(r => r.status === 'in_progress' || r.status === 'approved');
  const completedRequests = filteredRequests.filter(r => r.status === 'completed');

  // Group by status for Kanban
  const submittedRequests = filteredRequests.filter(r => r.status === 'submitted');
  const underReviewRequests = filteredRequests.filter(r => r.status === 'under_review');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const inProgressRequests = filteredRequests.filter(r => r.status === 'in_progress');

  const RequestCard = ({ request }: { request: typeof mockMaintenanceRequests[0] }) => (
    <Link href={`/maintenance/${request.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2">{request.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {request.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>
              <Badge variant="secondary" className={getRequestStatusColor(request.status)}>
                {getRequestStatusLabel(request.status)}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              <span>{request.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(request.submittedDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{request.location}</span>
            </div>
          </div>

          {request.dueDate && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">{formatDate(request.dueDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage and track all service requests
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
          <Link href="/maintenance/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-[1fr,200px,200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | 'all')}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Submitted Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">SUBMITTED</h3>
              <Badge variant="secondary">{submittedRequests.length}</Badge>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {submittedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {submittedRequests.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No submitted requests
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Under Review Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">UNDER REVIEW</h3>
              <Badge variant="secondary">{underReviewRequests.length}</Badge>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {underReviewRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {underReviewRequests.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No requests under review
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Approved Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">APPROVED</h3>
              <Badge variant="secondary">{approvedRequests.length}</Badge>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {approvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {approvedRequests.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No approved requests
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">IN PROGRESS</h3>
              <Badge variant="secondary">{inProgressRequests.length}</Badge>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {inProgressRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {inProgressRequests.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No requests in progress
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {viewMode === 'list' && (
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-base py-3">
            All
            <Badge variant="secondary" className="ml-2">{filteredRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-base py-3">
            Pending
            <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="text-base py-3">
            Active
            <Badge variant="secondary" className="ml-2">{activeRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-base py-3">
            Completed
            <Badge variant="secondary" className="ml-2">{completedRequests.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new request</p>
                <Link href="/maintenance/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-muted-foreground">All requests have been reviewed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active requests</h3>
                <p className="text-muted-foreground">No work is currently in progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed requests</h3>
                <p className="text-muted-foreground">Completed requests will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      )}
      </div>
    </ProtectedLayout>
  );
}
