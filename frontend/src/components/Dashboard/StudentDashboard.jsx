import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, Clock, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useLanguage } from '../../contexts/LanguageContext'

const StudentDashboard = () => {
  const { t } = useLanguage()

  const upcomingAssignments = [
    { id: 1, title: 'Mathematics Homework', subject: 'Math', dueDate: 'Tomorrow', status: 'pending' },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics', dueDate: 'In 2 days', status: 'pending' },
    { id: 3, title: 'History Essay', subject: 'History', dueDate: 'Next week', status: 'in-progress' }
  ]

  const performanceData = [
    { month: 'Sep', math: 85, physics: 78, chemistry: 82 },
    { month: 'Oct', math: 88, physics: 82, chemistry: 85 },
    { month: 'Nov', math: 92, physics: 85, chemistry: 88 },
    { month: 'Dec', math: 90, physics: 88, chemistry: 86 }
  ]

  const subjectDistribution = [
    { name: 'Mathematics', value: 30, color: '#3B82F6' },
    { name: 'Physics', value: 25, color: '#8B5CF6' },
    { name: 'Chemistry', value: 20, color: '#10B981' },
    { name: 'English', value: 15, color: '#F59E0B' },
    { name: 'History', value: 10, color: '#EF4444' }
  ]

  const recentActivities = [
    { id: 1, activity: 'Submitted Math Assignment', time: '2 hours ago' },
    { id: 2, activity: 'Completed Physics Quiz', time: '1 day ago' },
    { id: 3, activity: 'Read Chemistry Chapter 5', time: '2 days ago' },
    { id: 4, activity: 'Joined Study Group', time: '3 days ago' }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Performance Trend</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <LineChart width={500} height={250} data={performanceData}>
              <Line type="monotone" dataKey="math" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="physics" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="chemistry" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Subject Distribution</h3>
            <BookOpen className="h-5 w-5 text-purple-600" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <PieChart width={300} height={250}>
              <Pie
                data={subjectDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {subjectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {assignment.subject} • Due {assignment.dueDate}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  assignment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {assignment.status === 'pending' ? 'Pending' : 'In Progress'}
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
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentDashboard