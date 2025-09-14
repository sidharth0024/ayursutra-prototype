import { supabase } from './supabase'
import { Patient } from './types'
export const createPatient = async (patient: Omit&lt;Patient, 'id' | 'created_at' | 'upda
const { data, error } = await supabase
.from('patients')
.insert([patient])
.select()
.single()
return { data, error }
}
export const getPatients = async () =&gt; {
const { data, error } = await supabase
.from('patients')
.select('*')
.order('created_at', { ascending: false })
return { data, error }
}
export const getPatientById = async (id: string) =&gt; {
const { data, error } = await supabase
.from('patients')
.select('*')
.eq('id', id)
.single()
return { data, error }
}
export const updatePatient = async (id: string, updates: Partial&lt;Patient&gt;) =&gt; {
const { data, error } = await supabase
.from('patients')
.update({ ...updates, updated_at: new Date().toISOString() })
.eq('id', id)
.select()
.single()
return { data, error }
}
export const deletePatient = async (id: string) =&gt; {
const { data, error } = await supabase
.from('patients')
.delete()
.eq('id', id)
return { data, error }
}
Member 2: Patient Management System
src/lib/database.ts
export const searchPatients = async (query: string) =&gt; {
const { data, error } = await supabase
.from('patients')
.select('*')
.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
.order('created_at', { ascending: false })
return { data, error }
}
// Therapy Operations
export const getTherapies = async () =&gt; {
const { data, error } = await supabase
.from('therapies')
.select('*')
.order('name')
return { data, error }
}
export const createTherapy = async (therapy: any) =&gt; {
const { data, error } = await supabase
.from('therapies')
.insert([therapy])
.select()
.single()
return { data, error }
}
