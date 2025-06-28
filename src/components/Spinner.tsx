/**
 * Component: Spinner
 * Purpose: Reusable loading spinner component with dark theme
 * Integration:
 *   - Used across the app for loading states
 *   - Accessible with proper ARIA labels
 * Styling: Tailwind CSS with smooth animations and dark theme colors
 * Accessibility: Proper role and aria-label attributes
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function Spinner({ size = 'md', className = '', label = 'Loading...' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-blue-400`}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}