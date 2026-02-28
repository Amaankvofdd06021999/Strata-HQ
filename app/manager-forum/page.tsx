'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function ManagerForumPage() {
  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Manager Forum
          </h1>
          <p className="text-muted-foreground mt-2">Professional discussion forum for council members and property managers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Forum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page is under construction. Check back soon!</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
