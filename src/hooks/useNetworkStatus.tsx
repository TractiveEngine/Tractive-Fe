// hooks/useNetworkStatus.ts
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useNetworkStatus = () => {
  const toastIdRef = useRef<string | number | null>(null);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      // Dismiss the offline toast if it exists
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }

      // Only show "back online" toast if we were previously offline
      if (wasOfflineRef.current) {
        toast.success('Network connection restored!', {
          duration: 3000,
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        wasOfflineRef.current = false;
      }
    };

    const handleOffline = () => {
      wasOfflineRef.current = true;
      
      // Show persistent offline toast
      toastIdRef.current = toast.error(
        'No internet connection. Please check your network.',
        {
          duration: Infinity, // Toast stays until dismissed
          icon: '⚠️',
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        }
      );
    };

    // Check initial status
    if (!navigator.onLine) {
      handleOffline();
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Dismiss any remaining toasts
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);
};