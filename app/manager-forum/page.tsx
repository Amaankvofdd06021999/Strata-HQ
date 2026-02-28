'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, MessageSquare, Lock, ThumbsUp, MessageCircle, Users, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUsers } from '@/lib/mock-data';
import { formatTimeAgo, getInitials } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

// Manager Forum specific mock data
const mockManagerPosts = [
  {
    id: 'mgr-1',
    title: 'Budget Review Q1 2026 - Need Council Approval',
    content: 'The proposed budget for Q1 2026 shows a 12% increase in operational costs primarily due to insurance premium hikes. We need to discuss potential special levy.',
    category: 'Financial',
    authorId: 'user-1',
    createdDate: '2026-02-25T10:30:00Z',
    isPinned: true,
    likes: 5,
    replies: 8,
    views: 24,
    tags: ['budget', 'levy', 'insurance'],
    status: 'open'
  },
  {
    id: 'mgr-2',
    title: 'Legal Action: Unit 405 Bylaw Violations',
    content: 'Repeated noise violations and unauthorized modifications. Previous warnings have been ignored. Seeking council guidance on next steps.',
    category: 'Legal',
    authorId: 'user-2',
    createdDate: '2026-02-24T14:20:00Z',
    isPinned: false,
    likes: 3,
    replies: 12,
    views: 18,
    tags: ['legal', 'bylaws', 'violations'],
    status: 'open'
  },
  {
    id: 'mgr-3',
    title: 'Emergency Preparedness Plan Update',
    content: 'Fire department conducted inspection and recommended updates to our emergency evacuation procedures. Draft plan attached for review.',
    category: 'Safety',
    authorId: 'user-1',
    createdDate: '2026-02-23T09:15:00Z',
    isPinned: true,
    likes: 7,
    replies: 5,
    views: 32,
    tags: ['safety', 'emergency', 'fire'],
    status: 'resolved'
  },
  {
    id: 'mgr-4',
    title: 'Contractor Performance Review - ABC Maintenance',
    content: 'Several complaints about response times and quality of work. Contract renewal is coming up in 3 months. Should we explore alternatives?',
    category: 'Operations',
    authorId: 'user-3',
    createdDate: '2026-02-22T16:45:00Z',
    isPinned: false,
    likes: 4,
    replies: 15,
    views: 28,
    tags: ['contractors', 'maintenance', 'review'],
    status: 'open'
  },
  {
    id: 'mgr-5',
    title: 'AGM Preparation - March 15th',
    content: 'AGM is scheduled for March 15th. Need to finalize agenda, prepare financial reports, and arrange venue. Let\'s divide responsibilities.',
    category: 'Governance',
    authorId: 'user-2',
    createdDate: '2026-02-21T11:00:00Z',
    isPinned: true,
    likes: 6,
    replies: 10,
    views: 35,
    tags: ['AGM', 'governance', 'planning'],
    status: 'open'
  },
];

export default function ManagerForumPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');

  // Check if user has access (council member, property manager, or admin only)
  const hasAccess = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  const filteredPosts = mockManagerPosts.filter((post) => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedPosts = filteredPosts.filter(p => p.isPinned);
  const openPosts = filteredPosts.filter(p => p.status === 'open' && !p.isPinned);
  const resolvedPosts = filteredPosts.filter(p => p.status === 'resolved');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Financial': 'bg-green-100 text-green-800',
      'Legal': 'bg-red-100 text-red-800',
      'Safety': 'bg-orange-100 text-orange-800',
      'Operations': 'bg-blue-100 text-blue-800',
      'Governance': 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleCreatePost = () => {
    // In real app, would call API
    console.log('Creating post:', { newPostTitle, newPostContent, newPostCategory });
    setIsNewPostOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
  };

  const PostCard = ({ post }: { post: typeof mockManagerPosts[0] }) => {
    const author = mockUsers.find(u => u.id === post.authorId);

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>{getInitials(author?.name || 'User')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                  </div>
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="font-medium">{author?.name}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdDate)}</span>
                  {post.status === 'resolved' && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Resolved</Badge>
                    </>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.replies} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Access control - show restricted message if user doesn't have access
  if (!hasAccess) {
    return (
      <ProtectedLayout>
        <div className="p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto mt-12">
            <CardContent className="p-12 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                The Manager Forum is only accessible to Council Members and Property Managers.
              </p>
              <p className="text-sm text-muted-foreground">
                If you believe you should have access, please contact your building administrator.
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
              <Lock className="h-8 w-8" />
              Manager Forum
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Private council and management discussions
            </p>
          </div>
          <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Governance">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Discussion title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Provide details about this topic..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle || !newPostContent || !newPostCategory}
                >
                  Create Discussion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockManagerPosts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openPosts.length + pinnedPosts.filter(p => p.status === 'open').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Replies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockManagerPosts.reduce((sum, p) => sum + p.replies, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedPosts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Pin className="h-5 w-5 text-blue-600" />
              Pinned Discussions
            </h2>
            <div className="space-y-4">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="open" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="open" className="text-base py-3">
              Open Discussions
              <Badge variant="secondary" className="ml-2">{openPosts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-base py-3">
              Resolved
              <Badge variant="secondary" className="ml-2">{resolvedPosts.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4">
            {openPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No open discussions</h3>
                  <p className="text-muted-foreground">Start a new discussion to get started</p>
                </CardContent>
              </Card>
            ) : (
              openPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No resolved discussions</h3>
                  <p className="text-muted-foreground">Resolved discussions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              resolvedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
