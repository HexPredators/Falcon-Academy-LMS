import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Zap, Brain, Rocket, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  message, 
  fullScreen = false,
  type = 'default'
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    white: 'text-white'
  };

  const getSpinnerIcon = () => {
    switch(type) {
      case 'ai':
        return <Brain className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`} />;
      case 'rocket':
        return <Rocket className={`${sizeClasses[size]} ${colorClasses[color]} animate-bounce`} />;
      case 'sparkles':
        return <Sparkles className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`} />;
      case 'zap':
        return <Zap className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />;
    }
  };

  const defaultMessages = {
    default: t('loading.loading'),
    ai: t('loading.aiThinking'),
    data: t('loading.fetchingData'),
    processing: t('loading.processing'),
    uploading: t('loading.uploading'),
    analyzing: t('loading.analyzing')
  };

  const loadingMessage = message || defaultMessages[type] || defaultMessages.default;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center z-50">
        <div className="relative">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Logo */}
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          {/* Spinner */}
          <div className="relative mb-6 flex justify-center">
            {getSpinnerIcon()}
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{loadingMessage}</h3>
            <p className="text-gray-600">{t('loading.pleaseWait')}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-8 w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-full animate-progress"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-medium">{t('loading.tip')}:</span> {t('loading.tips')[Math.floor(Math.random() * 5)]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {getSpinnerIcon()}
        {type === 'default' && (
          <div className="absolute inset-0 border-4 border-transparent border-t-current rounded-full animate-spin"></div>
        )}
      </div>
      {loadingMessage && (
        <p className={`mt-4 text-center font-medium ${
          color === 'white' ? 'text-white' : 'text-gray-700'
        }`}>
          {loadingMessage}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;