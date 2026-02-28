'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { AlertTriangle, Phone, MapPin, Building2, FileText, Download, Users, Siren } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Emergency contacts mock data
const emergencyServices = [
  {
    id: 'es-1',
    name: '911 Emergency Services',
    description: 'Police, Fire, Ambulance',
    phone: '911',
    type: 'critical',
    available: '24/7'
  },
  {
    id: 'es-2',
    name: 'BC Emergency Health Services',
    description: 'Non-emergency medical advice',
    phone: '811',
    type: 'health',
    available: '24/7'
  },
  {
    id: 'es-3',
    name: 'Poison Control',
    description: 'Poison control and information',
    phone: '1-800-567-8911',
    type: 'health',
    available: '24/7'
  },
  {
    id: 'es-4',
    name: 'BC Hydro Power Outages',
    description: 'Report power outages',
    phone: '1-800-224-9376',
    type: 'utility',
    available: '24/7'
  },
];

const buildingContacts = [
  {
    id: 'bc-1',
    name: 'Property Manager - Sarah Johnson',
    role: 'Primary Contact',
    phone: '604-555-1000',
    email: 'manager@stratahq.com',
    available: 'Mon-Fri 9AM-5PM',
    type: 'primary'
  },
  {
    id: 'bc-2',
    name: 'After-Hours Emergency Line',
    role: 'Building Emergencies',
    phone: '604-555-9999',
    email: 'emergency@stratahq.com',
    available: '24/7',
    type: 'emergency'
  },
  {
    id: 'bc-3',
    name: 'Maintenance Supervisor - Mike Chen',
    role: 'Maintenance Issues',
    phone: '604-555-2000',
    email: 'maintenance@stratahq.com',
    available: 'Mon-Sat 7AM-6PM',
    type: 'maintenance'
  },
  {
    id: 'bc-4',
    name: 'Security Desk',
    role: 'Building Security',
    phone: '604-555-3000',
    email: 'security@stratahq.com',
    available: '24/7',
    type: 'security'
  },
];

const emergencyProcedures = [
  {
    id: 'ep-1',
    title: 'Fire Emergency',
    icon: AlertTriangle,
    steps: [
      'Activate the nearest fire alarm pull station',
      'Evacuate immediately via the nearest stairwell (DO NOT use elevators)',
      'Close doors behind you to contain the fire',
      'Proceed to the designated assembly area (main parking lot)',
      'Call 911 once you are safely outside',
      'Do not re-enter the building until authorities give the all-clear'
    ],
    color: 'red'
  },
  {
    id: 'ep-2',
    title: 'Earthquake',
    icon: AlertTriangle,
    steps: [
      'DROP to the ground, take COVER under a desk or table, and HOLD ON',
      'Stay away from windows, mirrors, and heavy objects',
      'If outside, move away from buildings, trees, and power lines',
      'After shaking stops, check for injuries and hazards',
      'Evacuate if the building is damaged or if alarm sounds',
      'Use stairs only - DO NOT use elevators'
    ],
    color: 'orange'
  },
  {
    id: 'ep-3',
    title: 'Flood / Water Leak',
    icon: AlertTriangle,
    steps: [
      'Call the after-hours emergency line immediately: 604-555-9999',
      'If safe, shut off the water source',
      'Move valuables and electronics away from water',
      'Do not touch electrical equipment if standing in water',
      'Alert your neighbors if they may be affected',
      'Document damage with photos for insurance'
    ],
    color: 'blue'
  },
  {
    id: 'ep-4',
    title: 'Gas Leak',
    icon: AlertTriangle,
    steps: [
      'DO NOT turn on/off lights or use any electrical devices',
      'DO NOT use phones inside the building',
      'Evacuate immediately and alert others',
      'Call 911 and FortisBC (1-800-663-9911) from outside',
      'Do not re-enter until authorities say it is safe',
      'Leave doors and windows open if safe to do so'
    ],
    color: 'yellow'
  },
];

const assemblyPoints = [
  {
    id: 'ap-1',
    name: 'Primary Assembly Point',
    location: 'Main Parking Lot - East Side',
    description: 'Default meeting location for all building evacuations',
    mapUrl: '#'
  },
  {
    id: 'ap-2',
    name: 'Secondary Assembly Point',
    location: 'City Park - Corner of Main St & 5th Ave',
    description: 'Alternative location if primary is not accessible',
    mapUrl: '#'
  },
];

