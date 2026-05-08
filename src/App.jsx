

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { RequestsProvider } from './context/RequestsContext'
import { ToastProvider } from './context/ToastContext'

import ProtectedRoute from './routes/ProtectedRoute'

import DashboardLayout from './layouts/DashboardLayout'

import LoginPage from './pages/auth/LoginPage'



import CreateRequestPage from './pages/employee/CreateRequestPage'
import MyRequestsPage from './pages/employee/MyRequestsPage'


import AllRequestsPage from './pages/manager/AllRequestsPage'

export default function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <ToastProvider>

          <Routes>

            
            <Route path="/login" element={<LoginPage />} />

            
            <Route path="/" element={<Navigate to="/login" replace />} />

            
            <Route element={<ProtectedRoute requiredRole="EMPLOYEE" />}>

              
              <Route element={<DashboardLayout />}>

                <Route
                  path="/employee/create-request"
                  element={<CreateRequestPage />}
                />

                <Route
                  path="/employee/my-requests"
                  element={<MyRequestsPage />}
                />

              </Route>
            </Route>

            
            <Route element={<ProtectedRoute requiredRole="MANAGER" />}>

              
              <Route element={<DashboardLayout />}>

                <Route
                  path="/manager/all-requests"
                  element={<AllRequestsPage />}
                />

              </Route>
            </Route>

       

          </Routes>

        </ToastProvider>
      </RequestsProvider>
    </AuthProvider>
  )
}