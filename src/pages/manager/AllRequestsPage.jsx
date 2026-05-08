import React, { useState, useEffect } from 'react'  // ← add useEffect
import { useRequests } from '../../context/RequestsContext'
import { useToast } from '../../context/ToastContext'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'

const FILTER_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function AllRequestsPage() {
  const { getAllRequests, fetchAllRequests, approveRequest, rejectRequest, isLoading } = useRequests()  // ← add fetchAllRequests
  const toast = useToast()

  const [activeFilter, setActiveFilter] = useState('ALL')
  const [processingId, setProcessingId] = useState(null)

  // ── Fetch from backend when page loads ──────────────────────────────
  useEffect(() => {
    fetchAllRequests()
  }, [fetchAllRequests])

  const allRequests = getAllRequests()

  const filtered = activeFilter === 'ALL'
    ? allRequests
    : allRequests.filter(r => r.status === activeFilter)

  const counts = {
    ALL: allRequests.length,
    PENDING: allRequests.filter(r => r.status === 'PENDING').length,
    APPROVED: allRequests.filter(r => r.status === 'APPROVED').length,
    REJECTED: allRequests.filter(r => r.status === 'REJECTED').length,
  }

  const FILTER_COLORS = {
    ALL: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
  }

  const handleApprove = async (requestId) => {
    setProcessingId(requestId)
    try {
      await approveRequest(requestId)
      toast.success(`Request ${requestId} approved successfully.`)
      fetchAllRequests()  // ← re-fetch after action to stay in sync
    } catch (err) {
      toast.error(err.message || 'Failed to approve request.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId) => {
    setProcessingId(requestId)
    try {
      await rejectRequest(requestId)
      toast.warning(`Request ${requestId} has been rejected.`)
      fetchAllRequests()  // ← re-fetch after action to stay in sync
    } catch (err) {
      toast.error(err.message || 'Failed to reject request.')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading requests...
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">All Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {allRequests.length} total · {counts.PENDING} pending review
          </p>
        </div>
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
              text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center
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
            title={
              activeFilter === 'ALL'
                ? 'No requests yet'
                : `No ${activeFilter.toLowerCase()} requests`
            }
            description={
              activeFilter === 'ALL'
                ? 'No employees have submitted requests yet.'
                : `There are no ${activeFilter.toLowerCase()} requests at this time.`
            }
            icon={
              activeFilter === 'ALL' ? '📋'
              : activeFilter === 'PENDING' ? '✅'
              : activeFilter === 'APPROVED' ? '🎉'
              : '📭'
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              showEmployee
              showActions
              onApprove={handleApprove}
              onReject={handleReject}
              isUpdating={processingId === request.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}