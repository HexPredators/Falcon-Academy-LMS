import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Server, 
  BarChart3, 
  Shield,
  Settings,
  Eye,
  Download,
  Filter
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly')
  const { t } = useLanguage()

  const systemStats = [
    { label: 'Total Users', value: '245', change: '+8.5%', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Sessions', value: '342', change: '+12.3%', icon: Server, color: 'bg-green-500' },
    { label: 'Storage Used', value: '43%', change: '-2.1%', icon: BarChart3, color: 'bg-purple-500' },
    { label: 'System Health', value: '99.8%', change: '+0.2%', icon: Shield, color: 'bg-orange-500' }
  ]

  const userGrowth = [
    { month: 'Sep', students: 450, teachers: 35, parents: 120 },
    { month: 'Oct', students: 520, teachers: 38, parents: 145 },
    { month: 'Nov', students: 580, teachers: 40, parents: 165 },
    { month: 'Dec', students: 620, teachers: 42, parents: 185 },
    { month: 'Jan', students: 670, teachers: 45, parents: 210 }
  ]

  const roleDistribution = [
    { role: 'Students', value: 670, color: '#3B82F6' },
    { role: 'Teachers', value: 45, color: '#10B981' },
    { role: 'Parents', value: 210, color: '#8B5CF6' },
    { role: 'Directors', value: 3, color: '#F59E0B' },
    { role: 'Admins', value: 2, color: '#EF4444' }
  ]

  const systemLogs = [
    { id: 1, action: 'User Login', user: 'john.doe@falconacademy.edu.et', time: '10:30 AM', status: 'success' },
    { id: 2, action: 'Assignment Upload', user: 'teacher.alemayehu@falconacademy.edu.et', time: '11:15 AM', status: 'success' },
    { id: 3, action: 'Failed Login Attempt', user: 'unknown@example.com', time: '12:45 PM', status: 'failed' },
    { id: 4, action: 'System Backup', user: 'System', time: '2:00 AM', status: 'success' },
    { id: 5, action: 'Database Update', user: 'admin@falconacademy.edu.et', time: '3:30 PM', status: 'success' }
  ]

  const recentActivities = [
    { id: 1, activity: 'New student registration', user: 'Samuel Getachew', time: '5 minutes ago' },
    { id: 2, activity: 'Teacher account created', user: 'Ms. Sara Johnson', time: '1 hour ago' },
    { id: 3, activity: 'System settings updated', user: 'Admin', time: '2 hours ago' },
    { id: 4, activity: 'Security audit completed', user: 'System', time: '4 hours ago' }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Administration</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage the entire platform
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">this month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="teachers" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="parents" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Role Distribution</h3>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">System Logs</h3>
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-4">
            {systemLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{log.action}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {log.user} • {log.time}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  log.status === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <Eye className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.activity}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">System Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quick access to administrative functions
            </p>
          </div>
          <Settings className="h-5 w-5 text-blue-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">User Management</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Server className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">System Settings</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Shield className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">Security</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium">Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard