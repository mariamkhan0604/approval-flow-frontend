import React, { createContext, useContext, useState, useCallback } from 'react'
import { requestService } from '../services/requestService'

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
})

export function RequestsProvider({ children }) {

  const [requests, setRequests] = useState([])   // start empty, load from API
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)


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


  const createRequest = useCallback(async ({ description, category, user }) => {
    setIsLoading(true)
    setError(null)
    try {
      const created = await requestService.createRequest({ description, category, user })
      const mapped = mapRequest(created)
      setRequests(prev => [mapped, ...prev])
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
      setRequests(prev => prev.map(r => r.id === requestId ? mapped : r))
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
      setRequests(prev => prev.map(r => r.id === requestId ? mapped : r))
      return mapped
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])


  // These now just read from local state (already fetched + mapped)
  const getMyRequests = useCallback(() => {
    return [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [requests])

  const getAllRequests = useCallback(() => {
    return [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [requests])

  const getStats = useCallback(() => {
    return {
      total:    requests.length,
      pending:  requests.filter(r => r.status === 'PENDING').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
    }
  }, [requests])

  const value = {
    requests,
    isLoading,
    error,
    fetchAllRequests,   // ← call this in manager pages on mount
    fetchMyRequests,    // ← call this in employee pages on mount
    createRequest,
    approveRequest,
    rejectRequest,
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
    throw new Error('useRequests must be used within a RequestsProvider')
  }
  return context
}