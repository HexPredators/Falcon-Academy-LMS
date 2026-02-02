import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react'
import Header from '../components/Common/Header'
import { useLanguage } from '../contexts/LanguageContext'
import AIAssistant from '../components/AI/AIAssistant'

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(1)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()

  const conversations = [
    {
      id: 1,
      name: 'Mr. Alemayehu',
      role: 'Mathematics Teacher',
      lastMessage: 'Remember to submit the assignment by tomorrow',
      timestamp: '10:30 AM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Physics Study Group',
      role: 'Group Chat',
      lastMessage: 'Let\'s meet tomorrow for revision',
      timestamp: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Ms. Sara',
      role: 'English Teacher',
      lastMessage: 'Great essay! Keep up the good work',
      timestamp: '2 days ago',
      unread: 0,
      online: true
    },
    {
      id: 4,
      name: 'Class 11-A Announcements',
      role: 'Class Channel',
      lastMessage: 'Exam schedule has been updated',
      timestamp: '3 days ago',
      unread: 5,
      online: false
    }
  ]

  const messages = [
    { id: 1, sender: 'teacher', text: 'Hello! How can I help you with the assignment?', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'I\'m having trouble with question 3 in the calculus assignment', time: '10:05 AM' },
    { id: 3, sender: 'teacher', text: 'Let me explain the concept. Which part specifically?', time: '10:10 AM' },
    { id: 4, sender: 'me', text: 'The integration part using substitution method', time: '10:15 AM' },
    { id: 5, sender: 'teacher', text: 'I\'ll share a step-by-step solution. Check the attached file.', time: '10:30 AM' }
  ]

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('messages')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Communicate with teachers, classmates, and groups
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card lg:col-span-1"
            >
              <div className="p-4 border-b dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="divide-y dark:divide-gray-800">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      activeConversation === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {conv.name.charAt(0)}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conv.name}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conv.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conv.role}
                          </span>
                          {conv.unread > 0 && (
                            <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card lg:col-span-2 flex flex-col"
            >
              <div className="p-4 border-b dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      {conversations.find(c => c.id === activeConversation)?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === activeConversation)?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {conversations.find(c => c.id === activeConversation)?.role}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl p-3 ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && (
                          <>
                            <CheckCheck className="h-3 w-3" />
                            <span>Read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t dark:border-gray-800">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 input-field min-h-[44px] max-h-32 resize-none"
                    rows="1"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
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

export default Messages