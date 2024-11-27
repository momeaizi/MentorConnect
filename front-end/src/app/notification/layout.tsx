import React from 'react';
import Navbar from '@/components/NavBar';
import '@/app/globals.css'

export const metadata = {
  title: 'Notification',
  description: 'Welcome to your Notification',
};

export default function NotificationLayout({
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
