import Enrolled from '@/models/enrolled';
import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';

export async function PUT(request: NextRequest) {
    try {
        await connectMongo();

        const body = await request.json();
        const { email, course_link, certificate, ...otherFields } = body;

        const enrollment = await Enrolled.findOne({
            email: email,
            course_link: course_link
        });

        if (!enrollment) {
            return Response.json({ error: 'Enrollment not found' }, { status: 404 });
        }

        const updateData = {
            ...otherFields,
            ...(certificate && {
                certificate: {
                    enrolledDate: certificate.enrolledDate,
                    completionDate: certificate.completionDate || null,
                    certificateId: certificate.certificateId || null,
                }
            })
        };

        const updatedEnrollment = await Enrolled.findOneAndUpdate(
            { email: email, course_link: course_link },
            updateData,
            { new: true }
        );

        return Response.json(updatedEnrollment);
    } catch (error) {
        console.error('Error updating enrollment:', error);
        return Response.json({ error: 'Failed to update enrollment' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectMongo();

        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({
                message: 'Enrollment ID (_id) is required'
            }, { status: 400 });
        }

        const updatedEnrollment = await Enrolled.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEnrollment) {
            return NextResponse.json({
                message: 'Enrollment not found for the provided ID'
            }, { status: 404 });
        }

        return NextResponse.json(updatedEnrollment, { status: 200 });
    } catch (error: any) {
        console.error('Database error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}