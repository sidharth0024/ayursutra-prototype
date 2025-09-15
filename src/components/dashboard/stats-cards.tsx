'use client'

import { DashboardStats } from '@/lib/analytics'
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Cancelled',
      value: stats.cancelledAppointments,
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 rounded shadow ${card.bgColor}`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className={`text-xl font-semibold ${card.textColor}`}>{card.value}</p>
          </div>
          <div
            className={`${card.color} p-3 rounded-full text-white flex items-center justify-center`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  )
}
