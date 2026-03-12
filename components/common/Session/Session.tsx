import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

const Session = () => {
    return (
        <div className='w-full h-screen flex flex-col gap-4 items-center justify-center'>
            <div className='text-3xl font-semibold'>
                Session Already Exists.
            </div>
            <Link href='/account'>
                <Button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Account Page
                </Button>
            </Link>
        </div>
    )
}

export default Session