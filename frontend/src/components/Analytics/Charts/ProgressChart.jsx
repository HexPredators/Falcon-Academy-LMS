import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, Award, CheckCircle, Clock, Zap } from 'lucide-react';

const ProgressChart = ({ 
  current, 
  target, 
  label, 
  color = 'blue', 
  showDetails = true,
  size = 'large',
  showAnimation = true 
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  if (current === undefined || target === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const remaining = target - current;
  const isComplete = percentage >= 100;

  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return { container: 'w-24 h-24', text: 'text-xl', subtext: 'text-xs', icon: 'w-6 h-6' };
      case 'medium':
        return { container: 'w-32 h-32', text: 'text-2xl', subtext: 'text-sm', icon: 'w-8 h-8' };
      case 'large':
      default:
        return { container: 'w-48 h-48', text: 'text-4xl', subtext: 'text-base', icon: 'w-12 h-12' };
    }
  };

  const sizeClasses = getSizeClasses();
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        ring: 'text-blue-500',
        dark: 'text-blue-700',
        light: 'bg-blue-50'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        ring: 'text-green-500',
        dark: 'text-green-700',
        light: 'bg-green-50'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        ring: 'text-purple-500',
        dark: 'text-purple-700',
        light: 'bg-purple-50'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        ring: 'text-yellow-500',
        dark: 'text-yellow-700',
        light: 'bg-yellow-50'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        ring: 'text-red-500',
        dark: 'text-red-700',
        light: 'bg-red-50'
      }
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses();

  const getStatusIcon = () => {
    if (isComplete) return <Award className={`${sizeClasses.icon} ${colorClasses.text}`} />;
    if (percentage >= 75) return <CheckCircle className={`${sizeClasses.icon} ${colorClasses.text}`} />;
    if (percentage >= 50) return <TrendingUp className={`${sizeClasses.icon} ${colorClasses.text}`} />;
    if (percentage >= 25) return <Clock className={`${sizeClasses.icon} ${colorClasses.text}`} />;
    return <Target className={`${sizeClasses.icon} ${colorClasses.text}`} />;
  };

  const getStatusText = () => {
    if (isComplete) return t('analytics.completed');
    if (percentage >= 75) return t('analytics.excellent');
    if (percentage >= 50) return t('analytics.good');
    if (percentage >= 25) return t('analytics.fair');
    return t('analytics.needsImprovement');
  };

  return (
    <div className={`flex flex-col items-center ${showDetails ? 'p-6' : 'p-2'}`}>
      <div 
        className={`relative ${sizeClasses.container} transition-transform duration-300 ${
          isHovered ? 'scale-105' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className={colorClasses.ring}
            strokeDasharray={circumference}
            strokeDashoffset={showAnimation && isHovered ? circumference : strokeDashoffset}
            style={{
              transition: showAnimation ? 'stroke-dashoffset 1s ease-in-out' : 'none'
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${sizeClasses.text} ${colorClasses.text}`}>
              {percentage}%
            </div>
            {showDetails && (
              <div className={`${sizeClasses.subtext} ${colorClasses.dark} mt-1`}>
                {current}/{target}
              </div>
            )}
          </div>
          
          {/* Animated checkmark on complete */}
          {isComplete && showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${colorClasses.bg} rounded-full p-2 animate-pulse`}>
                <CheckCircle className={`${sizeClasses.icon} ${colorClasses.text}`} />
              </div>
            </div>
          )}
        </div>

        {/* Status icon */}
        {showDetails && (
          <div className="absolute top-0 right-0">
            <div className={`p-2 rounded-full ${colorClasses.bg}`}>
              {getStatusIcon()}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-6 text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          
          <div className={`px-4 py-2 rounded-lg ${colorClasses.light}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{t('analytics.progress')}</span>
              <span className={`text-sm font-bold ${colorClasses.text}`}>
                {getStatusText()}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colorClasses.bg.replace('100', '500')} transition-all duration-1000`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">{t('analytics.current')}</div>
              <div className="text-xl font-bold text-gray-900">{current}</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">{t('analytics.remaining')}</div>
              <div className={`text-xl font-bold ${
                remaining <= 0 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {remaining <= 0 ? t('analytics.completed') : remaining}
              </div>
            </div>
          </div>

          {/* Time estimate */}
          {remaining > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {t('analytics.estimatedCompletion')}: {Math.ceil(remaining / (current / 30))} {t('analytics.days')}
              </span>
            </div>
          )}

          {/* Milestones */}
          {!isComplete && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{t('analytics.milestones')}</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              
              <div className="relative h-2 bg-gray-200 rounded-full">
                {[25, 50, 75, 100].map(milestone => (
                  <div
                    key={milestone}
                    className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                      percentage >= milestone 
                        ? `${colorClasses.bg.replace('100', '500')} border-2 border-white` 
                        : 'bg-gray-300'
                    }`}
                    style={{ left: `${milestone}%` }}
                  >
                    {percentage >= milestone && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                        {milestone}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">{t('analytics.setGoal')}</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">{t('analytics.accelerate')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Simplified view for small size */}
      {!showDetails && (
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-gray-900 truncate">{label}</div>
          <div className={`text-xs ${colorClasses.text}`}>
            {percentage}% • {getStatusText()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;