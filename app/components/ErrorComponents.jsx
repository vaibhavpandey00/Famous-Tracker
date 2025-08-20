import React from 'react';

class ErrorComponents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`⚠️UI Error in: ${this.props.name}`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md w-full" role="alert">
          <p className="font-bold">Error</p>
          <p>Something went wrong with '{this.props.name}'.</p>
          <p>Please try refreshing the page. If the issue persists, contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorComponents;