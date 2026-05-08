
import React from 'react'

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-[3px]',
    xl: 'w-14 h-14 border-4',
  }

  return (
    <div
      className={`
        rounded-full border-slate-200 border-t-brand-600
        animate-spin ${sizes[size] || sizes.md} ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}


export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Spinner size="xl" />
      <p className="text-sm text-slate-500 font-medium animate-pulse-soft">{message}</p>
    </div>
  )
}


export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  )
}
