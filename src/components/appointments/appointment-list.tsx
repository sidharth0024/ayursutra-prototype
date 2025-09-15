'use client'

import { useState } from 'react'
import { Appointment } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime } from '@/lib/utils'
import { updateAppointment, deleteAppointment } from '@/lib/appointments'
import {
  Calendar,
  Clock,
  User,
  Phone,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  MoreVertical,
} from 'lucide-react'

interface AppointmentListProps {
  appointments: Appointment[]
  loading: boolean
  onEdit: (appointmentId: string) => void
  onRefresh: () => void
}

export default function AppointmentList({
  appointments,
  loading,
  onEdit,
  onRefresh,
}: AppointmentListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleStatusUpdate = async (
    appointmentId: string,
    status: 'completed' | 'cancelled' | 'no-show'
  ) => {
    setActionLoading(appointmentId)
    try {
      const { error } = await updateAppointment(appointmentId, { status })
      if (error) {
        alert('Error updating appointment: ' + error.message)
      } else {
        onRefresh()
      }
    } catch (error) {
      alert('Error updating appointment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return
    }
    setActionLoading(appointmentId)
    try {
      const { error } = await deleteAppointment(appointmentId)
      if (error) {
        alert('Error deleting appointment: ' + error.message)
      } else {
        onRefresh()
      }
    } catch (error) {
      alert('Error deleting appointment')
    } finally {
      setActionLoading(null)
    }
  }

  const isUpcoming = (appointmentDate: string) => {
    return new Date(appointmentDate) > new Date()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Calendar className="mx-auto h-12 w-12 mb-4" />
        <p>No appointments scheduled</p>
        <p className="text-sm">Get started by booking your first appointment.</p>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter((apt) =>
    isUpcoming(apt.appointment_date)
  )
  const pastAppointments = appointments.filter(
    (apt) => !isUpcoming(apt.appointment_date)
  )

  return (
    <div>
      {upcomingAppointments.length > 0 && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Upcoming Appointments</h2>
          <div className="space-y-4 mb-6">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={onEdit}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                actionLoading={actionLoading}
                isUpcoming={true}
              />
            ))}
          </div>
        </>
      )}
      {pastAppointments.length > 0 && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Past Appointments</h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={onEdit}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                actionLoading={actionLoading}
                isUpcoming={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface AppointmentCardProps {
  appointment: Appointment
  onEdit: (id: string) => void
  onStatusUpdate: (
    id: string,
    status: 'completed' | 'cancelled' | 'no-show'
  ) => void
  onDelete: (id: string) => void
  actionLoading: string | null
  isUpcoming: boolean
}

function AppointmentCard({
  appointment,
  onEdit,
  onStatusUpdate,
  onDelete,
  actionLoading,
  isUpcoming,
}: AppointmentCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusBadge = (status: string) => {
    const baseClasses =
      'inline-flex px-2 py-1 rounded-full text-xs font-medium'
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-700`
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700`
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-700`
      case 'no-show':
        return `${baseClasses} bg-orange-100 text-orange-700`
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />
      case 'no-show':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div>{getStatusIcon(appointment.status)}</div>
        <div>
          <div className="font-semibold">{appointment.patient?.full_name}</div>
          <div className={getStatusBadge(appointment.status)}>
            {appointment.status}
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{appointment.therapy?.name}</span>
            {appointment.therapy?.duration_minutes && (
              <span>({appointment.therapy.duration_minutes} min)</span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(appointment.appointment_date)}</span>
            <Clock className="h-4 w-4" />
            <span>{formatTime(appointment.appointment_date)}</span>
          </div>
          {appointment.patient?.phone && (
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{appointment.patient.phone}</span>
            </div>
          )}
          {appointment.therapist_name && (
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Therapist: {appointment.therapist_name}</span>
            </div>
          )}
          {appointment.notes && (
            <div className="mt-2 text-sm text-gray-700">{appointment.notes}</div>
          )}
        </div>
      </div>

      <div className="relative flex items-center space-x-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="More actions"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-lg z-10">
            <button
              onClick={() => {
                onEdit(appointment.id)
                setShowMenu(false)
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <Edit className="h-4 w-4 mr-3" /> Edit Appointment
            </button>

            {isUpcoming && appointment.status === 'scheduled' && (
              <>
                <button
                  onClick={() => {
                    onStatusUpdate(appointment.id, 'completed')
                    setShowMenu(false)
                  }}
                  disabled={actionLoading === appointment.id}
                  className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-100 w-full disabled:opacity-50"
                >
                  <Check className="h-4 w-4 mr-3" /> Mark Completed
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(appointment.id, 'no-show')
                    setShowMenu(false)
                  }}
                  disabled={actionLoading === appointment.id}
                  className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-100 w-full disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4 mr-3" /> Mark No Show
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(appointment.id, 'cancelled')
                    setShowMenu(false)
                  }}
                  disabled={actionLoading === appointment.id}
                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-3" /> Cancel Appointment
                </button>
              </>
            )}
            <button
              onClick={() => {
                onDelete(appointment.id)
                setShowMenu(false)
              }}
              disabled={actionLoading === appointment.id}
              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-3" /> Delete Appointment
            </button>
          </div>
        )}

        {/* Quick action buttons for upcoming scheduled appointments */}
        {isUpcoming && appointment.status === 'scheduled' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(appointment.id)}
              disabled={actionLoading === appointment.id}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(appointment.id, 'completed')}
              disabled={actionLoading === appointment.id}
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-2" /> Complete
            </Button>
          </div>
        )}

        {/* Loading overlay on actions */}
        {actionLoading === appointment.id && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded">
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
