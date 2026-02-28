'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { DollarSign, Download, TrendingUp, TrendingDown, Calendar, FileText, CreditCard, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils-extended';
import { useAuth } from '@/lib/auth-context';

// Financial data mock
const mockFinancialStatements = [
  {
    id: 'fs-1',
    period: 'Q1 2026',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    totalRevenue: 125000,
    totalExpenses: 98500,
    netIncome: 26500,
    status: 'final',
    fileUrl: '#'
  },
  {
    id: 'fs-2',
    period: 'Q4 2025',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    totalRevenue: 118000,
    totalExpenses: 102000,
    netIncome: 16000,
    status: 'final',
    fileUrl: '#'
  },
  {
    id: 'fs-3',
    period: 'Q3 2025',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    totalRevenue: 115000,
    totalExpenses: 95000,
    netIncome: 20000,
    status: 'final',
    fileUrl: '#'
  },
];

const mockBudgets = [
  {
    id: 'bg-1',
    year: 2026,
    totalBudget: 480000,
    categories: [
      { name: 'Property Management', budgeted: 120000, spent: 30000, percentage: 25 },
      { name: 'Maintenance & Repairs', budgeted: 150000, spent: 38000, percentage: 25 },
      { name: 'Utilities', budgeted: 80000, spent: 22000, percentage: 28 },
      { name: 'Insurance', budgeted: 60000, spent: 15000, percentage: 25 },
      { name: 'Landscaping', budgeted: 30000, spent: 5000, percentage: 17 },
      { name: 'Reserve Fund', budgeted: 40000, spent: 10000, percentage: 25 },
    ],
    status: 'active'
  },
  {
    id: 'bg-2',
    year: 2025,
    totalBudget: 450000,
    categories: [
      { name: 'Property Management', budgeted: 115000, spent: 115000, percentage: 100 },
      { name: 'Maintenance & Repairs', budgeted: 140000, spent: 138000, percentage: 99 },
      { name: 'Utilities', budgeted: 75000, spent: 78000, percentage: 104 },
      { name: 'Insurance', budgeted: 55000, spent: 55000, percentage: 100 },
      { name: 'Landscaping', budgeted: 28000, spent: 26000, percentage: 93 },
      { name: 'Reserve Fund', budgeted: 37000, spent: 37000, percentage: 100 },
    ],
    status: 'closed'
  },
];

const mockInvoices = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    vendor: 'ABC Maintenance Services',
    description: 'Monthly building maintenance - February 2026',
    amount: 5500,
    dueDate: '2026-03-15',
    issueDate: '2026-02-01',
    status: 'paid',
    paidDate: '2026-02-28'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    vendor: 'ProClean Solutions',
    description: 'Common area cleaning services',
    amount: 2200,
    dueDate: '2026-03-10',
    issueDate: '2026-02-25',
    status: 'pending',
    paidDate: null
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    vendor: 'BC Hydro',
    description: 'Electricity - Common areas',
    amount: 3800,
    dueDate: '2026-03-20',
    issueDate: '2026-02-28',
    status: 'pending',
    paidDate: null
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    vendor: 'Elite Electrical Ltd',
    description: 'Emergency lighting repair',
    amount: 1200,
    dueDate: '2026-03-05',
    issueDate: '2026-02-15',
    status: 'overdue',
    paidDate: null
  },
];

const mockPayments = [
  {
    id: 'pay-1',
    unit: '301',
    ownerName: 'John Smith',
    period: 'March 2026',
    amount: 450,
    dueDate: '2026-03-01',
    paidDate: '2026-02-28',
    status: 'paid',
    type: 'strata_fee'
  },
  {
    id: 'pay-2',
    unit: '405',
    ownerName: 'Sarah Johnson',
    period: 'March 2026',
    amount: 450,
    dueDate: '2026-03-01',
    paidDate: null,
    status: 'pending',
    type: 'strata_fee'
  },
  {
    id: 'pay-3',
    unit: '202',
    ownerName: 'Mike Chen',
    period: 'March 2026',
    amount: 450,
    dueDate: '2026-03-01',
    paidDate: null,
    status: 'overdue',
    type: 'strata_fee'
  },
];

