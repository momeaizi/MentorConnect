'use client';
import React from 'react';
import '@/app/globals.css'


export default function ViewersLayout({
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