import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/projects')
      setProjects(data)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addProject = async (key, name) => {
    const { data } = await axios.post('/api/projects', { key, name })
    setProjects(p => [...p, data])
  }

  const removeProject = async (key) => {
    await axios.delete(`/api/projects/${key}`)
    setProjects(p => p.filter(pr => pr.key !== key))
  }

  return { projects, loading, error, addProject, removeProject, reload: load }
}
