import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Edit,
  Share2
} from 'lucide-react'
import Header from '../components/Common/Header'
import { useAuth } from '../hooks/useAuth'
import AIAssistant from '../components/AI/AIAssistant'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer
} from 'recharts'

const Profile = () => {
  const { user } = useAuth()

  const profileData = {
    name: 'Abebe Belachew',
    email: 'Abebe@gmail.com',
    phone: '+251 91 234 5678',
    grade: '11',
    section: 'A',
    stream: 'Natural Science',
    studentId: 'FAV202511045',
    joinDate: 'September 2021',
    achievements: 12,
    completedAssignments: 48,
    averageScore: 92
  }

  const skillData = [
    { subject: 'Mathematics', score: 95 },
    { subject: 'Physics', score: 88 },
    { subject: 'Chemistry', score: 85 },
    { subject: 'Biology', score: 90 },
    { subject: 'English', score: 87 },
    { subject: 'History', score: 82 }
  ]

  const recentAchievements = [
    { id: 1, title: 'Math Olympiad Winner', date: 'Jan 2024', type: 'academic' },
    { id: 2, title: 'Perfect Attendance', date: 'Dec 2023', type: 'attendance' },
    { id: 3, title: 'Science Fair 1st Place', date: 'Nov 2023', type: 'competition' },
    { id: 4, title: 'Early Submission Award', date: 'Oct 2023', type: 'discipline' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your personal profile
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="card p-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-white dark:border-gray-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{profileData.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Grade {profileData.grade} • Section {profileData.section} • {profileData.stream}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium">
                        Student
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="font-medium">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-medium">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                          <p className="font-medium">{profileData.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                          <p className="font-medium">{profileData.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Achievements</p>
                      <p className="text-2xl font-bold mt-2">{profileData.achievements}</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assignments</p>
                      <p className="text-2xl font-bold mt-2">{profileData.completedAssignments}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                      <p className="text-2xl font-bold mt-2">{profileData.averageScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </motion.div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-6">Subject Skills Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        achievement.type === 'academic' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        achievement.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30' :
                        achievement.type === 'competition' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-orange-100 dark:bg-orange-900/30'
                      }`}>
                        <Award className={`h-5 w-5 ${
                          achievement.type === 'academic' ? 'text-blue-600 dark:text-blue-400' :
                          achievement.type === 'attendance' ? 'text-green-600 dark:text-green-400' :
                          achievement.type === 'competition' ? 'text-purple-600 dark:text-purple-400' :
                          'text-orange-600 dark:text-orange-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Learning Goals</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mathematics Mastery</span>
                      <span className="text-sm text-green-600 dark:text-green-400">85%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Complete 50 Assignments</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">48/50</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '96%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Improve English Writing</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">70%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Rank</span>
                    <span className="font-medium">8th</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Study Hours This Week</span>
                    <span className="font-medium">28.5h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Books Read</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <AIAssistant />
    </div>
  )
}

export default Profile