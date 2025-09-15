import { useState, useEffect } from 'react'
import {
  getDashboardStats,
  getAppointmentTrends,
  getTherapyStats,
  getRecentActivity,
} from '@/lib/analytics'
import type {
  DashboardStats,
  AppointmentTrend,
  TherapyStats,
} from '@/lib/analytics'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
  })

  const [trends, setTrends] = useState<AppointmentTrend[]>([])
  const [therapyStats, setTherapyStats] = useState<TherapyStats[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, trendsData, therapyData, activityData] = await Promise.all([
        getDashboardStats(),
        getAppointmentTrends(30),
        getTherapyStats(),
        getRecentActivity(10),
      ])
      setStats(statsData)
      setTrends(trendsData)
      setTherapyStats(therapyData)
      setRecentActivity(activityData.data || [])
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return {
    stats,
    trends,
    therapyStats,
    recentActivity,
    loading,
    error,
    refreshDashboard: loadDashboardData,
  }
}
