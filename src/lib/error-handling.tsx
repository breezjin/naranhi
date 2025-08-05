
import React from 'react'

// Enhanced error handling for admin pages
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`[${context}] Supabase Error:`, error);
  
  // Common database errors
  if (error?.code === 'PGRST116') {
    return 'Database table not found. Please ensure database is properly set up.';
  }
  
  if (error?.code === 'PGRST301') {
    return 'Database connection failed. Please check Supabase configuration.';
  }
  
  if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
    return 'Database table missing. Run database setup first.';
  }
  
  if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
    return 'Database schema mismatch. Please update database schema.';
  }
  
  // Auth errors
  if (error?.message?.includes('JWT')) {
    return 'Authentication failed. Please log in again.';
  }
  
  // Generic fallback
  return error?.message || 'An unexpected error occurred.';
};

export const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
  return function ErrorBoundaryWrapper(props: any) {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    
    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setHasError(true);
        setError(event.error?.message || 'Component error occurred');
      };
      
      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);
    
    if (hasError) {
      return (
        <div className="p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-red-600">오류가 발생했습니다</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button 
            onClick={() => {setHasError(false); setError('')}} 
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};
