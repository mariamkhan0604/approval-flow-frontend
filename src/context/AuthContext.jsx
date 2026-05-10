import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const STORAGE_KEY = 'flowdesk_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore user from localStorage on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    // authService calls apiClient.login which:
    //   1. POSTs to /auth/login to validate credentials
    //   2. Stores Basic Auth header in sessionStorage for all future requests
    const { user: loggedInUser } = await authService.login(username, password)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    setUser(loggedInUser)

    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()          // clears sessionStorage
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isEmployee: user?.role === 'EMPLOYEE',
    isManager:  user?.role === 'MANAGER',
    isReviewer: user?.role === 'REVIEWER',
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}