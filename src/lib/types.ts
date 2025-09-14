 export interface User {
 id: string
 email: string
 created_at: string
 }
 export interface Patient {
 id: string
 full_name: string
 email: string
 phone: string
 age: number
 gender: 'male' | 'female' | 'other'
 address: string
 medical_history?: string
 emergency_contact?: string
 created_at: string
 updated_at: string
 }
 export interface Therapy {
 id: string
 name: string
 duration_minutes: number
 description: string
 category: string
 precautions: string[]
 aftercare: string[]
 created_at: string
 }
 therapist_name?: string
 created_at: string
 updated_at: string
 patient?: Patient
 therapy?: Therapy
 }
 export interface Appointment {
 id: string
 patient_id: string
 therapy_id: string
 appointment_date: string
 status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
 notes?: string
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
