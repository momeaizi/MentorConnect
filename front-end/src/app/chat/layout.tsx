import React from 'react';
import Navbar from '@/components/NavBar';
import '@/app/globals.css'

export const metadata = {
  title: 'Chat',
  description: 'Welcome to your Chat',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='chat-page h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr]'>
        <Navbar />
        <main className="p-0 h-full w-screen">
            {children}
        </main>
    </div>
  );
}
