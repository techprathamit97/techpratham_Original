"use client";

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { useRouter } from 'next/router';

import dynamic from "next/dynamic";
import { generateSlug } from "@/lib/generateSlug";
import { Plus } from "lucide-react";
import parse from "html-react-parser";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { toast } from 'sonner';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { FaUpload } from 'react-icons/fa';

const TipTapEditor = dynamic(() => import('@/components/common/TipTabEditor/TipTapEditor'), {
    ssr: false,
    loading: () => <div className="border rounded-md p-4 bg-gray-50">Loading editor...</div>
});

// Form validation schema
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required.",
    }),
    slug: z.string().min(1, {
        message: "Slug is required.",
    }),
    image: z.string().min(1, {
        message: "Image is required.",
    }),
    description: z.string().optional(),
    content: z.string().min(1, {
        message: "Content is required.",
    }),
});

type FormData = z.infer<typeof formSchema>;

const ArticlesPage = () => {
    const { userData, loading, authenticated, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

    const router = useRouter();
    const [imageUrl, setImageUrl] = useState("");
    const postedBy = userData?.name;

    const [isEditorReady, setIsEditorReady] = useState(false);

    // Initialize form with react-hook-form
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            image: "",
            description: "",
            content: "",
        },
    });

    const { watch, setValue, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

    useEffect(() => {
        if (imageUrl) {
            setValue("image", imageUrl);
        }
    }, [imageUrl, setValue]);

    const getProfileImageUrl = () => {
        if (imageUrl) {
            return imageUrl;
        }
        return '/course/course-banner.png';
    };

    // Watch title to auto-generate slug
    const watchedTitle = watch("title");
    const watchedSlug = watch("slug");
    const watchedDescription = watch("description");
    const watchedContent = watch("content");

    // Auto-generate slug when title changes
    useEffect(() => {
        if (watchedTitle) {
            const autoSlug = generateSlug(watchedTitle);
            setValue("slug", autoSlug);
        }
    }, [watchedTitle, setValue]);

    // Form submission handler
    const onSubmit = async (data: FormData) => {
        try {
            const newBlog = {
                ...data,
                postedBy,
            };

            console.log('Submitting blog:', newBlog);

            const response = await fetch(`/api/article/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlog),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Announcement creation failed with status: ${response.status}, response: ${errorText}`);
            }

            const result = await response.json();
            console.log('Success:', result);

            // Reset form
            reset();

            toast("Success! Announcement created successfully!");
            router.push('/');

        } catch (error) {
            console.error('Error creating announcement:', error);
            toast.error("Failed to create announcement. Please try again.");
        }
    };

    useEffect(() => {
        setCurrentTab("articles");

        const timer = setTimeout(() => {
            setIsEditorReady(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [setCurrentTab]);

    return (
        <React.Fragment>
            {loading ? (
                <AdminLoader />
            ) : (!authenticated || !isAdmin) ? (
                <SignOut />
            ) : (
                <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

                    <AdminSidebar />

                    <div className='bg-black flex flex-col w-full h-full md:relative fixed'>

                        <AdminTopBar />

                        <div className='flex flex-col items-center justify-center min-h-screen bg-black w-full overflow-y-auto p-6 pb-16 scrollHide'>
                            <div className='w-full h-full flex flex-col justify-start'>

                                {authenticated ? (
                                    <div className='flex flex-col gap-4 items-start justify-start w-full h-full mb-6 px-0'>
                                        <div className='p-0 flex flex-row flex-wrap w-full'>

                                            <div className="flex flex-row gap-4 w-full">

                                                {/* Announcement Editor */}
                                                <div className="md:w-1/2 w-full p-5 mb-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
                                                    <h2 className="text-2xl font-bold border-b border-gray-400 pb-2 mb-5">
                                                        Announcement Editor
                                                    </h2>

                                                    <Form {...form}>
                                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                                            {/* Title */}
                                                            <FormField
                                                                control={form.control}
                                                                name="title"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Announcement Title *</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="Enter announcement title"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            {/* Slug */}
                                                            <FormField
                                                                control={form.control}
                                                                name="slug"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Announcement Slug</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="URL-friendly version (auto-generated)"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                            Auto-generated from title, but you can customize it
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <div className='min-w-64 flex flex-col gap-4'>
                                                                {imageUrl ? (
                                                                    <CldImage src={imageUrl} alt="Profile image" width={384} height={384} className='w-full h-80 object-cover border-4 border-white shadow' />
                                                                ) : (
                                                                    <Image src={getProfileImageUrl()} alt='profile' width={384} height={384} priority={true} className='w-full h-80 object-cover border-4 border-white shadow' />
                                                                )}
                                                                <CldUploadWidget
                                                                    uploadPreset="techpratham"
                                                                    onSuccess={(result: any) => {
                                                                        if (result.event === 'success' && result.info?.secure_url) {
                                                                            setImageUrl(result.info.secure_url);
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
                                                            </div>

                                                            {/* Description */}
                                                            <FormField
                                                                control={form.control}
                                                                name="description"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Announcement Description</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Brief description of the announcement..."
                                                                                rows={3}
                                                                                className="resize-none"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            {/* Content */}
                                                            <FormField
                                                                control={form.control}
                                                                name="content"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Announcement Content *</FormLabel>
                                                                        <FormControl>
                                                                            <div>
                                                                                {isEditorReady ? (
                                                                                    <TipTapEditor
                                                                                        content={field.value}
                                                                                        onChange={field.onChange}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="border rounded-md p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                                                                                        <div className="text-gray-500">Loading rich text editor...</div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <Button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="w-full sm:w-auto"
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                                        Creating...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Create Announcement
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </form>
                                                    </Form>
                                                </div>

                                                {/* Announcement Preview */}
                                                <div className="blog-view md:w-1/2 w-full p-8 py-5 mb-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
                                                    <h2 className="text-2xl font-bold border-b border-gray-400 pb-2 mb-5">
                                                        Announcement Preview
                                                    </h2>
                                                    <div className="space-y-6">

                                                        {/* Title Preview */}
                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-900 mb-2">
                                                                Title
                                                            </Label>
                                                            <h1 className="text-2xl font-bold text-gray-900 mt-2">
                                                                {watchedTitle || "Enter a title..."}
                                                            </h1>
                                                        </div>

                                                        {/* Slug Preview */}
                                                        {watchedSlug && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-900 mb-2">
                                                                    URL Slug
                                                                </Label>
                                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm text-purple-600 mt-2 inline-block">
                                                                    /{watchedSlug}
                                                                </code>
                                                            </div>
                                                        )}

                                                        {/* Description Preview */}
                                                        {watchedDescription && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-900 mb-2">
                                                                    Description
                                                                </Label>
                                                                <p className="text-gray-700 italic mt-2">{watchedDescription}</p>
                                                            </div>
                                                        )}

                                                        {/* Content Preview */}
                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-900 mb-2">
                                                                Content
                                                            </Label>
                                                            <div className="prose prose-sm max-w-none mt-2">
                                                                {watchedContent ? parse(watchedContent) : (
                                                                    <p className="text-gray-500 italic">Start typing to see preview...</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Metadata */}
                                                        {postedBy && (
                                                            <div className="pt-4 border-t border-gray-200">
                                                                <p className="text-sm text-gray-500">
                                                                    Author: <span className="font-medium">{postedBy}</span>
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Created: {new Date().toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <div className='w-full min-h-screen flex flex-col items-center justify-start bg-[#f9f9f9]'>

                                        <div className='flex flex-col w-full h-full pt-24 pb-8 items-center justify-center'>

                                            <div className='w-11/12 h-full flex flex-col items-center justify-center overflow-hidden'>

                                                <div className='w-full h-auto flex flex-col items-center justify-center gap-3 mb-6'>
                                                    <h1 className='md:text-3xl text-xl font-bold'>Gmpshare: Admin Dashboard</h1>
                                                    <Separator className='h-[0.5px]' />
                                                </div>

                                                <div className='w-full h-auto flex flex-col items-center justify-center gap-2 mb-4'>
                                                    <Image src={'/home/no-entry.png'} alt='boy on chair' width={600} height={400} className='' />
                                                    <div className='text-base font-normal'>This dashboard is only for admins. If you're not the admin, back off.</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default ArticlesPage