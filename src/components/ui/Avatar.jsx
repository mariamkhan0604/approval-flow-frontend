
import React from 'react'
import { getInitials } from '../../utils/helpers'


const COLORS = [
  'bg-brand-500 text-white',
  'bg-violet-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
]

function getColor(name = '') {
  const index = name.charCodeAt(0) % COLORS.length
  return COLORS[index]
}

export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = getInitials(name)
  const colorClass = getColor(name)

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-semibold flex-shrink-0
        ${colorClass} ${sizes[size] || sizes.md} ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  )
}
