import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePIAssignments() {
  const [assignments, setAssignments] = useState([])

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/pis/assignments')
      setAssignments(data)
    } catch {
      // non-critical
    }
  }, [])

  useEffect(() => { load() }, [load])

  // { [initiative_key]: pi_name }
  const piByInitiative = {}
  // { [initiative_key]: pi_id }
  const piIdByInitiative = {}
  assignments.forEach(a => {
    piByInitiative[a.initiative_key] = a.pi_name
    piIdByInitiative[a.initiative_key] = a.pi_id
  })

  // Assign to a PI (moves from current PI if already in one)
  const assignToPI = async (initiative_key, project_key, pi_id) => {
    const currentPiId = piIdByInitiative[initiative_key]
    if (currentPiId) {
      await axios.delete(`/api/pis/${currentPiId}/initiatives/${initiative_key}`)
    }
    if (pi_id) {
      await axios.post(`/api/pis/${pi_id}/initiatives`, { initiative_key, project_key })
    }
    await load()
  }

  return { piByInitiative, piIdByInitiative, assignToPI }
}
