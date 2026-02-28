'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, AlertTriangle, FileText, User, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockViolations } from '@/lib/mock-data';
import { formatDate, formatTimeAgo } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';
import type { ViolationStatus } from '@/lib/types';

export default function ViolationsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ViolationStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Filter violations
  const filteredViolations = mockViolations.filter((violation) => {
    const matchesSearch = violation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         violation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (violation.unit && violation.unit.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Group by status
  const activeViolations = filteredViolations.filter(v =>
    v.status !== 'resolved' && v.status !== 'dismissed'
  );
  const investigatingViolations = filteredViolations.filter(v =>
    v.status === 'investigating' || v.status === 'reported'
  );
  const warningViolations = filteredViolations.filter(v => v.status === 'warning_issued');
  const resolvedViolations = filteredViolations.filter(v =>
    v.status === 'resolved' || v.status === 'dismissed'
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ViolationStatus) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-orange-100 text-orange-800';
      case 'warning_issued': return 'bg-amber-100 text-amber-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ViolationStatus) => {
    switch (status) {
      case 'reported': return 'Reported';
      case 'investigating': return 'Investigating';
      case 'confirmed': return 'Confirmed';
      case 'warning_issued': return 'Warning Issued';
      case 'resolved': return 'Resolved';
      case 'dismissed': return 'Dismissed';
      default: return status;
    }
  };

  const ViolationCard = ({ violation }: { violation: typeof mockViolations[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{violation.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {violation.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <Badge variant="outline" className={getSeverityColor(violation.severity)}>
                {violation.severity}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(violation.status)}>
                {getStatusLabel(violation.status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {violation.unit && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-medium">{violation.unit}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium capitalize">{violation.category.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Reported:</span>
              <span className="font-medium">{formatTimeAgo(violation.reportedDate)}</span>
            </div>
            {violation.fineAmount && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fine:</span>
                <span className="font-medium">${violation.fineAmount}</span>
              </div>
            )}
          </div>

          {violation.location && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Location:</span> {violation.location}
            </div>
          )}

          {violation.actionTaken && (
            <div className="text-sm p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Action Taken:</span> {violation.actionTaken}
            </div>
          )}

          {violation.resolution && (
            <div className="text-sm p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-medium text-green-800">Resolution:</span>
              <span className="text-green-700 ml-2">{violation.resolution}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Only council/managers can see violations page
  if (!isCouncilOrManager) {
    return (
      <ProtectedLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">
                This page is only accessible to council members and property managers.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <AlertTriangle className="h-8 w-8" />
              Violations
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Track and manage building violations
            </p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Report Violation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeViolations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investigating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investigatingViolations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Warnings Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warningViolations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedViolations.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-[1fr,200px,200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search violations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ViolationStatus | 'all')}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="warning_issued">Warning Issued</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-base py-3">
              All
              <Badge variant="secondary" className="ml-2">{filteredViolations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="text-base py-3">
              Active
              <Badge variant="secondary" className="ml-2">{activeViolations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="investigating" className="text-base py-3">
              Investigating
              <Badge variant="secondary" className="ml-2">{investigatingViolations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-base py-3">
              Resolved
              <Badge variant="secondary" className="ml-2">{resolvedViolations.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredViolations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No violations found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredViolations.map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeViolations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active violations</h3>
                  <p className="text-muted-foreground">All violations have been addressed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeViolations.map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="investigating" className="space-y-4">
            {investigatingViolations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No violations under investigation</h3>
                  <p className="text-muted-foreground">No cases currently being investigated</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {investigatingViolations.map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedViolations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No resolved violations</h3>
                  <p className="text-muted-foreground">Resolved violations will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {resolvedViolations.map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
