'use client';

import { useEffect, useState } from 'react';

export function useHtml2pdf() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).html2pdf) {
      console.log('html2pdf already loaded');
      setIsLoaded(true);
      return;
    }

    console.log('useHtml2pdf: Starting to load html2pdf library');

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.14.0/html2pdf.bundle.min.js';
    script.async = true;
    script.defer = false;
    script.crossOrigin = 'anonymous';

    const handleLoad = () => {
      console.log('useHtml2pdf: Script loaded event fired');
      console.log('useHtml2pdf: typeof window.html2pdf:', typeof (window as any).html2pdf);
      
      // Verify it's actually on window
      if (typeof (window as any).html2pdf !== 'undefined') {
        console.log('useHtml2pdf: html2pdf is available on window object');
        setIsLoaded(true);
      } else {
        console.warn('useHtml2pdf: Script loaded but html2pdf not found on window');
        console.warn('useHtml2pdf: window keys:', Object.keys(window).filter((k: string) => k.includes('html') || k.includes('pdf')));
        setError('html2pdf library loaded but not available on window');
        setIsLoaded(true); // Still mark as loaded to let the wait function discover it later
      }
    };

    const handleError = (event: Event) => {
      console.error('useHtml2pdf: Script load error:', event);
      setError('Failed to load html2pdf library from CDN');
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    console.log('useHtml2pdf: Adding script to document head');
    
    // Add script to document
    document.head.appendChild(script);

    // Also set a timeout to log status after some time
    const statusTimer = setTimeout(() => {
      const hasLib = typeof (window as any).html2pdf !== 'undefined';
      console.log('useHtml2pdf: Status check after 3 seconds - loaded:', hasLib);
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(statusTimer);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      // Don't remove script as it may still be needed
    };
  }, []);

  return { isLoaded, error };
}
