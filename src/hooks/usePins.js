import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePins(projectKey) {
  const [pins, setPins] = useState([])

  const load = useCallback(async () => {
    if (!projectKey) return
    const { data } = await axios.get(`/api/pins?project=${projectKey}`)
    setPins(data)
  }, [projectKey])

  useEffect(() => { load() }, [load])

  const pin = async (initiativeKey) => {
    await axios.post('/api/pins', { projectKey, initiativeKey })
    setPins(p => [...p, initiativeKey])
  }

  const unpin = async (initiativeKey) => {
    await axios.delete(`/api/pins/${projectKey}/${initiativeKey}`)
    setPins(p => p.filter(k => k !== initiativeKey))
  }

  const isPinned = (key) => pins.includes(key)

  return { pins, pin, unpin, isPinned }
}
