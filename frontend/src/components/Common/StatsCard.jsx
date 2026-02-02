import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'percent',
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  trend = 'neutral',
  loading = false,
  onClick,
  footer,
  precision = 0,
  suffix = '',
  prefix = '',
  compact = false,
  bordered = false,
  gradient = false,
  variant = 'default',
  animation = true,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();

  const variants = {
    default: 'bg-white',
    primary: 'bg-blue-50',
    secondary: 'bg-gray-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
    light: 'bg-gray-50'
  };

  const trendConfig = {
    up: {
      icon: change > 0 ? TrendingUp : TrendingDown,
      color: change > 0 ? 'text-green-600' : 'text-red-600',
      bg: change > 0 ? 'bg-green-100' : 'bg-red-100',
      arrow: change > 0 ? ArrowUpRight : ArrowDownRight
    },
    down: {
      icon: change > 0 ? TrendingDown : TrendingUp,
      color: change > 0 ? 'text-red-600' : 'text-green-600',
      bg: change > 0 ? 'bg-red-100' : 'bg-green-100',
      arrow: change > 0 ? ArrowDownRight : ArrowUpRight
    },
    neutral: {
      icon: TrendingUp,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      arrow: ArrowUpRight
    }
  };

  const config = trendConfig[trend];
  const TrendIcon = config.icon;
  const ArrowIcon = config.arrow;

  const formattedValue = () => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString('en-ET', {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision
      });
    }
    return value;
  };

  const formattedChange = () => {
    if (change === undefined || change === null) return null;
    
    if (changeType === 'percent') {
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }
    
    if (changeType === 'absolute') {
      return `${change > 0 ? '+' : ''}${change.toLocaleString('en-ET')}`;
    }
    
    return change;
  };

  const cardContent = (
    <div
      className={`
        ${variants[variant]}
        ${bordered ? 'border border-gray-200' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-blue-50' : ''}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-300' : ''}
        rounded-2xl p-6
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-3 ${iconBgColor} rounded-xl`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {loading ? (
                <div className="mt-2 space-y-2">
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              ) : (
                <>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {prefix}{formattedValue()}{suffix}
                    </span>
                    {change !== undefined && change !== null && (
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <ArrowIcon className="w-3 h-3 mr-1" />
                        {formattedChange()}
                      </span>
                    )}
                  </div>
                  {footer && (
                    <p className="mt-2 text-sm text-gray-500">{footer}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {props.menuItems && (
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {props.chart && (
        <div className="mt-6">
          {props.chart}
        </div>
      )}

      {props.details && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            {props.details}
            {onClick && (
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                {t('view_details')}
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (animation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: onClick ? 1.02 : 1 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export const StatsCardGrid = ({ 
  children, 
  cols = 1, 
  gap = 6, 
  className = '',
  variant = 'grid'
}) => {
  const gridConfig = {
    grid: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    },
    carousel: {
      1: 'flex space-x-6 overflow-x-auto pb-4',
      2: 'flex space-x-6 overflow-x-auto pb-4',
      3: 'flex space-x-6 overflow-x-auto pb-4',
      4: 'flex space-x-6 overflow-x-auto pb-4'
    }
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  if (variant === 'carousel') {
    return (
      <div className={`flex space-x-6 overflow-x-auto pb-4 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`grid ${gridConfig.grid[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export const StatsCardMini = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  loading = false,
  ...props
}) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
  };

  const { bg, text } = colorClasses[color];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse mt-1 w-16"></div>
          ) : (
            <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 ${bg} rounded-lg`}>
            <Icon className={`w-5 h-5 ${text}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;