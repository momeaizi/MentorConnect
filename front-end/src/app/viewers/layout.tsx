import React from 'react';
// import Navbar from '@/components/NavBar';
import '@/app/globals.css'

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
    <div className="">
        <div className="">
            {children}
        </div>
    </div>
  );
}