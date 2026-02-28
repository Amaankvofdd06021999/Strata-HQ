'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import Link from 'next/link';
import { Scale, Send, ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  'What are the quorum requirements for an AGM?',
  'Can strata council restrict pet ownership?',
  'What is the process for enforcing bylaws?',
  'How do special levies work under the Strata Property Act?',
  'What are the depreciation report requirements?',
];

export default function StrataLawAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real app, would call API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(textToSend),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getSimulatedResponse = (question: string): string => {
    if (question.toLowerCase().includes('quorum')) {
      return 'Under Section 48 of the Strata Property Act, quorum for an annual or special general meeting is:\n\n• **1/3 of eligible voters** for strata corporations with more than 4 strata lots\n• **2 eligible voters** for strata corporations with 4 or fewer strata lots\n\nEligible voters include owners and, if authorized by bylaw, tenants. If quorum is not achieved within 30 minutes of the scheduled meeting time, the meeting may be adjourned to a new date at least 7 days later. At the adjourned meeting, quorum is not required.\n\nWould you like to know more about meeting procedures or voting requirements?';
    }
    if (question.toLowerCase().includes('pet')) {
      return 'Strata corporations have broad authority to regulate pets under Section 121 of the Strata Property Act. However, there are important limitations:\n\n**What Strata Can Do:**\n• Prohibit or restrict certain types of pets\n• Set size or breed restrictions\n• Require registration of pets\n• Establish rules for pet behavior\n\n**Important Limitations:**\n• Cannot prohibit **service dogs** or **guide dogs**\n• Bylaws cannot be unreasonable or significantly unfair\n• Cannot retroactively ban existing pets without proper grandfather clauses\n\nAny pet restrictions must be properly passed as bylaws following the procedures in the Strata Property Act. Would you like information on the bylaw amendment process?';
    }
    return 'Based on the BC Strata Property Act and related regulations, I can help you understand this topic. However, I need a bit more context about your specific situation.\n\nCould you please provide:\n• The specific section or topic you\'re asking about\n• Any relevant details about your strata corporation\n• What you\'re trying to accomplish\n\nThis will help me give you the most accurate and helpful information. Remember, while I can provide general legal information, you should consult with a qualified strata lawyer for specific legal advice.';
  };

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ai-assistants">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Strata Law Assistant</h1>
                <p className="text-sm text-muted-foreground">Powered by AI • BC Strata Property Act Expert</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
            Online
          </Badge>
        </div>

        {/* Main Chat Area */}
        <div className="grid gap-6">
          {/* Welcome / Suggested Questions */}
          {messages.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  How can I help you today?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  I\'m here to help you understand the BC Strata Property Act, regulations, and legal requirements.
                  Ask me anything about strata law!
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested questions:</p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 text-left"
                        onClick={() => handleSendMessage(question)}
                      >
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 bg-blue-100">
                        <AvatarFallback>
                          <Scale className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`flex flex-col gap-1 max-w-[80%]`}>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-blue-100">
                      <AvatarFallback>
                        <Scale className="h-4 w-4 text-blue-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Input Area */}
          <Card>
            <CardContent className="p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about strata law..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                This AI provides general information. For specific legal advice, consult a qualified strata lawyer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
