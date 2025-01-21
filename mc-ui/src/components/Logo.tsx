import React from 'react';
import { FireFilled } from '@ant-design/icons';

export const Logo: React.FC = () => (
  <div className="flex justify-center items-center mb-4">
    <FireFilled style={{ color: "#eb2f96" }} className="logo-navbar-fire-icon mr-2" />
    <h1 className="text-4xl font-bold text-white">
      <span className="italic text-3xl font-extrabold font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
        Matcha
      </span>
    </h1>
  </div>
);

