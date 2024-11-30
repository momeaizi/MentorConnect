import React from 'react';
// import Navbar from '@/components/NavBar';
import '@/app/globals.css'
import Navbar from '@/components/NavBar';

export const metadata = {
  title: 'viewers',
  description: 'Welcome to your Chat',
};

export default function ViewersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
      <Navbar />
        <div className="w-full flex flex-col justify-center items-center">
            {children}
        </div>
    </div>
  );
}