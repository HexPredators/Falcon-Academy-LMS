import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Bot, User, Sparkles, Zap, Brain, Clock, BookOpen, MessageSquare, X, Minimize2, Maximize2, Settings, Download, Share2 } from 'lucide-react'
import Button from '../../Common/Button'

const AIAssistant = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    { id: 1, text: t('ai.welcomeMessage'), sender: 'ai', timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [aiModules, setAiModules] = useState([
    { id: 'lesson-planner', name: t('ai.lessonPlanner'), icon: BookOpen, color: 'blue', description: t('ai.lessonPlannerDesc') },
    { id: 'study-planner', name: t('ai.studyPlanner'), icon: Clock, color: 'green', description: t('ai.studyPlannerDesc') },
    { id: 'learning-support', name: t('ai.learningSupport'), icon: Brain, color: 'purple', description: t('ai.learningSupportDesc') },
    { id: 'how-we-work', name: t('ai.howWeWork'), icon: Zap, color: 'orange', description: t('ai.howWeWorkDesc') },
  ])
  const [activeModule, setActiveModule] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { id: messages.length + 1, text: input, sender: 'user', timestamp: new Date() }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: t('ai.demoResponse', { query: input }),
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1500)
  }

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId)
    const moduleText = {
      'lesson-planner': t('ai.lessonPlannerPrompt'),
      'study-planner': t('ai.studyPlannerPrompt'),
      'learning-support': t('ai.learningSupportPrompt'),
      'how-we-work': t('ai.howWeWorkPrompt'),
    }[moduleId]
    
    if (moduleText) {
      setInput(moduleText)
    }
  }

  const handleQuickAction = (action) => {
    const actionText = {
      'assignment-help': t('ai.assignmentHelp'),
      'quiz-prep': t('ai.quizPrep'),
      'explain-concept': t('ai.explainConcept'),
      'grade-calc': t('ai.gradeCalc'),
    }[action]
    
    if (actionText) {
      setInput(actionText)
    }
  }

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.sender === 'ai' ? 'Falcon AI' : 'You'}: ${msg.text}\n`
    ).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'falcon-ai-chat.txt'
    a.click()
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-full max-w-md h-[600px]'}`}>
      {/* Minimized State */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-gradient-to-br from-falcon-blue-600 to-falcon-blue-800 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-200 group"
        >
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </button>
      ) : (
        /* Expanded Chat Interface */
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-falcon-blue-600 to-falcon-blue-800 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Falcon AI Assistant</h3>
                  <p className="text-blue-200 text-sm">{t('ai.available')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportChat}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={t('ai.exportChat')}
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={t('ai.minimize')}
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={t('ai.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-white/10 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('ai.poweredByGPT')}</span>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('ai.settings')}
              </button>
            </div>
          </div>

          {/* AI Modules Grid */}
          <div className="p-4 bg-gray-50 border-b">
            <h4 className="font-semibold text-gray-700 mb-3">{t('ai.quickModules')}</h4>
            <div className="grid grid-cols-2 gap-3">
              {aiModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    activeModule === module.id
                      ? `bg-${module.color}-100 border-${module.color}-300 border`
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${module.color}-100 rounded-lg flex items-center justify-center`}>
                      <module.icon className={`w-5 h-5 text-${module.color}-600`} />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{module.name}</h5>
                      <p className="text-xs text-gray-500 truncate">{module.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b">
            <h4 className="font-semibold text-gray-700 mb-3">{t('ai.quickActions')}</h4>
            <div className="flex flex-wrap gap-2">
              {['assignment-help', 'quiz-prep', 'explain-concept', 'grade-calc'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-2 bg-falcon-blue-50 hover:bg-falcon-blue-100 text-falcon-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {t(`ai.${action}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-falcon-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'bg-white/20' : 'bg-falcon-blue-100'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3 text-falcon-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {message.sender === 'user' ? t('ai.you') : 'Falcon AI'}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-falcon-blue-100 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-falcon-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Falcon AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('ai.typeMessage')}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Button
                type="submit"
                loading={loading}
                disabled={!input.trim()}
                className="px-6 py-3 bg-falcon-blue-600 hover:bg-falcon-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{t('ai.rememberContext')}</span>
              </div>
              <button className="flex items-center gap-1 hover:text-falcon-blue-600">
                <Share2 className="w-4 h-4" />
                {t('ai.share')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAssistant