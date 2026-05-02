import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import { Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Head from 'next/head';
import { useRouter } from 'next/router';

const LmsDashboard = () => {
  const router = useRouter();
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [courseData, setCourseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const slugify = (text: string) =>
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      if (!authenticated) return;

      const res = await fetch(`/api/lms/content/all`);
      const lmsDataArray = res.ok ? await res.json() : [];

      const normalized = lmsDataArray.map((lms: any) => ({
        _id: lms._id,
        lmsId: lms._id,
        hasLmsContent: true,
        title: lms.title || lms.courseId,
        link: lms.courseId,
        sidebar: lms.sidebar || [],
        category: "LMS",
        shortDesc: "LMS Content Page",
        rating: "5.0",
        duration: "Self-paced"
      }));

      setCourseData(normalized);
    } catch (error) {
      console.error("Failed to fetch LMS data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchCourseData();
      setCurrentTab("lms");
    }
  }, [authenticated]);

  const handleCreatePage = () => {
    if (!newCourseTitle) {
      toast.error("Please enter a title");
      return;
    }
    const slug = slugify(newCourseTitle);
    router.push(`/admin/editor/${slug}`);
  };

  // ✅ CONFIRMATION ADDED HERE (ONLY CHANGE)
  const deleteLmsContent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this LMS page?\nThis action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeletingCourseId(id);
    try {
      const res = await fetch(`/api/lms/content?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('LMS Content deleted successfully.');
        setCourseData(prev => prev.filter(c => c.lmsId !== id));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete LMS content.');
    } finally {
      setIsDeleting(false);
      setDeletingCourseId(null);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>LMS Content | Admin Dashboard</title>
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

            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              </div>
            ) : (
              <div className="bg-black p-6 overflow-y-auto">
                <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                  <h2 className="text-2xl font-bold text-white">All LMS Content Pages</h2>

                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="manual" className="flex gap-2">
                        <PlusIcon className='w-5 h-5' />
                        Create LMS Page
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-black border-zinc-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Create New LMS Page</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                          Enter the title for your new course content page. This will determine the URL slug.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Page Title</Label>
                          <Input
                            id="title"
                            placeholder="e.g. Workday HCM Advanced"
                            className="bg-zinc-900 border-zinc-700 text-white"
                            value={newCourseTitle}
                            onChange={(e) => setNewCourseTitle(e.target.value)}
                          />
                        </div>
                        {newCourseTitle && (
                          <p className="text-xs text-zinc-500">
                            Slug: <span className="text-red-500">/admin/editor/{slugify(newCourseTitle)}</span>
                          </p>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="manual" onClick={handleCreatePage}>
                          Create & Edit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {courseData.length === 0 && (
                  <div className="w-full py-20 text-center border border-dashed border-zinc-800 rounded-lg">
                    <p className="text-zinc-500">
                      No LMS content pages found. Click "Create LMS Page" to start.
                    </p>
                  </div>
                )}

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 w-full">
                  {courseData.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="w-full flex flex-col p-6 rounded-lg bg-[#111] border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white leading-tight">
                            {course.title}
                          </h3>
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5">
                            Active LMS
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                          {course.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-zinc-500 mb-6 line-clamp-3 leading-relaxed">
                        {course.shortDesc}
                      </p>

                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span>★</span>
                          <span className="font-bold">{course.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-800">
                          {course.duration}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex gap-2">
                          <Link href={`/e-book/${course.link}`} target="_blank" className="flex-1">
                            <Button variant="manual" className="w-full font-bold">
                              Explore Course
                            </Button>
                          </Link>
                          <Link href={`/admin/editor/${course.link}`}>
                            <Button variant="manual" className="px-3">
                              <Pencil2Icon className="w-5 h-5" />
                            </Button>
                          </Link>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <Link href={`/admin/editor/${course.link}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                            >
                              Manage Structure
                            </Button>
                          </Link>
                          <Button
                            variant="manual"
                            className="px-3"
                            onClick={() => deleteLmsContent(course.lmsId)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default LmsDashboard;
