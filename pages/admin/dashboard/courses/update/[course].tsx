"use client";
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Star, FileText } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { UserContext } from '@/context/userContext';
import QuillEditor from '../../../../../src/account/common/QuillEditor';
import { uploadImageToS3 } from "@/lib/uploadImage";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}
// Zod Schema
const curriculumSchema = z.object({
  que: z.string().min(1, "Question is required"),
  ans: z.string().min(1, "Answer is required"),
  topics: z.array(z.string()).optional()
});

const interviewFaqSchema = z.object({
  que: z.string().min(1, "Question is required"),
  ans: z.string().min(1, "Answer is required"),
});

const jobRoleSchema = z.object({
  role: z.string().optional(),
});

const aboutCertificateSchema = z.object({
  heading: z.string().optional(),
  paragraph: z.string().optional(),
  image: z.string().optional(),
  pdf: z.string().optional(),
});

const faqSchema = z.object({
  que: z.string().min(1, "Question is required"),
  ans: z.string().min(1, "Answer is required")
});

const seoFaqSchema = z.object({
  que: z.string().min(1, "Question is required"),
  ans: z.string().min(1, "Answer is required")
});

const projectSchema = z.object({
  company: z.string().min(1, "Company is required"),
  logo: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  scenario: z.string().min(1, "Scenario is required"),
  liveWork: z.array(z.string()).optional(),
  outcome: z.string().min(1, "Outcome is required"),
  objective: z.string().optional(),
});


const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDesc: z.string().min(1, "Short description is required"),
  image: z.string(),
  alt: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  certificateName: z.string().optional(), // Dynamic certificate name field
  whoShouldTakeTitle: z.string().optional(), // Custom title for Who Should Take section
  jobRoleTitle: z.string().optional(), // Custom title for Job Role section
  curriculumTitle: z.string().optional(), // Custom title for Curriculum section
  projectTitle: z.string().optional(), // Custom title for Project section
  rating: z.string().min(1, "Rating is required"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], { required_error: "Level is required" }),
  category: z.string().min(1, "Category is required"),
  trending: z.boolean().optional(),
  priority: z.number().min(0, "Priority must be 0 or higher").optional(), // Add priority field
  placement_report: z.string().min(1, "Placement report is required"),
  curriculum: z.string().min(1, "Curriculum is required"),
  interview: z.string().min(1, "Interview information is required"),
  link: z.string().min(1, "Course link is required"),
  videoLink: z.string().min(1, "Video link is required"),
  assesment_link: z.string().min(1, "Assessment link is required"),
  curriculum_data: z.array(curriculumSchema).optional(),
  skills_data: z.array(z.string()).optional(),
  faqs_data: z.array(faqSchema).optional(),
  seo_faqs_data: z.array(seoFaqSchema).optional(), // SEO FAQs
  interview_questions_data: z.array(interviewFaqSchema).optional(),
  job_role: z.array(jobRoleSchema).optional(),
  about_certificate_data: aboutCertificateSchema,
  project_data: z.array(projectSchema).optional(),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Course extends CourseFormData {
  id: string;
  _id: string;
  trending?: boolean;
  priority?: number; // Add priority field
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// CurriculumTopicItem Component
const CurriculumTopicItem = ({ form, index, canRemove, onRemove }: {
  form: any;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}) => {
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim()) {
      const currentTopics = form.getValues(`curriculum_data.${index}.topics`) || [];
      const updatedTopics = [...currentTopics, newTopic.trim()];
      form.setValue(`curriculum_data.${index}.topics`, updatedTopics);
      setNewTopic('');
    }
  };

  const removeTopic = (topicIndex: number) => {
    const currentTopics = form.getValues(`curriculum_data.${index}.topics`) || [];
    const updatedTopics = currentTopics.filter((_: any, i: any) => i !== topicIndex);
    form.setValue(`curriculum_data.${index}.topics`, updatedTopics);
  };
  const { fields: projectFields, append, remove } = useFieldArray({
    control: form.control,
    name: "project_data",
  })
  const topics = form.watch(`curriculum_data.${index}.topics`) || [];

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Topic {index + 1}</CardTitle>
        {canRemove && (
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={`curriculum_data.${index}.que`}
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Question/Topic</FormLabel>
              <FormControl>
                <QuillEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`curriculum_data.${index}.ans`}
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Answer/Description</FormLabel>
              <FormControl>
                {/* <Textarea {...field} /> */}
                <QuillEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Topics Section */}
        <div className="mb-4">
          <FormLabel>Subtopics</FormLabel>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a subtopic"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            />
            <Button type="button" onClick={addTopic} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic: any, topicIndex: any) => (
                <div key={topicIndex} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <span className="text-sm">{topic}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(topicIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UpdateCoursePage = () => {
  const [newSkill, setNewSkill] = useState('');
  const [publicId, setPublicId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseUrl, setCourseUrl] = useState<string>("");

  const [newKeyword, setNewKeyword] = useState('');

  const router = useRouter();
  const { course: encodedCourse } = router.query;
  const { authenticated, isAdmin, setCurrentTab } = useContext(UserContext);
  const certImageInputRef = useRef<HTMLInputElement | null>(null);
  const [certImageSrc, setCertImageSrc] = useState<string>("");
  const [certUploading, setCertUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const courseLink = encodedCourse ? decodeURIComponent(encodedCourse as string) : "";
  const [projectUploadingIndex, setProjectUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTab("courses");
  }, [setCurrentTab]);


  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      shortDesc: '',
      image: '',
      alt: '',
      description: '',
      certificateName: '', // Dynamic certificate name field
      whoShouldTakeTitle: '', // Custom title for Who Should Take section
      jobRoleTitle: '', // Custom title for Job Role section
      curriculumTitle: '', // Custom title for Curriculum section
      projectTitle: '', // Custom title for Project section
      rating: '',
      duration: '',
      level: 'Beginner',
      category: '',
      trending: false,
      priority: 0, // Add priority field with default value
      placement_report: '',
      curriculum: '',
      interview: '',
      link: '',
      videoLink: '',
      assesment_link: '',
      curriculum_data: [{ que: '', ans: '', topics: [] }],
      skills_data: [],
      faqs_data: [{ que: '', ans: '' }],
      seo_faqs_data: [{ que: '', ans: '' }], // SEO FAQs default
      interview_questions_data: [{ que: "", ans: "" }],
      job_role: [{ role: '' }],
      about_certificate_data: {
        heading: '',
        paragraph: ''
      },
      project_data: [
        {
          company: '',
          logo: '',
          title: '',
          scenario: '',
          liveWork: [''],
          outcome: '',
          objective: '',
        },
      ],

      metadata: {
        title: '',
        description: '',
        keywords: []
      }
    }
  });

  const { setValue, reset } = form;

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseLink || typeof courseLink !== 'string') {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/course/link?link=${encodeURIComponent(courseLink)}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Course not found');
          } else {
            setError('Failed to fetch course data');
          }
          return;
        }

        const courseData: Course = await response.json();
        setCourseUrl(courseData.link);
        setPublicId(courseData.image || "");

        // Reset form with fetched data
        reset({
          title: courseData.title || '',
          shortDesc: courseData.shortDesc || '',
          image: courseData.image || '',
          alt: courseData.alt || '',
          description: courseData.description || '',
          certificateName: courseData.certificateName || '', // Load certificate name
          whoShouldTakeTitle: courseData.whoShouldTakeTitle || '', // Load Who Should Take title
          jobRoleTitle: courseData.jobRoleTitle || '', // Load Job Role title
          curriculumTitle: courseData.curriculumTitle || '', // Load Curriculum title
          projectTitle: courseData.projectTitle || '', // Load Project title
          rating: courseData.rating || '',
          duration: courseData.duration || '',
          level: courseData.level as "Beginner" | "Intermediate" | "Advanced" || 'Beginner',
          category: courseData.category || '',
          trending: courseData.trending ?? false,
          priority: courseData.priority || 0, // Add priority field
          placement_report: courseData.placement_report || '',
          curriculum: courseData.curriculum || '',
          interview: courseData.interview || '',
          link: courseData.link || '',
          videoLink: courseData.videoLink || '',
          assesment_link: courseData.assesment_link || '',
          curriculum_data: courseData.curriculum_data && courseData.curriculum_data.length > 0
            ? courseData.curriculum_data
            : [{ que: '', ans: '', topics: [] }],
          skills_data: courseData.skills_data || [],
          faqs_data: courseData.faqs_data && courseData.faqs_data.length > 0
            ? courseData.faqs_data
            : [{ que: '', ans: '' }],
          seo_faqs_data: courseData.seo_faqs_data && courseData.seo_faqs_data.length > 0
            ? courseData.seo_faqs_data
            : [{ que: '', ans: '' }], // Load SEO FAQs
          interview_questions_data:
            courseData.interview_questions_data &&
              courseData.interview_questions_data.length > 0
              ? courseData.interview_questions_data
              : [{ que: '', ans: '' }],
          job_role:
            courseData.job_role?.length
              ? courseData.job_role
              : [{ role: '' }],

          about_certificate_data: {
            heading: courseData.about_certificate_data?.heading || '',
            paragraph: courseData.about_certificate_data?.paragraph || ''
          },
          project_data:
            courseData.project_data && courseData.project_data.length > 0
              ? courseData.project_data
              : [
                {
                  company: '',
                  logo: '',
                  title: '',
                  scenario: '',
                  liveWork: [''],
                  outcome: '',
                },
              ],
          metadata: {
            title: courseData.metadata?.title || '',
            description: courseData.metadata?.description || '',
            keywords: courseData.metadata?.keywords || []
          }
        });
        setCertImageSrc(courseData.about_certificate_data?.image || "");
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseLink, reset]);

  useEffect(() => {
    if (publicId) {
      setValue("image", publicId);
    }
  }, [publicId, setValue]);

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (publicId) {
      setImageSrc(publicId);
    }
  }, [publicId]);

  //   useEffect(() => {
  //   const img = form.getValues("about_certificate_data.image");
  //   if (img) setCertImageSrc(img);
  // }, [form]);

  const certImage = form.watch("about_certificate_data.image");

  useEffect(() => {
    if (certImage) {
      setCertImageSrc(certImage);
    }
  }, [certImage]);

  const fetchCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await fetch('/api/category/fetch');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories. Please try again.");
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const getProfileImageUrl = () => {
    if (publicId) {
      return publicId;
    }
    return '/course/course-banner.png';
  };
  const [imageSrc, setImageSrc] = useState<string>(getProfileImageUrl());

  const handleCertificateImageUpload = async (file: File) => {
    try {
      setCertUploading(true);

      // 1️⃣ Instant preview
      const previewUrl = URL.createObjectURL(file);
      setCertImageSrc(previewUrl);

      // 2️⃣ Upload to S3
      const { url } = await uploadImageToS3(file);

      // 3️⃣ Update RHF (THIS IS THE FIX)
      form.setValue("about_certificate_data.image", url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

    } catch (err) {
      console.error(err);
      toast.error("Certificate image upload failed");
    } finally {
      setCertUploading(false);
    }
  };



  const handleCourseImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // 1️⃣ Instant preview
      const previewUrl = URL.createObjectURL(file);
      setImageSrc(previewUrl);

      // 2️⃣ Upload to S3 / Cloudinary
      const { url } = await uploadImageToS3(file);

      // 3️⃣ Update RHF state (🔥 IMPORTANT)
      form.setValue("image", url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      // 4️⃣ Keep existing logic (used elsewhere)
      setPublicId(url);
      setImageSrc(url);

    } catch (err) {
      console.error(err);
      toast.error("Course image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProjectLogoUpload = async (file: File, index: number) => {
    try {
      setProjectUploadingIndex(index);

      // 1️⃣ Instant Preview
      const previewUrl = URL.createObjectURL(file);
      form.setValue(`project_data.${index}.logo`, previewUrl);

      // 2️⃣ Upload to S3
      const { url } = await uploadImageToS3(file);

      // 3️⃣ Replace preview with real URL
      form.setValue(`project_data.${index}.logo`, url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      toast.success("Project logo uploaded successfully");
    } catch (err) {
      toast.error("Project logo upload failed");
    } finally {
      setProjectUploadingIndex(null);
    }
  };


  const {
    fields: curriculumFields,
    append: appendCurriculum,
    remove: removeCurriculum
  } = useFieldArray({
    control: form.control,
    name: 'curriculum_data'
  });



  const {
    fields: interviewFaqFields,
    append: appendInterviewFaq,
    remove: removeInterviewFaq,
  } = useFieldArray({
    control: form.control,
    name: "interview_questions_data",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq
  } = useFieldArray({
    control: form.control,
    name: 'faqs_data'
  });

  const {
    fields: seoFaqFields,
    append: appendSeoFaq,
    remove: removeSeoFaq
  } = useFieldArray({
    control: form.control,
    name: 'seo_faqs_data'
  });

  const {
    fields: jobRoleFields,
    append: appendJobRole,
    remove: removeJobRole,
  } = useFieldArray({
    control: form.control,
    name: "job_role",
  });


  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject
  } = useFieldArray({
    control: form.control,
    name: 'project_data'
  });

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = form.getValues('skills_data') || [];
      const updatedSkills = [...currentSkills, newSkill.trim()];
      form.setValue('skills_data', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues('skills_data') || [];
    const updatedSkills = currentSkills.filter((_, i) => i !== index);
    form.setValue('skills_data', updatedSkills);
  };

  const courseTitle = form.watch('title');

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = form.getValues('metadata.keywords') || [];
      const updatedKeywords = [...currentKeywords, newKeyword.trim()];
      form.setValue('metadata.keywords', updatedKeywords);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues('metadata.keywords') || [];
    const updatedKeywords = currentKeywords.filter((_, i) => i !== index);
    form.setValue('metadata.keywords', updatedKeywords);
  };
  const htmlToText = (html: string = ''): string => {
    if (typeof window === 'undefined') return '';
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.textContent || el.innerText || '';
  };
  const keywords = form.watch('metadata.keywords') || [];

  useEffect(() => {
    if (!courseTitle) return;

    const plainTitle = htmlToText(courseTitle);

    const slug = plainTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    form.setValue('link', slug);
  }, [courseTitle, form]);

 const onSubmit = async (data: CourseFormData) => {
  setIsSubmitting(true);

  try {
    // ✅ Clear ONLY objective field before update
    const updatedData = {
      ...data,
      project_data: data.project_data?.map((project) => ({
        ...project,
        objective: "", // or null if backend allows
      })),
    };

    console.log("Updating form data:", updatedData);

    const response = await fetch(`/api/course/update?link=${courseUrl}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // ✅ send modified data
    });

    if (response.ok) {
      toast.success("Course updated successfully!");
      router.push("/admin/dashboard/courses");
    } else {
      const errorResult = await response.json();
      toast.error(`Error: ${errorResult.message || "Failed to update course"}`);
    }
  } catch (error) {
    toast.error("Network error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const skills = form.watch('skills_data') || [];

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | TechPratham Admin</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading course data...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Head>
          <title>Course Not Found | TechPratham Admin</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
            <p className="text-gray-600 mb-6">The course you're trying to edit doesn't exist or has been removed.</p>
            <Button
              onClick={() => router.push('/admin/dashboard/courses')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </>
    );
  }
  const rawTitle = form.watch("title");
  const cleanTitle = stripHtml(rawTitle);
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Update Course | Admin Dashboard</title>
        <meta name="description" content="Update Course Section in Admin Dashboard of TechPratham." />
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

            <div className='w-full h-full p-6 overflow-auto'>
              <Head>
                <title>Update Course - {cleanTitle} | TechPratham Admin</title>
              </Head>
              <div className="container mx-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Update Course</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Course Title *</FormLabel>
                                <FormControl>
                                  {/* <QuillEditor field={field} /> */}
                                  <Input  {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter the title of your course
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={
                                        isFetchingCategories
                                          ? "Loading categories..."
                                          : "Select a category"
                                      } />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isFetchingCategories ? (
                                      <SelectItem value="" disabled>
                                        Loading categories...
                                      </SelectItem>
                                    ) : categories.length === 0 ? (
                                      <SelectItem value="" disabled>
                                        No categories available
                                      </SelectItem>
                                    ) : (
                                      categories.map((category) => (
                                        <SelectItem key={category._id} value={category.name}>
                                          {category.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="certificateName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certificate Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Workday HCM Training" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Name to display on the certificate (optional)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Course Settings</CardTitle>
                            </CardHeader>
                            <CardContent className='w-full space-y-4'>
                              <FormField
                                control={form.control}
                                name="trending"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="mt-1"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        Mark as Trending Course
                                      </FormLabel>
                                      <FormDescription>
                                        This course will be displayed in the trending section
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Course Priority</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Lower numbers appear first (1=first, 2=second, 3=third, etc.). Leave 0 for default order.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          {/* Image Upload */}
                          <div className="w-full flex flex-col gap-4">

                            {/* IMAGE PREVIEW */}
                            <Image
                              src={imageSrc}
                              alt={form.watch("alt") || "Course Image"}
                              width={400}
                              height={300}
                              className="w-full h-72 object-cover rounded-lg border border-[#dddedd]"
                            />

                            {/* HIDDEN FILE INPUT */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCourseImageUpload(file);
                              }}
                            />

                            {/* UPLOAD BUTTON */}
                            <Button
                              type="button"
                              disabled={uploading}
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full max-w-80"
                            >
                              <FaUpload className="mr-2" />
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>

                            {/* ALT TEXT */}
                            <FormField
                              control={form.control}
                              name="alt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Image Alt Text <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Describe the image for SEO & accessibility"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>


                        </div>

                        <FormField
                          control={form.control}
                          name="shortDesc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Short Description *</FormLabel>
                              <FormControl>
                                {/* <Textarea {...field} /> */}
                                <QuillEditor field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Description *</FormLabel>
                              <FormControl>
                                {/* <Textarea className='h-40' {...field} /> */}
                                <QuillEditor field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Course Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Level *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Additional Required Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="curriculum"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Curriculum Link *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="interview"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interview Link *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="placement_report"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placement Report *</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Course Link *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="videoLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Video Link *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="assesment_link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assessment Link *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills You'll Learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" onClick={addSkill} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <div key={index} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSkill(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>SEO Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="metadata.title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Meta Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="SEO optimized title" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Title tag for search engines (recommended: 50-60 characters)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="metadata.description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Meta Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="SEO optimized description"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Description for search engines (recommended: 150-160 characters)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Keywords Section */}
                        <div className="space-y-4">
                          <FormLabel>Meta Keywords</FormLabel>
                          <div className="flex gap-2">
                            <Input
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              placeholder="Add a keyword"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                            />
                            <Button type="button" onClick={addKeyword} variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {keywords.map((keyword, index) => (
                                <div key={index} className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded">
                                  <span className="text-sm">{keyword}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeKeyword(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Curriculum Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Curriculum Details</CardTitle>
                        <Button
                          type="button"
                          onClick={() => appendCurriculum({ que: '', ans: '', topics: [] })}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {/* Curriculum Title Field */}
                        <FormField
                          control={form.control}
                          name="curriculumTitle"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Curriculum Section Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Course Curriculum" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom title for the "Curriculum" section (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {curriculumFields.map((field, index) => (
                          <CurriculumTopicItem
                            key={field.id}
                            form={form}
                            index={index}
                            canRemove={curriculumFields.length > 1}
                            onRemove={() => removeCurriculum(index)}
                          />
                        ))}
                      </CardContent>
                    </Card>

                    {/* FAQs Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <Button
                          type="button"
                          onClick={() => appendFaq({ que: '', ans: '' })}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add FAQ
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {faqFields.map((field, index) => (
                          <Card key={field.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">FAQ {index + 1}</CardTitle>
                              {faqFields.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeFaq(index)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name={`faqs_data.${index}.que`}
                                render={({ field }) => (
                                  <FormItem className="mb-4">
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                      <QuillEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`faqs_data.${index}.ans`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                      {/* <Textarea {...field} /> */}
                                      <QuillEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>



                    <Card className="mt-6">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Interview FAQs</CardTitle>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => appendInterviewFaq({ que: "", ans: "" })}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Question
                        </Button>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {interviewFaqFields.map((item, index) => (
                          <Card key={item.id} className="relative">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-sm">
                                Question {index + 1}
                              </CardTitle>

                              {interviewFaqFields.length > 0 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeInterviewFaq(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`interview_questions_data.${index}.que`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                      {/* <Input {...field} placeholder="Enter interview question" /> */}
                                      <QuillEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`interview_questions_data.${index}.ans`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                      {/* Use Textarea OR Quill */}
                                      {/* <Textarea {...field} placeholder="Enter answer" /> */}
                                      <QuillEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>


                    <Card>
                      <CardHeader className="flex justify-between items-center">
                        <CardTitle>Job Roles</CardTitle>
                        <Button
                          type="button"
                          onClick={() => appendJobRole({ role: '' })}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Role
                        </Button>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="jobRoleTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Role Section Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Career Opportunities" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom title for the "Job Role" section (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {jobRoleFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 mb-3">
                            <FormField
                              control={form.control}
                              name={`job_role.${index}.role`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="e.g. Frontend Developer" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeJobRole(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* SEO FAQs Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>SEO FAQs</CardTitle>
                        <Button
                          type="button"
                          onClick={() => appendSeoFaq({ que: '', ans: '' })}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add SEO FAQ
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {seoFaqFields.map((field, index) => (
                          <Card key={field.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">SEO FAQ {index + 1}</CardTitle>
                              {seoFaqFields.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeSeoFaq(index)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name={`seo_faqs_data.${index}.que`}
                                render={({ field }) => (
                                  <FormItem className="mb-4">
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter SEO FAQ question" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`seo_faqs_data.${index}.ans`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                      <QuillEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>About Certification</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">

                        {/* HEADING */}
                        <FormField
                          control={form.control}
                          name="about_certificate_data.heading"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heading</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* DESCRIPTION */}
                        <FormField
                          control={form.control}
                          name="about_certificate_data.paragraph"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <QuillEditor field={field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />


                      </CardContent>
                    </Card>




                    {/* Project Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Projects</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Project Title Field */}
                        <FormField
                          control={form.control}
                          name="projectTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Section Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Key Projects" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom title for the "Project" section (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <CardContent className="bg-white">
                      {projectFields.map((field, index) => (
                        <Card key={field.id} className="mb-4">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Project {index + 1}
                            </CardTitle>

                            {projectFields.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeProject(index)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </CardHeader>

                          <CardContent className="space-y-4">

                            {/* Company */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.company`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Accenture" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Logo */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.logo`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Logo Image</FormLabel>

                                  <FormControl>
                                    <Input {...field} placeholder="https://example.com/logo.png" />
                                  </FormControl>

                                  {/* Upload */}
                                  <div className="mt-2 flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id={`project-logo-${index}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleProjectLogoUpload(file, index);
                                      }}
                                    />

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        document
                                          .getElementById(`project-logo-${index}`)
                                          ?.click()
                                      }
                                    >
                                      {projectUploadingIndex === index
                                        ? "Uploading..."
                                        : "Upload Image"}
                                    </Button>
                                  </div>

                                  {/* Preview */}
                                  {field.value && (
                                    <div className="mt-3">
                                      <img
                                        src={field.value}
                                        alt="Project Logo Preview"
                                        className="h-20 object-contain border rounded p-2 bg-white"
                                      />
                                    </div>
                                  )}

                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Project Title */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Title</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Workday Security Redesign Project"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Scenario */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.scenario`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Scenario</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Describe the project scenario..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Live Work (Multi-line → Array) */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.liveWork`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Live Work (one per line)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      value={field.value?.join("\n") || ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value.split("\n") // ❌ no trim, no filter here
                                        )
                                      }
                                      placeholder={`Role audit...\nFixing domain access...\nCreating new roles...`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Outcome */}
                            <FormField
                              control={form.control}
                              name={`project_data.${index}.outcome`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Outcome</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Project outcome..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Objective (Hidden Field) */}
                            <input
                              type="hidden"
                              {...form.register(`project_data.${index}.objective`)}
                            />

                          </CardContent>
                        </Card>
                      ))}

                      {/* Add Project Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() =>
                          appendProject({
                            company: "",
                            logo: "",
                            title: "",
                            scenario: "",
                            liveWork: [],
                            outcome: "",
                            objective: "",
                          })
                        }
                      >
                        + Add New Project
                      </Button>
                    </CardContent>

                    {/* Who Should Take Section Title */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Who Should Take Section Title</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="whoShouldTakeTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Who Should Take Section Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Who Should Take This Course" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom title for the "Who Should Take" section (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Card>
                      <CardContent className="pt-6">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Updating Course...' : 'Update Course'}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateCoursePage;
