import { Loader2 } from 'lucide-react';
import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <Loader2
      className={`animate-spin text-blue-600 ${sizeStyles[size]} ${className}`}
      aria-label="Loading"
    />
  );
};

// Fullscreen loading overlay
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <Spinner size="xl" />
      {message && (
        <p className="mt-4 text-lg text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
};

// Inline loading state
export const LoadingInline: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <Spinner size="md" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};