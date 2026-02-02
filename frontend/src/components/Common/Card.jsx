import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  titleIcon: TitleIcon,
  headerAction,
  footer,
  footerAction,
  padding = true,
  shadow = 'lg',
  border = true,
  rounded = 'xl',
  hoverable = false,
  loading = false,
  onClick,
  variant = 'default',
  accent = false,
  gradient = false,
  animation = true,
  ...props
}) => {
  const { t } = useTranslation();

  const variants = {
    default: 'bg-white',
    primary: 'bg-blue-50 border-blue-200',
    secondary: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    light: 'bg-gray-50 border-gray-100'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-3xl'
  };

  const paddingClasses = padding ? 'p-6' : 'p-0';
  const borderClass = border ? 'border' : '';
  const hoverClass = hoverable ? 'hover:shadow-xl transition-all duration-300 cursor-pointer' : '';
  const accentClass = accent ? 'border-l-4 border-l-blue-500' : '';
  const gradientClass = gradient ? 'bg-gradient-to-br from-white to-blue-50' : '';

  const cardContent = (
    <div
      className={`
        ${variants[variant]}
        ${shadowClasses[shadow]}
        ${roundedClasses[rounded]}
        ${paddingClasses}
        ${borderClass}
        ${hoverClass}
        ${accentClass}
        ${gradientClass}
        ${className}
        transition-all duration-300
      `}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className={`mb-6 ${!padding && 'p-6 pb-0'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <div className="flex items-center space-x-3">
                  {TitleIcon && (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TitleIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    {subtitle && (
                      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0 ml-4">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={!padding ? 'p-6' : ''}>
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className={`mt-6 pt-6 border-t border-gray-200 ${!padding && 'p-6 pt-0'}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{footer}</div>
            {footerAction && (
              <div className="flex-shrink-0">
                {footerAction}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (animation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export const CardGrid = ({ children, cols = 1, gap = 6, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', padding = true }) => (
  <div className={`${padding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', padding = true }) => (
  <div className={`${padding ? 'p-6 pt-0' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;