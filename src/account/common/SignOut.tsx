import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SignOut = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center bg-[#1a1a1a] p-8 shadow-md max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
                <p className="text-gray-200 mb-4">You need to be signed in to view your admin account.</p>
                <Link href='/auth/login'>
                    <Button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Sign In
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default SignOut