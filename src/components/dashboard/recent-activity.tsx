'use client'

import { formatDate, formatTime } from '@/lib/utils'
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
} from 'lucide-react'

interface RecentActivityProps {
  activities: any[]
  loading: boolean
}

export default function RecentActivity({ activities, loading }: RecentActivityProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'no-show':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'was scheduled'
      case 'completed':
        return 'was completed'
      case 'cancelled':
        return 'was cancelled'
      case 'no-show':
        return 'was marked as no-show'
      default:
        return 'was updated'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-4 text-gray-700 font-semibold">
        <Activity className="h-5 w-5 mr-2" />
        Recent Activity
      </div>

      {activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div>{getStatusIcon(activity.status)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">
                    {activity.patient?.full_name || 'Unknown Patient'}
                  </span>{' '}
                  appointment for{' '}
                  <span className="font-semibold">
                    {activity.therapy?.name || 'Unknown Therapy'}
                  </span>{' '}
                  {getStatusText(activity.status)}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(activity.appointment_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTime(activity.appointment_date)}</span>
                  </div>
                  {activity.therapist_name && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{activity.therapist_name}</span>
                    </div>
                  )}
                </div>
                {activity.notes && (
                  <p className="text-xs text-gray-600 mt-1 italic">{activity.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(activity.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          <Activity className="mx-auto h-12 w-12 mb-4" />
          <p>No recent activity</p>
          <p>Recent appointments and updates will appear here</p>
        </div>
      )}
    </div>
  )
}
