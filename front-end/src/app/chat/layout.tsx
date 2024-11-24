import React from 'react';
import Navbar from '@/components/NavBar';

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
    <div>
        <Navbar />
        <main className="p-4 bg-gray-100 min-h-screen">
            {children}
        </main>
    </div>
  );
}
