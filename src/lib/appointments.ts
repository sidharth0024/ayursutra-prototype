import { supabase } from './supabase'
 import { Appointment } from './types'
 export const createAppointment = async (appointment: Omit&lt;Appointment, 'id' | 'created
 const { data, error } = await supabase
 .from('appointments')
 .insert([appointment])
 .select(`
 *,
 patient:patients(*),
 therapy:therapies(*)
 `)
 .single()
 return { data, error }
 }
 export const getAppointments = async () =&gt; {
 const { data, error } = await supabase
 .from('appointments')
 .select(`
 *,
 patient:patients(*),
 therapy:therapies(*)
 `)
 .order('appointment_date', { ascending: true })
 return { data, error }
}
 export const updateAppointment = async (id: string, updates: Partial&lt;Appointment&gt;) 
  const { data, error } = await supabase
    .from('appointments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      patient:patients(*),
      therapy:therapies(*)
    `)
    .single()
  
  return { data, error }
 }
 export const deleteAppointment = async (id: string) =&gt; {
  const { data, error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
  
  return { data, error }
 }
 export const getAppointmentsByDate = async (date: string) =&gt; {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*),
      therapy:therapies(*)
    `)
    .gte('appointment_date', startOfDay.toISOString())
    .lte('appointment_date', endOfDay.toISOString())
    .order('appointment_date', { ascending: true })
  
  return { data, error }
 }
 export const generateTimeSlots = (date: Date) =&gt; {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 18 // 6 PM
  const interval = 30 // 30 minutes
  for (let hour = startHour; hour &lt; endHour; hour++) {
    for (let minute = 0; minute &lt; 60; minute += interval) {
      const slotTime = new Date(date)
 slotTime.setHours(hour, minute, 0, 0)
      
      slots.push({
        time: slotTime,
        label: slotTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
      })
    }
  }
  
  return slots
 }
 export const isSlotAvailable = async (date: Date, durationMinutes: number = 60) =&gt; {
  const endTime = new Date(date.getTime() + durationMinutes * 60000)
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .neq('status', 'cancelled')
    .gte('appointment_date', date.toISOString())
    .lt('appointment_date', endTime.toISOString())
  
  return { available: !data || data.length === 0, conflictingAppointments: data || [] }
 }
