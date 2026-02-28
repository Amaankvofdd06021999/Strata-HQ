'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, Briefcase, Star, Phone, Mail, MapPin, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPhoneNumber, formatCurrency, formatDate } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

// Vendors mock data
const mockVendors = [
  {
    id: 'v-1',
    name: 'ABC Maintenance Services',
    category: 'Maintenance',
    contactPerson: 'Robert Wilson',
    phone: '6045551234',
    email: 'robert@abcmaintenance.com',
    address: '123 Service St, Vancouver, BC V6B 1A1',
    rating: 4.8,
    totalContracts: 24,
    activeContracts: 3,
    totalPaid: 145000,
    verified: true,
    status: 'active',
    since: '2023-01-15',
    description: 'Full-service building maintenance and repair specialists',
    services: ['HVAC', 'Plumbing', 'Electrical', 'General Repairs']
  },
  {
    id: 'v-2',
    name: 'ProClean Solutions',
    category: 'Cleaning',
    contactPerson: 'Linda Martinez',
    phone: '6045555678',
    email: 'linda@proclean.com',
    address: '456 Clean Ave, Vancouver, BC V6C 2B2',
    rating: 4.9,
    totalContracts: 36,
    activeContracts: 2,
    totalPaid: 89000,
    verified: true,
    status: 'active',
    since: '2022-06-01',
    description: 'Professional cleaning services for commercial and residential properties',
    services: ['Common Area Cleaning', 'Carpet Cleaning', 'Window Washing']
  },
  {
    id: 'v-3',
    name: 'GreenScape Landscaping',
    category: 'Landscaping',
    contactPerson: 'David Park',
    phone: '6045559012',
    email: 'david@greenscape.com',
    address: '789 Garden Rd, Vancouver, BC V6D 3C3',
    rating: 4.7,
    totalContracts: 18,
    activeContracts: 2,
    totalPaid: 62000,
    verified: true,
    status: 'active',
    since: '2023-03-20',
    description: 'Landscaping, grounds maintenance, and seasonal services',
    services: ['Lawn Care', 'Garden Maintenance', 'Snow Removal', 'Irrigation']
  },
  {
    id: 'v-4',
    name: 'SecureWatch Security',
    category: 'Security',
    contactPerson: 'James Anderson',
    phone: '6045553456',
    email: 'james@securewatch.com',
    address: '321 Safety Blvd, Vancouver, BC V6E 4D4',
    rating: 4.8,
    totalContracts: 12,
    activeContracts: 1,
    totalPaid: 95000,
    verified: true,
    status: 'active',
    since: '2021-11-10',
    description: 'Professional security monitoring and patrol services',
    services: ['24/7 Monitoring', 'Patrol Services', 'Access Control']
  },
  {
    id: 'v-5',
    name: 'QuickFix Plumbing',
    category: 'Plumbing',
    contactPerson: 'Tom Richards',
    phone: '6045557890',
    email: 'tom@quickfixplumbing.com',
    address: '654 Pipe St, Vancouver, BC V6F 5E5',
    rating: 4.6,
    totalContracts: 8,
    activeContracts: 0,
    totalPaid: 28000,
    verified: false,
    status: 'inactive',
    since: '2024-05-15',
    description: 'Emergency and scheduled plumbing services',
    services: ['Emergency Repairs', 'Pipe Replacement', 'Drain Cleaning']
  },
];

const mockContracts = [
  {
    id: 'c-1',
    vendorId: 'v-1',
    vendorName: 'ABC Maintenance Services',
    title: 'Monthly Building Maintenance',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    value: 66000,
    status: 'active',
    paymentTerms: 'Monthly',
    description: 'Comprehensive monthly maintenance services including HVAC, plumbing, and electrical'
  },
  {
    id: 'c-2',
    vendorId: 'v-2',
    vendorName: 'ProClean Solutions',
    title: 'Weekly Common Area Cleaning',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    value: 26400,
    status: 'active',
    paymentTerms: 'Monthly',
    description: 'Weekly cleaning of all common areas including lobbies, hallways, and amenity spaces'
  },
  {
    id: 'c-3',
    vendorId: 'v-3',
    vendorName: 'GreenScape Landscaping',
    title: 'Seasonal Landscaping Services',
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    value: 18000,
    status: 'active',
    paymentTerms: 'Monthly',
    description: 'Spring through fall landscaping, lawn care, and garden maintenance'
  },
  {
    id: 'c-4',
    vendorId: 'v-4',
    vendorName: 'SecureWatch Security',
    title: 'Security Monitoring Service',
    startDate: '2025-12-01',
    endDate: '2026-11-30',
    value: 48000,
    status: 'active',
    paymentTerms: 'Monthly',
    description: '24/7 security monitoring and monthly patrol services'
  },
];

export default function VendorsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeVendors = filteredVendors.filter(v => v.status === 'active');
  const inactiveVendors = filteredVendors.filter(v => v.status === 'inactive');
  const activeContracts = mockContracts.filter(c => c.status === 'active');
  const categories = Array.from(new Set(mockVendors.map(v => v.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const VendorCard = ({ vendor }: { vendor: typeof mockVendors[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                {vendor.verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs mb-2">
                {vendor.category}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{vendor.rating}</span>
              </div>
              <Badge className={getStatusColor(vendor.status)}>
                {vendor.status}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{vendor.description}</p>

          <div className="flex flex-wrap gap-1">
            {vendor.services.map((service, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Active Contracts</p>
              <p className="font-semibold">{vendor.activeContracts}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Contracts</p>
              <p className="font-semibold">{vendor.totalContracts}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Paid</p>
              <p className="font-semibold">{formatCurrency(vendor.totalPaid)}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm pt-3 border-t">
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{vendor.contactPerson}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${vendor.phone}`} className="hover:text-primary">
                {formatPhoneNumber(vendor.phone)}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${vendor.email}`} className="hover:text-primary">
                {vendor.email}
              </a>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" />
              <span className="text-xs">{vendor.address}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ContractCard = ({ contract }: { contract: typeof mockContracts[0] }) => (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{contract.title}</h3>
                <p className="text-sm text-muted-foreground">{contract.vendorName}</p>
              </div>
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{contract.description}</p>

            <div className="grid grid-cols-4 gap-4 pt-3 border-t text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Contract Value</p>
                <p className="font-semibold">{formatCurrency(contract.value)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Start Date</p>
                <p className="font-medium">{formatDate(contract.startDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">End Date</p>
                <p className="font-medium">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Payment Terms</p>
                <p className="font-medium">{contract.paymentTerms}</p>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Access control
  if (!isCouncilOrManager) {
    return (
      <ProtectedLayout>
        <div className="p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto mt-12">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                Vendor management is only accessible to Council Members and Property Managers.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <Briefcase className="h-8 w-8" />
              Vendor Management
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Manage vendors, contracts, and service providers
            </p>
          </div>
          <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input placeholder="Contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="(604) 555-1234" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="contact@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Street address" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of services..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddVendorOpen(false)}>
                  Add Vendor
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
                Total Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVendors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVendors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContracts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contract Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(activeContracts.reduce((sum, c) => sum + c.value, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="vendors" className="text-base py-3">
              Vendors
              <Badge variant="secondary" className="ml-2">{mockVendors.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-base py-3">
              Contracts
              <Badge variant="secondary" className="ml-2">{mockContracts.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-[1fr,200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors..."
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

            {/* Vendors List */}
            {filteredVendors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>
                  Current service contracts and agreements
                </CardDescription>
              </CardHeader>
            </Card>

            {mockContracts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No contracts</h3>
                  <p className="text-muted-foreground">Contracts will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockContracts.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
