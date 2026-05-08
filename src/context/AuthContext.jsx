

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  USER: 'flowdesk_user',
  TOKEN: 'flowdesk_token',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true) 

  
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch {
        
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
      }
    }

    setIsLoading(false)
  }, [])

  /**
   * Login action
   * @param {string} username
   * @param {string} password
   */
  const login = useCallback(async (username, password) => {
    const { user: loggedInUser, token: authToken } = await authService.login(username, password)

    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser))
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)

    setUser(loggedInUser)
    setToken(authToken)

    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isEmployee: user?.role === 'EMPLOYEE',
    isManager: user?.role === 'MANAGER',
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
