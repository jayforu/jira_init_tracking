import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function useExecutivePIDashboard(piId, includeDone = false) {
  const [pi, setPi] = useState(null)
  const [initiatives, setInitiatives] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!piId) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`/api/executive/pi/${piId}?includeDone=${includeDone}`)
      setPi(data.pi)
      setInitiatives(data.initiatives)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [piId, includeDone])

  useEffect(() => { load() }, [load])

  return { pi, initiatives, loading, error, reload: load }
}
