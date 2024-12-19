'use client'
import React from 'react';

interface ButtonProps {
  text: string;
  className?: string;
  onclick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, className, onclick, disabled = false }: ButtonProps) {
  const handleClick = () => {
    if (!disabled && onclick) {
      onclick();
    }
  };

  return (
    <div
      className={`button-components ${className || ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <p>{text}</p>
    </div>
  );
}