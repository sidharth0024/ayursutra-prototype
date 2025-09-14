import { useState, useEffect } from 'react'
import { getDashboardStats, getAppointmentTrends, getTherapyStats, getRecentActivity } fr
import type { DashboardStats, AppointmentTrend, TherapyStats } from '@/lib/analytics'
export function useDashboard() {
const [stats, setStats] = useState&lt;DashboardStats&gt;({
totalPatients: 0,
totalAppointments: 0,
todayAppointments: 0,
completedAppointments: 0,
cancelledAppointments: 0,
upcomingAppointments: 0
})
const [trends, setTrends] = useState&lt;AppointmentTrend[]&gt;([])
const [therapyStats, setTherapyStats] = useState&lt;TherapyStats[]&gt;([])
const [recentActivity, setRecentActivity] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState&lt;string | null&gt;(null)
const loadDashboardData = async () =&gt; {
setLoading(true)
setError(null)
try {
const [statsData, trendsData, therapyData, activityData] = await Promise.all([
getDashboardStats(),
getAppointmentTrends(30),
getTherapyStats(),
getRecentActivity(10)
])
setStats(statsData)
setTrends(trendsData)
setTherapyStats(therapyData)
setRecentActivity(activityData.data)
} catch (err: any) {
setError(err.message)
} finally {
setLoading(false)
}
}
useEffect(() =&gt; {
loadDashboardData()
}, [])
return {
stats,
trends,
therapyStats,
recentActivity,
loading,
error,
refreshDashboard: loadDashboardData
}
}
