import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailPage() {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    to: '', // Empty by default - can send to any email
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.to || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format for multiple emails
    const emails = formData.to.split(',').map(email => email.trim()).filter(email => email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      return;
    }

    if (emails.length === 0) {
      toast.error('Please enter at least one email address');
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          to: emails.join(', ') // Send as comma-separated string
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Email sent successfully to ${emails.length} recipient(s)!`);
        // Reset form
        setFormData({
          to: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Mail className="h-8 w-8" />
            Send Email
          </h1>
          <p className="text-gray-400 mt-2">
            Send emails to any recipient from TechPratham
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Compose Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="to" className="text-white">
                  To (Email Addresses)
                </Label>
                <Input
                  id="to"
                  type="text"
                  placeholder="email1@example.com, email2@example.com, email3@example.com"
                  value={formData.to}
                  onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Tip: Enter multiple emails separated by commas to send to multiple recipients
                </p>
              </div>

              <div>
                <Label htmlFor="subject" className="text-white">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Enter email subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white mt-2 min-h-[200px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="manual"
                  className="flex items-center gap-2"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ to: '', subject: '', message: '' })}
                  disabled={isSending}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Email Configuration</h3>
          <div className="text-gray-400 text-sm space-y-1">
            <p>From: TechPratham &lt;techprathamit@gmail.com&gt;</p>
            <p>Service: Gmail SMTP</p>
            <p>Status: ✅ Ready to send to ANY email address</p>
          </div>
          <div className="mt-3 p-3 bg-green-900/30 border border-green-700 rounded">
            <p className="text-green-400 text-xs">
              ✅ Gmail SMTP configured! Send emails to any recipient worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
