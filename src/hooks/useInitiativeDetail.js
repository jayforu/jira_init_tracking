import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

function epicHealth(epic) {
  const { status, subtasks, tests } = epic
  const devDone = status === 'Done'
  const devStarted = !['Ready for Execution', 'Ready for Dev'].includes(status)
  const passRate = tests.total > 0 ? tests.pass / tests.total : 0
  const noTests = tests.total === 0

  if (status === 'Blocked') return 'Blocked'
  if (!devStarted) return 'N/A'
  if (devDone && noTests) return 'At Risk'
  if (devDone && passRate >= 0.9) return 'Good'
  if (tests.fail > 0) return 'At Risk'
  return 'At Risk'
}

export default function useInitiativeDetail(initiativeKey) {
  const [epics, setEpics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!initiativeKey) return
    setLoading(true)
    setError(null)
    try {
      const { data: rawEpics } = await axios.get(`/api/jira/epics?parent=${initiativeKey}`)

      const enriched = await Promise.all(rawEpics.map(async (epic) => {
        const [{ data: subtasks }, { data: tests }] = await Promise.all([
          axios.get(`/api/jira/subtasks?parent=${epic.key}`),
          axios.get(`/api/jira/tests?epicKey=${epic.key}`)
        ])
        const enrichedEpic = { ...epic, subtasks, tests }
        return { ...enrichedEpic, health: epicHealth(enrichedEpic) }
      }))

      setEpics(enriched)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [initiativeKey])

  useEffect(() => { load() }, [load])

  return { epics, loading, error, reload: load }
}
