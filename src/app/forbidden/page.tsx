'use client'

import Link from 'next/link';
import React from 'react';
import {useRouter} from 'next/navigation';
import {Button, Card} from '@heroui/react';

export default function Page() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
            <Card className="p-8 rounded shadow-md text-center">
                <h1 className="text-center text-4xl font-bold text-red-500 mb-4">Forbidden</h1>
                <p className="text-lg text-gray-700 mb-8">You do not have permission to view this page.</p>
                <Button
                    as={Link}
                    href={'/'}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Go to Home
                </Button>
            </Card>
        </div>
    );
};