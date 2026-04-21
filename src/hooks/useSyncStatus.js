import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

export default function useSyncStatus(projectKey) {
  const [state, setState] = useState(null)
  const pollRef = useRef(null)

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/sync/status')
      setState(data[projectKey] || null)
      return data[projectKey]
    } catch { return null }
  }, [projectKey])

  const triggerSync = useCallback(async () => {
    try {
      await axios.post(`/api/sync/${projectKey}`)
      setState(s => ({ ...s, status: 'syncing' }))
      // Poll until done
      pollRef.current = setInterval(async () => {
        const s = await fetchStatus()
        if (s?.status !== 'syncing') clearInterval(pollRef.current)
      }, 2000)
    } catch (e) {
      console.error('Sync trigger failed:', e.message)
    }
  }, [projectKey, fetchStatus])

  useEffect(() => {
    fetchStatus()
    return () => clearInterval(pollRef.current)
  }, [fetchStatus])

  return { syncState: state, triggerSync, refreshStatus: fetchStatus }
}
