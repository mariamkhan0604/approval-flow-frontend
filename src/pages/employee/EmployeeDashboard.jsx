import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import StatsCard from '../../components/ui/StatsCard'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'

export default function EmployeeDashboard() {
  const { user } = useAuth()

  const {
    getMyRequests,
    getStats,
    fetchMyRequests,
    isLoading,
  } = useRequests()

  const navigate = useNavigate()

  // Fetch employee requests from backend on load
  useEffect(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

  // No need to pass user.id anymore
  const myRequests = getMyRequests()
  const stats = getStats()

  const recentRequests = myRequests.slice(0, 3)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Requests"
          value={stats.total}
          icon="📋"
          variant="total"
          description="All time submissions"
        />

        <StatsCard
          label="Pending"
          value={stats.pending}
          icon="⏳"
          variant="pending"
          description="Awaiting decision"
        />

        <StatsCard
          label="Approved"
          value={stats.approved}
          icon="✓"
          variant="approved"
          description="Successfully approved"
        />

        <StatsCard
          label="Rejected"
          value={stats.rejected}
          icon="✕"
          variant="rejected"
          description="Not approved"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <button
          onClick={() => navigate('/employee/create-request')}
          className="card p-5 text-left hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center transition-colors">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                New Request
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Submit an approval request
              </p>
            </div>

            <svg
              className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>

          </div>
        </button>

        <button
          onClick={() => navigate('/employee/my-requests')}
          className="card p-5 text-left hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                View All Requests
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                {stats.total} total submissions
              </p>
            </div>

            <svg
              className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>

          </div>
        </button>

      </div>

      {/* Recent Requests */}
      <div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-slate-800">
            Recent Requests
          </h2>

          {myRequests.length > 3 && (
            <button
              onClick={() => navigate('/employee/my-requests')}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              View all →
            </button>
          )}
        </div>

        {recentRequests.length === 0 ? (
          <div className="card">
            <EmptyState
              title="No requests yet"
              description="You haven't submitted any approval requests. Create your first one!"
              icon="📝"
              action={{
                label: '+ Create Request',
                onClick: () => navigate('/employee/create-request'),
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}