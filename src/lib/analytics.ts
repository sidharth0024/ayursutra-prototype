import { supabase } from './supabase'
export interface DashboardStats {
totalPatients: number
totalAppointments: number
todayAppointments: number
completedAppointments: number
cancelledAppointments: number
upcomingAppointments: number
}
export interface AppointmentTrend {
date: string
appointments: number
completed: number
cancelled: number
}
export interface TherapyStats {
therapy_name: string
count: number
revenue: number
}
export const getDashboardStats = async (): Promise&lt;DashboardStats&gt; =&gt; {
// Get total patients
const { count: totalPatients } = await supabase
.from('patients')
.select('*', { count: 'exact', head: true })
// Get total appointments
const { count: totalAppointments } = await supabase
.from('appointments')
.select('*', { count: 'exact', head: true })
// Get today's appointments
const today = new Date()
today.setHours(0, 0, 0, 0)
Member 4 Dashboard & Analytics
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const { count: todayAppointments } = await supabase
.from('appointments')
.select('*', { count: 'exact', head: true })
.gte('appointment_date', today.toISOString())
.lt('appointment_date', tomorrow.toISOString())
// Get completed appointments
const { count: completedAppointments } = await supabase
.from('appointments')
.select('*', { count: 'exact', head: true })
.eq('status', 'completed')
// Get cancelled appointments
const { count: cancelledAppointments } = await supabase
.from('appointments')
.select('*', { count: 'exact', head: true })
.eq('status', 'cancelled')
// Get upcoming appointments
const now = new Date()
const { count: upcomingAppointments } = await supabase
.from('appointments')
.select('*', { count: 'exact', head: true })
.eq('status', 'scheduled')
.gte('appointment_date', now.toISOString())
return {
totalPatients: totalPatients || 0,
totalAppointments: totalAppointments || 0,
todayAppointments: todayAppointments || 0,
completedAppointments: completedAppointments || 0,
cancelledAppointments: cancelledAppointments || 0,
upcomingAppointments: upcomingAppointments || 0
}
}
export const getAppointmentTrends = async (days: number = 30): Promise&lt;AppointmentTren
const endDate = new Date()
const startDate = new Date()
startDate.setDate(startDate.getDate() - days)
const { data, error } = await supabase
.from('appointments')
.select('appointment_date, status')
.gte('appointment_date', startDate.toISOString())
.lte('appointment_date', endDate.toISOString())
.order('appointment_date')
if (error || !data) return []
// Group by date
const dateGroups: { [key: string]: { total: number; completed: number; cancelled: numbe
data.forEach(appointment =&gt; {
const date = new Date(appointment.appointment_date).toDateString()
if (!dateGroups[date]) {
dateGroups[date] = { total: 0, completed: 0, cancelled: 0 }
}
dateGroups[date].total++
if (appointment.status === 'completed') dateGroups[date].completed++
if (appointment.status === 'cancelled') dateGroups[date].cancelled++
})
return Object.entries(dateGroups).map(([date, stats]) =&gt; ({
date: new Date(date).toLocaleDateString(),
appointments: stats.total,
completed: stats.completed,
cancelled: stats.cancelled
}))
}
export const getTherapyStats = async (): Promise&lt;TherapyStats[]&gt; =&gt; {
const { data, error } = await supabase
.from('appointments')
.select(`
therapy:therapies(name),
status
`)
.neq('status', 'cancelled')
if (error || !data) return []
const therapyGroups: { [key: string]: number } = {}
data.forEach(appointment =&gt; {
const therapyName = appointment.therapy?.name || 'Unknown'
therapyGroups[therapyName] = (therapyGroups[therapyName] || 0) + 1
})
return Object.entries(therapyGroups).map(([therapy_name, count]) =&gt; ({
therapy_name,
count,
revenue: count * 2000 // Assume ₹2000 per therapy
}))
}
export const getRecentActivity = async (limit: number = 10) =&gt; {
const { data, error } = await supabase
.from('appointments')
.select(`
*,
patient:patients(full_name),
therapy:therapies(name)
`)
.order('created_at', { ascending: false })
.limit(limit)
return { data: data || [], error }
}
