import { useState, useEffect, useCallback, useRef } from 'react'
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
  const reqIdRef = useRef(0)

  const load = useCallback(async () => {
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    const myReqId = ++reqIdRef.current
    setData(null)
    setError(null)
    if (!params) { setLoading(false); return }
    setLoading(true)
    try {
      const { data: resp } = await axios.get(`/api/team-activity?${params}`)
      if (reqIdRef.current === myReqId) setData(resp)
    } catch (e) {
      if (reqIdRef.current === myReqId) setError(e.response?.data?.error || e.message)
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false)
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
  const reqIdRef = useRef(0)

  const load = useCallback(async () => {
    const myReqId = ++reqIdRef.current
    setPRs(null)
    if (!enabled) { setLoading(false); return }
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    if (!params) { setLoading(false); return }
    setLoading(true)
    try {
      const { data: resp } = await axios.get(`/api/team-activity/prs?${params}`)
      if (reqIdRef.current === myReqId) setPRs(resp.prs_by_author)
    } catch {
      if (reqIdRef.current === myReqId) setPRs(null)
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false)
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
  const reqIdRef = useRef(0)

  const load = useCallback(async () => {
    const myReqId = ++reqIdRef.current
    setCommits(null)
    if (!enabled) { setLoading(false); return }
    const params = buildParams({ boardId, sprintId, from, to, quickFilterIds })
    if (!params) { setLoading(false); return }
    setLoading(true)
    try {
      const { data: resp } = await axios.get(`/api/team-activity/commits?${params}`)
      if (reqIdRef.current === myReqId) setCommits(resp.commits_by_author)
    } catch {
      if (reqIdRef.current === myReqId) setCommits(null)
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false)
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
  const reqIdRef = useRef(0)

  const load = useCallback(async () => {
    const myReqId = ++reqIdRef.current
    setData(null)
    setError(null)
    if (!enabled || !boardId || !from || !to) { setLoading(false); return }
    setLoading(true)
    try {
      const params = new URLSearchParams({ boardId, from, to })
      if (quickFilterIds && quickFilterIds.length) params.set('quickFilterIds', quickFilterIds.join(','))
      const { data: resp } = await axios.get(`/api/team-activity/trends?${params}`)
      if (reqIdRef.current === myReqId) setData(resp)
    } catch (e) {
      if (reqIdRef.current === myReqId) setError(e.response?.data?.error || e.message)
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false)
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
