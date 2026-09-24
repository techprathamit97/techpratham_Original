import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import Course from '@/models/course';
import { connectMongo } from '@/utils/mongodb';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/lib/courseCache';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
    try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

        await connectMongo();

        const body = await request.json();
        
        const courseItems = Array.isArray(body) 
            ? await Course.insertMany(body)
            : await Course.create(body);

        // Clear navbar cache since courses have been modified
        clearNavbarCache();
        
        // Clear fetch-grouped cache since courses have been modified
        clearFetchGroupedCache();

        // On-demand ISR revalidation so a newly created course shows on the
        // homepage immediately instead of waiting for the 5-minute window.
        try {
            revalidatePath('/');
            const links = Array.isArray(courseItems)
                ? courseItems.map((c: any) => c?.link).filter(Boolean)
                : [ (courseItems as any)?.link ].filter(Boolean);
            links.forEach((link: string) => revalidatePath(`/courses/${link}`));
        } catch (e) {
            console.error('revalidatePath failed:', e);
        }
            
        return NextResponse.json(courseItems, { status: 201 });
    } catch (error: any) {
        console.error('Database error:', error);
        if (error.errors) {
            const fieldErrors = Object.entries(error.errors).map(([field, err]: any) => ({
                field,
                message: err.message || err.toString()
            }));
            console.error('Field validation errors:', fieldErrors);
            return NextResponse.json({ 
                message: error.message,
                fieldErrors: fieldErrors 
            }, { status: 500 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

