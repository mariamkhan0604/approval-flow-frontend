
import React from 'react'
import StatusBadge from './StatusBadge'
import Avatar from './Avatar'
import { formatDate, formatRelativeTime, truncate } from '../../utils/helpers'

export default function RequestCard({
  request,
  showEmployee = false,   
  showActions = false,   
  onApprove,
  onReject,
  isUpdating = false,
}) {
  const {
    id,
    description,
    status,
    createdAt,
    employeeName,
    department,
    category,
  } = request

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
     
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {showEmployee && (
            <Avatar name={employeeName} size="md" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                {id}
              </span>
            </div>
            {showEmployee && (
              <p className="text-sm font-semibold text-slate-800 mt-1">{employeeName}</p>
            )}

          </div>
        </div>

        <StatusBadge status={status} />
      </div>

    
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {truncate(description, 150)}
      </p>

      
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span title={formatDate(createdAt)}>{formatRelativeTime(createdAt)}</span>
          <span className="mx-1">·</span>
         
        </div>

  
        {showActions && status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(id)}
              disabled={isUpdating}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? '...' : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </>
              )}
            </button>
            <button
              onClick={() => onApprove(id)}
              disabled={isUpdating}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? '...' : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </>
              )}
            </button>
          </div>
        )}

       
        {showActions && status !== 'PENDING' && (
          <p className="text-xs text-slate-400 italic">Already processed</p>
        )}
      </div>
    </div>
  )
}
