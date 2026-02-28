'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, CheckSquare, Clock, User, LayoutGrid, List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTasks } from '@/lib/mock-data';
import { formatDate, getPriorityColor } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';
import type { TaskStatus, Priority } from '@/lib/types';

export default function TasksPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    // Only council/managers can see all tasks
    if (!isCouncilOrManager) {
      return matchesSearch && matchesPriority && task.assignedTo.includes(user?.id || '');
    }

    return matchesSearch && matchesPriority;
  });

  // Group by status for Kanban
  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'inprogress');
  const reviewTasks = filteredTasks.filter(t => t.status === 'review');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'review': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'review': return 'Review';
      case 'completed': return 'Completed';
      case 'blocked': return 'Blocked';
      default: return status;
    }
  };

  const TaskCard = ({ task }: { task: typeof mockTasks[0] }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight flex-1">{task.title}</h3>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          {task.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckSquare className="h-3 w-3" />
              <span>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <CheckSquare className="h-8 w-8" />
              Tasks
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Manage your tasks and action items
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
            {isCouncilOrManager && (
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Task
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-[1fr,200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}>
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
            {/* TODO Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                <h3 className="font-semibold text-slate-800">TODO</h3>
                <Badge variant="secondary" className="bg-slate-200">{todoTasks.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {todoTasks.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      No tasks to do
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* IN PROGRESS Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-blue-800">IN PROGRESS</h3>
                <Badge variant="secondary" className="bg-blue-200">{inProgressTasks.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {inProgressTasks.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      No tasks in progress
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* REVIEW Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <h3 className="font-semibold text-amber-800">REVIEW</h3>
                <Badge variant="secondary" className="bg-amber-200">{reviewTasks.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {reviewTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {reviewTasks.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      No tasks in review
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* COMPLETED Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="font-semibold text-green-800">COMPLETED</h3>
                <Badge variant="secondary" className="bg-green-200">{completedTasks.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {completedTasks.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      No completed tasks
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant="secondary" className={getStatusColor(task.status)}>
                                {getStatusLabel(task.status)}
                              </Badge>
                            </div>
                          </div>

                          {task.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="h-2" />
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>Due {formatDate(task.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span>{task.category}</span>
                            </div>
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <CheckSquare className="h-4 w-4" />
                                <span>
                                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
