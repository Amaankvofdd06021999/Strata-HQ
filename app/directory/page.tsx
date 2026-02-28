'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Search, Users, Building2, Phone, Mail, MapPin, Briefcase, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUsers } from '@/lib/mock-data';
import { getInitials, formatPhoneNumber } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

// Service providers mock data
const mockServiceProviders = [
  {
    id: 'sp-1',
    name: 'ABC Plumbing Services',
    category: 'Plumbing',
    contactPerson: 'John Smith',
    phone: '6045551234',
    email: 'john@abcplumbing.com',
    address: '123 Main St, Vancouver, BC',
    rating: 4.8,
    verified: true,
    description: 'Licensed plumber specializing in residential repairs and emergencies'
  },
  {
    id: 'sp-2',
    name: 'Elite Electrical Ltd',
    category: 'Electrical',
    contactPerson: 'Sarah Johnson',
    phone: '6045555678',
    email: 'sarah@eliteelectrical.com',
    address: '456 Oak Ave, Vancouver, BC',
    rating: 4.9,
    verified: true,
    description: 'Certified electricians for all residential electrical needs'
  },
  {
    id: 'sp-3',
    name: 'ProClean Solutions',
    category: 'Cleaning',
    contactPerson: 'Mike Chen',
    phone: '6045559012',
    email: 'mike@proclean.com',
    address: '789 Pine St, Vancouver, BC',
    rating: 4.7,
    verified: true,
    description: 'Professional cleaning services for common areas and units'
  },
  {
    id: 'sp-4',
    name: 'GreenScape Landscaping',
    category: 'Landscaping',
    contactPerson: 'Emma Wilson',
    phone: '6045553456',
    email: 'emma@greenscape.com',
    address: '321 Cedar Rd, Vancouver, BC',
    rating: 4.6,
    verified: true,
    description: 'Full-service landscaping and grounds maintenance'
  },
  {
    id: 'sp-5',
    name: 'SecureWatch Security',
    category: 'Security',
    contactPerson: 'David Lee',
    phone: '6045557890',
    email: 'david@securewatch.com',
    address: '654 Birch Blvd, Vancouver, BC',
    rating: 4.9,
    verified: true,
    description: 'Professional security services and monitoring systems'
  },
  {
    id: 'sp-6',
    name: 'HVAC Masters',
    category: 'HVAC',
    contactPerson: 'Lisa Brown',
    phone: '6045552345',
    email: 'lisa@hvacmasters.com',
    address: '987 Maple Dr, Vancouver, BC',
    rating: 4.8,
    verified: true,
    description: 'Heating, ventilation, and air conditioning specialists'
  },
];

export default function DirectoryPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Filter residents
  const residents = mockUsers.filter(u => u.role === 'resident' || u.role === 'owner');
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (resident.unit && resident.unit.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Filter service providers
  const filteredProviders = mockServiceProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || provider.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockServiceProviders.map(p => p.category)));

  const ResidentCard = ({ resident }: { resident: typeof mockUsers[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback>{getInitials(resident.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{resident.name}</h3>
                {resident.unit && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Building2 className="h-4 w-4" />
                    <span>Unit {resident.unit}</span>
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="capitalize">
                {resident.role === 'owner' ? 'Owner' : 'Resident'}
              </Badge>
            </div>

            {isCouncilOrManager && (
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${resident.email}`} className="hover:text-primary">
                    {resident.email}
                  </a>
                </div>
                {resident.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${resident.phone}`} className="hover:text-primary">
                      {formatPhoneNumber(resident.phone)}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceProviderCard = ({ provider }: { provider: typeof mockServiceProviders[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{provider.name}</h3>
                {provider.verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {provider.category}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{provider.rating}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{provider.description}</p>

          <div className="space-y-2 text-sm pt-2 border-t">
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{provider.contactPerson}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${provider.phone}`} className="hover:text-primary">
                {formatPhoneNumber(provider.phone)}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${provider.email}`} className="hover:text-primary">
                {provider.email}
              </a>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" />
              <span className="text-xs">{provider.address}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Building residents and service providers
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Residents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{residents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Service Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockServiceProviders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockServiceProviders.filter(p => p.verified).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="residents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="residents" className="text-base py-3">
              Residents
              <Badge variant="secondary" className="ml-2">{residents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="providers" className="text-base py-3">
              Service Providers
              <Badge variant="secondary" className="ml-2">{mockServiceProviders.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Residents Tab */}
          <TabsContent value="residents" className="space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search residents by name, unit, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Residents List */}
            {filteredResidents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No residents found</h3>
                  <p className="text-muted-foreground">Try adjusting your search</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResidents.map((resident) => (
                  <ResidentCard key={resident.id} resident={resident} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Service Providers Tab */}
          <TabsContent value="providers" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-[1fr,200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search service providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-11"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Providers List */}
            {filteredProviders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No service providers found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredProviders.map((provider) => (
                  <ServiceProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
