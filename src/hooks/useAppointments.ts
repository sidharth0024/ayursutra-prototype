 import { useState, useEffect } from 'react'
 import { getAppointments } from '@/lib/appointments'
 import { Appointment } from '@/lib/types'
 export function useAppointments() {
  const [appointments, setAppointments] = useState&lt;Appointment[]&gt;([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState&lt;string | null&gt;(null)
  const loadAppointments = async () =&gt; {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await getAppointments()
      if (error) throw error
      setAppointments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
   useEffect(() =&gt; {
 loadAppointments()
 }, [])
 return {
 appointments,
 loading,
 error,
 refreshAppointments: loadAppointments
 }
 }
