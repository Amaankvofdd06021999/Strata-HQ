'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, MapPin, Users, Clock, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAmenities, mockBookings } from '@/lib/mock-data';
import { formatDate, formatTime } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

export default function AmenitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Filter amenities
  const filteredAmenities = mockAmenities.filter((amenity) => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         amenity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && amenity.status === 'available';
  });

  // Filter bookings
  const myBookings = mockBookings.filter(b => b.userId === user?.id);
  const upcomingBookings = myBookings.filter(b => b.status === 'confirmed');
  const pastBookings = myBookings.filter(b => b.status === 'completed');

  const handleBooking = () => {
    // In real app, would call API
    console.log('Booking:', { selectedAmenity, selectedDate, selectedTime });
    setIsBookingDialogOpen(false);
    setSelectedAmenity('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <MapPin className="h-8 w-8" />
              Amenities
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Book and manage building amenities
            </p>
          </div>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book an Amenity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Amenity</Label>
                  <Select value={selectedAmenity} onValueChange={setSelectedAmenity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amenity" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAmenities.map((amenity) => (
                        <SelectItem key={amenity.id} value={amenity.id}>
                          {amenity.name} - ${amenity.hourlyRate}/hr
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM - 10:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM - 3:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM - 4:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM - 5:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM - 8:00 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM - 9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBooking} disabled={!selectedAmenity || !selectedDate || !selectedTime}>
                  Confirm Booking
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
                Available Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAmenities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastBookings.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="available" className="text-base py-3">
              Available Amenities
              <Badge variant="secondary" className="ml-2">{filteredAmenities.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-base py-3">
              My Upcoming
              <Badge variant="secondary" className="ml-2">{upcomingBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="text-base py-3">
              Past Bookings
              <Badge variant="secondary" className="ml-2">{pastBookings.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Available Amenities */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAmenities.map((amenity) => (
                <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{amenity.name}</CardTitle>
                        <CardDescription className="mt-1">{amenity.location}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {amenity.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{amenity.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {amenity.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${amenity.hourlyRate}/hr</span>
                      </div>
                    </div>

                    {amenity.amenities && amenity.amenities.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Features</div>
                        <div className="flex flex-wrap gap-1">
                          {amenity.amenities.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Available Hours</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{amenity.availableHours}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedAmenity(amenity.id);
                        setIsBookingDialogOpen(true);
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">Book an amenity to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const amenity = mockAmenities.find(a => a.id === booking.amenityId);
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{amenity?.name}</h3>
                                <p className="text-sm text-muted-foreground">{amenity?.location}</p>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(booking.startTime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                              </div>
                            </div>

                            {booking.notes && (
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                {booking.notes}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">Total</div>
                            <div className="text-2xl font-bold">${booking.totalCost}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button variant="outline" size="sm">Modify</Button>
                          <Button variant="outline" size="sm" className="text-red-600">Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">Your booking history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const amenity = mockAmenities.find(a => a.id === booking.amenityId);
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{amenity?.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(booking.startTime)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
