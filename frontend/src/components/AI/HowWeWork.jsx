import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap, Users, BookOpen, Target, Shield, Globe, Smartphone, TrendingUp, CheckCircle, Play, ArrowRight, ChevronRight, Star, Award } from 'lucide-react'
import Button from '../../Common/Button'

const HowWeWork = () => {
  const { t } = useTranslation()
  const [activeFeature, setActiveFeature] = useState('ai')

  const features = [
    {
      id: 'ai',
      title: t('features.aiAssistant'),
      description: t('features.aiDescription'),
      icon: Zap,
      color: 'blue',
      details: [
        t('features.aiDetail1'),
        t('features.aiDetail2'),
        t('features.aiDetail3'),
        t('features.aiDetail4')
      ],
      videoUrl: '#'
    },
    {
      id: 'learning',
      title: t('features.digitalLibrary'),
      description: t('features.libraryDescription'),
      icon: BookOpen,
      color: 'green',
      details: [
        t('features.libraryDetail1'),
        t('features.libraryDetail2'),
        t('features.libraryDetail3'),
        t('features.libraryDetail4')
      ]
    },
    {
      id: 'tracking',
      title: t('features.parentTracking'),
      description: t('features.trackingDescription'),
      icon: Users,
      color: 'purple',
      details: [
        t('features.trackingDetail1'),
        t('features.trackingDetail2'),
        t('features.trackingDetail3'),
        t('features.trackingDetail4')
      ]
    },
    {
      id: 'analytics',
      title: t('features.analytics'),
      description: t('features.analyticsDescription'),
      icon: TrendingUp,
      color: 'orange',
      details: [
        t('features.analyticsDetail1'),
        t('features.analyticsDetail2'),
        t('features.analyticsDetail3'),
        t('features.analyticsDetail4')
      ]
    },
    {
      id: 'security',
      title: t('features.securePlatform'),
      description: t('features.securityDescription'),
      icon: Shield,
      color: 'red',
      details: [
        t('features.securityDetail1'),
        t('features.securityDetail2'),
        t('features.securityDetail3'),
        t('features.securityDetail4')
      ]
    },
    {
      id: 'multilingual',
      title: t('features.multilingual'),
      description: t('features.multilingualDescription'),
      icon: Globe,
      color: 'teal',
      details: [
        t('features.multilingualDetail1'),
        t('features.multilingualDetail2'),
        t('features.multilingualDetail3'),
        t('features.multilingualDetail4')
      ]
    }
  ]

  const steps = [
    { number: '01', title: t('steps.register'), description: t('steps.registerDesc') },
    { number: '02', title: t('steps.verify'), description: t('steps.verifyDesc') },
    { number: '03', title: t('steps.explore'), description: t('steps.exploreDesc') },
    { number: '04', title: t('steps.learn'), description: t('steps.learnDesc') },
    { number: '05', title: t('steps.track'), description: t('steps.trackDesc') },
    { number: '06', title: t('steps.succeed'), description: t('steps.succeedDesc') }
  ]

  const testimonials = [
    { name: 'ደመሰሰ ታደሰ', role: 'Grade 11 Student', text: t('testimonials.student'), rating: 5 },
    { name: 'ሙሉጌታ አባይ', role: 'Mathematics Teacher', text: t('testimonials.teacher'), rating: 5 },
    { name: 'ትንሳኤ መኮንን', role: 'Parent', text: t('testimonials.parent'), rating: 5 }
  ]

  const activeFeatureData = features.find(f => f.id === activeFeature)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full mb-4">
          <Zap className="w-5 h-5" />
          <span className="font-semibold">{t('ai.innovativePlatform')}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('ai.howWeWorkTitle')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('ai.howWeWorkSubtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Panel - Features List */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('ai.platformFeatures')}</h2>
            <div className="space-y-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    activeFeature === feature.id
                      ? `bg-${feature.color}-50 border-2 border-${feature.color}-300 shadow-md`
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${feature.color}-100`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    {activeFeature === feature.id && (
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">{t('ai.platformStats')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">5,000+</div>
                <div className="text-blue-200 text-sm">{t('ai.activeUsers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">10,000+</div>
                <div className="text-blue-200 text-sm">{t('ai.resources')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-blue-200 text-sm">{t('ai.satisfaction')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-blue-200 text-sm">{t('ai.support')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Feature Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {activeFeatureData && (
              <>
                <div className={`p-6 bg-gradient-to-r from-${activeFeatureData.color}-600 to-${activeFeatureData.color}-800 text-white`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <activeFeatureData.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{activeFeatureData.title}</h2>
                      <p className="text-white/90">{activeFeatureData.description}</p>
                    </div>
                  </div>
                  {activeFeatureData.videoUrl && (
                    <Button className="bg-white text-gray-900 hover:bg-gray-100">
                      <Play className="w-5 h-5 mr-2" />
                      {t('ai.watchDemo')}
                    </Button>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.featureDetails')}</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {activeFeatureData.details.map((detail, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* How it Works */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.howItWorks')}</h3>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        {steps.map((step, idx) => (
                          <div key={idx} className="relative flex items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center z-10">
                              <span className="font-bold text-gray-900">{step.number}</span>
                            </div>
                            <div className="ml-6">
                              <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('ai.benefits')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{t('ai.personalizedLearning')}</h4>
                          <p className="text-sm text-gray-600">{t('ai.personalizedDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{t('ai.anywhereAccess')}</h4>
                          <p className="text-sm text-gray-600">{t('ai.accessDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{t('ai.realTimeAnalytics')}</h4>
                          <p className="text-sm text-gray-600">{t('ai.analyticsDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{t('ai.ethiopianCurriculum')}</h4>
                          <p className="text-sm text-gray-600">{t('ai.curriculumDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('ai.whatUsersSay')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">{t('ai.readyToStart')}</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          {t('ai.joinThousands')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
            {t('ai.getStartedNow')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3">
            {t('ai.scheduleDemo')}
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('ai.frequentlyAsked')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: t('faq.q1'), a: t('faq.a1') },
            { q: t('faq.q2'), a: t('faq.a2') },
            { q: t('faq.q3'), a: t('faq.a3') },
            { q: t('faq.q4'), a: t('faq.a4') },
            { q: t('faq.q5'), a: t('faq.a5') },
            { q: t('faq.q6'), a: t('faq.a6') }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowWeWork