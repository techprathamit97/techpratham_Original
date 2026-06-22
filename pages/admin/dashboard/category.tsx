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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import Head from 'next/head';

// Zod validation schema
const categorySchema = z.object({
    name: z.string()
        .min(2, { message: "Category name must be at least 2 characters." })
        .max(50, { message: "Category name must not exceed 50 characters." }),
    position: z.coerce.number({ invalid_type_error: "Position must be a number" })
        .min(1, { message: "Position must be 1 or greater." }),
    slug: z.string()
        .min(2, { message: "Slug must be at least 2 characters." })
        .max(50, { message: "Slug must not exceed 50 characters." })
        .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
    displayInNavbar: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    position: number;
    children?: Subcategory[];
}

interface Category {
    _id: string;
    name: string;
    position: number;
    slug: string;
    displayInNavbar: boolean;
    isActive: boolean;
    subcategories: Subcategory[];
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
    const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
    const [subcategoryParent, setSubcategoryParent] = useState<{ categoryId: string; path?: number[] } | null>(null);

    // Subcategory form
    const subcategoryForm = useForm({
        defaultValues: {
            name: "",
            slug: "",
        },
    });

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            position: 1,
            slug: "",
            displayInNavbar: true,
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
            toast.error('Failed to fetch categories. Please try again.');
        } finally {
            setIsFetching(false);
        }
    };

    // Generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Generate unique ID for subcategories
    const generateId = (): string => {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            setIsSubmitting(true);

            // Validate slug is provided
            if (!values.slug || values.slug.trim() === '') {
                toast.error('Slug is required');
                return;
            }

            // Prepare data for submission (no auto slug generation)
            const submitData = {
                name: values.name,
                position: values.position,
                slug: values.slug.toLowerCase().trim(),
                displayInNavbar: values.displayInNavbar
            };

            if (editingCategory) {
                // Update existing category
                const response = await fetch(`/api/category/update/${editingCategory._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submitData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update category');
                }

                await fetchCategories();
                setEditingCategory(null);
                toast.success('Category updated successfully!');
            } else {
                // Create new category
                const response = await fetch('/api/category/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...submitData,
                        subcategories: [] // Initialize with empty subcategories
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create category');
                }

                await fetchCategories();
                toast.success('Category created successfully!');
            }

            // Reset form
            form.reset();

        } catch (error: any) {
            console.error('Error with category:', error);
            toast.error(error.message || 'Operation failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        form.setValue('name', category.name);
        form.setValue('position', category.position);
        form.setValue('slug', category.slug);
        form.setValue('displayInNavbar', category.displayInNavbar);
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

            await fetchCategories();
            toast.success('Category deleted successfully!');

        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.message || 'Failed to delete category. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    // Add subcategory to a category
    const openSubcategoryForm = (categoryId: string, path?: number[]) => {
        setSubcategoryParent({ categoryId, path });
        setShowSubcategoryForm(true);
        subcategoryForm.reset();
    };

    const closeSubcategoryForm = () => {
        setShowSubcategoryForm(false);
        setSubcategoryParent(null);
        subcategoryForm.reset();
    };

    const onSubmitSubcategory = async (values: { name: string; slug: string }) => {
        try {
            if (!subcategoryParent) return;

            // Validate inputs
            if (!values.name.trim() || !values.slug.trim()) {
                toast.error('Both name and slug are required');
                return;
            }

            // Validate slug format
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(values.slug)) {
                toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
                return;
            }

            const { categoryId, path } = subcategoryParent;
            const category = categories.find(cat => cat._id === categoryId);
            if (!category) return;

            const newSubcategory: Subcategory = {
                id: generateId(),
                name: values.name.trim(),
                slug: values.slug.toLowerCase().trim(),
                position: 1,
                children: []
            };

            let updatedSubcategories = JSON.parse(JSON.stringify(category.subcategories));

            if (!path) {
                // Adding to main category
                newSubcategory.position = category.subcategories.length + 1;
                updatedSubcategories.push(newSubcategory);
            } else {
                // Adding to nested subcategory
                let current = updatedSubcategories;
                for (let i = 0; i < path.length - 1; i++) {
                    current = current[path[i]].children;
                }
                
                const parent = current[path[path.length - 1]];
                if (!parent.children) parent.children = [];
                newSubcategory.position = parent.children.length + 1;
                parent.children.push(newSubcategory);
            }

            const response = await fetch(`/api/category/update/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subcategories: updatedSubcategories
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add subcategory');
            }

            await fetchCategories();
            toast.success('Subcategory added successfully!');
            closeSubcategoryForm();

        } catch (error: any) {
            console.error('Error adding subcategory:', error);
            toast.error(error.message || 'Failed to add subcategory');
        }
    };

    // Delete subcategory
    const deleteSubcategory = async (categoryId: string, path: number[]) => {
        try {
            const category = categories.find(cat => cat._id === categoryId);
            if (!category) return;

            const updatedSubcategories = JSON.parse(JSON.stringify(category.subcategories));
            
            if (path.length === 1) {
                // Delete from root level
                updatedSubcategories.splice(path[0], 1);
            } else {
                // Navigate to parent and delete
                let current = updatedSubcategories;
                for (let i = 0; i < path.length - 2; i++) {
                    current = current[path[i]].children;
                }
                current[path[path.length - 2]].children.splice(path[path.length - 1], 1);
            }

            const response = await fetch(`/api/category/update/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subcategories: updatedSubcategories
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete subcategory');
            }

            await fetchCategories();
            toast.success('Subcategory deleted successfully!');

        } catch (error: any) {
            console.error('Error deleting subcategory:', error);
            toast.error(error.message || 'Failed to delete subcategory');
        }
    };

    // Render subcategory tree
    const renderSubcategories = (subcategories: Subcategory[], categoryId: string, path: number[] = []) => {
        return subcategories.map((sub, index) => {
            const currentPath = [...path, index];
            
            return (
                <div key={sub.id} className={`border border-gray-600 rounded-lg mb-2 ${path.length > 0 ? 'ml-6' : ''}`}>
                    <div className="bg-gray-750 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-200">
                                    {'📂'.repeat(path.length + 1)} {sub.name}
                                </span>
                                <Badge variant="outline" className="text-xs text-gray-400 border-gray-500">
                                    {sub.slug}
                                </Badge>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-600 text-green-400 hover:bg-green-900 p-1"
                                    onClick={() => openSubcategoryForm(categoryId, currentPath)}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-600 text-red-400 hover:bg-red-900 p-1"
                                    onClick={() => {
                                        if (confirm(`Delete "${sub.name}"?`)) {
                                            deleteSubcategory(categoryId, currentPath);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Nested children */}
                    {sub.children && sub.children.length > 0 && (
                        <div className="p-2">
                            {renderSubcategories(sub.children, categoryId, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
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
                <meta name="description" content="Manage categories with nested subcategories." />
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
                                                            <FormLabel className="text-gray-200">Display Order</FormLabel>
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
                                                            <FormLabel className="text-gray-200">Category Name *</FormLabel>
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
                                                    name="slug"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200">Slug *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="enter-url-friendly-slug"
                                                                    {...field}
                                                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                                />
                                                            </FormControl>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                Must be lowercase, use hyphens instead of spaces
                                                            </div>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="displayInNavbar"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-gray-200">Display in Navbar</FormLabel>
                                                                <div className="text-sm text-gray-400">
                                                                    Show this category in the navigation dropdown
                                                                </div>
                                                            </div>
                                                            <FormControl>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded"
                                                                />
                                                            </FormControl>
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
                                            <span>Categories ({categories.length})</span>
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
                                            <div className="max-h-96 overflow-y-auto space-y-4">
                                                {categories.map((category) => (
                                                    <div key={category._id} className="border border-gray-700 rounded-lg">
                                                        {/* Main Category */}
                                                        <div className="bg-gray-800 p-4 rounded-t-lg">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold text-white text-lg">
                                                                        📁 {category.name}
                                                                    </h3>
                                                                    <Badge variant="outline" className="border-blue-600 text-blue-400 text-xs">
                                                                        Main Category
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-green-600 text-green-400 hover:bg-green-900 p-2"
                                                                        onClick={() => openSubcategoryForm(category._id)}
                                                                        title="Add Subcategory"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2"
                                                                        onClick={() => handleEdit(category)}
                                                                        title="Edit Category"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-red-600 text-red-400 hover:bg-red-900 p-2"
                                                                        onClick={() => handleDelete(category._id)}
                                                                        disabled={isDeleting === category._id}
                                                                        title="Delete Category"
                                                                    >
                                                                        {isDeleting === category._id ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Trash2 className="w-4 h-4" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Position: {category.position} | Slug: {category.slug} | Created: {formatDate(category.createdAt)}
                                                            </div>
                                                        </div>

                                                        {/* Nested Subcategories */}
                                                        {category.subcategories && category.subcategories.length > 0 && (
                                                            <div className="p-4 bg-gray-850">
                                                                {renderSubcategories(category.subcategories, category._id)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Subcategory Form Modal */}
                        {showSubcategoryForm && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <Card className="bg-gray-900 border-gray-700 w-96 max-w-lg mx-4">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center justify-between">
                                            <span>Add Subcategory</span>
                                            <Button
                                                onClick={closeSubcategoryForm}
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 hover:text-white"
                                            >
                                                ✕
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={subcategoryForm.handleSubmit(onSubmitSubcategory)} className="space-y-4">
                                            <div>
                                                <label className="text-gray-200 text-sm font-medium block mb-2">
                                                    Subcategory Name *
                                                </label>
                                                <Input
                                                    {...subcategoryForm.register('name', { required: 'Name is required' })}
                                                    placeholder="Enter subcategory name"
                                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                />
                                                {subcategoryForm.formState.errors.name && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {subcategoryForm.formState.errors.name.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-gray-200 text-sm font-medium block mb-2">
                                                    Slug *
                                                </label>
                                                <Input
                                                    {...subcategoryForm.register('slug', { 
                                                        required: 'Slug is required',
                                                        pattern: {
                                                            value: /^[a-z0-9-]+$/,
                                                            message: 'Slug can only contain lowercase letters, numbers, and hyphens'
                                                        }
                                                    })}
                                                    placeholder="enter-url-friendly-slug"
                                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                                />
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Must be lowercase, use hyphens instead of spaces
                                                </div>
                                                {subcategoryForm.formState.errors.slug && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {subcategoryForm.formState.errors.slug.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    type="button"
                                                    onClick={closeSubcategoryForm}
                                                    variant="outline"
                                                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Add Subcategory
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default CategoryPage;