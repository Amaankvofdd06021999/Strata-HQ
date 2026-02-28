'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Plus, Search, FileText, Download, Eye, Upload, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDocuments } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  // Filter documents based on access level
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;

    // Check access permissions
    let hasAccess = true;
    if (doc.accessLevel === 'council' && !isCouncilOrManager) {
      hasAccess = false;
    }
    if (doc.accessLevel === 'manager' && user?.role !== 'property_manager' && user?.role !== 'admin') {
      hasAccess = false;
    }

    return matchesSearch && matchesCategory && matchesType && hasAccess;
  });

  // Group by category
  const governanceDocs = filteredDocuments.filter(d => d.category === 'Governance');
  const financialDocs = filteredDocuments.filter(d => d.category === 'Financial');
  const policyDocs = filteredDocuments.filter(d => d.category === 'Policies');
  const insuranceDocs = filteredDocuments.filter(d => d.category === 'Insurance');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = (fileType: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getAccessBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case 'all':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Public</Badge>;
      case 'council':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Council Only</Badge>;
      case 'manager':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Manager Only</Badge>;
      default:
        return <Badge variant="secondary">Restricted</Badge>;
    }
  };

  const DocumentCard = ({ document }: { document: typeof mockDocuments[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
            {getTypeIcon(document.fileType)}
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg leading-tight">{document.title}</h3>
                {getAccessBadge(document.accessLevel)}
              </div>
              {document.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {document.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Type:</span> {document.fileType}
              </div>
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(document.size)}
              </div>
              <div>
                <span className="font-medium">Version:</span> {document.version}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Uploaded:</span> {formatDate(document.uploadedDate)}
              </div>
              <div>
                <span className="font-medium">Category:</span> {document.category}
              </div>
            </div>

            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8" />
              Documents
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Access building documents and files
            </p>
          </div>
          {isCouncilOrManager && (
            <Button size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredDocuments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Governance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{governanceDocs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Financial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialDocs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{policyDocs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-[1fr,200px,200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
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
                  <SelectItem value="Governance">Governance</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Policies">Policies</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bylaw">Bylaws</SelectItem>
                  <SelectItem value="policy">Policies</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="meeting_minutes">Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-base py-3">
              All
              <Badge variant="secondary" className="ml-2">{filteredDocuments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="governance" className="text-base py-3">
              Governance
              <Badge variant="secondary" className="ml-2">{governanceDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-base py-3">
              Financial
              <Badge variant="secondary" className="ml-2">{financialDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-base py-3">
              Policies
              <Badge variant="secondary" className="ml-2">{policyDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="text-base py-3">
              Insurance
              <Badge variant="secondary" className="ml-2">{insuranceDocs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="governance" className="space-y-4">
            {governanceDocs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No governance documents</h3>
                  <p className="text-muted-foreground">Governance documents will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {governanceDocs.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            {financialDocs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No financial documents</h3>
                  <p className="text-muted-foreground">Financial documents will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {financialDocs.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            {policyDocs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No policy documents</h3>
                  <p className="text-muted-foreground">Policy documents will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {policyDocs.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            {insuranceDocs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No insurance documents</h3>
                  <p className="text-muted-foreground">Insurance documents will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {insuranceDocs.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
