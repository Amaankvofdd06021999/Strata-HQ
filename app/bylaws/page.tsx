"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Scale, Download, Copy, Search, Edit, Plus, FileText, Clock, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

// Mock bylaw data
const mockBylaws = [
  {
    id: "1",
    section: "1.0",
    title: "General Provisions",
    category: "general",
    content: `This bylaw establishes the fundamental governance framework for Harborview Towers Strata Corporation. All residents, council members, and property managers must adhere to these provisions.

Key Points:
• These bylaws take precedence over house rules but are subject to provincial strata legislation
• Council has authority to enforce bylaws and impose reasonable fines
• Amendments require a 3/4 vote at a general meeting
• All owners and tenants must receive a copy of current bylaws`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-11-20"
  },
  {
    id: "2",
    section: "2.0",
    title: "Pets and Animals",
    category: "pets",
    content: `Pets are permitted in accordance with the following regulations:

Allowed Pets:
• Dogs: Maximum 2 per unit, weight limit of 25 lbs each
• Cats: Maximum 2 per unit
• Caged birds and fish tanks under 50 gallons

Prohibited:
• Aggressive breeds as defined by insurance policy
• Reptiles over 3 feet in length
• Farm animals or livestock

Requirements:
• All pets must be registered with strata management
• Dogs must be leashed in common areas
• Owners responsible for immediate cleanup
• Excessive noise or aggressive behavior will result in removal requirement
• $500 pet deposit required (refundable)`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-06-10"
  },
  {
    id: "3",
    section: "3.0",
    title: "Parking and Vehicles",
    category: "parking",
    content: `Parking regulations for all residents and visitors:

Resident Parking:
• One assigned parking spot per unit (see strata plan)
• Additional spots available for purchase subject to availability
• EV charging stations available for units 401-842 (even floors)
• Vehicles must display valid parking pass

Visitor Parking:
• Located on P1 level, spots 1-15
• Maximum 4 hour stay between 8 AM - 10 PM
• Overnight visitor parking requires council approval
• Visitor passes available from concierge

Violations:
• Unauthorized vehicles will be towed at owner's expense
• Storing inoperable vehicles prohibited
• Commercial vehicles over 2 tons prohibited
• Working on vehicles prohibited (except EV charging)`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-09-15"
  },
  {
    id: "4",
    section: "4.0",
    title: "Noise and Quiet Hours",
    category: "noise",
    content: `To ensure peaceful enjoyment of all residents:

Quiet Hours:
• 10 PM - 8 AM on weekdays
• 11 PM - 9 AM on weekends and holidays

Noise Guidelines:
• Keep television, music, and voices at reasonable levels at all times
• No loud activities during quiet hours (parties, renovations, moving)
• Courtyard and rooftop amenities close at 10 PM
• Musical instruments permitted until 9 PM with closed windows

Renovations:
• Permitted Monday-Friday 9 AM - 5 PM
• Saturday 10 AM - 4 PM
• No renovations on Sundays or statutory holidays
• Advance notice required to adjacent units`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-03-22"
  },
  {
    id: "5",
    section: "5.0",
    title: "Alterations and Renovations",
    category: "alterations",
    content: `Prior written approval required for all alterations:

Requires Council Approval:
• Any structural changes or modifications
• Plumbing or electrical work
• Installation of hardwood or tile flooring
• Balcony modifications or additions
• Window replacements or tinting

Approval Process:
• Submit Form 7 with detailed plans
• Include contractor information and insurance
• Timeline and noise mitigation plan required
• Council response within 14 business days
• Building permit required for structural work

Standards:
• All work must meet BC Building Code
• Licensed and insured contractors required
• Underlay required for hard flooring (minimum 6mm)
• Original building exterior must be maintained`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-07-08"
  },
  {
    id: "6",
    section: "6.0",
    title: "Rental and Short-Term Accommodation",
    category: "rentals",
    content: `Rental regulations and restrictions:

Long-Term Rentals:
• Permitted with advance written notice to council
• Minimum 12-month lease term required
• Form F must be filed within 2 weeks of tenancy start
• Maximum 30% of units may be rented (currently at 22%)
• Landlords responsible for tenant bylaw compliance

Short-Term Rentals:
• Airbnb, VRBO and similar platforms strictly prohibited
• Minimum rental period is 12 months
• Violations subject to $500/day fines

Owner Occupancy:
• At least one owner must occupy unit if not rented
• Maximum 30 consecutive days vacant unless notice filed

Guest Suites:
• Building guest suite available for owner's guests (2-night maximum)
• Not available for tenant use`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-10-30"
  },
  {
    id: "7",
    section: "7.0",
    title: "Common Areas and Amenities",
    category: "common_areas",
    content: `Rules governing shared spaces and facilities:

General Rules:
• Common areas for residents and approved guests only
• Children under 14 must be supervised
• Appropriate attire required at all times
• No glass containers in pool or hot tub areas
• Clean up after use and report any damage

Booking Requirements:
• Party room, guest suite, and rooftop require advance booking
• Maximum 2 bookings per unit per month
• Cancellations require 48 hours notice
• $500 refundable damage deposit required

Gym Facilities:
• Open 5 AM - 11 PM daily
• Maximum 90-minute sessions during peak hours (5-8 PM)
• Proper athletic attire and clean indoor shoes required
• Wipe down equipment after use
• Personal trainers require council approval

Pool and Hot Tub:
• Open year-round, hours posted seasonally
• Shower before entering
• No food or beverages except water in sealed containers
• Maximum 20 minute hot tub sessions
• Children must pass swim test or wear lifejacket`,
    effectiveDate: "2023-01-15",
    lastAmended: "2024-05-12"
  }
]

