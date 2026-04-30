import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useBoards(project) {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setBoards([])
    setError(null)
    if (!project) return
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/agile/boards?project=${project}`)
      setBoards(data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [project])

  useEffect(() => { load() }, [load])

  return { boards, loading, error }
}

export function useSprints(boardId) {
  const [sprints, setSprints] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setSprints([])
    if (!boardId) return
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/agile/sprints?board=${boardId}`)
      // Sort: active first, then closed by start_date desc
      const sorted = data.sort((a, b) => {
        if (a.state === 'active' && b.state !== 'active') return -1
        if (b.state === 'active' && a.state !== 'active') return 1
        return new Date(b.start_date || 0) - new Date(a.start_date || 0)
      })
      setSprints(sorted)
    } catch {
      setSprints([])
    } finally {
      setLoading(false)
    }
  }, [boardId])

  useEffect(() => { load() }, [load])

  return { sprints, loading }
}
