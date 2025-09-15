import { supabase } from './supabase'
import { Patient } from './types'

// Create a new patient (exclude id and timestamps as they are managed by supabase)
export const createPatient = async (
  patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single()
  return { data, error }
}

// Fetch all patients ordered by creation date descending
export const getPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// Fetch single patient by id
export const getPatientById = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

// Update patient data with partial updates and update timestamp
export const updatePatient = async (
  id: string,
  updates: Partial<Patient>
) => {
  const { data, error } = await supabase
    .from('patients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Delete patient by id
export const deletePatient = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
  return { data, error }
}

// Search patients by full name, email, or phone (partial, case-insensitive)
export const searchPatients = async (query: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Therapy-related operations

// Fetch all therapies ordered by name
export const getTherapies = async () => {
  const { data, error } = await supabase
    .from('therapies')
    .select('*')
    .order('name')
  return { data, error }
}

// Create a new therapy entry
export const createTherapy = async (therapy: any) => {
  const { data, error } = await supabase
    .from('therapies')
    .insert([therapy])
    .select()
    .single()
  return { data, error }
}
