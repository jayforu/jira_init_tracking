import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useTeamActivity(project, from, to) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!project || !from || !to) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ project, from, to })
      const { data: resp } = await axios.get(`/api/team-activity?${params}`)
      setData(resp)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [project, from, to])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}

export function useTeamActivityPRs(project, from, to, enabled) {
  const [prs, setPRs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!project || !from || !to || !enabled) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ project, from, to })
      const { data: resp } = await axios.get(`/api/team-activity/prs?${params}`)
      setPRs(resp.prs_by_author)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [project, from, to, enabled])

  useEffect(() => { load() }, [load])

  return { prs, loading, error }
}

export function useTeamActivityCommits(project, from, to, enabled) {
  const [commits, setCommits] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!project || !from || !to || !enabled) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ project, from, to })
      const { data: resp } = await axios.get(`/api/team-activity/commits?${params}`)
      setCommits(resp.commits_by_author)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [project, from, to, enabled])

  useEffect(() => { load() }, [load])

  return { commits, loading, error }
}

export default useTeamActivity
