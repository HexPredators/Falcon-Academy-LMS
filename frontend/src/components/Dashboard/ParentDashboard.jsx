import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award,
  Calendar,
  MessageSquare,
  Eye,
  Download
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(0)
  const { t } = useLanguage()

  const children = [
    { id: 1, name: 'Samuel Getachew', grade: '11', section: 'A', stream: 'Natural Science' },
    { id: 2, name: 'Meron Getachew', grade: '9', section: 'B', stream: null }
  ]

  const childPerformance = [
    { month: 'Sep', assignments: 85, quizzes: 78, attendance: 92 },
    { month: 'Oct', assignments: 88, quizzes: 82, attendance: 95 },
    { month: 'Nov', assignments: 92, quizzes: 85, attendance: 98 },
    { month: 'Dec', assignments: 90, quizzes: 88, attendance: 96 },
    { month: 'Jan', assignments: 94, quizzes: 90, attendance: 100 }
  ]

  const subjectScores = [
    { subject: 'Mathematics', score: 92, classAvg: 85, improvement: '+7%' },
    { subject: 'Physics', score: 88, classAvg: 78, improvement: '+10%' },
    { subject: 'Chemistry', score: 85, classAvg: 82, improvement: '+3%' },
    { subject: 'English', score: 87, classAvg: 80, improvement: '+7%' },
    { subject: 'Amharic', score: 90, classAvg: 85, improvement: '+5%' }
  ]

  const upcomingEvents = [
    { id: 1, event: 'Parent-Teacher Meeting', date: 'Jan 28', child: 'Samuel' },
    { id: 2, event: 'Science Fair', date: 'Jan 30', child: 'Samuel' },
    { id: 3, event: 'Math Olympiad', date: 'Feb 5', child: 'Samuel' },
    { id: 4, event: 'PTA Conference', date: 'Feb 10', child: 'Both' }
  ]

  const recentActivities = [
    { id: 1, activity: 'Submitted Math Assignment', child: 'Samuel', time: '2 hours ago', score: '95/100' },
    { id: 2, activity: 'Completed Physics Quiz', child: 'Samuel', time: '1 day ago', score: '88/100' },
    { id: 3, activity: 'English Essay Graded', child: 'Samuel', time: '2 days ago', score: '90/100' },
    { id: 4, activity: 'Library Book Read', child: 'Meron', time: '3 days ago', progress: 'Chapter 5' }
  ]

  const currentChild = children[selectedChild]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Parent Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your children's academic progress
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(parseInt(e.target.value))}
              className="input-field"
            >
              {children.map((child, index) => (
                <option key={child.id} value={index}>
                  {child.name} - Grade {child.grade}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Award, label: 'Overall Average', value: '89%', change: '+5%', color: 'bg-blue-500' },
          { icon: TrendingUp, label: 'Class Rank', value: '8/45', change: '+2', color: 'bg-green-500' },
          { icon: BookOpen, label: 'Assignments', value: '48/50', change: '+3', color: 'bg-purple-500' },
          { icon: Eye, label: 'Attendance', value: '98%', change: '+2%', color: 'bg-orange-500' }
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
            <h3 className="text-lg font-semibold">Performance Trend</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={childPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="assignments" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="quizzes" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="attendance" stroke="#8B5CF6" strokeWidth={2} />
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
            <h3 className="text-lg font-semibold">Subject Performance</h3>
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="score" name="Student Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="classAvg" name="Class Average" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
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
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <Eye className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{activity.activity}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{activity.child}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  {activity.score ? (
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {activity.score}
                    </span>
                  ) : (
                    <span className="font-medium">{activity.progress}</span>
                  )}
                </div>
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
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{event.event}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{event.child}</span>
                    <span>•</span>
                    <span>{event.date}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium">
                  View Details
                </button>
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
              Common parent actions
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Message Teacher</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Schedule Meeting</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">View Assignments</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Award className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium">Check Grades</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ParentDashboard