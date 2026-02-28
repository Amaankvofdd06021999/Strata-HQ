'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, MessageSquare, ThumbsUp, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockForumPosts, mockUsers } from '@/lib/mock-data';
import { formatTimeAgo, getInitials } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

export default function CommunityPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockForumPosts.filter((post) => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const popularPosts = [...filteredPosts].sort((a, b) => b.likes - a.likes).slice(0, 10);
  const recentPosts = [...filteredPosts].sort((a, b) =>
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'General': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-orange-100 text-orange-800',
      'Events': 'bg-purple-100 text-purple-800',
      'Safety': 'bg-red-100 text-red-800',
      'Suggestions': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const PostCard = ({ post }: { post: typeof mockForumPosts[0] }) => {
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
                  <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="font-medium">{author?.name}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdDate)}</span>
                  {post.isPinned && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">Pinned</Badge>
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

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              Community Forum
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Connect with your neighbors and share ideas
            </p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockForumPosts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
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
                {mockForumPosts.reduce((sum, p) => sum + p.replies, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockForumPosts.reduce((sum, p) => sum + p.views, 0)}
              </div>
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

        {/* Tabs */}
        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="recent" className="text-base py-3">
              Recent Posts
              <Badge variant="secondary" className="ml-2">{recentPosts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="popular" className="text-base py-3">
              Popular
              <Badge variant="secondary" className="ml-2">{popularPosts.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {recentPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to start a discussion!</p>
                </CardContent>
              </Card>
            ) : (
              recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            {popularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
