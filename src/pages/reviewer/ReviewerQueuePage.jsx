import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import { useToast } from '../../context/ToastContext'
import RequestCard from '../../components/ui/RequestCard'
import EmptyState from '../../components/ui/EmptyState'

const FILTER_OPTIONS = ['NEEDS MY VOTE', 'ALL OPEN']

export default function ReviewerQueuePage() {
  const { user } = useAuth()
  const {
    requests,
    fetchPendingReviews,
    fetchAllGroupPending,
    submitReviewDecision,
    isLoading,
  } = useRequests()
  const toast = useToast()

  const [activeFilter, setActiveFilter] = useState('NEEDS MY VOTE')
  const [processingId, setProcessingId] = useState(null)

  // On mount, load requests this reviewer hasn't voted on
  useEffect(() => {
    fetchPendingReviews()
  }, [fetchPendingReviews])

  // Switch between "needs my vote" and "all open"
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    if (filter === 'ALL OPEN') {
      fetchAllGroupPending()
    } else {
      fetchPendingReviews()
    }
  }

  const groupPendingRequests = requests.filter(r => r.status === 'GROUP_APPROVAL_PENDING')

  const myUsername = user?.username

  // For "NEEDS MY VOTE": requests where currentReviewer hasn't voted yet
  const needsMyVote = groupPendingRequests.filter(
    r => !r.reviewerDecisions || !r.reviewerDecisions.hasOwnProperty(myUsername)
  )

  const displayed = activeFilter === 'NEEDS MY VOTE' ? needsMyVote : groupPendingRequests

  const handleApprove = async (requestId) => {
    setProcessingId(requestId)
    try {
      const result = await submitReviewDecision(requestId, 'APPROVED')
      if (result.status === 'APPROVED') {
        toast.success('Request approved! The workflow is now complete.')
      } else {
        toast.success('Your approval has been recorded.')
      }
      // Refresh whichever tab is active
      if (activeFilter === 'ALL OPEN') {
        fetchAllGroupPending()
      } else {
        fetchPendingReviews()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit decision.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId) => {
    setProcessingId(requestId)
    try {
      const result = await submitReviewDecision(requestId, 'REJECTED')
      if (result.status === 'REJECTED') {
        toast.warning('All reviewers rejected — request is now REJECTED.')
      } else {
        toast.info('Your rejection recorded. Waiting for other reviewers.')
      }
      if (activeFilter === 'ALL OPEN') {
        fetchAllGroupPending()
      } else {
        fetchPendingReviews()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit decision.')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading && !processingId) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading review queue...
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Review Queue</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {needsMyVote.length} request{needsMyVote.length !== 1 ? 's' : ''} need{needsMyVote.length === 1 ? 's' : ''} your vote
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {FILTER_OPTIONS.map(filter => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-200 border
              ${activeFilter === filter
                ? filter === 'NEEDS MY VOTE'
                  ? 'bg-teal-100 text-teal-700 border-teal-200 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            {filter}
            <span className={`
              text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center
              ${activeFilter === filter ? 'bg-white/60' : 'bg-slate-100'}
            `}>
              {filter === 'NEEDS MY VOTE' ? needsMyVote.length : groupPendingRequests.length}
            </span>
          </button>
        ))}
      </div>

      {/* Request list */}
      {displayed.length === 0 ? (
        <div className="card">
          <EmptyState
            title={
              activeFilter === 'NEEDS MY VOTE'
                ? "You're all caught up!"
                : 'No open group reviews'
            }
            description={
              activeFilter === 'NEEDS MY VOTE'
                ? "You've voted on all currently open requests. Check back later."
                : 'No requests are currently in the group approval stage.'
            }
            icon={activeFilter === 'NEEDS MY VOTE' ? '🎉' : '📋'}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              showEmployee
              showReviewActions
              currentReviewer={myUsername}
              onReviewApprove={handleApprove}
              onReviewReject={handleReject}
              isUpdating={processingId === request.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}