export default function EmergencyPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'health': return 'bg-blue-100 text-blue-800';
      case 'utility': return 'bg-orange-100 text-orange-800';
      case 'primary': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'security': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EmergencyServiceCard = ({ service }: { service: typeof emergencyServices[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
            <Badge className={getTypeColor(service.type)}>
              {service.available}
            </Badge>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t">
            <Phone className="h-5 w-5 text-red-600" />
            <a href={`tel:${service.phone}`} className="text-2xl font-bold text-red-600 hover:text-red-700">
              {service.phone}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BuildingContactCard = ({ contact }: { contact: typeof buildingContacts[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
            </div>
            <Badge className={getTypeColor(contact.type)}>
              {contact.available}
            </Badge>
          </div>
          <div className="space-y-2 text-sm pt-2 border-t">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${contact.phone}`} className="font-semibold text-blue-600 hover:text-blue-700">
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary">
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProcedureCard = ({ procedure }: { procedure: typeof emergencyProcedures[0] }) => {
    const Icon = procedure.icon;
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-${procedure.color}-100`}>
              <Icon className={`h-6 w-6 text-${procedure.color}-600`} />
            </div>
            <CardTitle>{procedure.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {procedure.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${procedure.color}-100 text-${procedure.color}-700 flex items-center justify-center text-sm font-semibold`}>
                  {index + 1}
                </span>
                <span className="text-sm pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <Siren className="h-8 w-8 text-red-600" />
            Emergency Information
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Important emergency contacts and procedures
          </p>
        </div>

        {/* Critical Alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-sm">
            <strong className="text-red-900">For life-threatening emergencies, always call 911 first.</strong>
            <br />
            Save the after-hours emergency line in your phone: <strong>604-555-9999</strong>
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="emergency" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="emergency" className="text-base py-3">
              Emergency Services
            </TabsTrigger>
            <TabsTrigger value="building" className="text-base py-3">
              Building Contacts
            </TabsTrigger>
            <TabsTrigger value="procedures" className="text-base py-3">
              Procedures
            </TabsTrigger>
            <TabsTrigger value="assembly" className="text-base py-3">
              Assembly Points
            </TabsTrigger>
          </TabsList>

          {/* Emergency Services */}
          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Services</CardTitle>
                <CardDescription>
                  Critical emergency phone numbers - available 24/7
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyServices.map((service) => (
                <EmergencyServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>

          {/* Building Contacts */}
          <TabsContent value="building" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Building Emergency Contacts</CardTitle>
                <CardDescription>
                  Contact information for building management and emergency services
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {buildingContacts.map((contact) => (
                <BuildingContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </TabsContent>

          {/* Emergency Procedures */}
          <TabsContent value="procedures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Procedures</CardTitle>
                <CardDescription>
                  Follow these procedures in case of emergency
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyProcedures.map((procedure) => (
                <ProcedureCard key={procedure.id} procedure={procedure} />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Emergency Preparedness Kit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep these essential items readily accessible in your unit:
                </p>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Flashlight and extra batteries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>First aid kit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Bottled water (3-day supply)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Non-perishable food</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Battery-powered radio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Important documents (copies)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Medications (7-day supply)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Cash and credit cards</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download Preparedness Checklist
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assembly Points */}
          <TabsContent value="assembly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evacuation Assembly Points</CardTitle>
                <CardDescription>
                  Designated meeting locations during building evacuations
                </CardDescription>
              </CardHeader>
            </Card>

            {assemblyPoints.map((point) => (
              <Card key={point.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{point.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{point.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline">View Map</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            ))}

            <Alert className="bg-blue-50 border-blue-200">
              <Users className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong>Important:</strong> During an evacuation, proceed calmly to the assembly point and wait for further instructions.
                Do not leave the assembly area until you have been accounted for by emergency personnel or building management.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Evacuation Floor Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Download floor plans showing emergency exits and evacuation routes:
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Floors 1-5 Evacuation Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Floors 6-10 Evacuation Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Parking Garage Evacuation Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
