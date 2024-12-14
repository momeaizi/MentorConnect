
import React from 'react';
import Navbar from '@/components/NavBar';
import '@/app/globals.css'



export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    );
}
