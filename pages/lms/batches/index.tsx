import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import LMSLayout from '@/src/lms/common/LMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar, 
  Users, 
  Plus, 
  Clock, 
  User,
  Mail,
  Video,
  Edit,
  Trash2,
  UserPlus,
  MessageSquare,
  BarChart3,
  Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Student {
  _id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
  };
  courseDetails: {
    title: string;
    category: string;
  };
  status: string;
  isApproved: boolean;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
  };
  courseDetails: {
    title: string;
    category: string;
  };
  isManual?: boolean;
  status: string;
  isApproved: boolean;
}

interface Batch {
  _id: string;
  batchId: string;
  course_title: string;
  course_link: string;
  trainer: {
    name: string;
    email: string;
    profile?: string;
    experience: string;
    rating: number;
  };
  schedule: {
    startDate: string;
    endDate: string;
    timing: string;
    days: string[];
  };
  capacity: number;
  enrolled_students: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  meetingLink: string;
  description: string;
  createdAt: string;
}

const BatchesManagement = () => {
  const { authenticated, loading, isAdmin } = useContext(UserContext);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [batchStudentsDetails, setBatchStudentsDetails] = useState<Student[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const [newBatch, setNewBatch] = useState({
    course_link: '',
    course_title: '',
    trainerId: '', // Only store trainer ID
    schedule: {
      startDate: '',
      endDate: '',
      timing: '',
      days: []
    },
    capacity: 30,
    meetingLink: '',
    description: ''
  });

  // Function to determine batch status based on dates
  const getBatchStatus = (batch: Batch): 'upcoming' | 'ongoing' | 'completed' => {
    const today = new Date();
    const startDate = new Date(batch.schedule.startDate);
    const endDate = new Date(batch.schedule.endDate);
    
    if (today > endDate) {
      return 'completed';
    } else if (today >= startDate && today <= endDate) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
  };

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/lms/batches');
      const data = await res.json();
      
      if (res.ok) {
        // Update batch statuses based on dates
        const batchesWithUpdatedStatus = Array.isArray(data) ? data.map(batch => ({
          ...batch,
          status: getBatchStatus(batch)
        })) : [];
        
        setBatches(batchesWithUpdatedStatus);
        
        // Update batch statuses in database if needed
        batchesWithUpdatedStatus.forEach(async (batch) => {
          if (batch.status !== data.find((b: Batch) => b._id === batch._id)?.status) {
            await updateBatchStatus(batch._id, batch.status);
          }
        });
      } else {
        throw new Error(data.message || 'Failed to fetch batches');
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      toast.error('Failed to fetch batches');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/invoice/fetch');
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Filter only manual invoices (enrolled students)
        const enrolledStudents = Array.isArray(data.invoices) ? 
          data.invoices.filter((invoice: Invoice) => invoice.isManual === true) : [];
        setStudents(enrolledStudents);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const updateBatchStatus = async (batchId: string, status: string) => {
    try {
      await fetch(`/api/lms/batches/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Failed to update batch status:', error);
    }
  };

  const assignStudentsToBatch = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      toast.error('Please select students to assign');
      return;
    }

    try {
      const res = await fetch(`/api/lms/batches/${selectedBatch._id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudents })
      });

      if (res.ok) {
        toast.success(`${selectedStudents.length} students assigned to batch`);
        setIsStudentDialogOpen(false);
        setSelectedStudents([]);
        fetchBatches(); // Refresh batches
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to assign students');
      }
    } catch (error: any) {
      console.error('Failed to assign students:', error);
      toast.error(error.message || 'Failed to assign students');
    }
  };

  const fetchBatchStudents = async (batch: Batch) => {
    try {
      // Fetch all students
      const res = await fetch('/api/invoice/fetch');
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Filter students enrolled in this batch
        const batchStudents = Array.isArray(data.invoices) ? 
          data.invoices.filter((invoice: Invoice) => 
            invoice.isManual === true && 
            batch.enrolled_students.includes(invoice.customerDetails.studentId)
          ) : [];
        
        setBatchStudentsDetails(batchStudents);
        setSelectedBatch(batch);
        setIsViewStudentsDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch batch students:', error);
      toast.error('Failed to fetch student details');
    }
  };

  const openEmailDialog = async (batch: Batch) => {
    try {
      // Fetch all students for this batch
      const res = await fetch('/api/invoice/fetch');
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Filter students enrolled in this batch
        const batchStudents = Array.isArray(data.invoices) ? 
          data.invoices.filter((invoice: Invoice) => 
            invoice.isManual === true && 
            batch.enrolled_students.includes(invoice.customerDetails.studentId)
          ) : [];
        
        setBatchStudentsDetails(batchStudents);
        setSelectedBatch(batch);
        setEmailSubject('');
        setEmailMessage('');
        setIsEmailDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch batch students:', error);
      toast.error('Failed to fetch student details');
    }
  };

  const sendEmailToAllStudents = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please enter both subject and message');
      return;
    }

    if (batchStudentsDetails.length === 0) {
      toast.error('No students enrolled in this batch');
      return;
    }

    setIsSendingEmail(true);

    try {
      // Get all student emails
      const studentEmails = batchStudentsDetails.map(student => student.customerDetails.email);
      
      // Send email to all students
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: studentEmails.join(', '),
          subject: emailSubject,
          message: emailMessage
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Email sent successfully to ${studentEmails.length} students`);
        setIsEmailDialogOpen(false);
        setEmailSubject('');
        setEmailMessage('');
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openStudentDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setSelectedStudents([]);
    setStudentSearchTerm('');
    setIsStudentDialogOpen(true);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = studentSearchTerm === '' || 
      student.customerDetails.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.customerDetails.studentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.courseDetails.title.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    // Only show students not already in this batch
    const notInBatch = !selectedBatch?.enrolled_students.includes(student.customerDetails.studentId);
    
    return matchesSearch && notInBatch;
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/course/fetch');
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await fetch('/api/lms/trainers');
      const data = await res.json();
      if (res.ok) {
        setTrainers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
    }
  };

  const handleCreateBatch = async () => {
    // Validate required fields
    if (!newBatch.course_link || !newBatch.trainerId || !newBatch.schedule.startDate || !newBatch.schedule.endDate || !newBatch.schedule.timing) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const batchData = {
        ...newBatch,
        schedule: {
          ...newBatch.schedule,
          startDate: new Date(newBatch.schedule.startDate),
          endDate: new Date(newBatch.schedule.endDate)
        }
      };

      const res = await fetch('/api/lms/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData)
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success('Batch created successfully');
        setIsCreateDialogOpen(false);
        fetchBatches();
        // Reset form
        setNewBatch({
          course_link: '',
          course_title: '',
          trainerId: '',
          schedule: { startDate: '', endDate: '', timing: '', days: [] },
          capacity: 30,
          meetingLink: '',
          description: ''
        });
      } else {
        throw new Error(responseData.error || responseData.message || 'Failed to create batch');
      }
    } catch (error: any) {
      console.error('Failed to create batch:', error);
      toast.error(error.message || 'Failed to create batch');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600';
      case 'ongoing': return 'bg-green-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getCapacityPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const stats = {
    totalBatches: batches.length,
    upcomingBatches: batches.filter(b => b.status === 'upcoming').length,
    ongoingBatches: batches.filter(b => b.status === 'ongoing').length,
    completedBatches: batches.filter(b => b.status === 'completed').length
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchBatches();
      fetchCourses();
      fetchStudents();
      fetchTrainers();
    }
  }, [authenticated, isAdmin]);

  if (loading || !authenticated || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <LMSLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Batch Management</h1>
            <p className="text-gray-400 mt-2">Create and manage course batches with trainers</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="manual" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Batch</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Course</Label>
                    <Select 
                      value={newBatch.course_link} 
                      onValueChange={(value) => {
                        const course = courses.find((c: any) => c.link === value);
                        setNewBatch(prev => ({
                          ...prev,
                          course_link: value,
                          course_title: course?.title || ''
                        }));
                      }}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {courses.map((course: any) => (
                          <SelectItem key={course.link} value={course.link}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Capacity</Label>
                    <Input
                      type="number"
                      value={newBatch.capacity}
                      onChange={(e) => setNewBatch(prev => ({
                        ...prev,
                        capacity: parseInt(e.target.value) || 30
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Trainer Name</Label>
                    <Select 
                      value={newBatch.trainerId} 
                      onValueChange={(value) => {
                        setNewBatch(prev => ({
                          ...prev,
                          trainerId: value
                        }));
                      }}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {trainers.map((trainer: any) => (
                          <SelectItem key={trainer._id} value={trainer.trainerId}>
                            {trainer.name} - {trainer.experience} (ID: {trainer.trainerId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Trainer Email</Label>
                    <Input
                      type="email"
                      value={
                        newBatch.trainerId 
                          ? trainers.find((t: any) => t.trainerId === newBatch.trainerId)?.email || ''
                          : ''
                      }
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white cursor-not-allowed"
                      placeholder="Auto-filled from trainer selection"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Start Date</Label>
                    <Input
                      type="date"
                      value={newBatch.schedule.startDate}
                      onChange={(e) => setNewBatch(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, startDate: e.target.value }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">End Date</Label>
                    <Input
                      type="date"
                      value={newBatch.schedule.endDate}
                      onChange={(e) => setNewBatch(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, endDate: e.target.value }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Timing</Label>
                  <Input
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                    value={newBatch.schedule.timing}
                    onChange={(e) => setNewBatch(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, timing: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Meeting Link</Label>
                  <Input
                    placeholder="Zoom/Meet link"
                    value={newBatch.meetingLink}
                    onChange={(e) => setNewBatch(prev => ({
                      ...prev,
                      meetingLink: e.target.value
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="manual" 
                  onClick={handleCreateBatch}
                  disabled={!newBatch.course_link || !newBatch.trainerId}
                >
                  Create Batch
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Batches</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBatches}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-white">{stats.upcomingBatches}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ongoing</p>
                  <p className="text-2xl font-bold text-white">{stats.ongoingBatches}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.completedBatches}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No batches created yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => {
              const capacityPercentage = getCapacityPercentage(batch.enrolled_students.length, batch.capacity);
              
              return (
                <Card key={batch._id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{batch.course_title}</CardTitle>
                        <p className="text-gray-400 text-sm">{batch.batchId}</p>
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Trainer Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={batch.trainer.profile} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {batch.trainer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{batch.trainer.name}</p>
                        <p className="text-gray-400 text-sm">{batch.trainer.experience}</p>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(batch.schedule.startDate).toLocaleDateString()} - 
                          {new Date(batch.schedule.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>{batch.schedule.timing}</span>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Students Enrolled</span>
                        <span className="text-sm text-white font-medium">
                          {batch.enrolled_students.length}/{batch.capacity}
                        </span>
                      </div>
                      <Progress value={capacityPercentage} className="h-2" />
                      {batch.enrolled_students.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {batch.enrolled_students.slice(0, 3).join(', ')}
                          {batch.enrolled_students.length > 3 && ` +${batch.enrolled_students.length - 3} more`}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => openStudentDialog(batch)}
                      >
                        <UserPlus className="h-3 w-3" />
                        Add Students
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => fetchBatchStudents(batch)}
                        disabled={batch.enrolled_students.length === 0}
                      >
                        <Users className="h-3 w-3" />
                        Show All Students
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => openEmailDialog(batch)}
                        disabled={batch.enrolled_students.length === 0}
                      >
                        <Mail className="h-3 w-3" />
                        Send Email to All
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Send Email to All Students in {selectedBatch?.batchId}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">
                  {batchStudentsDetails.length} students will receive this email
                </span>
              </div>
              <Badge className="bg-blue-600">
                {selectedBatch?.course_title}
              </Badge>
            </div>

            <div>
              <Label className="text-white">Subject</Label>
              <Input
                placeholder="Enter email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label className="text-white">Message</Label>
              <textarea
                placeholder="Enter your message here..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={8}
                className="w-full mt-2 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {batchStudentsDetails.length > 0 && (
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Recipients:</p>
                <div className="flex flex-wrap gap-2">
                  {batchStudentsDetails.slice(0, 5).map((student) => (
                    <Badge key={student._id} className="bg-gray-600">
                      {student.customerDetails.name}
                    </Badge>
                  ))}
                  {batchStudentsDetails.length > 5 && (
                    <Badge className="bg-gray-600">
                      +{batchStudentsDetails.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEmailDialogOpen(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button 
              variant="manual" 
              onClick={sendEmailToAllStudents}
              disabled={isSendingEmail || !emailSubject.trim() || !emailMessage.trim()}
            >
              {isSendingEmail ? 'Sending...' : `Send Email to ${batchStudentsDetails.length} Students`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Batch Students Dialog */}
      <Dialog open={isViewStudentsDialogOpen} onOpenChange={setIsViewStudentsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Students in {selectedBatch?.batchId} - {selectedBatch?.course_title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Total Students: {batchStudentsDetails.length}
              </p>
              <Badge className="bg-blue-600">
                Batch: {selectedBatch?.batchId}
              </Badge>
            </div>

            {batchStudentsDetails.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No students enrolled in this batch</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Student ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Course</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchStudentsDetails.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                              {student.customerDetails.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-white font-medium">
                              {student.customerDetails.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{student.customerDetails.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {student.customerDetails.phone || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-600">
                            {student.customerDetails.studentId}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {student.courseDetails.title}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={
                            student.status === 'paid' ? 'bg-green-600' :
                            student.status === 'partial' ? 'bg-yellow-600' : 
                            student.status === 'pending' ? 'bg-orange-600' : 'bg-red-600'
                          }>
                            {student.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsViewStudentsDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Assignment Dialog */}
      <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Assign Students to {selectedBatch?.batchId}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, ID, or course..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Selected Count */}
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                {selectedStudents.length} students selected
              </p>
              <p className="text-gray-400 text-sm">
                Batch Capacity: {selectedBatch?.enrolled_students.length || 0}/{selectedBatch?.capacity}
              </p>
            </div>

            {/* Students List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No available students found</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div 
                    key={student._id} 
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.customerDetails.studentId)}
                      onCheckedChange={() => toggleStudentSelection(student.customerDetails.studentId)}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {student.customerDetails.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{student.customerDetails.name}</p>
                          <p className="text-gray-400 text-sm">{student.customerDetails.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className="bg-blue-600 mb-1">
                        {student.customerDetails.studentId}
                      </Badge>
                      <p className="text-gray-400 text-xs">{student.courseDetails.title}</p>
                    </div>
                    
                    <Badge className={
                      student.status === 'paid' ? 'bg-green-600' :
                      student.status === 'partial' ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {student.status.toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsStudentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="manual" 
              onClick={assignStudentsToBatch}
              disabled={selectedStudents.length === 0}
            >
              Assign {selectedStudents.length} Students
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LMSLayout>
  );
};

export default BatchesManagement;