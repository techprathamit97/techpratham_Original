import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Search, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  BookOpen,
  Star,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

interface VerifiedCertificate {
  valid: boolean;
  certificateId: string;
  studentName: string;
  courseName: string;
  courseCategory: string;
  completionDate: string;
  issueDate: string;
  grade: string;
  score: number;
  verificationCode: string;
  template: string;
}

const VerifyCertificate = () => {
  const [verificationInput, setVerificationInput] = useState('');
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!verificationInput.trim()) {
      toast.error('Please enter a certificate ID or verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    setCertificate(null);

    try {
      const res = await fetch('/api/lms/certificates/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationCode: verificationInput.includes('TP') ? verificationInput : '',
          certificateId: verificationInput.includes('CERT') ? verificationInput : ''
        })
      });

      const data = await res.json();

      if (data.valid) {
        setCertificate(data);
        toast.success('Certificate verified successfully!');
      } else {
        setError(data.message || 'Certificate not found or invalid');
        toast.error('Certificate verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify certificate. Please try again.');
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Verify Certificate | TechPratham</title>
        <meta name="description" content="Verify the authenticity of TechPratham certificates using certificate ID or verification code." />
      </Head>

      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold">Certificate Verification</h1>
            </div>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Verify the authenticity of TechPratham certificates by entering the certificate ID (starts with CERT) 
              or verification code (starts with TP).
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-zinc-900 border-zinc-800 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Verify Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="verification-input">Certificate ID or Verification Code</Label>
                  <Input
                    id="verification-input"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value.toUpperCase())}
                    placeholder="Enter CERT-XXXXXX or TP-XXXXXX"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Certificate IDs start with "CERT" and verification codes start with "TP"
                  </p>
                </div>
                <Button 
                  onClick={handleVerify} 
                  disabled={isLoading || !verificationInput.trim()}
                  className="w-full"
                  variant="manual"
                >
                  {isLoading ? 'Verifying...' : 'Verify Certificate'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="bg-red-900/20 border-red-700 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="font-semibold text-red-400">Verification Failed</h3>
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificate Details */}
          {certificate && (
            <Card className="bg-green-900/20 border-green-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-6 h-6" />
                  Certificate Verified Successfully
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Certificate Info */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-zinc-400">Student Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">{certificate.studentName}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Course Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold">{certificate.courseName}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Category</Label>
                      <div className="mt-1">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {certificate.courseCategory}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Grade & Score</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold">{certificate.grade}</span>
                        <span className="text-zinc-400">({certificate.score}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates and IDs */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-zinc-400">Certificate ID</Label>
                      <div className="font-mono text-sm bg-zinc-800 p-2 rounded mt-1">
                        {certificate.certificateId}
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Verification Code</Label>
                      <div className="font-mono text-sm bg-zinc-800 p-2 rounded mt-1">
                        {certificate.verificationCode}
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Completion Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span>{formatDate(certificate.completionDate)}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400">Issue Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="w-4 h-4 text-orange-400" />
                        <span>{formatDate(certificate.issueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div className="text-center">
                      <h3 className="font-bold text-green-400">Authentic Certificate</h3>
                      <p className="text-green-300 text-sm">
                        This certificate has been verified and is authentic
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-zinc-500">
            <p>
              Need help? Contact us at{' '}
              <Link href="mailto:support@techpratham.com" className="text-blue-400 hover:underline">
                support@techpratham.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyCertificate;