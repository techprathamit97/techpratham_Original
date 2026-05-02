import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Star } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useRef } from "react";
import { FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { Separator } from '@/components/ui/separator';
import QuillEditor from '../common/QuillEditor';
import { uploadImageToS3 } from "@/lib/uploadImage";

// Zod Schema
const curriculumSchema = z.object({
    que: z.string().min(1, "Question is required"),
    ans: z.string().min(1, "Answer is required"),
    topics: z.array(z.string()).optional()
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

const interviewQuestionSchema = z.object({
    que: z.string().optional(),
    ans: z.string().optional(),
});

const jobRoleSchema = z.object({
    role: z.string().optional(),
});

const aboutCertificateSchema = z.object({
    heading: z.string().optional(),
    paragraph: z.string().optional()
});


const courseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    shortDesc: z.string()
        .min(1, "Short description is required")
        .max(280, "Short description must be at most 180 characters"),
    image: z.string(),
    alt: z.string().min(1, "Image alt text is required"),
    description: z
        .string()
        .min(1, "Detailed description is required")
        .refine(
            (val) => val.trim().split(/\s+/).length <= 800,
            "Detailed description must not exceed 800 words"
        ),
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
    videoLink: z.string().url("Please enter a valid URL").min(1, "Video link is required"),
    assesment_link: z.string().url("Please enter a valid URL").min(1, "Assessment link is required"),
    curriculum_data: z.array(curriculumSchema).optional(),
    skills_data: z.array(z.string()).optional(),
    faqs_data: z.array(faqSchema).optional(),
    seo_faqs_data: z.array(seoFaqSchema).optional(), // SEO FAQs
    project_data: z.array(projectSchema).optional(),
    interview_questions_data: z.array(interviewQuestionSchema).optional(),
    job_role: z.array(jobRoleSchema).optional(),
    about_certificate_data: aboutCertificateSchema.optional(),
    metadata: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional()
    }).optional(),
});

interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

type CourseFormData = z.infer<typeof courseSchema>;

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

    const topics = form.watch(`curriculum_data.${index}.topics`) || [];



    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">Topic {index + 1}</h4>
                {canRemove && (
                    <Button
                        type="button"
                        onClick={onRemove}
                        variant="destructive"
                        size="sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className='flex flex-col gap-4'>
                    <FormField
                        control={form.control}
                        name={`curriculum_data.${index}.que`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                    <QuillEditor field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Topics Section */}
                    <div className="space-y-4">
                        <FormLabel>Subtopics</FormLabel>
                        <div className="flex gap-2">
                            <Input
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Add a subtopic"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                            />
                            <Button type="button" onClick={addTopic} variant="outline" size="sm" className='h-9'>
                                <Plus className="w-4" />
                            </Button>
                        </div>
                        {topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic: any, topicIndex: any) => (
                                    <div key={topicIndex} className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                                        <span className="text-sm">{topic}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(topicIndex)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name={`curriculum_data.${index}.ans`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                {/* <Textarea
                                    placeholder="Enter detailed description"
                                    rows={6}
                                    {...field}
                                /> */}
                                <QuillEditor field={field} />
                            </FormControl>
                            <FormDescription>Write here the detailed description of this topic.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

        </div>
    );
};

const CourseTab = () => {
    const [newSkill, setNewSkill] = useState('');
    const [publicId, setPublicId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const [preview, setPreview] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const imageSrc = preview || publicId || "/course/course-banner.png";
    const router = useRouter();

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
            project_data: [
                {
                    company: '',
                    logo: '',
                    title: '',
                    scenario: '',
                    liveWork: [''],
                    outcome: '',
                    objective: '',
                }
            ],

            interview_questions_data: [{ que: "", ans: "" }],


            job_role: [{ role: "" }],
            about_certificate_data: {
                heading: "",
                paragraph: ""
            },
            metadata: {
                title: '',
                description: '',
                keywords: []
            }
        }
    });

    const { setValue, reset } = form;
    useEffect(() => {
        if (publicId) {
            setValue("image", publicId);
        }
    }, [publicId, setValue]);



    const {
        fields: curriculumFields,
        append: appendCurriculum,
        remove: removeCurriculum
    } = useFieldArray({
        control: form.control,
        name: 'curriculum_data'
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
        fields: interviewFields,
        append: appendInterview,
        remove: removeInterview,
    } = useFieldArray({
        control: form.control,
        name: "interview_questions_data",
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


    const {
        fields: jobRoleFields,
        append: appendJobRole,
        remove: removeJobRole,
    } = useFieldArray({
        control: form.control,
        name: "job_role",
    });

    const removeSkill = (index: number) => {
        const currentSkills = form.getValues('skills_data') || [];
        const updatedSkills = currentSkills.filter((_, i) => i !== index);
        form.setValue('skills_data', updatedSkills);
    };

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

    const keywords = form.watch('metadata.keywords') || [];
    const htmlToText = (html: string = ''): string => {
        if (typeof window === 'undefined') return '';

        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };
    const courseTitle = form.watch('title');

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
            console.log('Submitting form data:', data);

            const response = await fetch('/api/course/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();

                console.log('Course created successfully:', result);
                toast.success(`Course created successfully! Course ID: ${result._id}`);

                form.reset();
                router.push('/admin/dashboard/courses');
            } else {
                const errorResult = await response.json();
                toast.error(`Error: ${errorResult.message || 'Failed to create course'}`);
            }

        } catch (error) {
            toast.error('Network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleCourseImageUpload = async (file: File) => {
        try {
            setUploading(true);

            const { url } = await uploadImageToS3(file);

            // ✅ update form + preview
            form.setValue("image", url);
            setPreview(url);

            toast.success("Image uploaded successfully");
        } catch (err) {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleProjectLogoUpload = async (file: File, index: number) => {
        try {
            setUploadingIndex(index);

            const { url } = await uploadImageToS3(file);

            // ✅ Auto set logo field in form
            form.setValue(`project_data.${index}.logo`, url);

            toast.success("Project logo uploaded successfully");
        } catch (err) {
            toast.error("Project logo upload failed");
        } finally {
            setUploadingIndex(null);
        }
    };









    const skills = form.watch('skills_data') || [];

    return (
        <div className="bg-[#242935] shadow-sm rounded-lg">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500" />
                        Create New Course
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <div className='flex flex-col'>
                                <FormLabel className="text-lg font-semibold mb-1">Basic Information</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Title <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    {/* <QuillEditor field={field} /> */}
                                                    <Input placeholder="Course Title" {...field} />
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
                                                <FormLabel>Category <span className='text-red-500'>*</span></FormLabel>
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
                                                            <SelectItem value="loading" disabled>
                                                                Loading categories...
                                                            </SelectItem>
                                                        ) : categories.length === 0 ? (
                                                            <SelectItem value="none" disabled>
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

                                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                                    <div className='flex flex-col gap-4'>
                                        <div className="w-full space-y-4">
                                            <FormLabel>Course Settings <span className='text-red-500'>*</span></FormLabel>

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
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="shortDesc"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Short Description <span className='text-red-500'>*</span></FormLabel>

                                                    <FormControl>
                                                        {/* Replace the Textarea/ReactQuill directly with the SSR-safe wrapper */}
                                                        <QuillEditor field={field} />
                                                    </FormControl>

                                                    <FormDescription>
                                                        Enter a brief description. Use the toolbar to add hyperlinks and other formatting.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-4">

                                        {/* IMAGE PREVIEW */}
                                        <Image
                                            src={imageSrc}
                                            alt="Course image"
                                            width={384}
                                            height={384}
                                            className="w-full h-72 object-cover border-4 border-white shadow"
                                        />


                                        {/* HIDDEN INPUT */}
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

                                        {/* BUTTON */}
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
                                                        <Input placeholder="Enter alt text" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>


                                    {/* <div className='w-full flex flex-col gap-4'>
                                        {publicId ? (
                                            <CldImage src={publicId} alt="Profile image" width={384} height={384} className='w-full h-72 object-cover border-4 border-white shadow' />
                                        ) : (
                                            <Image src={getProfileImageUrl()} alt='profile' width={384} height={384} priority={true} className='w-full h-72 object-cover border-4 border-white shadow' />
                                        )}
                                        <CldUploadWidget
                                            uploadPreset="techpratham"
                                            onSuccess={(result: any) => {
                                                if (result.event === 'success' && result.info?.secure_url) {
                                                    setPublicId(result.info.secure_url);
                                                }
                                            }}
                                        >
                                            {({ open }) => {
                                                return (
                                                    <Button type="button" onClick={() => open()} className='w-full max-w-80'>
                                                        <FaUpload className="mr-2" /> Upload an Image
                                                    </Button>
                                                );
                                            }}
                                        </CldUploadWidget>
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
                                                            placeholder="Enter Alt text for the image"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Used for SEO & accessibility
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div> */}

                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className='mb-4'>
                                            <FormLabel>Detailed Description <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <QuillEditor field={field} />
                                            </FormControl>
                                            <FormDescription>Max 800 characters are allowed.</FormDescription>
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
                                                <FormLabel>Duration <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 8 weeks, 40 hours" {...field} />
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
                                                <FormLabel>Level <span className='text-red-500'>*</span></FormLabel>
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
                                                <FormLabel>Rating <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 4.5, 5.0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col w-full'>
                                <FormLabel className="text-lg font-semibold mb-1">External Links</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                {/* Additional Required Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <FormField
                                        control={form.control}
                                        name="curriculum"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Curriculum Link <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Curriculum report link"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    You can add drive link of your documents here.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="interview"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Interview Link <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Interview Questions report link"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    You can add drive link of your documents here.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="placement_report"
                                    render={({ field }) => (
                                        <FormItem className='mb-4'>
                                            <FormLabel>Placement Report <span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Placement statistics report link"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                You can add drive link of your documents here.
                                            </FormDescription>
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
                                                <FormLabel>Course Link <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/course" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Don't change as it's auto-generated from course title.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="videoLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Video Link <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Copy the embed link from share section.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="assesment_link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Assessment Link <span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/assessment" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    You can add drive link of your documents here.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-4">
                                <FormLabel className="text-lg font-semibold">Skills You'll Learn</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                                                <span className="text-sm">{skill}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SEO Metadata Section */}
                            <div className="flex flex-col">
                                <FormLabel className="text-lg font-semibold mb-1">SEO Metadata</FormLabel>

                                <Separator className='h-[0.5px] mb-4' />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className='flex flex-col gap-4'>
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
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {keywords.map((keyword, index) => (
                                                        <div key={index} className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                                                            <span className="text-sm">{keyword}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeKeyword(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="metadata.description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="SEO optimized description"
                                                        rows={5}
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
                            </div>

                            {/* Curriculum Section */}
                            <div className="flex flex-col">
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

                                <FormLabel className="text-lg font-semibold mb-1">Curriculum Details</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                <div className="space-y-4 mb-4">
                                    {curriculumFields.map((field, index) => (
                                        <CurriculumTopicItem
                                            key={field.id}
                                            form={form}
                                            index={index}
                                            canRemove={curriculumFields.length > 1}
                                            onRemove={() => removeCurriculum(index)}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        onClick={() => appendCurriculum({ que: '', ans: '', topics: [] })}
                                        variant="default"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Topic
                                    </Button>
                                </div>
                            </div>



                            {/* FAQs Section */}
                            <div className="flex flex-col">
                                <FormLabel className="text-lg font-semibold mb-1">Frequently Asked Questions</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                <div className="space-y-4 mb-4">
                                    {faqFields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">FAQ {index + 1}</h4>
                                                {faqFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeFaq(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`faqs_data.${index}.que`}
                                                    render={({ field }) => (
                                                        <FormItem>
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
                                                                {/* <Textarea
                                                                    placeholder="Enter detailed answer"
                                                                    rows={3}
                                                                    {...field}
                                                                /> */}
                                                                <QuillEditor field={field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        onClick={() => appendFaq({ que: '', ans: '' })}
                                        variant="default"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add FAQ
                                    </Button>
                                </div>
                            </div>

                            <FormLabel className="text-lg font-semibold">Interview FAQs</FormLabel>

                            {interviewFields.map((field, index) => (
                                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                                    <FormField
                                        control={form.control}
                                        name={`interview_questions_data.${index}.que`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question</FormLabel>
                                                <FormControl>
                                                    <QuillEditor field={field} />
                                                </FormControl>
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
                                                    <QuillEditor field={field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeInterview(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}

                            <Button type="button" onClick={() => appendInterview({ que: "", ans: "" })}>
                                Add Interview FAQ
                            </Button>



                            <div>
                                <FormField
                                    control={form.control}
                                    name="jobRoleTitle"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
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

                                <FormLabel className="text-lg font-semibold">Job Roles</FormLabel>

                                {jobRoleFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`job_role.${index}.role`}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input placeholder="e.g. Workday HCM Consultant" {...field} />
                                                </FormControl>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeJobRole(index)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" onClick={() => appendJobRole({ role: "" })}>
                                    Add Job Role
                                </Button>
                            </div>

                            {/* SEO FAQs Section */}
                            <div className="flex flex-col">
                                <FormLabel className="text-lg font-semibold mb-1">SEO FAQs</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                <div className="space-y-4 mb-4">
                                    {seoFaqFields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">SEO FAQ {index + 1}</h4>
                                                {seoFaqFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeSeoFaq(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`seo_faqs_data.${index}.que`}
                                                    render={({ field }) => (
                                                        <FormItem>
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
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        onClick={() => appendSeoFaq({ que: '', ans: '' })}
                                        variant="default"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add SEO FAQ
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <FormLabel className="text-lg font-semibold">
                                    About Certification
                                </FormLabel>

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
                            </div>

                            {/* Project Section */}
                            <div className="flex flex-col">
                                {/* Project Title Field */}
                                <FormField
                                    control={form.control}
                                    name="projectTitle"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
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

                                <FormLabel className="text-lg font-semibold mb-1">
                                    Projects
                                </FormLabel>
                                <Separator className="h-[0.5px] mb-4" />

                                <div className="space-y-6 mb-4">
                                    {projectFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="border rounded-lg p-5 space-y-5 bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Project {index + 1}</h4>
                                                {projectFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeProject(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

                                                {/* Logo Upload + URL */}
                                                <FormField
                                                    control={form.control}
                                                    name={`project_data.${index}.logo`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Project Logo</FormLabel>

                                                            <div className="space-y-3">
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="https://example.com/logo.png"
                                                                    />
                                                                </FormControl>

                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        id={`project-logo-${index}`}
                                                                        onChange={(e) => {
                                                                            if (e.target.files?.[0]) {
                                                                                handleProjectLogoUpload(
                                                                                    e.target.files[0],
                                                                                    index
                                                                                );
                                                                            }
                                                                        }}
                                                                    />

                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            document
                                                                                .getElementById(
                                                                                    `project-logo-${index}`
                                                                                )
                                                                                ?.click()
                                                                        }
                                                                        disabled={uploadingIndex === index}
                                                                    >
                                                                        {uploadingIndex === index
                                                                            ? "Uploading..."
                                                                            : "Upload Logo"}
                                                                    </Button>

                                                                    {field.value && (
                                                                        <img
                                                                            src={field.value}
                                                                            alt="logo preview"
                                                                            className="h-10 object-contain"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Title */}
                                                <FormField
                                                    control={form.control}
                                                    name={`project_data.${index}.title`}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
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
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Scenario</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Describe the project scenario..."
                                                                    rows={3}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Live Work (One per line → Stored as Array) */}
                                                <FormField
                                                    control={form.control}
                                                    name={`project_data.${index}.liveWork`}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>
                                                                Live Work (One per line)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                                                                    onChange={(e) => {
                                                                        field.onChange(e.target.value.split("\n"));
                                                                    }}
                                                                    placeholder={`Role audit using Delivered Security Reports
Fixing domain access leaks
Rebuilding Business Process security policies`}
                                                                    rows={4}
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
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Outcome</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Compliance improvement & audit pass."
                                                                    rows={3}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Objective (Hidden Field) */}
                                                <input
                                                    type="hidden"
                                                    {...form.register(
                                                        `project_data.${index}.objective`
                                                    )}
                                                />

                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
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
                                        variant="default"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Project
                                    </Button>
                                </div>
                            </div>

                            {/* Custom Who Should Take Title */}
                            <div className="flex flex-col">
                                <FormLabel className="text-lg font-semibold mb-1">Who Should Take Section Title</FormLabel>
                                <Separator className='h-[0.5px] mb-4' />

                                <div className="grid grid-cols-1 gap-6">
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
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating Course...' : 'Create Course'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CourseTab