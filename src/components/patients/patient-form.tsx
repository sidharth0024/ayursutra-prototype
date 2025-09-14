'use client'
import { useState, useEffect } from 'react'
import { createPatient, updatePatient, getPatientById } from '@/lib/database'
import { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
interface PatientFormProps {
patientId?: string
onSuccess?: () =&gt; void
onCancel?: () =&gt; void
}
export default function PatientForm({ patientId, onSuccess, onCancel }: PatientFormProps)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [formData, setFormData] = useState({
full_name: '',
email: '',
phone: '',
age: '',
gender: '',
src/components/patients/patient-form.tsx
address: '',
medical_history: '',
emergency_contact: ''
})
useEffect(() =&gt; {
if (patientId) {
loadPatient()
}
}, [patientId])
const loadPatient = async () =&gt; {
if (!patientId) return
setLoading(true)
const { data, error } = await getPatientById(patientId)
if (error) {
setError(error.message)
} else if (data) {
setFormData({
full_name: data.full_name || '',
email: data.email || '',
phone: data.phone || '',
age: data.age?.toString() || '',
gender: data.gender || '',
address: data.address || '',
medical_history: data.medical_history || '',
emergency_contact: data.emergency_contact || ''
})
}
setLoading(false)
}
const handleChange = (e: React.ChangeEvent&lt;HTMLInputElement | HTMLTextAreaElement |
const { name, value } = e.target
setFormData(prev =&gt; ({
...prev,
[name]: value
}))
}
const handleSubmit = async (e: React.FormEvent) =&gt; {
e.preventDefault()
setLoading(true)
setError('')
if (!formData.full_name || !formData.phone) {
setError('Name and phone are required')
setLoading(false)
return
}
const patientData = {
...formData,
age: formData.age ? parseInt(formData.age) : undefined
}
try {
let result
if (patientId) {
result = await updatePatient(patientId, patientData)
} else {
result = await createPatient(patientData)
}
if (result.error) {
setError(result.error.message)
} else {
onSuccess?.()
}
} catch (err: any) {
setError(err.message)
} finally {
setLoading(false)
}
}
if (loading &amp;&amp; patientId) {
return (
<div>
<div>Loading patient data...</div>
</div>
)
}
return (
&lt;form onSubmit={handleSubmit} className="space-y-6"&gt;
<div>
{/* Full Name */}
<div>
&lt;label htmlFor="full_name" className="block text-sm font-medium text-gray-70
Full Name *
&lt;/label&gt;
&lt;input
type="text"
id="full_name"
name="full_name"
required
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.full_name}
onChange={handleChange}
/&gt;
</div>
{/* Email */}
<div>
&lt;label htmlFor="email" className="block text-sm font-medium text-gray-700"&g
Email
&lt;/label&gt;
&lt;input
type="email"
id="email"
name="email"
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.email}
onChange={handleChange}
/&gt;
</div>
{/* Phone */}
<div>
&lt;label htmlFor="phone" className="block text-sm font-medium text-gray-700"&g
Phone Number *
&lt;/label&gt;
&lt;input
type="tel"
id="phone"
name="phone"
required
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.phone}
onChange={handleChange}
/&gt;
</div>
{/* Age */}
<div>
&lt;label htmlFor="age" className="block text-sm font-medium text-gray-700"&gt;
Age
&lt;/label&gt;
&lt;input
type="number"
id="age"
name="age"
min="1"
max="120"
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.age}
onChange={handleChange}
/&gt;
</div>
{/* Gender */}
<div>
&lt;label htmlFor="gender" className="block text-sm font-medium text-gray-700"&
Gender
&lt;/label&gt;
&lt;select
id="gender"
name="gender"
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.gender}
onChange={handleChange}
&gt;
&lt;option value=""&gt;Select Gender&lt;/option&gt;
&lt;option value="male"&gt;Male&lt;/option&gt;
&lt;option value="female"&gt;Female&lt;/option&gt;
  &lt;option value="other"&gt;Other&lt;/option&gt;
&lt;/select&gt;
</div>
{/* Emergency Contact */}
<div>
&lt;label htmlFor="emergency_contact" className="block text-sm font-medium text
Emergency Contact
&lt;/label&gt;
&lt;input
type="tel"
id="emergency_contact"
name="emergency_contact"
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shad
value={formData.emergency_contact}
onChange={handleChange}
/&gt;
</div>
</div>
{/* Address */}
<div>
&lt;label htmlFor="address" className="block text-sm font-medium text-gray-700"&g
Address
&lt;/label&gt;
&lt;textarea
id="address"
name="address"
rows={3}
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow
value={formData.address}
onChange={handleChange}
/&gt;
</div>
{/* Medical History */}
<div>
&lt;label htmlFor="medical_history" className="block text-sm font-medium text-gra
Medical History
&lt;/label&gt;
&lt;textarea
id="medical_history"
name="medical_history"
rows={4}
placeholder="Previous surgeries, chronic conditions, medications, allergies..."
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow
value={formData.medical_history}
onChange={handleChange}
/&gt;
</div>
{error &amp;&amp; (
<div>
{error}
</div>
)}
{/* Buttons */}
<div>
&lt;Button
type="button"
variant="secondary"
onClick={onCancel}
&gt;
Cancel
&lt;/Button&gt;
&lt;Button
type="submit"
disabled={loading}
&gt;
{loading ? 'Saving...' : (patientId ? 'Update Patient' : 'Add Patient')}
&lt;/Button&gt;
</div>
&lt;/form&gt;
)
}
