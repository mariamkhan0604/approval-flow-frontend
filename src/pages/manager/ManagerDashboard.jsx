
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequests } from '../../context/RequestsContext'
import StatsCard from '../../components/ui/StatsCard'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../context/ToastContext'

export default function ManagerDashboard() {
  const { getAllRequests, getStats, approveRequest, rejectRequest, isLoading } = useRequests()
  const toast = useToast()
  const navigate = useNavigate()

  const allRequests = getAllRequests()
  const stats = getStats()

  
  const pendingRequests = allRequests.filter(r => r.status === 'PENDING').slice(0, 3)

  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId)
      toast.success(`Request ${requestId} has been approved.`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId)
      toast.warning(`Request ${requestId} has been rejected.`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Requests"
          value={stats.total}
          icon="📋"
          variant="total"
          description="All employees"
        />
        <StatsCard
          label="Pending Review"
          value={stats.pending}
          icon="⏳"
          variant="pending"
          description="Needs your attention"
        />
        <StatsCard
          label="Approved"
          value={stats.approved}
          icon="✓"
          variant="approved"
          description="Decisions made"
        />
        <StatsCard
          label="Rejected"
          value={stats.rejected}
          icon="✕"
          variant="rejected"
          description="Not approved"
        />
      </div>

      {stats.pending > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🔔</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">
              {stats.pending} request{stats.pending > 1 ? 's' : ''} awaiting your review
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Review and take action to keep things moving.
            </p>
          </div>
          <button
            onClick={() => navigate('/manager/all-requests')}
            className="btn-primary bg-amber-500 hover:bg-amber-600 flex-shrink-0 text-xs px-4 py-2"
          >
            Review Now
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-slate-800">
            Pending Requests
            {stats.pending > 0 && (
              <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {stats.pending}
              </span>
            )}
          </h2>
          <button
            onClick={() => navigate('/manager/all-requests')}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            View all →
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="card">
            <EmptyState
              title="All caught up!"
              description="There are no pending requests to review. Great work!"
              icon="🎉"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                showEmployee
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
                isUpdating={isLoading}
              />
            ))}
          </div>
        )}
      </div>

     
      {stats.total > 0 && (
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Approval Rate</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${(stats.approved / stats.total) * 100}%` }}
              />
              <div
                className="h-full bg-rose-400 transition-all duration-700"
                style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
              />
              <div
                className="h-full bg-amber-300 transition-all duration-700"
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {Math.round((stats.approved / stats.total) * 100)}% approved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {Math.round((stats.rejected / stats.total) * 100)}% rejected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
