import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'


export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      <Sidebar />

      
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        
        

        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
