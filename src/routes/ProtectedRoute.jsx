import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui/Spinner'

/**
 * @param {string} requiredRole - 'EMPLOYEE' | 'MANAGER' | null (any authenticated user)
 */
export default function ProtectedRoute({ requiredRole = null }) {
  const { isAuthenticated, user, isLoading } = useAuth()

  
  if (isLoading) {
    return <PageLoader message="Restoring your session..." />
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  
  if (requiredRole && user?.role !== requiredRole) {
    const redirectTo = user?.role === 'MANAGER'
      ? '/manager/dashboard'
      : '/employee/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