export default function BylawsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { value: "all", label: "All Bylaws" },
    { value: "general", label: "General" },
    { value: "pets", label: "Pets" },
    { value: "parking", label: "Parking" },
    { value: "noise", label: "Noise" },
    { value: "alterations", label: "Alterations" },
    { value: "rentals", label: "Rentals" },
    { value: "common_areas", label: "Common Areas" }
  ]

  const filteredBylaws = mockBylaws.filter(bylaw => {
    const matchesSearch = bylaw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bylaw.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bylaw.section.includes(searchQuery)
    const matchesCategory = selectedCategory === "all" || bylaw.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopyBylaw = (bylaw: typeof mockBylaws[0]) => {
    const text = `Section ${bylaw.section}: ${bylaw.title}\n\n${bylaw.content}`
    navigator.clipboard.writeText(text)
    toast.success("Bylaw copied to clipboard")
  }

  const handleDownloadAll = () => {
    toast.success("Downloading complete bylaw document...")
    // In a real app, this would generate a PDF
  }

  const handleCopyAll = () => {
    const allText = mockBylaws.map(b =>
      `Section ${b.section}: ${b.title}\n\n${b.content}\n\n${'='.repeat(80)}\n\n`
    ).join('')
    navigator.clipboard.writeText(allText)
    toast.success("All bylaws copied to clipboard")
  }

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Building Bylaws
          </h1>
          <p className="text-muted-foreground mt-2">
            Official strata bylaws and regulations for Harborview Towers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCopyAll}>
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
          <Button variant="outline" onClick={handleDownloadAll}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Link href="/bylaws/builder">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Bylaw Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sections</p>
                <p className="text-2xl font-bold">{mockBylaws.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-2xl font-bold">Nov 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Effective Date</p>
                <p className="text-2xl font-bold">Jan 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bylaws..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.value)}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bylaws List */}
      <div className="space-y-4">
        {filteredBylaws.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bylaws found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBylaws.map((bylaw) => (
            <Card key={bylaw.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        Section {bylaw.section}
                      </Badge>
                      <Badge variant="secondary">
                        {bylaw.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{bylaw.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span>Effective: {new Date(bylaw.effectiveDate).toLocaleDateString()}</span>
                      {bylaw.lastAmended && (
                        <span>Last Amended: {new Date(bylaw.lastAmended).toLocaleDateString()}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyBylaw(bylaw)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {bylaw.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </ProtectedLayout>
  )
}
