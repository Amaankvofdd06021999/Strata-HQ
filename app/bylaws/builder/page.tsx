"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Save, FileText, Eye, Download, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ProtectedLayout } from "@/components/protected-layout"

interface BylawSection {
  id: string
  number: string
  title: string
  category: string
  content: string
}

const bylawTemplates = [
  {
    category: "pets",
    title: "Pet Regulations",
    template: `Pets are permitted subject to the following conditions:

Allowed Pets:
• [Specify allowed pet types]
• [Maximum number per unit]
• [Weight/size restrictions]

Requirements:
• All pets must be registered with strata
• Owners responsible for cleanup and damages
• [Additional requirements]

Prohibited:
• [List prohibited animals or behaviors]`
  },
  {
    category: "parking",
    title: "Parking Rules",
    template: `Parking regulations for residents and visitors:

Assigned Parking:
• [Number of spaces per unit]
• [Location and numbering system]
• [Guest parking availability]

Requirements:
• Valid parking passes must be displayed
• [Additional parking rules]

Violations:
• Unauthorized vehicles may be towed at owner's expense`
  },
  {
    category: "noise",
    title: "Noise and Quiet Hours",
    template: `To ensure peaceful enjoyment for all residents:

Quiet Hours:
• [Weekday hours]
• [Weekend hours]

Guidelines:
• Keep noise at reasonable levels
• [Renovation hours]
• [Additional noise restrictions]`
  }
]

export default function BylawBuilderPage() {
  const [sections, setSections] = useState<BylawSection[]>([])
  const [buildingName, setBuildingName] = useState("")
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [currentSection, setCurrentSection] = useState<BylawSection>({
    id: Math.random().toString(),
    number: "1.0",
    title: "",
    category: "general",
    content: ""
  })

  const categories = [
    { value: "general", label: "General Provisions" },
    { value: "pets", label: "Pets and Animals" },
    { value: "parking", label: "Parking and Vehicles" },
    { value: "noise", label: "Noise Regulations" },
    { value: "alterations", label: "Alterations and Renovations" },
    { value: "rentals", label: "Rental Restrictions" },
    { value: "common_areas", label: "Common Areas" },
    { value: "governance", label: "Governance" },
    { value: "financial", label: "Financial" },
    { value: "other", label: "Other" }
  ]

  const addSection = () => {
    if (!currentSection.title || !currentSection.content) {
      toast.error("Please fill in section title and content")
      return
    }

    setSections([...sections, currentSection])
    setCurrentSection({
      id: Math.random().toString(),
      number: (parseFloat(currentSection.number) + 1).toFixed(1),
      title: "",
      category: "general",
      content: ""
    })
    toast.success("Section added")
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
    toast.success("Section removed")
  }

  const applyTemplate = (template: typeof bylawTemplates[0]) => {
    setCurrentSection({
      ...currentSection,
      title: template.title,
      category: template.category,
      content: template.template
    })
    toast.success("Template applied")
  }

  const handleSave = () => {
    if (sections.length === 0) {
      toast.error("Please add at least one bylaw section")
      return
    }
    if (!buildingName) {
      toast.error("Please enter building name")
      return
    }

    toast.success("Bylaws saved successfully!")
    // In real app, save to backend
  }

  const handleDownload = () => {
    toast.success("Downloading bylaws as PDF...")
    // In real app, generate PDF
  }

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href="/bylaws">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bylaws
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Bylaw Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create and customize bylaws for your strata building
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Building Info */}
          <Card>
            <CardHeader>
              <CardTitle>Building Information</CardTitle>
              <CardDescription>Basic details for your bylaw document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building/Strata Name</Label>
                  <Input
                    id="buildingName"
                    placeholder="e.g., Harborview Towers"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Section Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>New Bylaw Section</CardTitle>
                  <CardDescription>Add a new section to your bylaws</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">
                  Section {currentSection.number}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionNumber">Section Number</Label>
                  <Input
                    id="sectionNumber"
                    value={currentSection.number}
                    onChange={(e) => setCurrentSection({...currentSection, number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentSection.category}
                    onValueChange={(value) => setCurrentSection({...currentSection, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pet Regulations"
                  value={currentSection.title}
                  onChange={(e) => setCurrentSection({...currentSection, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <div className="text-sm text-muted-foreground">
                    Quick templates:
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {bylawTemplates.map(template => (
                    <Button
                      key={template.category}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
                <Textarea
                  id="content"
                  rows={12}
                  placeholder="Enter the bylaw content here... You can use templates above or write your own."
                  value={currentSection.content}
                  onChange={(e) => setCurrentSection({...currentSection, content: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={addSection} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Bylaws
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
              <CardDescription>
                {sections.length} section{sections.length !== 1 ? 's' : ''} added
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No sections added yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b">
                      <h2 className="text-lg font-bold">{buildingName || "Untitled"}</h2>
                      <p className="text-sm text-muted-foreground">
                        Strata Bylaws
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Effective: {new Date(effectiveDate).toLocaleDateString()}
                      </p>
                    </div>

                    {sections.map((section, index) => (
                      <div key={section.id} className="pb-4 border-b last:border-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Badge variant="outline" className="font-mono text-xs mb-1">
                              Section {section.number}
                            </Badge>
                            <h3 className="font-semibold text-sm">{section.title}</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {section.content.slice(0, 150)}
                          {section.content.length > 150 && "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </ProtectedLayout>
  )
}
