import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 border border-gray-300',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white focus:ring-yellow-500',
    outline: 'bg-transparent border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 underline focus:ring-blue-500'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-7 py-3.5 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const iconClasses = Icon ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
        ${loading ? 'cursor-wait' : ''}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className={`w-5 h-5 animate-spin ${children ? 'mr-2' : ''}`} />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={`w-5 h-5 ${iconClasses}`} />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`w-5 h-5 ${iconClasses}`} />
      )}
    </button>
  );
};

// Icon Button
export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'medium',
  label,
  ...props
}) => {
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2.5',
    large: 'p-3.5'
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={Icon}
      className={sizeClasses[size]}
      aria-label={label}
      {...props}
    >
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
};

// Button Group
export const ButtonGroup = ({ children, direction = 'horizontal', className = '' }) => {
  const directionClasses = direction === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-2';
  
  return (
    <div className={`inline-flex ${directionClasses} ${className}`}>
      {React.Children.map(children, (child, index) => (
        React.cloneElement(child, {
          className: `${child.props.className || ''} ${
            direction === 'horizontal' 
              ? index === 0 ? 'rounded-r-none' : 
                index === React.Children.count(children) - 1 ? 'rounded-l-none' : 
                'rounded-none border-l-0'
              : index === 0 ? 'rounded-b-none' : 
                index === React.Children.count(children) - 1 ? 'rounded-t-none' : 
                'rounded-none border-t-0'
          }`
        })
      ))}
    </div>
  );
};

export default Button;