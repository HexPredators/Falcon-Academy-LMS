import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react'
import Header from '../components/Common/Header'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import AIAssistant from '../components/AI/AIAssistant'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('monthly')
  const { user } = useAuth()
  const { t } = useLanguage()

  const performanceData = [
    { month: 'Sep', assignments: 85, quizzes: 78, average: 82 },
    { month: 'Oct', assignments: 88, quizzes: 82, average: 85 },
    { month: 'Nov', assignments: 92, quizzes: 85, average: 89 },
    { month: 'Dec', assignments: 90, quizzes: 88, average: 87 },
    { month: 'Jan', assignments: 94, quizzes: 90, average: 92 }
  ]

  const subjectPerformance = [
    { subject: 'Mathematics', score: 92, improvement: '+8%', color: '#3B82F6' },
    { subject: 'Physics', score: 88, improvement: '+5%', color: '#8B5CF6' },
    { subject: 'Chemistry', score: 85, improvement: '+6%', color: '#10B981' },
    { subject: 'Biology', score: 90, improvement: '+7%', color: '#F59E0B' },
    { subject: 'English', score: 87, improvement: '+4%', color: '#EF4444' }
  ]

  const gradeDistribution = [
    { name: 'A (90-100)', value: 35, color: '#10B981' },
    { name: 'B (80-89)', value: 40, color: '#3B82F6' },
    { name: 'C (70-79)', value: 15, color: '#F59E0B' },
    { name: 'D (60-69)', value: 7, color: '#EF4444' },
    { name: 'F (<60)', value: 3, color: '#DC2626' }
  ]

  const activityData = [
    { day: 'Mon', hours: 3.5, assignments: 2, quizzes: 1 },
    { day: 'Tue', hours: 4.2, assignments: 3, quizzes: 0 },
    { day: 'Wed', hours: 2.8, assignments: 1, quizzes: 2 },
    { day: 'Thu', hours: 5.1, assignments: 4, quizzes: 1 },
    { day: 'Fri', hours: 3.9, assignments: 2, quizzes: 2 },
    { day: 'Sat', hours: 2.5, assignments: 1, quizzes: 0 },
    { day: 'Sun', hours: 1.8, assignments: 0, quizzes: 1 }
  ]

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'student': return 'Your Learning Analytics'
      case 'teacher': return 'Class Performance Analytics'
      case 'parent': return "Child's Progress Analytics"
      case 'director': return 'School Performance Dashboard'
      case 'admin': return 'System Analytics Dashboard'
      default: return 'Analytics Dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('analytics')}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {getDashboardTitle()}
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
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
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
              { icon: TrendingUp, label: 'Overall Performance', value: '92%', change: '+5%', color: 'bg-green-500' },
              { icon: BookOpen, label: 'Avg Study Hours', value: '3.7h', change: '+0.8h', color: 'bg-blue-500' },
              { icon: Award, label: 'Completion Rate', value: '94%', change: '+3%', color: 'bg-purple-500' },
              { icon: Users, label: 'Class Rank', value: '8/45', change: '+2', color: 'bg-orange-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
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
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="assignments" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Assignments"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quizzes" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="Quizzes"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Average"
                    />
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
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="subject" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {subjectPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
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
                <h3 className="text-lg font-semibold">Grade Distribution</h3>
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
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
                <h3 className="text-lg font-semibold">Weekly Activity</h3>
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Study Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assignments" name="Assignments" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quizzes" name="Quizzes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-600 dark:text-blue-400">Strengths</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span>Mathematics problem-solving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span>Physics concepts application</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span>Consistent assignment submission</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-orange-600 dark:text-orange-400">Areas to Improve</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-600" />
                    <span>Chemistry lab reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-600" />
                    <span>Time management in quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-600" />
                    <span>English essay writing</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-green-600 dark:text-green-400">Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span>Focus on chemistry practice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span>Use AI study planner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span>Join English writing workshop</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-purple-600 dark:text-purple-400">Upcoming Goals</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    <span>Achieve 95% in next math test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    <span>Complete all assignments early</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    <span>Improve quiz scores by 10%</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <AIAssistant />
    </div>
  )
}

export default Analytics