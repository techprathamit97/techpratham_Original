"use client";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Head from 'next/head';

// Zod validation schema
const categorySchema = z.object({
    name: z.string()
        .min(2, { message: "Category name must be at least 2 characters." })
        .max(50, { message: "Category name must not exceed 50 characters." })
        .regex(/^[a-zA-Z0-9\s]+$/, { message: "Category name can only contain letters, numbers, and spaces." }),
    description: z.string()
        .min(10, { message: "Description must be at least 10 characters." })
        .max(200, { message: "Description must not exceed 200 characters." }),
    position: z.coerce.number({ invalid_type_error: "Position must be a number" })
        .min(1, { message: "Position must be 1 or greater." }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Category {
    _id: string;
    name: string;
    description: string;
     position: number;
    createdAt: string;
    updatedAt: string;
}

const CategoryPage = () => {
    const { loading, authenticated, userData, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        setCurrentTab("category");
    }, [currentTab]);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsFetching(true);
            const response = await fetch('/api/category/fetch');

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast("Failed to fetch categories. Please try again.");
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            setIsSubmitting(true);

            if (editingCategory) {
                // Update existing category
                const response = await fetch(`/api/category/update/${editingCategory._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update category');
                }

                const updatedCategory = await response.json();

                // Update category in the list
                setCategories(prev =>
                    prev.map(cat =>
                        cat._id === editingCategory._id ? updatedCategory : cat
                    )
                );

                setEditingCategory(null);
                toast("Category updated successfully!");
            } else {
                // Create new category
                const response = await fetch('/api/category/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create category');
                }

                const newCategory = await response.json();
                setCategories(prev => [newCategory, ...prev]);
                toast("Category created successfully!");
            }

            // Reset form
            form.reset();

        } catch (error: any) {
            console.error('Error with category:', error);
            toast("Operation failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add these three new functions after your onSubmit function:
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setValue('name', category.name);
    form.setValue('description', category.description);
    form.setValue('position', category.position); // Add this line
};

    const handleCancelEdit = () => {
        setEditingCategory(null);
        form.reset();
    };

    const handleDelete = async (categoryId: string) => {
        try {
            setIsDeleting(categoryId);

            const response = await fetch(`/api/category/delete/${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete category');
            }

            // Remove category from the list
            setCategories(prev => prev.filter(cat => cat._id !== categoryId));
            toast("Category deleted successfully!");

        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast("Failed to delete category. Please try again.");
        } finally {
            setIsDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Manage Category | Admin Dashboard</title>
                <meta name="description" content="Explore the Manage Category section in Admin Dashboard of TechPratham." />
            </Head>

            {loading ? (
                <AdminLoader />
            ) : (!authenticated || !isAdmin) ? (
                <SignOut />
            ) : (
                <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
                    <AdminSidebar />

                    <div className='bg-black flex flex-col w-full h-full md:relative fixed'>
                        <AdminTopBar />

                        <div className="bg-black p-6 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">Category Management</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Create/Edit Category Section */}
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Plus className="w-5 h-5" />
                                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                                            </div>
                                            {editingCategory && (
                                                <Button
                                                    onClick={handleCancelEdit}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="position"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200">Display Order (Position))</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="e.g. 1"
                                                                    {...field}
                                                                    className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200">Category Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter category name"
                                                                    {...field}
                                                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200">Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Enter category description"
                                                                    {...field}
                                                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                                                                    rows={3}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            {editingCategory ? 'Updating...' : 'Creating...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {editingCategory ? (
                                                                <>
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Update Category
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Create Category
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>

                                {/* Display Categories Section */}
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center justify-between">
                                            <span>Existing Categories ({categories.length})</span>
                                            <Button
                                                onClick={fetchCategories}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                            >
                                                Refresh
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isFetching ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                <span className="ml-2 text-gray-400">Loading categories...</span>
                                            </div>
                                        ) : categories.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 mb-2">No categories found</p>
                                                <p className="text-sm text-gray-500">Create your first category using the form</p>
                                            </div>
                                        ) : (
                                            <div className="max-h-96 overflow-y-auto space-y-3">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category._id}
                                                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="font-semibold text-white text-lg">
                                                                {category.name}
                                                            </h3>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2"
                                                                    onClick={() => handleEdit(category)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-red-600 text-red-400 hover:bg-red-900 p-2"
                                                                    onClick={() => handleDelete(category._id)}
                                                                    disabled={isDeleting === category._id}
                                                                >
                                                                    {isDeleting === category._id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                                                            {category.description}
                                                        </p>

                                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                                                Created: {formatDate(category.createdAt)}
                                                            </Badge>
                                                            {category.updatedAt !== category.createdAt && (
                                                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                                                    Updated: {formatDate(category.updatedAt)}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default CategoryPage;