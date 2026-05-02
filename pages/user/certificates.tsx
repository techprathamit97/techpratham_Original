import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import { Badge } from '@/components/ui/badge';
import { DownloadIcon, CalendarIcon } from '@radix-ui/react-icons';
import Head from 'next/head';
import UserSidebar from '@/src/account/common/UserSidebar';
import UserTopBar from '@/src/account/common/UserTopBar';
import UserLoader from '@/src/account/common/UserLoader';
import SignOut from '@/src/account/common/SignOut';

interface Certificate {
  _id: string;
  course_title: string;
  course_link: string;
  category: string;
  level: string;
  certificate: {
    enrolledDate: string;
    completionDate: string;
    certificateId: string;
  };
  name: string;
  email: string;
}

const UserCertificates = () => {
  const { authenticated, loading, userData, setCurrentTab } = useContext(UserContext);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCertificates = async () => {
    if (!userData?.email) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/course/enrolled?email=${userData.email}`);
      
      if (res.ok) {
        const data = await res.json();
        // Filter only enrollments with certificates
        const certificatesData = data.filter((enrollment: any) => 
          enrollment.certificate && enrollment.certificate.certificateId
        );
        setCertificates(certificatesData);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch certificates');
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && userData) {
      fetchUserCertificates();
      setCurrentTab("certificates");
    }
  }, [authenticated, userData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      // This would typically call an API to generate and download the certificate
      // For now, we'll show a placeholder
      alert(`Certificate download for ${certificate.course_title} will be implemented with certificate generation service.`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>My Certificates | TechPratham</title>
        <meta name="description" content="Download your course completion certificates." />
      </Head>

      {loading ? (
        <UserLoader />
      ) : !authenticated ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
          <UserSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>
            <UserTopBar />

            <div className="bg-black p-6 overflow-y-auto">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Certificates</h2>
                  <p className="text-zinc-400 mt-1">Download your course completion certificates</p>
                </div>
              </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
                  <p className="text-zinc-400 mb-6">
                    Complete your courses to earn certificates. Certificates will appear here once approved.
                  </p>
                  <Link href="/courses">
                    <Button variant="manual">Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">
                              {cert.course_title}
                            </h3>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              ✓ Certified
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {cert.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-zinc-700">
                              {cert.level}
                            </Badge>
                          </div>

                          <div className="text-sm text-zinc-400 mb-2">
                            Certificate ID: <span className="font-mono text-zinc-300">{cert.certificate.certificateId}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-4xl mb-2">🏆</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-zinc-400" />
                          <div>
                            <div className="text-zinc-400">Enrolled</div>
                            <div className="text-white">{formatDate(cert.certificate.enrolledDate)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-zinc-400" />
                          <div>
                            <div className="text-zinc-400">Completed</div>
                            <div className="text-white">{formatDate(cert.certificate.completionDate)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3 mb-4">
                        <p className="text-green-400 text-sm">
                          🎉 Congratulations! You have successfully completed this course and earned your certificate.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleDownloadCertificate(cert)}
                          variant="manual" 
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          Download Certificate
                        </Button>
                        
                        <Link href={`/e-book/${cert.course_link}`} target="_blank">
                          <Button 
                            variant="outline" 
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          >
                            View Course
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserCertificates;