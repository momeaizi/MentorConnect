import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div
      className="h-screen bg-cover bg-center grid grid-cols-1 grid-rows-[72px_1fr] gap-0"
      style={{ backgroundImage: "url('/dark_background.jpg')" }}
    >
      <div className="flex flex-row justify-between	items-center	px-8">
        <Image
          src="/matcha_logo.png"
          width={500}
          height={500}
          alt="logo"
        />
        <p>Log in</p>
      </div>
      <div className="flex flex-col justify-center	items-center">
        <h1 className="text-5xl font-bold mb-4">
        No boss here, change it
        </h1>
        <h3 className="text-xl text-gray-300">
        He who has no skill should return to his mother's teaching
        </h3>
        <p>Create account</p>
      </div>
    </div>
  );
}