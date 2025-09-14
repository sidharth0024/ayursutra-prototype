import { useState, useEffect } from 'react'
import { getPatients, searchPatients } from '@/lib/database'
import { Patient } from '@/lib/types'
export function usePatients() {
const [patients, setPatients] = useState&lt;Patient[]&gt;([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState&lt;string | null&gt;(null)
const loadPatients = async () =&gt; {
setLoading(true)
setError(null)
try {
const { data, error } = await getPatients()
if (error) throw error
setPatients(data || [])
} catch (err: any) {
setError(err.message)
} finally {
setLoading(false)
}
}
const searchPatientsData = async (query: string) =&gt; {
if (!query.trim()) {
return loadPatients()
}
setLoading(true)
try {
const { data, error } = await searchPatients(query)
src/hooks/usePatients.ts
if (error) throw error
setPatients(data || [])
} catch (err: any) {
setError(err.message)
} finally {
setLoading(false)
}
}
useEffect(() =&gt; {
loadPatients()
}, [])
return {
patients,
loading,
error,
refreshPatients: loadPatients,
searchPatients: searchPatientsData
}
}
