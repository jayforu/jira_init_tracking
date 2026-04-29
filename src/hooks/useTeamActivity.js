import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

function buildParams({ boardId, sprintId, from, to, quickFilterIds }) {
  if (!boardId) return null
  const p = new URLSearchParams({ boardId })
  if (sprintId) {
    p.set('sprintId', sprintId)
  } else if (from && to) {
    p.set('from', from)
    p.set('to', to)
  }
  if (quickFilterIds && quickFilterIds.length) {
    p.set('quickFilterIds', quickFilterIds.join(','))
  }
  return p
}

// Stable string key for quickFilterIds so callers can pass a fresh array each
// render without re-firing the effect.
function qfKey(quickFilterIds) {
  return Array.isArray(quickFilterIds) ? quickFilterIds.slice().sort().join(',') : ''
}

export function useTeamActivity({ boardId, sprintId, from, to, quickFilterIds }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const qfk = qfKey(quickFilterIds)

  const load = useCallback(async () => {
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    if (!params) return
    setLoading(true)
    setError(null)
    try {
      const { data: resp } = await axios.get(`/api/team-activity?${params}`)
      setData(resp)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, sprintId, from, to, qfk])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}

export function useTeamActivityPRs({ boardId, sprintId, from, to, quickFilterIds, enabled }) {
  const [prs, setPRs] = useState(null)
  const [loading, setLoading] = useState(false)
  const qfk = qfKey(quickFilterIds)

  const load = useCallback(async () => {
    if (!enabled) return
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    if (!params) return
    setLoading(true)
    try {
      const { data: resp } = await axios.get(`/api/team-activity/prs?${params}`)
      setPRs(resp.prs_by_author)
    } catch {
      setPRs(null)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, sprintId, from, to, qfk, enabled])

  useEffect(() => { load() }, [load])

  return { prs, loading }
}

export function useTeamActivityCommits({ boardId, sprintId, from, to, quickFilterIds, enabled }) {
  const [commits, setCommits] = useState(null)
  const [loading, setLoading] = useState(false)
  const qfk = qfKey(quickFilterIds)

  const load = useCallback(async () => {
    if (!enabled) return
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    if (!params) return
    setLoading(true)
    try {
      const { data: resp } = await axios.get(`/api/team-activity/commits?${params}`)
      setCommits(resp.commits_by_author)
    } catch {
      setCommits(null)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, sprintId, from, to, qfk, enabled])

  useEffect(() => { load() }, [load])

  return { commits, loading }
}

export function useTeamActivityTrends({ boardId, from, to, quickFilterIds, enabled }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const qfk = qfKey(quickFilterIds)

  const load = useCallback(async () => {
    if (!enabled || !boardId || !from || !to) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ boardId, from, to })
      if (quickFilterIds && quickFilterIds.length) params.set('quickFilterIds', quickFilterIds.join(','))
      const { data: resp } = await axios.get(`/api/team-activity/trends?${params}`)
      setData(resp)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, from, to, qfk, enabled])

  useEffect(() => { load() }, [load])

  return { data, loading, error }
}

export function useBoardQuickFilters(boardId) {
  const [quickFilters, setQuickFilters] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!boardId) { setQuickFilters([]); return }
    let cancelled = false
    setLoading(true)
    axios.get(`/api/team-activity/quick-filters?boardId=${boardId}`)
      .then(({ data }) => { if (!cancelled) setQuickFilters(data.quick_filters || []) })
      .catch(() => { if (!cancelled) setQuickFilters([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [boardId])

  return { quickFilters, loading }
}

export default useTeamActivity