export default function FinancialPage() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2026');

  const isCouncilOrManager = user?.role === 'council_member' || user?.role === 'property_manager' || user?.role === 'admin';

  const currentBudget = mockBudgets.find(b => b.year === parseInt(selectedYear));
  const totalSpent = currentBudget?.categories.reduce((sum, cat) => sum + cat.spent, 0) || 0;
  const budgetPercentage = currentBudget ? Math.round((totalSpent / currentBudget.totalBudget) * 100) : 0;

  const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue');
  const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid');

  const paidPayments = mockPayments.filter(p => p.status === 'paid');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const overduePayments = mockPayments.filter(p => p.status === 'overdue');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'final': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600';
    if (percentage > 90) return 'text-orange-600';
    if (percentage > 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Access control
  if (!isCouncilOrManager) {
    return (
      <ProtectedLayout>
        <div className="p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto mt-12">
            <CardContent className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                Financial information is only accessible to Council Members and Property Managers.
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
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <DollarSign className="h-8 w-8" />
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Budgets, statements, invoices, and payments
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Annual Budget {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentBudget?.totalBudget || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {budgetPercentage}% spent
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0))} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payment Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((paidPayments.length / mockPayments.length) * 100)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {paidPayments.length} of {mockPayments.length} paid
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="statements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="statements" className="text-base py-3">
              Statements
            </TabsTrigger>
            <TabsTrigger value="budget" className="text-base py-3">
              Budget
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-base py-3">
              Invoices
              {overdueInvoices.length > 0 && (
                <Badge variant="destructive" className="ml-2">{overdueInvoices.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-base py-3">
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Financial Statements */}
          <TabsContent value="statements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Statements</CardTitle>
                <CardDescription>
                  Quarterly financial statements and reports
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {mockFinancialStatements.map((statement) => (
                <Card key={statement.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{statement.period} Financial Statement</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(statement.startDate)} - {formatDate(statement.endDate)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(statement.status)}>
                            {statement.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                            <p className="text-lg font-semibold text-green-600 flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {formatCurrency(statement.totalRevenue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
                            <p className="text-lg font-semibold text-red-600 flex items-center gap-1">
                              <TrendingDown className="h-4 w-4" />
                              {formatCurrency(statement.totalExpenses)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                            <p className="text-lg font-semibold">{formatCurrency(statement.netIncome)}</p>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget */}
          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Annual Budget</CardTitle>
                    <CardDescription>
                      Budget breakdown and spending tracking
                    </CardDescription>
                  </div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {currentBudget && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentBudget.year} Budget Summary</CardTitle>
                      <CardDescription>
                        Total Budget: {formatCurrency(currentBudget.totalBudget)}
                      </CardDescription>
                    </div>
                    <Badge variant={currentBudget.status === 'active' ? 'default' : 'secondary'}>
                      {currentBudget.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentBudget.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                          </span>
                          <span className={`font-semibold ${getBudgetColor(category.percentage)}`}>
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            category.percentage > 100 ? 'bg-red-500' :
                            category.percentage > 90 ? 'bg-orange-500' :
                            category.percentage > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Bills</CardTitle>
                <CardDescription>
                  Track and manage vendor invoices and payments
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{invoice.vendor}</h3>
                            <p className="text-sm text-muted-foreground">{invoice.description}</p>
                          </div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t">
                          <div>
                            <p className="text-muted-foreground mb-1">Invoice #</p>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Due Date</p>
                            <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Amount</p>
                            <p className="font-semibold text-lg">{formatCurrency(invoice.amount)}</p>
                          </div>
                        </div>
                      </div>

                      {invoice.status === 'pending' && (
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Strata Fee Payments</CardTitle>
                <CardDescription>
                  Monthly strata fee payment tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {mockPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">Unit {payment.unit} - {payment.ownerName}</h3>
                            <p className="text-sm text-muted-foreground">{payment.period}</p>
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t">
                          <div>
                            <p className="text-muted-foreground mb-1">Amount</p>
                            <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Due Date</p>
                            <p className="font-medium">{formatDate(payment.dueDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">
                              {payment.paidDate ? 'Paid Date' : 'Status'}
                            </p>
                            <p className="font-medium">
                              {payment.paidDate ? formatDate(payment.paidDate) : payment.status.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
