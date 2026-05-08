
import { useState, useCallback } from 'react'

export function useAsync() {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: null,
  })

  const execute = useCallback(async (asyncFn) => {
    setState({ isLoading: true, error: null, data: null })
    try {
      const result = await asyncFn()
      setState({ isLoading: false, error: null, data: result })
      return result
    } catch (err) {
      setState({ isLoading: false, error: err.message, data: null })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null })
  }, [])

  return { ...state, execute, reset }
}
