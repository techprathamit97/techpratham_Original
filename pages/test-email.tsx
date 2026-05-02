import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestEmailPage = () => {
  const [email, setEmail] = useState('Ayanshayanshm639@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, get text
        const text = await response.text();
        data = { error: 'Invalid JSON response', details: text, status: response.status };
      }
      
      setResult(data);
    } catch (error: any) {
      setResult({ error: 'Network error', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  const sendQuizCompletionEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/quiz/send-completion-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          userName: 'Test User',
          quizTitle: 'Sample Quiz Test',
          totalMarks: 85,
          maxMarks: 100,
          percentage: 85,
          passed: true
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, get text
        const text = await response.text();
        data = { error: 'Invalid JSON response', details: text, status: response.status };
      }
      
      setResult(data);
    } catch (error: any) {
      setResult({ error: 'Network error', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={sendTestEmail} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>

          <Button 
            onClick={sendQuizCompletionEmail} 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Sending...' : 'Send Quiz Completion Email'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> Due to Resend domain restrictions, emails will be sent to techprathamit@gmail.com with user details included.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestEmailPage;