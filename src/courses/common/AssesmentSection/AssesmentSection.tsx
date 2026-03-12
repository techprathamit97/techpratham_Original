import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const AssesmentSection = ({ course }: any) => {
    return (
        <div className='w-full h-auto flex flex-col items-center justify-center gap-6 bg-blue-500 text-white'>
            <div className='md:w-10/12 w-11/12 h-auto grid md:grid-cols-2 grid-cols-1 py-8 gap-6'>
                <div className='w-full h-auto flex flex-col justify-center'>
                    <div className='text-3xl font-semibold'>Self Assessment</div>
                    <div className='text-lg mb-4'>Learn, Grow & Test your skill with Online Assessment Exam to achieve your Certification Goals</div>
                    <Link href={course.assesment_link}>
                        <Button variant='outline'>Take Free Practices Test <ChevronRightIcon /> </Button>
                    </Link>
                </div>
                <div className='w-full h-auto'>
                    <Image src='/course/assessment.jpg' alt='' width={400} height={300} className='h-full w-auto' />
                </div>
            </div>
        </div>
    )
}

export default AssesmentSection