import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRequests } from '../../context/RequestsContext'
import { useToast } from '../../context/ToastContext'
import { REQUEST_CATEGORIES } from '../../data/mockData'
import Spinner from '../../components/ui/Spinner'

const MIN_DESC_LENGTH = 10
const MAX_DESC_LENGTH = 1000

export default function CreateRequestPage() {
  const { user } = useAuth()
  const { createRequest } = useRequests()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    description: '',
    category: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const charCount = form.description.length
  const isDescValid = charCount >= MIN_DESC_LENGTH && charCount <= MAX_DESC_LENGTH

  const validate = () => {
    const newErrors = {}
    if (!form.description || form.description.trim().length < MIN_DESC_LENGTH) {
      newErrors.description = `Description must be at least ${MIN_DESC_LENGTH} characters.`
    }
    if (form.description.trim().length > MAX_DESC_LENGTH) {
      newErrors.description = `Description cannot exceed ${MAX_DESC_LENGTH} characters.`
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const newRequest = await createRequest({
        description: form.description,
        category: form.category || 'Other',
        user,
      })
      toast.success(`Request ${newRequest.id} submitted successfully!`)
      navigate('/employee/my-requests')
    } catch (err) {
      toast.error(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ description: '', category: '' })
    setErrors({})
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">Submit a Request</h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill out the form below. Your request will be reviewed by a manager.
        </p>
      </div>

      
      <div className="card p-6 space-y-5">
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user?.name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">


          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="description">
               Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Enter Description "
              className={`
                input-base resize-none leading-relaxed
                ${errors.description ? 'border-rose-400 focus:ring-rose-500/30' : ''}
              `}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.description ? (
                <p className="text-xs text-rose-500">{errors.description}</p>
              ) : (
                <p className="text-xs text-slate-400">
                  Minimum {MIN_DESC_LENGTH} characters required
                </p>
              )}
              <span className={`text-xs font-mono transition-colors ${
                charCount < MIN_DESC_LENGTH
                  ? 'text-slate-400'
                  : charCount > MAX_DESC_LENGTH
                    ? 'text-rose-500'
                    : 'text-emerald-600'
              }`}>
                {charCount}/{MAX_DESC_LENGTH}
              </span>
            </div>
          </div>

         
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !isDescValid}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Request
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
