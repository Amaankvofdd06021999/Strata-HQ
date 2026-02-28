'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, CheckSquare, MessageSquare, User, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import { formatDate, getPriorityColor, getInitials } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

type MatrixQuadrant = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export default function TasksPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);
  const [newComment, setNewComment] = useState('');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Categorize tasks into Eisenhower Matrix quadrants
  const categorizeTask = (task: typeof mockTasks[0]): MatrixQuadrant => {
    const isUrgent = task.priority === 'urgent' || task.priority === 'high';
    const isImportant = task.category === 'Financial' || task.category === 'Legal & Compliance' || task.category === 'Safety & Security';

    if (isUrgent && isImportant) return 'urgent-important';
    if (!isUrgent && isImportant) return 'not-urgent-important';
    if (isUrgent && !isImportant) return 'urgent-not-important';
    return 'not-urgent-not-important';
  };

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!isCouncilOrManager) {
      return matchesSearch && task.assignedTo.includes(user?.id || '');
    }
    return matchesSearch;
  });

  // Group by quadrant
  const urgentImportant = filteredTasks.filter(t => categorizeTask(t) === 'urgent-important');
  const notUrgentImportant = filteredTasks.filter(t => categorizeTask(t) === 'not-urgent-important');
  const urgentNotImportant = filteredTasks.filter(t => categorizeTask(t) === 'urgent-not-important');
  const notUrgentNotImportant = filteredTasks.filter(t => categorizeTask(t) === 'not-urgent-not-important');

  const handleAddComment = () => {
    if (newComment.trim() && selectedTask) {
      // In a real app, this would call an API
      console.log('Adding comment:', newComment, 'to task:', selectedTask.id);
      setNewComment('');
    }
  };

  const TaskCard = ({ task }: { task: typeof mockTasks[0] }) => {
    const assignedUsers = task.assignedTo.map(id => mockUsers.find(u => u.id === id)).filter(Boolean);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4"
                style={{ borderLeftColor: task.priority === 'urgent' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : '#3b82f6' }}
                onClick={() => setSelectedTask(task)}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight flex-1 text-sm">{task.title}</h3>
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                    {task.priority}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>

                {task.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate, 'MMM dd')}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {assignedUsers.slice(0, 3).map((u) => u && (
                      <Avatar key={u.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {assignedUsers.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{assignedUsers.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{task.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Task Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge variant="secondary">{task.category}</Badge>
                <Badge>{task.status}</Badge>
              </div>

              <p className="text-muted-foreground">{task.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium mb-1">Due Date</div>
                  <div className="text-sm text-muted-foreground">{formatDate(task.dueDate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Created</div>
                  <div className="text-sm text-muted-foreground">{formatDate(task.createdDate)}</div>
                </div>
              </div>

              {task.progress !== undefined && (
                <div>
                  <div className="text-sm font-medium mb-2">Progress: {task.progress}%</div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-2">Assigned To</div>
                <div className="flex flex-wrap gap-2">
                  {assignedUsers.map((u) => u && (
                    <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Subtasks</h3>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        className="rounded"
                        readOnly
                      />
                      <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Activity & Comments</h3>

              <div className="space-y-4 mb-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} size="sm">
                      Add Comment
                    </Button>
                  </div>
                </div>

                {/* Mock Comments */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">Sarah Chen</span>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm">I've started working on this task. Will update progress by EOD.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const QuadrantCard = ({
    title,
    description,
    tasks,
    color,
    textColor
  }: {
    title: string;
    description: string;
    tasks: typeof mockTasks;
    color: string;
    textColor: string;
  }) => (
    <div className="space-y-3">
      <div className={`p-4 rounded-lg ${color}`}>
        <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
        <p className={`text-sm ${textColor} opacity-90`}>{description}</p>
        <Badge variant="secondary" className="mt-2">{tasks.length} tasks</Badge>
      </div>
      <div className="space-y-3 min-h-[300px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No tasks in this quadrant
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <CheckSquare className="h-8 w-8" />
              Task Management
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Eisenhower Matrix - Prioritize what matters most
            </p>
          </div>
          {isCouncilOrManager && (
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Task
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Eisenhower Matrix - 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Q1: Urgent & Important - DO FIRST */}
          <QuadrantCard
            title="🔥 DO FIRST"
            description="Urgent & Important - Crisis, Deadlines"
            tasks={urgentImportant}
            color="bg-red-50 border-2 border-red-200"
            textColor="text-red-900"
          />

          {/* Q2: Not Urgent & Important - SCHEDULE */}
          <QuadrantCard
            title="📅 SCHEDULE"
            description="Not Urgent & Important - Planning, Development"
            tasks={notUrgentImportant}
            color="bg-green-50 border-2 border-green-200"
            textColor="text-green-900"
          />

          {/* Q3: Urgent & Not Important - DELEGATE */}
          <QuadrantCard
            title="👥 DELEGATE"
            description="Urgent & Not Important - Interruptions"
            tasks={urgentNotImportant}
            color="bg-amber-50 border-2 border-amber-200"
            textColor="text-amber-900"
          />

          {/* Q4: Not Urgent & Not Important - ELIMINATE */}
          <QuadrantCard
            title="🗑️ ELIMINATE"
            description="Not Urgent & Not Important - Time Wasters"
            tasks={notUrgentNotImportant}
            color="bg-slate-50 border-2 border-slate-200"
            textColor="text-slate-900"
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
