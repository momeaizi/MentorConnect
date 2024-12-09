'use client'
import React from 'react';
import Navbar from '@/components/NavBar';
import '@/app/globals.css'

// export const metadata = {
//   title: 'Profile',
//   description: 'Welcome to your profile',
// };

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
      <Navbar />
      <div className='p-0 h-full w-screen overflow-hidden'>
        {children}
      </div>
    </div>
  );
}
