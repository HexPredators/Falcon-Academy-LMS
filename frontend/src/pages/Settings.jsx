import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Globe, 
  Shield,
  Moon,
  Save,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff
} from 'lucide-react'
import Header from '../components/Common/Header'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import AIAssistant from '../components/AI/AIAssistant'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const { t, language, changeLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' },
    { code: 'om', name: 'Afaan Oromoo' },
    { code: 'ti', name: 'ትግርኛ' }
  ]

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'language', icon: Globe, label: 'Language & Region' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'appearance', icon: Moon, label: 'Appearance' }
  ]

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@falconacademy.edu.et',
    phone: '+251 91 234 5678',
    grade: '11',
    section: 'A',
    stream: 'Natural Science',
    bio: 'Passionate about science and technology'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    quizReminders: true,
    gradeUpdates: true,
    newsUpdates: false,
    marketingEmails: false
  })

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false
  })

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData)
  }

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notificationSettings)
  }

  const handleSaveSecurity = () => {
    console.log('Saving security settings:', securitySettings)
  }

  const handleChangePassword = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Changing password')
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
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card space-y-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="card p-6">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Profile Settings</h2>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.name.charAt(0)}
                      </div>
                      <div>
                        <button className="btn-secondary mb-2">Change Photo</button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Recommended: Square image, at least 400x400px
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Grade</label>
                        <select
                          value={profileData.grade}
                          onChange={(e) => setProfileData({...profileData, grade: e.target.value})}
                          className="input-field"
                        >
                          {['9', '10', '11', '12'].map(g => (
                            <option key={g} value={g}>Grade {g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Section</label>
                        <select
                          value={profileData.section}
                          onChange={(e) => setProfileData({...profileData, section: e.target.value})}
                          className="input-field"
                        >
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(s => (
                            <option key={s} value={s}>Section {s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Stream</label>
                        <select
                          value={profileData.stream}
                          onChange={(e) => setProfileData({...profileData, stream: e.target.value})}
                          className="input-field"
                        >
                          <option value="Natural Science">Natural Science</option>
                          <option value="Social Science">Social Science</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows="3"
                        className="input-field"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Notification Settings</h2>
                      <button
                        onClick={handleSaveNotifications}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Preferences
                      </button>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <h4 className="font-medium">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {key.includes('email') ? 'Receive email notifications' :
                               key.includes('assignment') ? 'Get reminders for assignments' :
                               key.includes('quiz') ? 'Get reminders for quizzes' :
                               key.includes('grade') ? 'Notify when grades are posted' :
                               key.includes('news') ? 'Receive school news updates' :
                               'Receive marketing communications'}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [key]: !value
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'language' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold mb-6">Language & Region</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-4">Language</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                language === lang.code
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5" />
                                <div>
                                  <h4 className="font-medium">{lang.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {lang.code === 'en' && 'Default system language'}
                                    {lang.code === 'am' && 'የአማርኛ ቋንቋ'}
                                    {lang.code === 'om' && 'Afaan Oromoo dubbii'}
                                    {lang.code === 'ti' && 'ቋንቋ ትግርኛ'}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Time Zone</label>
                        <select className="input-field">
                          <option value="Africa/Addis_Ababa">Africa/Addis_Ababa (EAT)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Date Format</label>
                        <select className="input-field">
                          <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => setSecuritySettings({
                              ...securitySettings,
                              twoFactorAuth: !securitySettings.twoFactorAuth
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              securitySettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Change Password</h4>
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={securitySettings.currentPassword}
                              onChange={(e) => setSecuritySettings({
                                ...securitySettings,
                                currentPassword: e.target.value
                              })}
                              className="input-field pl-10 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <input
                            type="password"
                            value={securitySettings.newPassword}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              newPassword: e.target.value
                            })}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={securitySettings.confirmPassword}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              confirmPassword: e.target.value
                            })}
                            className="input-field"
                          />
                        </div>
                        <button
                          onClick={handleChangePassword}
                          className="btn-primary"
                        >
                          Update Password
                        </button>
                      </div>

                      <div className="pt-6 border-t dark:border-gray-800">
                        <h4 className="font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
                        <div className="space-y-3">
                          <button className="w-full btn-secondary text-red-600 hover:text-red-700 hover:border-red-300">
                            Export All Data
                          </button>
                          <button className="w-full btn-secondary text-red-600 hover:text-red-700 hover:border-red-300">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold mb-6">Appearance</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-4">Theme</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => toggleTheme()}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                                <Moon className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">Light Mode</h4>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Bright interface with light colors
                            </p>
                          </button>

                          <button
                            onClick={() => toggleTheme()}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <Moon className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">Dark Mode</h4>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Dark interface for reduced eye strain
                            </p>
                          </button>

                          <button
                            onClick={() => {}}
                            className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 text-left hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Moon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium">System Default</h4>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Match your device's theme settings
                            </p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Font Size</label>
                        <select className="input-field">
                          <option value="small">Small</option>
                          <option value="medium" selected>Medium</option>
                          <option value="large">Large</option>
                          <option value="xlarge">Extra Large</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Animations</label>
                        <select className="input-field">
                          <option value="full">Full Animations</option>
                          <option value="reduced">Reduced Animations</option>
                          <option value="none">No Animations</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <h4 className="font-medium">High Contrast Mode</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Increase contrast for better readability
                          </p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <AIAssistant />
    </div>
  )
}

export default Settings