import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, RefreshCw, Home, HelpCircle, Bug,
  Shield, XCircle, AlertCircle, Download, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to analytics service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    window.location.reload();
  };

  handleReport = () => {
    const { error, errorInfo } = this.state;
    const errorData = {
      error: error?.toString(),
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // In production, send to error reporting service
    console.log('Error report:', errorData);
    alert('Error reported to our team. Thank you!');
  };

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const errorText = `
Error: ${error?.toString()}
Component Stack: ${errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim();
    
    navigator.clipboard.writeText(errorText);
    alert('Error details copied to clipboard');
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 border-b border-red-100">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 text-center">
                  We've encountered an unexpected error. Our team has been notified.
                </p>
              </div>

              {/* Error Info */}
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-600" />
                    Error Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <code className="text-sm text-gray-700 font-mono break-all">
                      {error?.toString()}
                    </code>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span className="font-semibold">Reload Application</span>
                  </button>

                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl transition-all"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Go to Dashboard</span>
                  </Link>

                  <button
                    onClick={this.handleReport}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Report Error</span>
                  </button>

                  <button
                    onClick={this.toggleDetails}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </span>
                  </button>
                </div>

                {/* Detailed Error Info */}
                {showDetails && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Technical Details
                      </h4>
                      <button
                        onClick={this.handleCopyError}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Copy Details
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                        {errorInfo?.componentStack}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Help Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    Need Help?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="/help"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Help Center</p>
                        <p className="text-sm text-gray-600">Browse documentation</p>
                      </div>
                    </a>
                    <a
                      href="mailto:support@falconacademy.edu.et"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Contact Support</p>
                        <p className="text-sm text-gray-600">Email our team</p>
                      </div>
                    </a>
                    <Link
                      to="/feedback"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      <Bug className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Submit Feedback</p>
                        <p className="text-sm text-gray-600">Help us improve</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    If the problem persists, please clear your browser cache and try again.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <button onClick={() => window.location.href = '/clear-cache'}>
                      Clear Cache
                    </button>
                    <button onClick={() => window.location.href = '/troubleshoot'}>
                      Troubleshoot
                    </button>
                    <button onClick={() => window.location.href = '/system-status'}>
                      System Status
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Version Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Falcon Academy DLMS v2.1.0 • Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// ErrorBoundary with translation support
const ErrorBoundaryWithTranslation = (props) => {
  const { t } = useTranslation();
  
  const translatedFallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('error.somethingWentWrong')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('error.unexpectedError')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {t('error.reloadPage')}
        </button>
      </div>
    </div>
  );

  return <ErrorBoundary {...props} fallback={translatedFallback} />;
};

export default ErrorBoundaryWithTranslation;