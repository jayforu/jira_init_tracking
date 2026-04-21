import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePIBoard(piId) {
  const [board, setBoard] = useState(null)   // { pi, initiatives[], standalone_epics[] }
  const [available, setAvailable] = useState([])
  const [availableEpics, setAvailableEpics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!piId) return
    setLoading(true)
    setError(null)
    try {
      const [boardRes, availRes, availEpicsRes] = await Promise.all([
        axios.get(`/api/pis/${piId}/board`),
        axios.get(`/api/pis/${piId}/available`),
        axios.get(`/api/pis/${piId}/available-epics`)
      ])
      setBoard(boardRes.data)
      setAvailable(availRes.data)
      setAvailableEpics(availEpicsRes.data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [piId])

  useEffect(() => { load() }, [load])

  const assign = async (initiative_key, project_key) => {
    await axios.post(`/api/pis/${piId}/initiatives`, { initiative_key, project_key })
    await load()
  }

  const unassign = async (initiative_key) => {
    await axios.delete(`/api/pis/${piId}/initiatives/${initiative_key}`)
    await load()
  }

  const toggleSpillover = async (initiative_key, spilled_over) => {
    await axios.patch(`/api/pis/${piId}/initiatives/${initiative_key}`, { spilled_over })
    setBoard(b => ({
      ...b,
      initiatives: b.initiatives.map(i =>
        i.initiative_key === initiative_key ? { ...i, spilled_over } : i
      )
    }))
  }

  const assignEpic = async (epic_key) => {
    await axios.post(`/api/pis/${piId}/epics`, { epic_key })
    await load()
  }

  const unassignEpic = async (epic_key) => {
    await axios.delete(`/api/pis/${piId}/epics/${epic_key}`)
    await load()
  }

  const toggleEpicSpillover = async (epic_key, spilled_over) => {
    await axios.patch(`/api/pis/${piId}/epics/${epic_key}`, { spilled_over })
    setBoard(b => ({
      ...b,
      standalone_epics: (b.standalone_epics || []).map(e =>
        e.epic_key === epic_key ? { ...e, spilled_over } : e
      )
    }))
  }

  return {
    board, available, availableEpics, loading, error,
    assign, unassign, toggleSpillover,
    assignEpic, unassignEpic, toggleEpicSpillover,
    reload: load
  }
}
