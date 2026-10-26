import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Search } from 'lucide-react';
import { Logo } from '../components/Logo';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center py-16 px-4 text-center select-none">
      <Logo variant="icon" interactive={false} size="large" className="mb-6" />

      <h1 className="text-6xl font-heading font-extrabold text-brand-green-900 tracking-tight">
        404
      </h1>
      <h2 className="text-xl font-heading font-bold text-gray-800 mt-2">
        Page Not Found
      </h2>
      <p className="text-xs text-gray-500 max-w-sm mt-2 mb-8 leading-relaxed">
        The link you followed may be broken or the page may have been moved. Let's get you back to safety.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-brand-green hover:bg-brand-green-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/find-workers"
          className="w-full sm:w-auto px-6 py-3 bg-brand-gold hover:bg-brand-gold-500 text-brand-green-900 font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Find Nearby Pros</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
