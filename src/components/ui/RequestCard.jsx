import React from 'react'
import StatusBadge from './StatusBadge'
import Avatar from './Avatar'
import {
  formatDate,
  formatRelativeTime,
  truncate,
} from '../../utils/helpers'

export default function RequestCard({
  request,
  showEmployee = false,
  showActions = false,
  showReviewActions = false,
  currentReviewer = null,
  onApprove,
  onReject,
  onReviewApprove,
  onReviewReject,
  isUpdating = false,
}) {
  const {
    id,
    description,
    status,
    createdAt,
    employeeName,
    managerId,
    reviewerDecisions = {},
  } = request

  const alreadyVoted =
    currentReviewer &&
    reviewerDecisions.hasOwnProperty(currentReviewer)

  const myVote = alreadyVoted
    ? reviewerDecisions[currentReviewer]
    : null

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">

      {/* Header */}
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
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {employeeName}
              </p>
            )}

          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {truncate(description, 150)}
      </p>

      {/* Decision panel */}
      {['GROUP_APPROVAL_PENDING', 'APPROVED', 'REJECTED'].includes(status) && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">

          {/* Manager decision */}
{managerId && (
  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">

    <span className="text-xs font-semibold text-slate-500">
      Manager
    </span>

    {status === 'REJECTED' &&
    Object.keys(reviewerDecisions).length === 0 ? (

      // Manager directly rejected
      <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        {managerId} 
      </span>

    ) : (

      // Manager approved / forwarded to reviewers
      <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>

        {managerId} 
      </span>

    )}

  </div>
)}

          {/* Reviewer votes */}
          {reviewerDecisions && Object.keys(reviewerDecisions).length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {status === 'GROUP_APPROVAL_PENDING'
                  ? 'Votes so far'
                  : 'Group review outcome'}
              </p>

              <div className="flex flex-wrap gap-2">
                {Object.entries(reviewerDecisions).map(
                  ([reviewer, vote]) => (
                    <span
                      key={reviewer}
                      className={`
                        flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg
                        ${vote === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }
                      `}
                    >
                      {vote === 'APPROVED' ? (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      {reviewer}
                    </span>
                  )
                )}
              </div>
            </>
          )}

        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span title={formatDate(createdAt)}>
            {formatRelativeTime(createdAt)}
          </span>
        </div>

        {/* Manager Actions */}
        {showActions && status === 'PENDING' && (
          <div className="flex items-center gap-2">

            <button
              onClick={() => onReject(id)}
              disabled={isUpdating}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                '...'
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
              {isUpdating ? (
                '...'
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Approve
                </>
              )}
            </button>

          </div>
        )}

        {/* Already Processed */}
        {showActions && status !== 'PENDING' && (
          <p className="text-xs text-slate-400 italic">
            Already processed
          </p>
        )}

        {/* Reviewer Actions */}
        {showReviewActions &&
          status === 'GROUP_APPROVAL_PENDING' && (
            alreadyVoted ? (
              <div
                className={`
                  flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                  ${myVote === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }
                `}
              >
                {myVote === 'APPROVED' ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                You voted{' '}
                {myVote === 'APPROVED' ? 'Approved' : 'Rejected'}
              </div>
            ) : (
              <div className="flex items-center gap-2">

                <button
                  onClick={() => onReviewReject(id)}
                  disabled={isUpdating}
                  className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    '...'
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject
                    </>
                  )}
                </button>

                <button
                  onClick={() => onReviewApprove(id)}
                  disabled={isUpdating}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    '...'
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Approve
                    </>
                  )}
                </button>

              </div>
            )
          )}

      </div>
    </div>
  )
}