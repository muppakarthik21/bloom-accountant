import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Plus, FileDown, Share, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Types
interface Expense {
  id: number;
  date: Date;
  expenseType: string;
  expenseName: string;
  description: string;
  paymentMode: string;
  totalAmount: number;
  paid: number;
  balance: number;
  mobileNumber?: string;
  name?: string;
}

interface ExpenseFormData {
  expenseType: string;
  expenseName: string;
  mobileNumber: string;
  name: string;
  description: string;
  price: string;
}

// Expense categories with their subcategories
const expenseCategories = {
  Maintenance: ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Painting'],
  'Office Supplies': ['Stationery', 'Furniture', 'Equipment', 'Printing'],
  Utilities: ['Electricity', 'Water', 'Internet', 'Phone', 'Gas'],
  Transportation: ['Fuel', 'Vehicle Maintenance', 'Public Transport'],
  'Food & Catering': ['Staff Meals', 'Event Catering', 'Refreshments'],
  Technology: ['Software', 'Hardware', 'IT Support', 'Equipment'],
  'Educational Materials': ['Books', 'Supplies', 'Digital Resources'],
  'Staff Development': ['Training', 'Workshops', 'Conferences'],
  Infrastructure: ['Building Repairs', 'Renovations', 'Upgrades'],
  Miscellaneous: ['Other Expenses', 'Emergency Costs', 'Unexpected']
};

const paymentModes = [
  'BANK', 'CASH', 'CREDIT CARD', 'DEBIT CARD', 'CHEQUE', 'ONLINE TRANSFER', 'UPI', 'PETTY CASH'
];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    expenseType: '',
    expenseName: '',
    mobileNumber: '',
    name: '',
    description: '',
    price: ''
  });
  const [createFormData, setCreateFormData] = useState({
    paymentMode: '',
    totalAmount: '',
    paid: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredExpenses = expenses.filter(expense => {
    if (!fromDate && !toDate) return true;
    if (fromDate && !toDate) return expense.date >= fromDate;
    if (!fromDate && toDate) return expense.date <= toDate;
    return expense.date >= fromDate && expense.date <= toDate;
  });

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setShowAddModal(false);
    setShowCreateModal(true);
    setIsLoading(false);
    
    toast({
      title: "Step 1 Complete",
      description: "Now complete the payment details.",
    });
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const totalAmount = parseFloat(createFormData.totalAmount);
    const paid = parseFloat(createFormData.paid) || 0;
    const balance = totalAmount - paid;

    const newExpense: Expense = {
      id: expenses.length + 1,
      date: new Date(),
      expenseType: formData.expenseType,
      expenseName: formData.expenseName,
      description: formData.description,
      paymentMode: createFormData.paymentMode,
      totalAmount,
      paid,
      balance,
      mobileNumber: formData.mobileNumber || undefined,
      name: formData.name || undefined
    };

    setExpenses([...expenses, newExpense]);
    setShowCreateModal(false);
    resetForms();
    setIsLoading(false);
    
    toast({
      title: "Expense Created Successfully! ✨",
      description: `${formData.expenseType} expense of ₹${totalAmount} has been added.`,
    });
  };

  const resetForms = () => {
    setFormData({
      expenseType: '',
      expenseName: '',
      mobileNumber: '',
      name: '',
      description: '',
      price: ''
    });
    setCreateFormData({
      paymentMode: '',
      totalAmount: '',
      paid: ''
    });
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowCreateModal(false);
    resetForms();
  };

  const calculateBalance = () => {
    const total = parseFloat(createFormData.totalAmount) || 0;
    const paid = parseFloat(createFormData.paid) || 0;
    return total - paid;
  };

  return (
    <div className="animate-fade-in">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="secondary" className="bg-secondary hover:bg-secondary/80">
            <FileText className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-card rounded-lg border p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="from-date" className="text-sm font-medium">From:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "mm/dd/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="to-date" className="text-sm font-medium">To:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "mm/dd/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold text-muted-foreground">NO.</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">DATE</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">EXPENSE TYPE</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">EXPENSE NAME</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">DESCRIPTION</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">PAYMENT MODE</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">AMOUNT</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-12 text-muted-foreground">
                    <div className="animate-scale-in">
                      {!fromDate && !toDate ? (
                        <div>
                          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Select date range to view expenses</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg">No expenses found for the selected date range</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <tr 
                    key={expense.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium">{expense.id}</td>
                    <td className="p-4">{format(expense.date, 'dd/MM/yyyy')}</td>
                    <td className="p-4">{expense.expenseType}</td>
                    <td className="p-4">{expense.expenseName}</td>
                    <td className="p-4 max-w-xs truncate">{expense.description}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        {expense.paymentMode}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">₹{expense.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={cn(
                        "font-semibold",
                        expense.balance > 0 ? "text-warning" : "text-success"
                      )}>
                        ₹{expense.balance.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-glass w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Expense</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleModalClose}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <Label htmlFor="expense-type" className="text-sm font-medium mb-2 block">
                  Expense Type *
                </Label>
                <Select 
                  value={formData.expenseType} 
                  onValueChange={(value) => {
                    setFormData({ ...formData, expenseType: value, expenseName: '' });
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(expenseCategories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expense-name" className="text-sm font-medium mb-2 block">
                  Expense Name *
                </Label>
                <Select 
                  value={formData.expenseName} 
                  onValueChange={(value) => setFormData({ ...formData, expenseName: value })}
                  required
                  disabled={!formData.expenseType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense name" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.expenseType && expenseCategories[formData.expenseType as keyof typeof expenseCategories].map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mobile" className="text-sm font-medium mb-2 block">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter expense description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px] transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium mb-2 block">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary ripple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-glass w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Expense</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleModalClose}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Expense Type</Label>
                <Input
                  value={formData.expenseType}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Expense Name</Label>
                <Input
                  value={formData.expenseName}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  disabled
                  className="bg-muted min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="payment-mode" className="text-sm font-medium mb-2 block">
                  Payment Mode *
                </Label>
                <Select 
                  value={createFormData.paymentMode} 
                  onValueChange={(value) => setCreateFormData({ ...createFormData, paymentMode: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="total-amount" className="text-sm font-medium mb-2 block">
                  Total Amount *
                </Label>
                <Input
                  id="total-amount"
                  type="number"
                  placeholder="Enter total amount"
                  value={createFormData.totalAmount}
                  onChange={(e) => setCreateFormData({ ...createFormData, totalAmount: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="paid" className="text-sm font-medium mb-2 block">
                  Paid
                </Label>
                <Input
                  id="paid"
                  type="number"
                  placeholder="Enter paid amount"
                  value={createFormData.paid}
                  onChange={(e) => setCreateFormData({ ...createFormData, paid: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Balance</Label>
                <div className={cn(
                  "p-3 rounded-lg font-bold text-lg",
                  calculateBalance() > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                )}>
                  ₹{calculateBalance().toLocaleString()}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary ripple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit Expense
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;