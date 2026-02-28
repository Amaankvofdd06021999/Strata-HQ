'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function AmenitiesPage() {
  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MapPin className="h-8 w-8" />
            Amenities
          </h1>
          <p className="text-muted-foreground mt-2">Book and manage building amenities</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Amenity Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page is under construction. Check back soon!</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
