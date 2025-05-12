import { useState, useEffect } from 'react';

type Acetype = typeof import('ace-builds');

export function useAceEditor() {
  const [ace, setAce] = useState<null | Acetype>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [preferences, setPreferences] = useState({});
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lazy load on startup
  useEffect(() => {
    lazyLoadAce()
      .then((aceInstance: Acetype) => {
        setAce(aceInstance);
        // Reset error state
        setError(null);
        setErrorMessage(null);
      })
      .catch((err: unknown) => {
        console.error('Error occurred while loading Ace editor:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => setLoading(false));
  }, []);

  // Function to reload the editor when an error occurs
  const retryLoading = () => {
    setLoading(true);
    setError(null);
    setErrorMessage(null);
    
    lazyLoadAce()
      .then((aceInstance: Acetype) => {
        setAce(aceInstance);
      })
      .catch((err: unknown) => {
        console.error('Error occurred while reloading Ace editor:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => setLoading(false));
  };

  return {
    ace,
    loading,
    preferences,
    setPreferences,
    error,
    errorMessage,
    retryLoading
  };
}

/**
 * Lazily loads the Ace editor
 * 
 * Reasons for lazy loading:
 * 1. Reduces initial load time - Ace editor is a relatively large library
 * 2. Loads only when needed - Uses resources efficiently by loading the editor only when it's actually used
 * 3. Improved error handling - Dynamic imports make error handling easier
 */
async function lazyLoadAce() {
  try {
    const ace = await import('ace-builds');
    await import('ace-builds/esm-resolver');
    
    (ace.config as { set(name: string, value: boolean | string | number | null): void }).set('useWorker', false);

    return ace;
  } catch (error) {
    // Propagate error to the caller
    console.error('Error occurred while loading Ace editor:', error);
    throw error;
  }
}
