'use client';
import React from 'react';
import Navbar from '@/components/NavBar';
import { AuthProvider } from '@/context/AuthContext';
import '@/app/globals.css'
import ProtectedRoute from '@/components/ProtectedRoute';



export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
                    <Navbar />
                    <div className='p-0 h-full w-screen overflow-hidden'>
                        {children}
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
