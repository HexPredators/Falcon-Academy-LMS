import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3,
  MessageSquare,
  Calendar,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const TeacherDashboard = () => {
  const { t } = useLanguage()

  const classStats = [
    { class: '11-A', students: 45, assignments: 12, avgScore: 85 },
    { class: '11-B', students: 42, assignments: 10, avgScore: 82 },
    { class: '12-A', students: 38, assignments: 15, avgScore: 88 },
    { class: '12-B', students: 40, assignments: 14, avgScore: 84 }
  ]

  const performanceData = [
    { month: 'Sep', assignments: 42, graded: 38, pending: 4 },
    { month: 'Oct', assignments: 45, graded: 42, pending: 3 },
    { month: 'Nov', assignments: 48, graded: 45, pending: 3 },
    { month: 'Dec', assignments: 40, graded: 37, pending: 3 },
    { month: 'Jan', assignments: 35, graded: 32, pending: 3 }
  ]

  const upcomingTasks = [
    { id: 1, task: 'Grade Math Assignment', class: '11-A', due: 'Today', priority: 'high' },
    { id: 2, task: 'Prepare Physics Quiz', class: '12-B', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Update Lesson Plans', class: 'All', due: 'This Week', priority: 'low' },
    { id: 4, task: 'Parent-Teacher Meetings', class: '11-B', due: 'Next Week', priority: 'medium' }
  ]

  const studentPerformance = [
    { name: 'Samuel Getachew', math: 92, physics: 88, attendance: 95 },
    { name: 'Meron Assefa', math: 85, physics: 90, attendance: 98 },
    { name: 'Tewodros Bekele', math: 78, physics: 82, attendance: 90 },
    { name: 'Helen Mekonnen', math: 95, physics: 94, attendance: 100 },
    { name: 'Kaleb Girma', math: 88, physics: 85, attendance: 92 }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Students', value: '165', change: '+8', color: 'bg-blue-500' },
          { icon: FileText, label: 'Assignments', value: '48', change: '+12', color: 'bg-green-500' },
          { icon: BookOpen, label: 'Avg Class Score', value: '85%', change: '+3%', color: 'bg-purple-500' },
          { icon: CheckCircle, label: 'Graded Work', value: '92%', change: '+5%', color: 'bg-orange-500' }
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
            <h3 className="text-lg font-semibold">Class Performance</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="class" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="avgScore" name="Average Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assignments" name="Assignments" fill="#10B981" radius={[4, 4, 0, 0]} />
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
            <h3 className="text-lg font-semibold">Grading Progress</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="assignments" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="graded" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
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
            <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{task.task}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {task.class} • Due {task.due}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {task.priority}
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
            <h3 className="text-lg font-semibold">Top Performing Students</h3>
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {studentPerformance.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>Math: {student.math}%</span>
                      <span>Physics: {student.physics}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>{student.attendance}%</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
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
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Access frequently used features
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Create Assignment</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BookOpen className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Grade Submissions</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">Send Messages</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium">View Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default TeacherDashboard