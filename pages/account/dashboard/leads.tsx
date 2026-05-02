import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, ArrowRightIcon } from '@radix-ui/react-icons';
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
import Link from 'next/link';
import PhoneDisplay from '@/components/common/PhoneDisplay';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  course: string;
  status: string;
  createdAt: string;
}

const LeadsManagement = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'instagram',
    course: '',
    status: 'new'
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      
      if (res.ok) {
        setLeads(Array.isArray(data) ? data : []);
      } else {
        throw new Error(data.message || 'Failed to fetch leads');
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
  }, [authenticated]);

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
          name: '',
          email: '',
          phone: '',
          source: 'instagram',
          course: '',
          status: 'new'
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

  const getSourceBadge = (source: string) => {
    const colors = {
      instagram: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      facebook: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      website: 'bg-green-500/10 text-green-500 border-green-500/20',
      referral: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      other: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    
    return (
      <Badge className={colors[source as keyof typeof colors] || colors.other}>
        {source.charAt(0).toUpperCase() + source.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      interested: 'bg-green-500/10 text-green-500 border-green-500/20',
      converted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const createInvoiceFromLead = (lead: Lead) => {
    // Pre-fill manual invoice form with lead data
    const params = new URLSearchParams({
      customerName: lead.name,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      courseTitle: lead.course || 'Course Training',
      courseCategory: 'General',
      source: `${lead.source}_lead`
    });
    
    window.open(`/admin/dashboard/create-manual-invoice?${params.toString()}`, '_blank');
  };

  return (
    <React.Fragment>
      <Head>
        <title>Leads Management | Account Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
          <AdminSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>
            <AdminTopBar />

            <div className="bg-black p-6 overflow-y-auto">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <h2 className="text-2xl font-bold text-white">Leads Management</h2>
                
                <div className="flex gap-4 items-center">
                  <Button onClick={() => setIsAddDialogOpen(true)} variant="manual" className="flex gap-2">
                    <PlusIcon className='w-5 h-5' />
                    Add Lead
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="text-left p-4 text-white font-medium">Lead</th>
                          <th className="text-left p-4 text-white font-medium">Course Interest</th>
                          <th className="text-left p-4 text-white font-medium">Source</th>
                          <th className="text-left p-4 text-white font-medium">Status</th>
                          <th className="text-left p-4 text-white font-medium">Date</th>
                          <th className="text-left p-4 text-white font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="p-4">
                              <div className="text-white font-medium">{lead.name}</div>
                              <div className="text-zinc-400 text-sm">{lead.email}</div>
                              <div className="mt-1">
                                <PhoneDisplay phone={lead.phone} className="text-xs" />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-white">{lead.course || 'Not specified'}</div>
                            </td>
                            <td className="p-4">
                              {getSourceBadge(lead.source)}
                            </td>
                            <td className="p-4">
                              {getStatusBadge(lead.status)}
                            </td>
                            <td className="p-4 text-zinc-400 text-sm">
                              {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="manual"
                                  onClick={() => createInvoiceFromLead(lead)}
                                  className="flex items-center gap-1"
                                >
                                  <ArrowRightIcon className="w-4 h-4" />
                                  Create Invoice
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {leads.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No leads found. Add leads from Instagram, Facebook, or other sources.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a lead from Instagram, Facebook, or other sources.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lead-name">Name *</Label>
                <Input
                  id="lead-name"
                  value={newLead.name}
                  onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="Lead name"
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
                <Input
                  id="lead-phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="lead-source">Source *</Label>
                <Select value={newLead.source} onValueChange={(value) => setNewLead(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="lead-status">Status</Label>
                <Select value={newLead.status} onValueChange={(value) => setNewLead(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
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
