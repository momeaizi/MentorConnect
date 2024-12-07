'use client';
import React from 'react';
import '@/app/globals.css'


export default function ProfileLayout({
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
