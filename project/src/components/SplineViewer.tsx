import React from 'react';

interface SplineViewerProps {
  url?: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Premium Glassmorphic Container */}
      <div className="relative z-10 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl max-w-sm text-center mx-4 animate-fadeIn">
        {/* Animated Floating Food Icon / Plate */}
        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center animate-bounce duration-1000">
          <svg className="w-full h-full text-emerald-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '20s' }} />
            {/* Inner Plate */}
            <circle cx="50" cy="50" r="30" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="3" />
            {/* Fork and Knife */}
            <path d="M43 38V54M40 38V44M46 38V44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M57 38V54C57 54 57 56 56 58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Leaves (Avocado/Leaf motif) */}
            <path d="M48 62C52 60 56 62 58 66C54 68 50 66 48 62Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M52 64C55 62 58 64 59 67C56 69 53 67 52 64Z" fill="currentColor" fillOpacity="0.5" />
          </svg>
          {/* Pulsing glow under plate */}
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full filter blur-xl -z-10 animate-ping"></div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Dietrium AI Planner</h3>
        <p className="text-emerald-300/80 text-sm leading-relaxed">
          Crafting personalized, scientific meal plans designed around your goals, metrics, and dietary preferences.
        </p>
      </div>

      {/* Floating abstract items background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-12 left-12 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-24 left-24 w-3 h-3 bg-teal-300 rounded-full animate-bounce"></div>
        <div className="absolute top-24 right-24 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SplineViewer;