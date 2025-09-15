'use client'
import { useState, useEffect } from 'react'
import { createPatient, updatePatient, getPatientById } from '@/lib/database'
import { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface PatientFormProps {
  patientId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PatientForm({ patientId, onSuccess, onCancel }: PatientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    medical_history: '',
    emergency_contact: ''
  })

  useEffect(() => {
    if (patientId) {
      loadPatient()
    }
  }, [patientId])

  const loadPatient = async () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (loading && patientId) {
    return (
      <div>
        <div>Loading patient data...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.full_name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          min={1}
          max={120}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Emergency Contact */}
      <div>
        <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
          Emergency Contact
        </label>
        <input
          type="tel"
          id="emergency_contact"
          name="emergency_contact"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.emergency_contact}
          onChange={handleChange}
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Medical History */}
      <div>
        <label htmlFor="medical_history" className="block text-sm font-medium text-gray-700">
          Medical History
        </label>
        <textarea
          id="medical_history"
          name="medical_history"
          rows={4}
          placeholder="Previous surgeries, chronic conditions, medications, allergies..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.medical_history}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (patientId ? 'Update Patient' : 'Add Patient')}
        </Button>
      </div>
    </form>
  )
}
