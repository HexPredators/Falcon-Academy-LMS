import React, { useEffect } from 'react';
import { X, Maximize2, Minimize2, Download, Printer, Share2, Copy, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  showHeader = true,
  showFooter = false,
  footerContent,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isLoading = false,
  isFullscreen = false,
  onFullscreenToggle,
  showActions = false,
  actions = [],
  backdropClose = true,
  showMaximize = false,
  className = ''
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleBackdropClick = (e) => {
      if (backdropClose && e.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleBackdropClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleBackdropClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, backdropClose]);

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const defaultActions = [
    { icon: Download, label: t('common.download'), onClick: () => {} },
    { icon: Printer, label: t('common.print'), onClick: () => {} },
    { icon: Share2, label: t('common.share'), onClick: () => {} },
    { icon: Copy, label: t('common.copy'), onClick: () => {} }
  ];

  const modalActions = actions.length > 0 ? actions : defaultActions;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full transform transition-all ${isFullscreen ? 'h-[90vh]' : ''} ${sizeClasses[size]} ${className}`}>
          {/* Modal Content */}
          <div className={`
            relative bg-white rounded-2xl shadow-2xl overflow-hidden
            ${isFullscreen ? 'h-full flex flex-col' : ''}
          `}>
            {/* Header */}
            {showHeader && (
              <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Actions */}
                    {showActions && (
                      <div className="flex items-center gap-1 mr-4">
                        {modalActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.onClick}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={action.label}
                          >
                            <action.icon className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Fullscreen Toggle */}
                    {showMaximize && (
                      <button
                        onClick={onFullscreenToggle}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={isFullscreen ? t('common.exitFullscreen') : t('common.fullscreen')}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-5 h-5" />
                        ) : (
                          <Maximize2 className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    {/* Close Button */}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Body */}
            <div className={`
              ${isFullscreen ? 'flex-1 overflow-auto' : 'max-h-[70vh] overflow-y-auto'}
              ${showHeader ? '' : 'pt-6'}
              px-6 py-4
            `}>
              {children}
            </div>

            {/* Footer */}
            {showFooter && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                {footerContent ? (
                  footerContent
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={onCancel || onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancelText || t('common.cancel')}
                      </button>
                      {onConfirm && (
                        <button
                          onClick={onConfirm}
                          disabled={isLoading}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>{t('common.processing')}</span>
                            </div>
                          ) : (
                            confirmText || t('common.confirm')
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>Preview Mode</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Controls (Outside Modal) */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              {t('common.close')}
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('common.print')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal
export const ConfirmationModal = ({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  type = 'warning',
  isLoading = false
}) => {
  const { t } = useTranslation();

  const typeConfig = {
    warning: {
      icon: '⚠️',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    danger: {
      icon: '❌',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    success: {
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    info: {
      icon: 'ℹ️',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      showFooter={true}
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
    >
      <div className="py-6">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 mb-6`}>
          <div className="flex items-start gap-4">
            <div className={`text-3xl ${type === 'warning' ? 'animate-pulse' : ''}`}>
              {config.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
              <p className="text-gray-700">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            <strong>{t('common.note')}:</strong> {t('modal.actionCannotBeUndone')}
          </p>
        </div>
      </div>
    </Modal>
  );
};

// Success Modal
export const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Success!',
  message,
  buttonText = 'Continue',
  onButtonClick
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      showFooter={true}
      onConfirm={onButtonClick || onClose}
      confirmText={buttonText}
      showCancel={false}
    >
      <div className="py-8 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
};

export default Modal;