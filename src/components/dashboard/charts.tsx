'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { AppointmentTrend, TherapyStats } from '@/lib/analytics'

interface ChartsProps {
  trends: AppointmentTrend[]
  therapyStats: TherapyStats[]
  loading: boolean
}

export default function Charts({ trends, therapyStats, loading }: ChartsProps) {
  const COLORS = ['#16a34a', '#059669', '#065f46', '#064e3b', '#052e16']

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading charts...
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Appointment Trends Chart */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Appointment Trends (Last 30 Days)</h3>
        {trends.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  name="Total Appointments"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
                  name="Cancelled"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500">No trend data available yet</p>
        )}
      </section>

      {/* Therapy Distribution Chart */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Therapy Distribution</h3>
        {therapyStats.length > 0 ? (
          <>
            {/* Pie Chart */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={therapyStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, therapy_name, count }) =>
                      `${therapy_name}: ${count}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {therapyStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} appointments`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ width: '100%', height: 300, marginTop: 40 }}>
              <ResponsiveContainer>
                <BarChart data={therapyStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="therapy_name"
                    stroke="#6b7280"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} appointments`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#16a34a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No therapy data available yet</p>
        )}
      </section>

      {/* Revenue Chart */}
      {therapyStats.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-semibold">Revenue by Therapy</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={therapyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="therapy_name"
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  )
}
