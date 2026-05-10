import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'

import { requestService } from '../services/requestService'
import { reviewerService } from '../services/reviewerService'

const RequestsContext = createContext(null)

// ── Maps backend shape → frontend shape ──────────────────────────────
const mapRequest = (r) => ({
  id: r.requestId,
  description: r.description,
  status: r.status,
  employeeId: r.employeeId,
  employeeName: r.employeeName,
  managerId: r.managerId,
  createdAt: r.createdAt,
  reviewerDecisions: r.reviewerDecisions || {},
})

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ────────────────────────────────────────────────────────────────────
  // Employee / Manager APIs
  // ────────────────────────────────────────────────────────────────────

  const fetchAllRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await requestService.getAllRequests()
      setRequests(data.map(mapRequest))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMyRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await requestService.getMyRequests()
      setRequests(data.map(mapRequest))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createRequest = useCallback(async ({ description }) => {
    setIsLoading(true)
    setError(null)

    try {
      const created = await requestService.createRequest({ description })

      const mapped = mapRequest(created)

      setRequests((prev) => [mapped, ...prev])

      return mapped
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveRequest = useCallback(async (requestId) => {
    setIsLoading(true)
    setError(null)

    try {
      const updated = await requestService.approveRequest(requestId)

      const mapped = mapRequest(updated)

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? mapped : r))
      )

      return mapped
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const rejectRequest = useCallback(async (requestId) => {
    setIsLoading(true)
    setError(null)

    try {
      const updated = await requestService.rejectRequest(requestId)

      const mapped = mapRequest(updated)

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? mapped : r))
      )

      return mapped
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ────────────────────────────────────────────────────────────────────
  // Reviewer APIs
  // ────────────────────────────────────────────────────────────────────

  // Requests reviewer has NOT reviewed yet
  const fetchPendingReviews = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await reviewerService.getPendingReviews()
      setRequests(data.map(mapRequest))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // All GROUP_APPROVAL_PENDING requests
  const fetchAllGroupPending = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await reviewerService.getAllGroupPending()
      setRequests(data.map(mapRequest))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reviewer history / all reviewer-visible requests
  const fetchReviewerHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await reviewerService.getAllRequests()
      setRequests(data.map(mapRequest))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reviewer submits approve/reject
  const submitReviewDecision = useCallback(
    async (requestId, decision) => {
      setIsLoading(true)
      setError(null)

      try {
        const updated = await reviewerService.submitDecision(
          requestId,
          decision
        )

        const mapped = mapRequest(updated)

        // Remove from queue after voting
        setRequests((prev) =>
          prev.filter((r) => r.id !== requestId)
        )

        return mapped
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // ────────────────────────────────────────────────────────────────────
  // Local Helpers
  // ────────────────────────────────────────────────────────────────────

  const getMyRequests = useCallback(() => {
    return [...requests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [requests])

  const getAllRequests = useCallback(() => {
    return [...requests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [requests])

  const getStats = useCallback(() => {
    return {
      total: requests.length,

      pending: requests.filter(
        (r) => r.status === 'PENDING'
      ).length,

      approved: requests.filter(
        (r) => r.status === 'APPROVED'
      ).length,

      rejected: requests.filter(
        (r) => r.status === 'REJECTED'
      ).length,

      groupPending: requests.filter(
        (r) => r.status === 'GROUP_APPROVAL_PENDING'
      ).length,
    }
  }, [requests])

  // ────────────────────────────────────────────────────────────────────
  // Context Value
  // ────────────────────────────────────────────────────────────────────

  const value = {
    requests,
    isLoading,
    error,

    // Employee / Manager
    fetchAllRequests,
    fetchMyRequests,
    createRequest,
    approveRequest,
    rejectRequest,

    // Reviewer
    fetchPendingReviews,
    fetchAllGroupPending,
    fetchReviewerHistory,
    submitReviewDecision,
    

    // Helpers
    getMyRequests,
    getAllRequests,
    getStats,
  }

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  )
}

export function useRequests() {
  const context = useContext(RequestsContext)

  if (!context) {
    throw new Error(
      'useRequests must be used within a RequestsProvider'
    )
  }

  return context
}