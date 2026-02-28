'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, BarChart3, Vote, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { mockPolls } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

export default function PollsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Filter polls
  const filteredPolls = mockPolls.filter((poll) => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poll.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group by status
  const activePolls = filteredPolls.filter(p => p.status === 'active');
  const closedPolls = filteredPolls.filter(p => p.status === 'closed');
  const draftPolls = filteredPolls.filter(p => p.status === 'draft');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PollCard = ({ poll }: { poll: typeof mockPolls[0] }) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = () => {
      setHasVoted(true);
      // In real app, would submit vote to backend
    };

    const isActive = poll.status === 'active';
    const totalVotes = poll.totalVotes;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{poll.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{poll.description}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(poll.status)}>
              {poll.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Poll metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Vote className="h-4 w-4" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Ends {formatDate(poll.endDate)}</span>
            </div>
            {poll.requiresQuorum && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Quorum: {poll.quorumPercentage}%</span>
              </div>
            )}
            {poll.isAnonymous && (
              <Badge variant="outline" className="text-xs">Anonymous</Badge>
            )}
          </div>

          {/* Voting interface or results */}
          {isActive && !hasVoted ? (
            <div className="space-y-4">
              {poll.type === 'single_choice' || poll.type === 'yes_no' ? (
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptions([...selectedOptions, option.id]);
                          } else {
                            setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={handleVote}
                disabled={!selectedOption && selectedOptions.length === 0}
                className="w-full"
              >
                <Vote className="h-4 w-4 mr-2" />
                Submit Vote
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {poll.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-muted-foreground">
                      {option.votes} votes ({option.percentage}%)
                    </span>
                  </div>
                  <Progress value={option.percentage} className="h-2" />
                </div>
              ))}
              {hasVoted && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Your vote has been recorded</span>
                </div>
              )}
            </div>
          )}
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
              <BarChart3 className="h-8 w-8" />
              Polls & Voting
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Participate in community polls and voting
            </p>
          </div>
          {isCouncilOrManager && (
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Poll
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePolls.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredPolls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Closed Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedPolls.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search polls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="active" className="text-base py-3">
              Active
              <Badge variant="secondary" className="ml-2">{activePolls.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="closed" className="text-base py-3">
              Closed
              <Badge variant="secondary" className="ml-2">{closedPolls.length}</Badge>
            </TabsTrigger>
            {isCouncilOrManager && (
              <TabsTrigger value="draft" className="text-base py-3">
                Draft
                <Badge variant="secondary" className="ml-2">{draftPolls.length}</Badge>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activePolls.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active polls</h3>
                  <p className="text-muted-foreground">Check back later for new polls</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activePolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {closedPolls.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No closed polls</h3>
                  <p className="text-muted-foreground">Closed polls will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {closedPolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            )}
          </TabsContent>

          {isCouncilOrManager && (
            <TabsContent value="draft" className="space-y-4">
              {draftPolls.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No draft polls</h3>
                    <p className="text-muted-foreground">Create a new poll to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {draftPolls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
