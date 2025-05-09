import React, { useEffect, useState } from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ url, className = 'w-full h-full' }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!document.querySelector('script[src*="@splinetool/viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.91/build/spline-viewer.js';
      script.onload = () => setLoaded(true);
      script.id = 'spline-viewer-script';
      document.head.appendChild(script);

      return () => {
        // Only remove if this component added it
        const scriptElement = document.getElementById('spline-viewer-script');
        if (scriptElement) {
          document.head.removeChild(scriptElement);
        }
      };
    } else {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-emerald-200 rounded"></div>
          <div className="mt-2 h-3 w-24 bg-emerald-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    // @ts-ignore - Custom element
    <spline-viewer url={url} className={className}></spline-viewer>
  );
};

export default SplineViewer;