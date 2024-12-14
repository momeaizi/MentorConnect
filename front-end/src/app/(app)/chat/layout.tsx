
import React from 'react';
import '@/app/globals.css'


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
    </>
  );
}
