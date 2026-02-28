"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Home, Car, PawPrint, Users, Zap, Check } from "lucide-react"
import { toast } from "sonner"

interface OnboardingData {
  buildingInfo: {
    name: string
    address: string
    city: string
    province: string
    postalCode: string
    totalUnits: number
    floors: number
    yearBuilt: number
    buildingType: string
  }
  complexInfo: {
    isComplex: boolean
    numberOfBuildings: number
    buildingNames: string[]
  }
  amenities: string[]
  parking: {
    hasParking: boolean
    hasEVCharging: boolean
    numberOfEVSpots: number
    parkingType: string
  }
  pets: {
    allowed: boolean
    types: string[]
    maxPerUnit: number
    weightLimit: number
  }
  rentals: {
    allowed: boolean
    restrictions: string
    minimumPeriod: number
  }
  governance: {
    councilSize: number
    meetingFrequency: string
    fiscalYearEnd: string
  }
}

const initialData: OnboardingData = {
  buildingInfo: {
    name: "",
    address: "",
    city: "",
    province: "BC",
    postalCode: "",
    totalUnits: 0,
    floors: 0,
    yearBuilt: new Date().getFullYear(),
    buildingType: "highrise"
  },
  complexInfo: {
    isComplex: false,
    numberOfBuildings: 1,
    buildingNames: []
  },
  amenities: [],
  parking: {
    hasParking: true,
    hasEVCharging: false,
    numberOfEVSpots: 0,
    parkingType: "assigned"
  },
  pets: {
    allowed: true,
    types: [],
    maxPerUnit: 2,
    weightLimit: 25
  },
  rentals: {
    allowed: true,
    restrictions: "short_term_banned",
    minimumPeriod: 12
  },
  governance: {
    councilSize: 5,
    meetingFrequency: "monthly",
    fiscalYearEnd: "12-31"
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)

  const steps = [
    "Building Info",
    "Complex Setup",
    "Amenities",
    "Parking & EV",
    "Pet Policy",
    "Rental Policy",
    "Governance",
    "Review"
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const togglePetType = (type: string) => {
    setData(prev => ({
      ...prev,
      pets: {
        ...prev.pets,
        types: prev.pets.types.includes(type)
          ? prev.pets.types.filter(t => t !== type)
          : [...prev.pets.types, type]
      }
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    toast.success("Building setup complete! Redirecting to dashboard...")
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Building Information</h2>
                <p className="text-muted-foreground">Tell us about your property</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Building/Strata Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Harborview Towers"
                  value={data.buildingInfo.name}
                  onChange={(e) => updateData('buildingInfo', 'name', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={data.buildingInfo.address}
                  onChange={(e) => updateData('buildingInfo', 'address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Vancouver"
                  value={data.buildingInfo.city}
                  onChange={(e) => updateData('buildingInfo', 'city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select
                  value={data.buildingInfo.province}
                  onValueChange={(value) => updateData('buildingInfo', 'province', value)}
                >
                  <SelectTrigger id="province">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BC">British Columbia</SelectItem>
                    <SelectItem value="AB">Alberta</SelectItem>
                    <SelectItem value="ON">Ontario</SelectItem>
                    <SelectItem value="QC">Quebec</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="V6B 1A1"
                  value={data.buildingInfo.postalCode}
                  onChange={(e) => updateData('buildingInfo', 'postalCode', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingType">Building Type</Label>
                <Select
                  value={data.buildingInfo.buildingType}
                  onValueChange={(value) => updateData('buildingInfo', 'buildingType', value)}
                >
                  <SelectTrigger id="buildingType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highrise">High-Rise</SelectItem>
                    <SelectItem value="lowrise">Low-Rise</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalUnits">Total Units</Label>
                <Input
                  id="totalUnits"
                  type="number"
                  value={data.buildingInfo.totalUnits || ""}
                  onChange={(e) => updateData('buildingInfo', 'totalUnits', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors">Number of Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  value={data.buildingInfo.floors || ""}
                  onChange={(e) => updateData('buildingInfo', 'floors', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={data.buildingInfo.yearBuilt}
                  onChange={(e) => updateData('buildingInfo', 'yearBuilt', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Complex Configuration</h2>
                <p className="text-muted-foreground">Is this part of a multi-building complex?</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-0.5">
                    <Label className="text-base">Multi-Building Complex</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable if you have multiple buildings managed together
                    </p>
                  </div>
                  <Switch
                    checked={data.complexInfo.isComplex}
                    onCheckedChange={(checked) => updateData('complexInfo', 'isComplex', checked)}
                  />
                </div>

                {data.complexInfo.isComplex && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfBuildings">Number of Buildings</Label>
                      <Input
                        id="numberOfBuildings"
                        type="number"
                        min="2"
                        value={data.complexInfo.numberOfBuildings}
                        onChange={(e) => updateData('complexInfo', 'numberOfBuildings', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Building Names (optional)</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        E.g., "Tower A", "Tower B", "Garden Building"
                      </p>
                      {Array.from({ length: data.complexInfo.numberOfBuildings }).map((_, i) => (
                        <Input
                          key={i}
                          placeholder={`Building ${i + 1} name`}
                          value={data.complexInfo.buildingNames[i] || ""}
                          onChange={(e) => {
                            const names = [...data.complexInfo.buildingNames]
                            names[i] = e.target.value
                            updateData('complexInfo', 'buildingNames', names)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        const amenitiesList = [
          { id: "gym", label: "Fitness Center/Gym", icon: "💪" },
          { id: "pool", label: "Swimming Pool", icon: "🏊" },
          { id: "hottub", label: "Hot Tub/Spa", icon: "🛁" },
          { id: "sauna", label: "Sauna", icon: "🧖" },
          { id: "partyroom", label: "Party/Meeting Room", icon: "🎉" },
          { id: "guestsuite", label: "Guest Suite", icon: "🛏️" },
          { id: "rooftop", label: "Rooftop Deck/Terrace", icon: "🌆" },
          { id: "garden", label: "Garden/Green Space", icon: "🌳" },
          { id: "bikestorage", label: "Bike Storage", icon: "🚲" },
          { id: "storage", label: "Storage Lockers", icon: "📦" },
          { id: "theater", label: "Theater/Media Room", icon: "🎬" },
          { id: "coworking", label: "Co-Working Space", icon: "💼" },
        ]

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Building Amenities</h2>
                <p className="text-muted-foreground">Select all amenities available in your building</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {amenitiesList.map((amenity) => (
                <Card
                  key={amenity.id}
                  className={`cursor-pointer transition-all ${
                    data.amenities.includes(amenity.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => toggleAmenity(amenity.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{amenity.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{amenity.label}</p>
                      </div>
                      {data.amenities.includes(amenity.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Selected: {data.amenities.length} amenities
            </p>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Parking & EV Charging</h2>
                <p className="text-muted-foreground">Configure parking facilities</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Parking Available</Label>
                    <p className="text-sm text-muted-foreground">
                      Does the building have parking facilities?
                    </p>
                  </div>
                  <Switch
                    checked={data.parking.hasParking}
                    onCheckedChange={(checked) => updateData('parking', 'hasParking', checked)}
                  />
                </div>

                {data.parking.hasParking && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="parkingType">Parking Assignment Type</Label>
                      <Select
                        value={data.parking.parkingType}
                        onValueChange={(value) => updateData('parking', 'parkingType', value)}
                      >
                        <SelectTrigger id="parkingType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assigned">Assigned Spots</SelectItem>
                          <SelectItem value="first_come">First Come First Serve</SelectItem>
                          <SelectItem value="permit">Permit Based</SelectItem>
                          <SelectItem value="mixed">Mixed System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <div className="space-y-0.5">
                          <Label className="text-base">EV Charging Stations</Label>
                          <p className="text-sm text-muted-foreground">
                            Electric vehicle charging available?
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={data.parking.hasEVCharging}
                        onCheckedChange={(checked) => updateData('parking', 'hasEVCharging', checked)}
                      />
                    </div>

                    {data.parking.hasEVCharging && (
                      <div className="space-y-2">
                        <Label htmlFor="evSpots">Number of EV Charging Spots</Label>
                        <Input
                          id="evSpots"
                          type="number"
                          min="1"
                          value={data.parking.numberOfEVSpots || ""}
                          onChange={(e) => updateData('parking', 'numberOfEVSpots', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        const petTypes = [
          { id: "dogs", label: "Dogs", icon: "🐕" },
          { id: "cats", label: "Cats", icon: "🐈" },
          { id: "birds", label: "Birds", icon: "🦜" },
          { id: "fish", label: "Fish/Aquariums", icon: "🐠" },
        ]

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pet Policy</h2>
                <p className="text-muted-foreground">Define pet rules and restrictions</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pets Allowed</Label>
                    <p className="text-sm text-muted-foreground">
                      Are pets permitted in the building?
                    </p>
                  </div>
                  <Switch
                    checked={data.pets.allowed}
                    onCheckedChange={(checked) => updateData('pets', 'allowed', checked)}
                  />
                </div>

                {data.pets.allowed && (
                  <>
                    <Separator />

                    <div className="space-y-3">
                      <Label>Allowed Pet Types</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {petTypes.map((pet) => (
                          <Card
                            key={pet.id}
                            className={`cursor-pointer transition-all ${
                              data.pets.types.includes(pet.id)
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => togglePetType(pet.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{pet.icon}</span>
                                <span className="font-medium text-sm">{pet.label}</span>
                                {data.pets.types.includes(pet.id) && (
                                  <Check className="h-4 w-4 text-primary ml-auto" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxPets">Max Pets Per Unit</Label>
                        <Input
                          id="maxPets"
                          type="number"
                          min="1"
                          value={data.pets.maxPerUnit}
                          onChange={(e) => updateData('pets', 'maxPerUnit', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weightLimit">Weight Limit (lbs)</Label>
                        <Input
                          id="weightLimit"
                          type="number"
                          min="0"
                          placeholder="25"
                          value={data.pets.weightLimit || ""}
                          onChange={(e) => updateData('pets', 'weightLimit', parseInt(e.target.value) || 0)}
                        />
                        <p className="text-xs text-muted-foreground">Leave 0 for no weight limit</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Rental Policy</h2>
                <p className="text-muted-foreground">Configure rental and leasing rules</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rentals Allowed</Label>
                    <p className="text-sm text-muted-foreground">
                      Can units be rented out?
                    </p>
                  </div>
                  <Switch
                    checked={data.rentals.allowed}
                    onCheckedChange={(checked) => updateData('rentals', 'allowed', checked)}
                  />
                </div>

                {data.rentals.allowed && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="rentalRestrictions">Rental Restrictions</Label>
                      <Select
                        value={data.rentals.restrictions}
                        onValueChange={(value) => updateData('rentals', 'restrictions', value)}
                      >
                        <SelectTrigger id="rentalRestrictions">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Restrictions</SelectItem>
                          <SelectItem value="short_term_banned">Short-Term Rentals Banned</SelectItem>
                          <SelectItem value="all_regulated">All Rentals Regulated</SelectItem>
                          <SelectItem value="owner_occupied_only">Owner Occupied Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minimumPeriod">Minimum Rental Period (months)</Label>
                      <Input
                        id="minimumPeriod"
                        type="number"
                        min="1"
                        value={data.rentals.minimumPeriod}
                        onChange={(e) => updateData('rentals', 'minimumPeriod', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Typical: 6-12 months to prevent short-term vacation rentals
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Governance Structure</h2>
                <p className="text-muted-foreground">Setup council and meeting preferences</p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="councilSize">Council Size</Label>
                  <Input
                    id="councilSize"
                    type="number"
                    min="3"
                    max="9"
                    value={data.governance.councilSize}
                    onChange={(e) => updateData('governance', 'councilSize', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Typically 3-7 members for most buildings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingFrequency">Council Meeting Frequency</Label>
                  <Select
                    value={data.governance.meetingFrequency}
                    onValueChange={(value) => updateData('governance', 'meetingFrequency', value)}
                  >
                    <SelectTrigger id="meetingFrequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="bimonthly">Bi-Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                  <Input
                    id="fiscalYearEnd"
                    type="date"
                    value={`2024-${data.governance.fiscalYearEnd}`}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                      updateData('governance', 'fiscalYearEnd', monthDay)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Common: December 31st or March 31st
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Review & Complete</h2>
                <p className="text-muted-foreground">Review your building configuration</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Building Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{data.buildingInfo.name || "Not set"}</span>

                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{data.buildingInfo.address || "Not set"}</span>

                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium">{data.buildingInfo.city}, {data.buildingInfo.province}</span>

                    <span className="text-muted-foreground">Units:</span>
                    <span className="font-medium">{data.buildingInfo.totalUnits} units</span>

                    <span className="text-muted-foreground">Floors:</span>
                    <span className="font-medium">{data.buildingInfo.floors} floors</span>

                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{data.buildingInfo.buildingType}</span>
                  </div>
                </CardContent>
              </Card>

              {data.complexInfo.isComplex && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Complex Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Buildings:</span>
                      <span className="font-medium">{data.complexInfo.numberOfBuildings}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.amenities.length > 0 ? (
                      data.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="capitalize">
                          {amenity.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None selected</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Parking:</span>
                    <span className="font-medium">{data.parking.hasParking ? 'Available' : 'Not available'}</span>

                    {data.parking.hasParking && data.parking.hasEVCharging && (
                      <>
                        <span className="text-muted-foreground">EV Charging:</span>
                        <span className="font-medium">{data.parking.numberOfEVSpots} spots</span>
                      </>
                    )}

                    <span className="text-muted-foreground">Pets:</span>
                    <span className="font-medium">{data.pets.allowed ? 'Allowed' : 'Not allowed'}</span>

                    <span className="text-muted-foreground">Rentals:</span>
                    <span className="font-medium">{data.rentals.allowed ? 'Allowed' : 'Not allowed'}</span>

                    <span className="text-muted-foreground">Council Size:</span>
                    <span className="font-medium">{data.governance.councilSize} members</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <Badge
                key={index}
                variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                className="whitespace-nowrap text-xs"
              >
                {index < currentStep && <Check className="h-3 w-3 mr-1" />}
                {step}
              </Badge>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleComplete} size="lg">
              Complete Setup
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
