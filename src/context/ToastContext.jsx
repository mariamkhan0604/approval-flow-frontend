

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])

    
    timersRef.current[id] = setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }, [removeToast])

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}



const TOAST_STYLES = {
  success: {
    container: 'bg-white border-l-4 border-emerald-500',
    icon: '✓',
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'Success',
  },
  error: {
    container: 'bg-white border-l-4 border-rose-500',
    icon: '✕',
    iconBg: 'bg-rose-100 text-rose-600',
    title: 'Error',
  },
  info: {
    container: 'bg-white border-l-4 border-brand-500',
    icon: 'i',
    iconBg: 'bg-brand-100 text-brand-600',
    title: 'Info',
  },
  warning: {
    container: 'bg-white border-l-4 border-amber-500',
    icon: '!',
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Warning',
  },
}

function Toast({ toast, onRemove }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl shadow-toast min-w-[300px] max-w-sm
        animate-slide-in-right ${style.container}
      `}
    >
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${style.iconBg}`}>
        {style.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{style.title}</p>
        <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
