// lib/components/shared/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
          <div className="flex max-w-sm flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-muted-foreground">
                We're having trouble displaying this page. Please try refreshing or check back later.
              </p>
            </div>
            
            <div className="rounded-xl border border-input bg-muted/30 p-4 text-left w-full">
              <p className="font-mono text-sm text-muted-foreground">
                {this.state.error?.message}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;