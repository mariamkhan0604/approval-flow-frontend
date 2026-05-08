
import React from 'react'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No items to display.',
  icon = '📋',
  action = null, 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
   
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-5"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
