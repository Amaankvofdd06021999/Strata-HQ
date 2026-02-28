'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function DirectoryPage() {
  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Directory
          </h1>
          <p className="text-muted-foreground mt-2">Building directory and resident information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resident Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page is under construction. Check back soon!</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
