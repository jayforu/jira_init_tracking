import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePIs() {
  const [pis, setPIs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get('/api/pis')
      setPIs(data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const createPI = async (name, start_date, end_date) => {
    const { data } = await axios.post('/api/pis', { name, start_date, end_date })
    setPIs(p => [data, ...p])
    return data
  }

  const updatePI = async (id, updates) => {
    const { data } = await axios.patch(`/api/pis/${id}`, updates)
    setPIs(p => p.map(pi => pi.id === id ? data : pi))
    return data
  }

  const deletePI = async (id) => {
    await axios.delete(`/api/pis/${id}`)
    setPIs(p => p.filter(pi => pi.id !== id))
  }

  return { pis, loading, error, createPI, updatePI, deletePI, reload: load }
}
