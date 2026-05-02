import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AccountantSidebar from '@/src/account/common/AccountantSidebar';
import AccountantTopBar from '@/src/account/common/AccountantTopBar';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight, Trash2, Eye, ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Head from 'next/head';
import PhoneDisplay from '@/components/common/PhoneDisplay';
import TruncatedText from '@/components/common/TruncatedText/TruncatedText';

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  formType: string;
  ipAddress: string;
  status?: 'reached' | 'unreached';
  metadata: {
    country?: string;
    message?: string;
    [key: string]: any;
  };
  inquiry?: string;
  description?: string;
  createdAt: string;
}

const LeadsManagement = () => {
  const { authenticated, loading, isAccountant, setCurrentTab } = useContext(UserContext);

  // Helper function to format relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays <= 7) {
      return `${diffInDays} days ago`;
    } else {
      return null; // Show full date for older entries
    }
  };

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDays, setFilterDays] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const leadsPerPage = 50;
  const [newLead, setNewLead] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    message: '',
    formType: 'manual',
    status: 'unreached',
    ipAddress: 'Manual Entry',
    country: 'Manual Entry'
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      
      if (res.ok) {
        const leadsArray = await res.json();
        
        // Apply search and filter
        let filteredLeads = Array.isArray(leadsArray) ? leadsArray : [];
        
        // Search filter
        if (searchTerm) {
          filteredLeads = filteredLeads.filter(lead => 
            lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone?.includes(searchTerm) ||
            lead.course?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Date filter
        if (filterDays !== 'all') {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Start of today
          
          let filterDate: Date;
          
          if (filterDays === 'today') {
            // Today: from start of today to end of today
            const endOfToday = new Date(today);
            endOfToday.setHours(23, 59, 59, 999);
            
            filteredLeads = filteredLeads.filter(lead => {
              const leadDate = new Date(lead.createdAt);
              return leadDate >= today && leadDate <= endOfToday;
            });
          } else if (filterDays === 'yesterday') {
            // Yesterday: from start of yesterday to end of yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);
            
            filteredLeads = filteredLeads.filter(lead => {
              const leadDate = new Date(lead.createdAt);
              return leadDate >= yesterday && leadDate <= endOfYesterday;
            });
          } else if (filterDays === 'custom' && customDate) {
            // Custom date: from start of selected date to end of selected date
            const selectedDate = new Date(customDate);
            selectedDate.setHours(0, 0, 0, 0);
            const endOfSelectedDate = new Date(selectedDate);
            endOfSelectedDate.setHours(23, 59, 59, 999);
            
            filteredLeads = filteredLeads.filter(lead => {
              const leadDate = new Date(lead.createdAt);
              return leadDate >= selectedDate && leadDate <= endOfSelectedDate;
            });
          }
        }
        
        // Sort by date
        filteredLeads.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          
          if (sortOrder === 'newest') {
            return dateB - dateA; // Newest first
          } else {
            return dateA - dateB; // Oldest first
          }
        });
        
        setTotalLeads(filteredLeads.length);
        
        // Pagination
        const startIndex = (currentPage - 1) * leadsPerPage;
        const paginatedLeads = filteredLeads.slice(startIndex, startIndex + leadsPerPage);
        
        setLeads(paginatedLeads);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch leads');
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchLeads();
      setCurrentTab("leads");
    }
  }, [authenticated, currentPage, searchTerm, filterDays, customDate, sortOrder]);

  const handleAddLead = async () => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Lead added successfully');
        setIsAddDialogOpen(false);
        setNewLead({
          fullName: '',
          email: '',
          phone: '',
          course: '',
          message: '',
          formType: 'manual',
          status: 'unreached',
          ipAddress: 'Manual Entry',
          country: 'Manual Entry'
        });
        fetchLeads();
      } else {
        throw new Error(data.message || 'Failed to add lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const res = await fetch(`/api/leads?id=${leadId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Lead deleted successfully');
        fetchLeads();
      } else {
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingLead({ ...lead }); // Create a copy for editing
    setIsViewDialogOpen(true);
  };

  const handleUpdateLead = async () => {
    if (!editingLead || !selectedLead) return;
    
    try {
      const res = await fetch(`/api/leads?id=${selectedLead._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editingLead.fullName,
          email: editingLead.email,
          phone: editingLead.phone,
          course: editingLead.course,
          message: editingLead.message,
          formType: editingLead.formType,
          ipAddress: editingLead.ipAddress,
          status: editingLead.status,
          metadata: editingLead.metadata
        })
      });

      if (res.ok) {
        toast.success('Lead updated successfully');
        setIsViewDialogOpen(false);
        fetchLeads();
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const handleStatusToggle = async (leadId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'reached' ? 'unreached' : 'reached';
    
    try {
      const res = await fetch(`/api/leads?id=${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Lead marked as ${newStatus}`);
        fetchLeads(); // Refresh the leads list
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const totalPages = Math.ceil(totalLeads / leadsPerPage);

  const createInvoiceFromLead = (lead: Lead) => {
    // Pre-fill manual invoice form with lead data
    const params = new URLSearchParams({
      customerName: lead.fullName,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      courseTitle: lead.course || 'Course Training',
      courseCategory: 'General',
      source: `${lead.formType}_lead`
    });
    
    window.open(`/accountant/dashboard/create-manual-invoice?${params.toString()}`, '_blank');
  };

  return (
    <React.Fragment>
      <Head>
        <title>Leads Management | Accountant Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAccountant) ? (
        <SignOut />
      ) : (
        <div className='w-full h-screen flex'>
          <AccountantSidebar />
          <div className='flex-1 bg-[#000] flex flex-col overflow-hidden'>
            <AccountantTopBar />

            <div className="flex-1 bg-black overflow-auto">
              <div className="p-6 min-w-0">
                <div className='w-full flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-4'>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-white">Leads Management</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                      Showing {leads.length} of {totalLeads} leads (Page {currentPage} of {totalPages})
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center flex-shrink-0">
                    <Button onClick={() => setIsAddDialogOpen(true)} variant="manual" className="flex gap-2">
                      <Plus className='w-5 h-5' />
                      Add Lead
                    </Button>
                  </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder="Search by name, email, course..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className="bg-zinc-900 border-zinc-700 text-white w-full"
                    />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => {
                      setSortOrder(value);
                      setCurrentPage(1); // Reset to first page on sort
                    }}>
                      <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="Sort by date" />
                      </SelectTrigger>
                      <SelectContent className="bg-red-800 border-zinc-700">
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDays} onValueChange={(value) => {
                      setFilterDays(value);
                      setCurrentPage(1); // Reset to first page on filter
                      // Clear custom date if not selecting custom
                      if (value !== 'custom') {
                        setCustomDate('');
                      }
                    }}>
                      <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent className="bg-red-800 border-zinc-700">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="custom">Custom Date</SelectItem>
                      </SelectContent>
                    </Select>
                    {filterDays === 'custom' && (
                      <input
                        type="date"
                        value={customDate}
                        max={new Date().toISOString().split('T')[0]} // Only allow past dates and today
                        onChange={(e) => {
                          setCustomDate(e.target.value);
                          setCurrentPage(1); // Reset to first page on date change
                        }}
                        className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Select date"
                      />
                    )}
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 whitespace-nowrap">
                      Download PDF
                    </Button>
                  </div>
                </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto min-w-full">
                    <table className="w-full min-w-[1200px]">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="text-left p-4 text-white font-medium min-w-[120px]">Name</th>
                          <th className="text-left p-4 text-white font-medium min-w-[200px]">Email</th>
                          <th className="text-left p-4 text-white font-medium min-w-[120px]">Phone</th>
                          <th className="text-left p-4 text-white font-medium min-w-[200px]">Course</th>
                          <th className="text-left p-4 text-white font-medium min-w-[200px]">Message</th>
                          <th className="text-left p-4 text-white font-medium min-w-[120px]">Form Type</th>
                          <th className="text-left p-4 text-white font-medium min-w-[100px]">Status</th>
                          <th className="text-left p-4 text-white font-medium min-w-[150px]">IP Address</th>
                          <th className="text-left p-4 text-white font-medium min-w-[100px]">Country</th>
                          <th 
                            className="text-left p-4 text-white font-medium min-w-[150px] cursor-pointer hover:bg-zinc-700 transition-colors"
                            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                            title="Click to sort by date"
                          >
                            <div className="flex items-center gap-1">
                              Date & Time
                              <span className="text-xs">
                                {sortOrder === 'newest' ? '↓' : '↑'}
                              </span>
                            </div>
                          </th>
                          <th className="text-left p-4 text-white font-medium min-w-[200px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="p-4 min-w-[120px]">
                              <div className="text-white font-medium truncate">{lead.fullName || '-'}</div>
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <div className="text-white truncate">{lead.email || '-'}</div>
                            </td>
                            <td className="p-4 min-w-[120px]">
                              <PhoneDisplay phone={lead.phone} />
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <TruncatedText 
                                text={lead.course || ''} 
                                wordLimit={10}
                                className="text-white"
                              />
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <TruncatedText 
                                text={lead.message || lead.metadata?.message || ''} 
                                wordLimit={10}
                                className="text-white"
                              />
                            </td>
                            <td className="p-4 min-w-[120px]">
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                {lead.formType || 'Unknown'}
                              </Badge>
                            </td>
                            <td className="p-4 min-w-[100px]">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={(lead.status || 'unreached') === 'reached'}
                                  onChange={() => handleStatusToggle(lead._id, lead.status || 'unreached')}
                                  className="w-4 h-4 text-green-600 bg-zinc-900 border-zinc-600 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <span className={`text-xs ${(lead.status || 'unreached') === 'reached' ? 'text-green-500' : 'text-orange-500'}`}>
                                  {(lead.status || 'unreached') === 'reached' ? 'Reached' : 'Unreached'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 min-w-[150px]">
                              <div className="text-zinc-400 text-sm font-mono truncate">{lead.ipAddress || '-'}</div>
                            </td>
                            <td className="p-4 min-w-[100px]">
                              <div className="text-white truncate">{lead.metadata?.country || '-'}</div>
                            </td>
                            <td className="p-4 text-zinc-400 text-sm min-w-[150px]">
                              <div className="flex flex-col">
                                <div className="text-white text-sm font-medium">
                                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-zinc-500 text-xs">
                                  {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </div>
                                {(() => {
                                  const relativeTime = getRelativeTime(lead.createdAt);
                                  return relativeTime ? (
                                    <div className="text-blue-400 text-xs font-medium">
                                      {relativeTime}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <div className="flex gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewLead(lead)}
                                  className="flex items-center gap-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteLead(lead._id)}
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {leads.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-zinc-500">
                      No leads found. {searchTerm || filterDays !== 'all' ? 'Try adjusting your search or filter.' : 'Add leads manually or check form submissions.'}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-zinc-800">
                      <div className="text-zinc-400 text-sm">
                        Showing {((currentPage - 1) * leadsPerPage) + 1} to {Math.min(currentPage * leadsPerPage, totalLeads)} of {totalLeads} leads
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-white">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details - {selectedLead?.fullName}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              View and edit complete lead information.
            </DialogDescription>
          </DialogHeader>
          
          {editingLead && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-300">Full Name</Label>
                    <Input
                      value={editingLead.fullName || ''}
                      onChange={(e) => setEditingLead(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-300">Email</Label>
                    <Input
                      type="email"
                      value={editingLead.email || ''}
                      onChange={(e) => setEditingLead(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-300">Phone</Label>
                    <div className="phone-input-container">
                      <Input
                        value={editingLead.phone || ''}
                        onChange={(e) => setEditingLead(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        className="bg-zinc-900 border-zinc-700 text-white"
                        placeholder="Enter phone number with country code"
                      />
                      <div className="mt-1">
                        <PhoneDisplay phone={editingLead.phone || ''} className="text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-300">Course Interest</Label>
                    <Input
                      value={editingLead.course || ''}
                      onChange={(e) => setEditingLead(prev => prev ? { ...prev, course: e.target.value } : null)}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Enter course interest"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Message</h3>
                <div>
                  <Label className="text-zinc-300">Lead Message</Label>
                  <textarea
                    value={editingLead.message || ''}
                    onChange={(e) => setEditingLead(prev => prev ? { ...prev, message: e.target.value } : null)}
                    className="w-full min-h-[120px] bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 resize-vertical"
                    placeholder="Enter lead message or inquiry"
                  />
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Technical Information</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-zinc-300">Status</Label>
                    <div className="flex items-center gap-3 bg-zinc-900 rounded-md px-3 py-2 border border-zinc-700">
                      <input
                        type="checkbox"
                        checked={(editingLead.status || 'unreached') === 'reached'}
                        onChange={(e) => {
                          const newStatus = e.target.checked ? 'reached' : 'unreached';
                          setEditingLead(prev => prev ? { ...prev, status: newStatus } : null);
                        }}
                        className="w-4 h-4 text-green-600 bg-zinc-800 border-zinc-600 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className={`text-sm ${(editingLead.status || 'unreached') === 'reached' ? 'text-green-500' : 'text-orange-500'}`}>
                        {(editingLead.status || 'unreached') === 'reached' ? 'Reached' : 'Unreached'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-300">Form Type</Label>
                    <Select 
                      value={editingLead.formType || ''} 
                      onValueChange={(value) => setEditingLead(prev => prev ? { ...prev, formType: value } : null)}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="Select form type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="reach-form">Reach Form</SelectItem>
                        <SelectItem value="lead-form">Lead Form</SelectItem>
                        <SelectItem value="course-callback">Course Callback</SelectItem>
                        <SelectItem value="course_enrollment">Course Enrollment</SelectItem>
                        <SelectItem value="Home-contact-form">Home Contact Form</SelectItem>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-zinc-300">IP Address</Label>
                    <Input
                      value={editingLead.ipAddress || ''}
                      onChange={(e) => setEditingLead(prev => prev ? { ...prev, ipAddress: e.target.value } : null)}
                      className="bg-zinc-900 border-zinc-700 text-white font-mono text-sm"
                      placeholder="IP Address"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-300">Country</Label>
                    <Input
                      value={editingLead.metadata?.country || ''}
                      onChange={(e) => setEditingLead(prev => prev ? { 
                        ...prev, 
                        metadata: { ...prev.metadata, country: e.target.value } 
                      } : null)}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-300">Created Date</Label>
                    <div className="bg-zinc-900 rounded-md px-3 py-2 text-white">
                      {new Date(editingLead.createdAt).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-300">Lead ID</Label>
                    <div className="bg-zinc-900 rounded-md px-3 py-2 text-white font-mono text-sm">
                      {selectedLead?._id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="manual" 
              onClick={handleUpdateLead}
            >
              Update Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a lead from form submissions or manual entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lead-name">Full Name *</Label>
                <Input
                  id="lead-name"
                  value={newLead.fullName}
                  onChange={(e) => setNewLead(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="Lead full name"
                />
              </div>
              <div>
                <Label htmlFor="lead-email">Email *</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="lead@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lead-phone">Phone *</Label>
                <div className="phone-input-container">
                  <Input
                    id="lead-phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="+91 9876543210"
                  />
                  <div className="mt-1">
                    <PhoneDisplay phone={newLead.phone} className="text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="lead-course">Course Interest</Label>
                <Input
                  id="lead-course"
                  value={newLead.course}
                  onChange={(e) => setNewLead(prev => ({ ...prev, course: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="e.g., Workday HCM"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lead-message">Message</Label>
              <Input
                id="lead-message"
                value={newLead.message}
                onChange={(e) => setNewLead(prev => ({ ...prev, message: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-white"
                placeholder="Lead message or inquiry"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lead-status">Status</Label>
                <div className="flex items-center gap-3 bg-zinc-900 rounded-md px-3 py-2 border border-zinc-700">
                  <input
                    type="checkbox"
                    checked={newLead.status === 'reached'}
                    onChange={(e) => {
                      const status = e.target.checked ? 'reached' : 'unreached';
                      setNewLead(prev => ({ ...prev, status }));
                    }}
                    className="w-4 h-4 text-green-600 bg-zinc-800 border-zinc-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className={`text-sm ${newLead.status === 'reached' ? 'text-green-500' : 'text-orange-500'}`}>
                    {newLead.status === 'reached' ? 'Reached' : 'Unreached'}
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="lead-ip">IP Address</Label>
                <Input
                  id="lead-ip"
                  value={newLead.ipAddress}
                  onChange={(e) => setNewLead(prev => ({ ...prev, ipAddress: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="IP Address (auto-filled for web forms)"
                />
              </div>
              <div>
                <Label htmlFor="lead-country">Country</Label>
                <Input
                  id="lead-country"
                  value={newLead.country}
                  onChange={(e) => setNewLead(prev => ({ ...prev, country: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="Country (auto-detected for web forms)"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="manual" onClick={handleAddLead}>
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default LeadsManagement;