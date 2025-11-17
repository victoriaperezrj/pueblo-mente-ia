import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¡Ups! Algo salió mal
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Ocurrió un error inesperado. No te preocupes, nuestro equipo ha sido notificado.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-left">
                  <p className="font-bold text-red-900 mb-2">Error Details:</p>
                  <pre className="text-sm text-red-700 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-red-600 overflow-auto max-h-40 mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-4 flex-wrap justify-center">
                <Button
                  onClick={this.handleReload}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Recargar página
                </Button>

                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Home className="w-5 h-5" />
                  Volver al inicio
                </Button>
              </div>

              <p className="mt-8 text-sm text-gray-500">
                Si el problema persiste, contacta a soporte en{' '}
                <a href="mailto:support@pueblo-mente-ia.com" className="text-blue-600 hover:underline">
                  support@pueblo-mente-ia.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
