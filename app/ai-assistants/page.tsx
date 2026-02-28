'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import Link from 'next/link';
import { Bot, Scale, Building2, Gavel, Wrench, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const assistants = [
  {
    id: 'strata-law',
    name: 'Strata Law Assistant',
    icon: Scale,
    description: 'Get instant answers about BC Strata Property Act, regulations, and legal requirements',
    features: [
      'Strata Property Act interpretation',
      'Bylaw compliance guidance',
      'Legal procedure assistance',
      'Regulation lookups'
    ],
    color: 'blue',
    href: '/ai-assistants/strata-law'
  },
  {
    id: 'building-rules',
    name: 'Building Rules Bot',
    icon: Building2,
    description: 'Navigate building bylaws, rules, and regulations specific to your strata',
    features: [
      'Bylaw interpretation',
      'Pet policies and restrictions',
      'Noise and nuisance rules',
      'Common property usage'
    ],
    color: 'green',
    href: '/ai-assistants/building-rules'
  },
  {
    id: 'crt-decisions',
    name: 'CRT Decisions Bot',
    icon: Gavel,
    description: 'Search and analyze Civil Resolution Tribunal strata decisions and precedents',
    features: [
      'Case law search',
      'Decision analysis',
      'Precedent research',
      'Dispute resolution guidance'
    ],
    color: 'purple',
    href: '/ai-assistants/crt-decisions'
  },
  {
    id: 'maintenance',
    name: 'Maintenance Assistant',
    icon: Wrench,
    description: 'Get help with maintenance issues, troubleshooting, and repair recommendations',
    features: [
      'Troubleshooting guidance',
      'Maintenance schedules',
      'Repair recommendations',
      'Emergency procedures'
    ],
    color: 'orange',
    href: '/ai-assistants/maintenance'
  },
];

export default function AIAssistantsPage() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-900',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-900',
        icon: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-900',
        icon: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-900',
        icon: 'text-orange-600'
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-3xl lg:text-4xl font-bold">AI Assistants</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get instant, intelligent help with strata management, legal questions, building rules, and maintenance
          </p>
        </div>

        {/* Feature Banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Powered by Advanced AI</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI assistants are trained on BC strata law, building codes, CRT decisions, and maintenance best practices.
                  Get accurate, instant answers to your questions 24/7.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assistants Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {assistants.map((assistant) => {
            const Icon = assistant.icon;
            const colors = getColorClasses(assistant.color);

            return (
              <Card key={assistant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-lg ${colors.bg}`}>
                      <Icon className={`h-8 w-8 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{assistant.name}</CardTitle>
                      <CardDescription className="text-base">
                        {assistant.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Key Features:</h4>
                    <div className="space-y-2">
                      {assistant.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={assistant.href}>
                    <Button className="w-full" size="lg">
                      Start Conversation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Available anytime, day or night</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">Instant</div>
              <p className="text-sm text-muted-foreground">Get answers in seconds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">Accurate</div>
              <p className="text-sm text-muted-foreground">Trained on official sources</p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> AI assistants provide general information and guidance based on BC strata law and regulations.
              For specific legal advice, please consult with a qualified strata lawyer or property management professional.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
