'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserCircle2 className="h-8 w-8" />
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">View and edit your profile information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page is under construction. Check back soon!</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
