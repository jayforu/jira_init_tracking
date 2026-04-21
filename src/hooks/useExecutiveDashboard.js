import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function useExecutiveDashboard(projectKey, includeDone = false) {
  const [initiatives, setInitiatives] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!projectKey) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(
        `/api/executive?project=${projectKey}&includeDone=${includeDone}`
      )
      setInitiatives(data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [projectKey, includeDone])

  useEffect(() => { load() }, [load])

  return { initiatives, loading, error, reload: load }
}
