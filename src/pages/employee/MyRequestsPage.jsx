import React, { useState, useEffect } from 'react'  // ← add useEffect
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'

const FILTER_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function MyRequestsPage() {
  const { user } = useAuth()
  const { getMyRequests, fetchMyRequests, isLoading } = useRequests()  // ← add fetchMyRequests, isLoading
  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState('ALL')

  // ── Fetch from backend when page loads ──────────────────────────────
  useEffect(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

  const allMyRequests = getMyRequests()  // ← remove user.id, context handles scoping now

  const filtered = activeFilter === 'ALL'
    ? allMyRequests
    : allMyRequests.filter(r => r.status === activeFilter)

  const counts = {
    ALL: allMyRequests.length,
    PENDING: allMyRequests.filter(r => r.status === 'PENDING').length,
    APPROVED: allMyRequests.filter(r => r.status === 'APPROVED').length,
    REJECTED: allMyRequests.filter(r => r.status === 'REJECTED').length,
  }

  const FILTER_COLORS = {
    ALL: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
  }

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading your requests...
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">My Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">{allMyRequests.length} total submissions</p>
        </div>
        <button
          onClick={() => navigate('/employee/create-request')}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>
      </div>

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
              text-xs rounded-full px-1.5 py-0.5
              ${activeFilter === filter ? 'bg-white/60' : 'bg-slate-100'}
            `}>
              {counts[filter]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={activeFilter === 'ALL' ? 'No requests yet' : `No ${activeFilter.toLowerCase()} requests`}
            description={
              activeFilter === 'ALL'
                ? "You haven't submitted any requests. Start by creating your first one."
                : `You have no ${activeFilter.toLowerCase()} requests at this time.`
            }
            icon={activeFilter === 'ALL' ? '📋' : activeFilter === 'PENDING' ? '⏳' : activeFilter === 'APPROVED' ? '✓' : '✕'}
            action={
              activeFilter === 'ALL'
                ? { label: '+ Create Request', onClick: () => navigate('/employee/create-request') }
                : null
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}