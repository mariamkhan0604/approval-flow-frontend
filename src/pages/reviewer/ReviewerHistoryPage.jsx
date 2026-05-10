import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'

const FILTER_OPTIONS = ['ALL', 'APPROVED', 'REJECTED']

const FILTER_COLORS = {
  ALL:      'bg-slate-100 text-slate-600',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

export default function ReviewerHistoryPage() {
  const { user } = useAuth()
  const { requests, fetchReviewerHistory, isLoading } = useRequests()
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    fetchReviewerHistory()
  }, [fetchReviewerHistory])
  console.log('ALL REQUESTS:', requests)

  // Only show requests that went through group review
  // (they have reviewerDecisions populated) and are finalised
  const historyRequests = requests.filter(r =>
    (r.status === 'APPROVED' || r.status === 'REJECTED') &&
    r.reviewerDecisions &&
    Object.keys(r.reviewerDecisions).length > 0
  )

  const filtered = activeFilter === 'ALL'
    ? historyRequests
    : historyRequests.filter(r => r.status === activeFilter)

  const counts = {
    ALL:      historyRequests.length,
    APPROVED: historyRequests.filter(r => r.status === 'APPROVED').length,
    REJECTED: historyRequests.filter(r => r.status === 'REJECTED').length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading history...
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Review History</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          All finalised requests that went through group approval
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-200 border
              ${activeFilter === filter
                ? `${FILTER_COLORS[filter]} border-current/20 shadow-sm`
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            {filter}
            <span className={`
              text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center
              ${activeFilter === filter ? 'bg-white/60' : 'bg-slate-100'}
            `}>
              {counts[filter]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={activeFilter === 'ALL' ? 'No history yet' : `No ${activeFilter.toLowerCase()} requests`}
            description={
              activeFilter === 'ALL'
                ? 'Finalised group-reviewed requests will appear here.'
                : `No requests have been ${activeFilter.toLowerCase()} through group review yet.`
            }
            icon={activeFilter === 'APPROVED' ? '✅' : activeFilter === 'REJECTED' ? '❌' : '📋'}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              showEmployee
              // No showReviewActions — history is read-only
            />
          ))}
        </div>
      )}
    </div>
  )
}