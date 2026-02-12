"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewScan() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-indigo-600">Redirecting to Dashboard...</div>
        </div>
    );
}
