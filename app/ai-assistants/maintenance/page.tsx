'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import Link from 'next/link';
import { Wrench, Send, ArrowLeft, Sparkles, FileText } from 'lucide-react';
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
  'How do I troubleshoot a leaking faucet?',
  'What\'s the recommended HVAC maintenance schedule?',
  'My circuit breaker keeps tripping, what should I do?',
  'How often should fire extinguishers be inspected?',
  'What are signs of a failing water heater?',
];

export default function MaintenanceAssistantPage() {
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

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I can help you with building maintenance and repair issues. I can provide:\n\n• Troubleshooting guidance for common problems\n• Preventive maintenance schedules\n• Safety protocols and procedures\n• Repair recommendations\n• Emergency response steps\n\n**Important:** For emergency situations (fire, gas leak, flooding), always:\n1. Ensure safety first\n2. Call emergency services (911) if needed\n3. Contact building management immediately\n\nWhat maintenance issue can I help you with today?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/ai-assistants">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Maintenance Assistant</h1>
                <p className="text-sm text-muted-foreground">Powered by AI • Maintenance & Repair Expert</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
            Online
          </Badge>
        </div>

        <div className="grid gap-6">
          {messages.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  How can I help with maintenance?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  I can help you troubleshoot maintenance issues, understand preventive maintenance schedules,
                  and provide guidance on building systems and repairs.
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

          {messages.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 bg-orange-100">
                        <AvatarFallback>
                          <Wrench className="h-4 w-4 text-orange-600" />
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
                    <Avatar className="h-8 w-8 bg-orange-100">
                      <AvatarFallback>
                        <Wrench className="h-4 w-4 text-orange-600" />
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
                  placeholder="Ask about maintenance..."
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
                AI-powered maintenance guidance. For emergencies, always contact building management or 911 first.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
