
import React from 'react'

const VARIANT_STYLES = {
  default: {
    bg: 'bg-white',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    valueColor: 'text-slate-900',
  },
  pending: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    valueColor: 'text-amber-700',
  },
  approved: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    valueColor: 'text-emerald-700',
  },
  rejected: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    valueColor: 'text-rose-700',
  },
  total: {
    bg: 'bg-brand-50',
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    valueColor: 'text-brand-700',
  },
}

export default function StatsCard({ label, value, icon, variant = 'default', description }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default

  return (
    <div className={`
      card p-5 flex items-start gap-4
      hover:shadow-card-hover transition-shadow duration-300
      animate-slide-up ${styles.bg} border-0
    `}>
     
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
        <span className={`text-xl ${styles.iconColor}`}>{icon}</span>
      </div>

      
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-3xl font-display font-bold leading-none ${styles.valueColor}`}>
          {value}
        </p>
        {description && (
          <p className="text-xs text-slate-400 mt-1.5">{description}</p>
        )}
      </div>
    </div>
  )
}
