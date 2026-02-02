import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  GraduationCap,
  BarChart3,
  School,
  Award,
  Calendar,
  Eye
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const DirectorDashboard = () => {
  const { t } = useLanguage()

  const schoolStats = [
    { grade: 'Grade 9', students: 150, teachers: 8, avgScore: 78 },
    { grade: 'Grade 10', students: 145, teachers: 9, avgScore: 82 },
    { grade: 'Grade 11', students: 140, teachers: 10, avgScore: 85 },
    { grade: 'Grade 12', students: 135, teachers: 11, avgScore: 87 }
  ]

  const performanceTrend = [
    { month: 'Sep', grade9: 75, grade10: 80, grade11: 82, grade12: 84 },
    { month: 'Oct', grade9: 77, grade10: 81, grade11: 83, grade12: 85 },
    { month: 'Nov', grade9: 78, grade10: 82, grade11: 84, grade12: 86 },
    { month: 'Dec', grade9: 79, grade10: 83, grade11: 85, grade12: 87 },
    { month: 'Jan', grade9: 80, grade10: 84, grade11: 86, grade12: 88 }
  ]

  const streamDistribution = [
    { name: 'Natural Science', value: 65, color: '#3B82F6' },
    { name: 'Social Science', value: 35, color: '#8B5CF6' }
  ]

  const teacherPerformance = [
    { name: 'Mr. Alemayehu', subject: 'Mathematics', avgScore: 92, students: 45 },
    { name: 'Ms. Sara', subject: 'English', avgScore: 88, students: 42 },
    { name: 'Dr. Getachew', subject: 'Physics', avgScore: 90, students: 38 },
    { name: 'Mrs. Helen', subject: 'Chemistry', avgScore: 87, students: 40 },
    { name: 'Mr. Samuel', subject: 'Biology', avgScore: 85, students: 35 }
  ]

  const upcomingEvents = [
    { id: 1, event: 'Board Meeting', date: 'Jan 25', time: '10:00 AM', priority: 'high' },
    { id: 2, event: 'Parent-Teacher Conference', date: 'Jan 28', time: '9:00 AM', priority: 'medium' },
    { id: 3, event: 'Staff Training', date: 'Feb 1', time: '2:00 PM', priority: 'medium' },
    { id: 4, event: 'Academic Review', date: 'Feb 5', time: '11:00 AM', priority: 'high' }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Students', value: '570', change: '+25', color: 'bg-blue-500' },
          { icon: GraduationCap, label: 'Teaching Staff', value: '38', change: '+3', color: 'bg-green-500' },
          { icon: TrendingUp, label: 'Overall Performance', value: '83%', change: '+5%', color: 'bg-purple-500' },
          { icon: Award, label: 'Graduation Rate', value: '98%', change: '+2%', color: 'bg-orange-500' }
        ].map((stat, index) => (
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
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">this term</span>
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
            <h3 className="text-lg font-semibold">Grade-wise Performance</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="grade" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="students" name="Students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" name="Avg Score" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Performance Trend</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="grade9" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="grade10" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="grade11" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="grade12" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Stream Distribution</h3>
            <School className="h-5 w-5 text-purple-600" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={streamDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {streamDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Teachers</h3>
            <Award className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {teacherPerformance.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{teacher.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {teacher.subject} • {teacher.students} students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {teacher.avgScore}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Calendar className="h-5 w-5 text-red-600" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{event.event}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date} at {event.time}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {event.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Quick Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Key metrics and observations
            </p>
          </div>
          <Eye className="h-5 w-5 text-blue-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
            <p className="text-xl font-bold mt-1">96.5%</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+1.2% from last term</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Library Usage</p>
            <p className="text-xl font-bold mt-1">1,245</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">books accessed this month</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assignment Submission</p>
            <p className="text-xl font-bold mt-1">94%</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">on-time submission rate</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Parent Engagement</p>
            <p className="text-xl font-bold mt-1">78%</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">active parent accounts</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DirectorDashboard