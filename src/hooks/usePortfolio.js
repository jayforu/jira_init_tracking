import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePortfolio(piId, project, includeDone) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!piId) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ pi: piId, includeDone: String(includeDone) })
      if (project && project !== 'ALL') params.set('project', project)
      const { data: resp } = await axios.get(`/api/portfolio?${params}`)
      setData(resp)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [piId, project, includeDone])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}
