import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Newspaper, 
  Calendar, 
  Users, 
  Globe,
  School,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react'
import Header from '../components/Common/Header'
import { useLanguage } from '../contexts/LanguageContext'
import AIAssistant from '../components/AI/AIAssistant'

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { t } = useLanguage()

  const categories = [
    { id: 'all', label: 'All News', icon: Newspaper, count: 12 },
    { id: 'school', label: 'School News', icon: School, count: 6 },
    { id: 'grade', label: 'Grade Specific', icon: Users, count: 4 },
    { id: 'events', label: 'Events', icon: Calendar, count: 5 },
    { id: 'achievements', label: 'Achievements', icon: Award, count: 3 }
  ]

  const newsItems = [
    {
      id: 1,
      title: 'Annual Science Fair 2024',
      category: 'events',
      excerpt: 'Join us for the biggest science fair of the year featuring innovative projects from students.',
      date: '2024-01-20',
      image: 'science-fair',
      priority: 'high',
      views: 1245
    },
    {
      id: 2,
      title: 'Grade 12 Exam Schedule Update',
      category: 'school',
      excerpt: 'Important changes to the final examination schedule for Grade 12 students.',
      date: '2024-01-18',
      image: 'exams',
      priority: 'high',
      views: 987
    },
    {
      id: 3,
      title: 'Mathematics Olympiad Winners',
      category: 'achievements',
      excerpt: 'Congratulations to our students for winning regional mathematics competition.',
      date: '2024-01-15',
      image: 'olympiad',
      priority: 'medium',
      views: 876
    },
    {
      id: 4,
      title: 'Parent-Teacher Meeting Schedule',
      category: 'school',
      excerpt: 'Schedule for upcoming parent-teacher meetings for all grades.',
      date: '2024-01-12',
      image: 'meeting',
      priority: 'medium',
      views: 654
    },
    {
      id: 5,
      title: 'New Digital Library Resources',
      category: 'school',
      excerpt: 'Over 500 new books added to the digital library across all subjects.',
      date: '2024-01-10',
      image: 'library',
      priority: 'low',
      views: 543
    },
    {
      id: 6,
      title: 'Sports Day Announcement',
      category: 'events',
      excerpt: 'Annual sports day scheduled for next month. Register your events now.',
      date: '2024-01-08',
      image: 'sports',
      priority: 'medium',
      views: 432
    }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory)

  const getImageColor = (imageName) => {
    const colors = {
      'science-fair': 'from-blue-500 to-purple-600',
      'exams': 'from-red-500 to-orange-600',
      'olympiad': 'from-green-500 to-teal-600',
      'meeting': 'from-purple-500 to-pink-600',
      'library': 'from-indigo-500 to-blue-600',
      'sports': 'from-orange-500 to-yellow-600'
    }
    return colors[imageName] || 'from-gray-500 to-gray-600'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
    return colors[priority]
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
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('news')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with latest announcements and events
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 border hover:border-blue-500 dark:hover:border-blue-400'
                }`}
              >
                <category.icon className="h-5 w-5" />
                <span className="font-medium">{category.label}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {filteredNews.map((news, index) => (
                    <motion.article
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className={`md:w-48 h-48 md:h-auto bg-gradient-to-br ${getImageColor(news.image)} relative`}>
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(news.priority)}`}>
                              {news.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {news.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {news.views.toLocaleString()} views
                              </span>
                            </div>
                          </div>
                          <h2 className="text-xl font-bold mb-3">{news.title}</h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              Read More →
                            </button>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                5 min read
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Important Announcements</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 dark:text-red-400 font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Emergency School Closure</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        School will be closed tomorrow due to maintenance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">New Portal Features</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Check out the new AI assistant and analytics dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Scholarship Applications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Deadline for scholarship applications is next week
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Science Fair', date: 'Jan 20', time: '9:00 AM', type: 'event' },
                    { title: 'PTA Meeting', date: 'Jan 22', time: '4:00 PM', type: 'meeting' },
                    { title: 'Sports Day', date: 'Jan 25', time: '8:00 AM', type: 'event' },
                    { title: 'Exam Week', date: 'Jan 29', time: 'All Day', type: 'academic' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'event' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : event.type === 'meeting'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  ))}
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

export default News