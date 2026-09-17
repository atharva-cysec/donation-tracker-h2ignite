import React from 'react';

/**
 * Global ErrorBoundary to catch unexpected runtime errors in any component
 * and prevent blank white screens in the browser.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TrustDonate ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-2xl border border-[#E4E8E5] p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto mb-4 border border-[#FECACA]">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1D2925] mb-2">Something went wrong</h2>
            <p className="text-xs text-[#68746F] mb-6 leading-relaxed">
              An unexpected error occurred while loading this page. Please refresh to reload the application.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full bg-[#2F7D5B] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#27684C] transition-colors cursor-pointer shadow-xs"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
